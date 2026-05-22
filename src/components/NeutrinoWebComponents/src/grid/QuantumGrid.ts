import { LitElement, html, PropertyValues, nothing } from 'lit';
import { customElement, state, query, queryAssignedElements } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import { DataItem, ApiResponse, ColumnDefinition, SortConfig } from './types.js';
import { QuantumGridColumn } from './QuantumGridColumn';

import style from "./QuantumGrid.css";

@customElement('quantum-grid')
export class QuantumGrid extends LitElement {
    @state() private data: DataItem[] = [];
    @state() private total = 0;
    @state() private page = 1;
    @state() private pageSize = 100;
    @state() private loading = false;
    private currentScrollTop = 0;
    @state() private searchTerm = '';
    @state() private density: 'standard' | 'compact' = 'standard';
    @state() private paginationEnabled = true;
    @state() private aggregatesEnabled = true;
    @state() private showGroupPanel = true;
    @state() private multiSort: SortConfig[] = [];
    @state() private multiGrouping: (keyof DataItem)[] = [];
    @state() private collapsedGroups: Set<string> = new Set();
    @state() private columns: ColumnDefinition[] = [];
    @queryAssignedElements({ flatten: true, selector: 'quantum-grid-column' })
    private _colElements!: QuantumGridColumn[];

    _syncColumnsFromTags() {
        if (this._colElements && this._colElements.length > 0) {
            this.columns = this._colElements.map(el => {
                const columnKey = (el.key || el.columnKey || el.name || el.getAttribute('column-key') || el.getAttribute('key') || el.getAttribute('name') || '') as keyof DataItem;
                return {
                    key: columnKey,
                    label: el.label || el.title || el.getAttribute('label') || el.getAttribute('title') || String(columnKey).toUpperCase(),
                    visible: !el.hidden && !el.hasAttribute('hidden'),
                    width: Number(el.width) || 150,
                    align: (el.align || el.getAttribute('align') || 'left') as any,
                    aggType: (el.aggType || el.getAttribute('agg-type')) as any,
                    dataType: el.dataType || el.getAttribute('data-type') || undefined
                };
            });
        }
    }
    @state() private draggingColumn: keyof DataItem | null = null;
    @state() private selectedIds: Set<DataItem['id']> = new Set();
    @state() private focusedId: DataItem['id'] | null = null;
    @state() private selectionMode: 'single' | 'multiple' = 'multiple';
    @state() private showSelection: boolean = true;

    @query('#body') private bodyElement?: HTMLDivElement;
    @query('.grid-header') private headerElement?: HTMLDivElement;
    @query('.sticky-footer-container') private footerElement?: HTMLDivElement;

    private _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    private _resizeObserver: ResizeObserver | null = null;
    private resizer: { key: keyof DataItem, startX: number, startWidth: number } | null = null;
    private _resizeFrame: number | null = null;

    // Optimized Cache
    private _cachedProcessedData: DataItem[] = [];
    private _cachedDisplayRows: any[] = [];
    private _cachedGlobalAggs: any = null;
    private _lastFilterKey = '';
    private _lastGroupKey = '';

    // Non-reactive optimized stores
    private _activeCols: ColumnDefinition[] = [];
    private _totalWidth = 0;
    private _displayRows: any[] = [];
    private _globalAggs: any = null;
    private _idToDataIndexMap = new Map<DataItem['id'], number>();
    private _searchRegExp: RegExp | null = null;
    private _resizeTimeout: number | null = null;

    static styles = style;

    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this.tabIndex = 0; // Make focusable
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        if (this._resizeObserver) this._resizeObserver.disconnect();
        if (this._resizeFrame) cancelAnimationFrame(this._resizeFrame);
    }

    protected willUpdate(changedProperties: PropertyValues) {
        // Invalidate caches if data changes
        if (changedProperties.has('data')) {
            this._lastFilterKey = '';
            this._lastGroupKey = '';
        }

        // Re-calculate derived data only when inputs change
        if (changedProperties.has('data') ||
            changedProperties.has('searchTerm') ||
            changedProperties.has('multiGrouping') ||
            changedProperties.has('multiSort') ||
            changedProperties.has('collapsedGroups') ||
            changedProperties.has('columns') ||
            changedProperties.has('showSelection') ||
            changedProperties.has('aggregatesEnabled') ||
            changedProperties.has('paginationEnabled')) {

            this._activeCols = this.columns.filter(c => c.visible);
            this._totalWidth = this._activeCols.reduce((sum, c) => sum + (c.width || 150), 0) + (this.showSelection ? 48 : 0);

            // Update Search RegExp
            if (this.searchTerm) {
                this._searchRegExp = new RegExp(`(${this.searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            } else {
                this._searchRegExp = null;
            }

            const { rows, globalAggs } = this.getDisplayRows();
            this._displayRows = rows;
            this._globalAggs = globalAggs;

            // Update ID to Index Map for O(1) lookups
            this._idToDataIndexMap.clear();
            for (let i = 0; i < this._displayRows.length; i++) {
                const row = this._displayRows[i];
                const id = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                if (id !== null) {
                    this._idToDataIndexMap.set(id, i);
                }
            }
        }
    }

    firstUpdated() {
        if (this.bodyElement) {
            this._resizeObserver = new ResizeObserver(() => {
                if (this._resizeTimeout) cancelAnimationFrame(this._resizeTimeout);
                this._resizeTimeout = requestAnimationFrame(() => this.requestUpdate());
            });
            this._resizeObserver.observe(this.bodyElement);
        }
    }

    private async fetchData() {
        this.loading = true;
        try {
            const url = this.paginationEnabled
                ? `/api/data?page=${this.page}&pageSize=${this.pageSize}`
                : `/api/data?all=true`;

            const response = await fetch(url);
            const result: ApiResponse = await response.json();
            this.data = result.data;
            this.total = result.total;
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            this.loading = false;
        }
    }

    private highlightText(text: any, search: string) {
        if (!search || !this._searchRegExp) return text;
        const str = String(text);
        if (!str.toLowerCase().includes(search.toLowerCase())) return text;

        const parts = str.split(this._searchRegExp);

        return html`${parts.map(p => p.toLowerCase() === search.toLowerCase()
            ? html`<mark style="background: rgba(245, 158, 11, 0.3); color: inherit; border-radius: 2px; padding: 0 1px;">${p}</mark>`
            : p)}`;
    }

    private onSearch(e: Event) {
        this.searchTerm = (e.target as HTMLInputElement).value;
        this.page = 1;
    }

    private toggleDensity() {
        this.density = this.density === 'standard' ? 'compact' : 'standard';
        if (this.density === 'compact') {
            this.setAttribute('density', 'compact');
        } else {
            this.removeAttribute('density');
        }
    }

    private toggleMode() {
        this.paginationEnabled = !this.paginationEnabled;
        this.page = 1;
        this.currentScrollTop = 0;
        if (this.bodyElement) this.bodyElement.scrollTop = 0;
        this.fetchData();
    }

    private toggleAggregates() {
        this.aggregatesEnabled = !this.aggregatesEnabled;
    }

    private handleColumnToggle(e: Event) {
        const key = (e.target as HTMLSelectElement).value;
        if (!key) return;
        this.columns = this.columns.map(c => c.key === key ? { ...c, visible: !c.visible } : c);
        (e.target as HTMLSelectElement).value = '';
    }

    private handleSort(key: keyof DataItem, isMulti: boolean) {
        const existingIndex = this.multiSort.findIndex(s => s.key === key);
        const isGroup = this.multiGrouping.includes(key);

        if (isMulti) {
            if (existingIndex === -1) {
                this.multiSort = [...this.multiSort, { key, order: 'asc' }];
            } else if (this.multiSort[existingIndex].order === 'asc') {
                const newSort = [...this.multiSort];
                newSort[existingIndex] = { ...newSort[existingIndex], order: 'desc' };
                this.multiSort = newSort;
            } else {
                if (isGroup) {
                    const newSort = [...this.multiSort];
                    newSort[existingIndex] = { ...newSort[existingIndex], order: 'asc' };
                    this.multiSort = newSort;
                } else {
                    this.multiSort = this.multiSort.filter((_, i) => i !== existingIndex);
                }
            }
        } else {
            const groupSorts = this.multiSort.filter(s => this.multiGrouping.includes(s.key));
            const currentSort = this.multiSort[existingIndex];
            const otherGroupSorts = groupSorts.filter(s => s.key !== key);

            if (!currentSort) {
                this.multiSort = [...otherGroupSorts, { key, order: 'asc' }];
            } else if (currentSort.order === 'asc') {
                this.multiSort = [...otherGroupSorts, { key, order: 'desc' }];
            } else {
                if (isGroup) {
                    this.multiSort = [...otherGroupSorts, { key, order: 'asc' }];
                } else {
                    this.multiSort = [...otherGroupSorts];
                }
            }
        }
        this.reorderSort();
    }

    private reorderSort() {
        const groupSorts = this.multiGrouping.map(key => {
            const existing = this.multiSort.find(s => s.key === key);
            return { key, order: existing ? existing.order : 'asc' as const };
        });
        const otherSorts = this.multiSort.filter(s => !this.multiGrouping.includes(s.key));
        this.multiSort = [...groupSorts, ...otherSorts];
    }

    private toggleGroup(key: keyof DataItem) {
        if (this.multiGrouping.includes(key)) {
            this.multiGrouping = this.multiGrouping.filter(k => k !== key);
            this.multiSort = this.multiSort.filter(s => s.key !== key);
        } else {
            this.multiGrouping = [...this.multiGrouping, key];
            if (!this.multiSort.find(s => s.key === key)) {
                this.multiSort = [...this.multiSort, { key, order: 'asc' }];
            }
        }
        this.reorderSort();
    }

    private toggleGroupCollapse(path: string) {
        const newCollapsed = new Set(this.collapsedGroups);
        if (newCollapsed.has(path)) {
            newCollapsed.delete(path);
        } else {
            newCollapsed.add(path);
        }
        this.collapsedGroups = newCollapsed;
    }

    // Selection Logic
    private handleRowClick(e: MouseEvent, item: DataItem) {
        const isMulti = e.ctrlKey || e.metaKey || this.selectionMode === 'multiple';
        const isRange = e.shiftKey;
        this.toggleSelection(item.id, isMulti, isRange);
        this.focusedId = item.id;
    }

    private toggleSelection(id: DataItem['id'], isMulti: boolean, isRange: boolean) {
        const newSelected = new Set(this.selectedIds);

        if (this.selectionMode === 'single') {
            newSelected.clear();
            newSelected.add(id);
        } else {
            if (isRange && this.focusedId !== null) {
                const startIdx = this._idToDataIndexMap.get(this.focusedId) ?? -1;
                const endIdx = this._idToDataIndexMap.get(id) ?? -1;
                if (startIdx > -1 && endIdx > -1) {
                    const min = Math.min(startIdx, endIdx);
                    const max = Math.max(startIdx, endIdx);
                    if (!isMulti) newSelected.clear();
                    for (let i = min; i <= max; i++) {
                        const row = this._displayRows[i];
                        const rowId = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                        if (rowId !== null) newSelected.add(rowId);
                    }
                }
            } else if (isMulti) {
                if (newSelected.has(id)) {
                    newSelected.delete(id);
                } else {
                    newSelected.add(id);
                }
            } else {
                newSelected.clear();
                newSelected.add(id);
            }
        }
        this.selectedIds = new Set(newSelected);
    }

    private selectAll() {
        const processed = this.getProcessedData();
        if (this.selectedIds.size === processed.length && processed.length > 0) {
            this.selectedIds = new Set();
        } else {
            this.selectedIds = new Set(processed.map(d => d.id));
        }
    }

    private onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const displayRows = this._displayRows;
            if (displayRows.length === 0) return;

            let nextIdx = -1;
            if (this.focusedId !== null) {
                const currentIdx = this._idToDataIndexMap.get(this.focusedId) ?? -1;
                if (currentIdx !== -1) {
                    let searchIdx = e.key === 'ArrowDown' ? currentIdx + 1 : currentIdx - 1;
                    while (searchIdx >= 0 && searchIdx < displayRows.length) {
                        const row = displayRows[searchIdx];
                        const id = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                        if (id !== null) {
                            nextIdx = searchIdx;
                            break;
                        }
                        searchIdx = e.key === 'ArrowDown' ? searchIdx + 1 : searchIdx - 1;
                    }
                }
            } else if (e.key === 'ArrowDown') {
                for (let i = 0; i < displayRows.length; i++) {
                    const row = displayRows[i];
                    const id = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                    if (id !== null) {
                        nextIdx = i;
                        break;
                    }
                }
            }

            if (nextIdx !== -1) {
                const nextRow = displayRows[nextIdx];
                const id = nextRow.type ? nextRow.data.id : nextRow.id;
                this.focusedId = id;
                this.toggleSelection(id, e.shiftKey, e.shiftKey);

                const rowHeight = this.density === 'compact' ? 32 : 48;
                const targetTop = nextIdx * rowHeight;
                if (this.bodyElement) {
                    if (targetTop < this.bodyElement.scrollTop) {
                        this.bodyElement.scrollTop = targetTop;
                    } else if (targetTop + rowHeight > this.bodyElement.scrollTop + this.bodyElement.clientHeight) {
                        this.bodyElement.scrollTop = targetTop - this.bodyElement.clientHeight + rowHeight;
                    }
                }
            }
        }
    }

    private startResizing(e: MouseEvent, key: keyof DataItem, width: number) {
        e.preventDefault();
        e.stopPropagation();
        this.resizer = { key, startX: e.pageX, startWidth: width };
        document.body.style.cursor = 'col-resize';
    }

    private onMouseMove = (e: MouseEvent) => {
        if (!this.resizer) return;
        if (this._resizeFrame) return;

        this._resizeFrame = requestAnimationFrame(() => {
            if (!this.resizer) return;
            const delta = e.pageX - this.resizer.startX;
            const newWidth = Math.max(50, this.resizer.startWidth + delta);

            this.columns = this.columns.map(c =>
                c.key === this.resizer?.key ? { ...c, width: newWidth } : c
            );
            this._resizeFrame = null;
        });
    };

    private onMouseUp = () => {
        if (!this.resizer) return;
        this.resizer = null;
        document.body.style.cursor = '';
        if (this._resizeFrame) {
            cancelAnimationFrame(this._resizeFrame);
            this._resizeFrame = null;
        }
    };

    // Drag & Drop Handlers
    private onDragStart(e: DragEvent, key: keyof DataItem) {
        this.draggingColumn = key;
        e.dataTransfer?.setData('text/plain', String(key));
        if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
    }

    private onDragOver(e: DragEvent, type: 'header' | 'panel') {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

        if (type === 'panel') {
            (e.currentTarget as HTMLElement).classList.add('drag-over');
        } else {
            (e.currentTarget as HTMLElement).classList.add('drop-target');
        }
    }

    private onDragLeave(e: DragEvent) {
        (e.currentTarget as HTMLElement).classList.remove('drag-over', 'drop-target');
    }

    private onDrop(e: DragEvent, targetKey?: keyof DataItem) {
        e.preventDefault();
        const sourceKey = e.dataTransfer?.getData('text/plain') as keyof DataItem;

        const panel = this.shadowRoot?.querySelector('.group-panel');
        panel?.classList.remove('drag-over');
        this.shadowRoot?.querySelectorAll('.header-cell').forEach(h => h.classList.remove('drop-target'));

        if (!sourceKey) return;

        // Handle Drop on Panel (Grouping)
        if (!targetKey) {
            if (!this.multiGrouping.includes(sourceKey)) {
                this.toggleGroup(sourceKey);
            }
            return;
        }

        // Handle Drop on Header (Reordering)
        if (sourceKey === targetKey) return;

        const newCols = [...this.columns];
        const srcIdx = newCols.findIndex(c => c.key === sourceKey);
        const destIdx = newCols.findIndex(c => c.key === targetKey);

        if (srcIdx > -1 && destIdx > -1) {
            const [removed] = newCols.splice(srcIdx, 1);
            newCols.splice(destIdx, 0, removed);
            this.columns = newCols;
        }

        this.draggingColumn = null;
    }

    private onDragEnd() {
        this.draggingColumn = null;
        this.shadowRoot?.querySelectorAll('.header-cell').forEach(h => h.classList.remove('drop-target', 'dragging'));
        this.shadowRoot?.querySelector('.group-panel')?.classList.remove('drag-over');
    }

    private onBodyScroll() {
        if (this.bodyElement) {
            this.currentScrollTop = this.bodyElement.scrollTop;
            const sl = this.bodyElement.scrollLeft;
            if (this.headerElement) this.headerElement.scrollLeft = sl;
            if (this.footerElement) this.footerElement.scrollLeft = sl;
            this.requestUpdate();
        }
    }

    private getProcessedData() {
        const filterKey = `${this.searchTerm}|${this.multiSort.map(s => `${String(s.key)}:${s.order}`).join(',')}`;
        if (this._lastFilterKey === filterKey && this._cachedProcessedData.length > 0) {
            return this._cachedProcessedData;
        }

        let result = [...this.data];

        if (this.searchTerm) {
            const lower = this.searchTerm.toLowerCase();
            result = result.filter(item => {
                for (const col of this.columns) {
                    const val = item[col.key];
                    if (val != null && String(val).toLowerCase().includes(lower)) {
                        return true;
                    }
                }
                return false;
            });
        }

        if (this.multiSort.length > 0) {
            const collator = this._collator;
            result.sort((a, b) => {
                for (const sort of this.multiSort) {
                    const aVal = a[sort.key];
                    const bVal = b[sort.key];
                    if (aVal !== bVal) {
                        const modifier = sort.order === 'asc' ? 1 : -1;
                        if (typeof aVal === 'number' && typeof bVal === 'number') {
                            return (aVal - bVal) * modifier;
                        }
                        return collator.compare(String(aVal), String(bVal)) * modifier;
                    }
                }
                return 0;
            });
        }

        this._cachedProcessedData = result;
        this._lastFilterKey = filterKey;
        return result;
    }

    private calculateAggregates(items: DataItem[]) {
        if (!this.aggregatesEnabled) return null;
        const aggs: Record<string, number> = {};

        this.columns.forEach(col => {
            if (!col.aggType) return;
            const values = items.map(d => Number(d[col.key]) || 0);
            if (col.aggType === 'sum') {
                aggs[col.key as string] = values.reduce((a, b) => a + b, 0);
            } else if (col.aggType === 'avg') {
                aggs[col.key as string] = values.reduce((a, b) => a + b, 0) / (values.length || 1);
            } else if (col.aggType === 'count') {
                aggs[col.key as string] = items.length;
            }
        });
        return aggs;
    }

    private getDisplayRows() {
        const processed = this.getProcessedData();
        const groupKey = `${this.multiGrouping.join(',')}|${this.collapsedGroups.size}|${this.aggregatesEnabled}|${this._lastFilterKey}`;

        if (this._lastGroupKey === groupKey && this._cachedDisplayRows.length > 0) {
            return { rows: this._cachedDisplayRows, globalAggs: this._cachedGlobalAggs };
        }

        let rows: any[] = [];
        let globalAggs: any = null;

        if (this.multiGrouping.length === 0) {
            rows = processed;
            globalAggs = this.calculateAggregates(processed);
        } else {
            const groupRecursive = (items: DataItem[], level: number, path: string): any => {
                if (level >= this.multiGrouping.length) {
                    return { type: 'data', items };
                }

                const key = this.multiGrouping[level];
                const groups: Record<string, DataItem[]> = {};
                items.forEach(item => {
                    const val = String(item[key]);
                    if (!groups[val]) groups[val] = [];
                    groups[val].push(item);
                });

                const sort = this.multiSort.find(s => s.key === key);
                const order = sort ? sort.order : 'asc';
                const sortedKeys = Object.keys(groups).sort((a, b) => {
                    const modifier = order === 'asc' ? 1 : -1;
                    return this._collator.compare(a, b) * modifier;
                });

                return {
                    type: 'node',
                    key,
                    level,
                    children: sortedKeys.map(name => {
                        const subItems = groups[name];
                        const currentPath = path ? `${path}|${name}` : name;
                        return {
                            name,
                            path: currentPath,
                            aggs: this.calculateAggregates(subItems),
                            subtree: groupRecursive(subItems, level + 1, currentPath),
                            count: subItems.length
                        };
                    })
                };
            };

            const tree = groupRecursive(processed, 0, '');
            const flat: any[] = [];
            const flatten = (node: any) => {
                if (node.type === 'data') {
                    node.items.forEach((d: any) => flat.push({ type: 'row', data: d, level: this.multiGrouping.length }));
                    return;
                }

                node.children.forEach((child: any) => {
                    const isCollapsed = this.collapsedGroups.has(child.path);
                    flat.push({
                        type: 'header',
                        label: child.name,
                        count: child.count,
                        level: node.level,
                        path: child.path,
                        collapsed: isCollapsed,
                        aggregates: child.aggs
                    });

                    if (!isCollapsed) {
                        flatten(child.subtree);
                        if (child.aggs) {
                            flat.push({
                                type: 'footer',
                                data: child.aggs,
                                level: node.level,
                                label: `Total ${child.name}`
                            });
                        }
                    }
                });
            };

            flatten(tree);
            rows = flat;
            globalAggs = this.calculateAggregates(processed);
        }

        this._cachedDisplayRows = rows;
        this._cachedGlobalAggs = globalAggs;
        this._lastGroupKey = groupKey;

        return { rows, globalAggs };
    }

    private exportCSV() {
        const processed = this.getProcessedData();
        const headers = this.columns.filter(c => c.visible).map(c => c.label).join(',');
        const rows = processed.map(d =>
            this.columns.filter(c => c.visible).map(c => `"${String(d[c.key]).replace(/"/g, '""')}"`).join(',')
        );
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quantum_export_${new Date().getTime()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    private renderHeader() {
        const activeCols = this.columns.filter(c => c.visible);
        const isAllSelected = this.selectedIds.size > 0 && this.selectedIds.size === this._cachedProcessedData.length;

        return html`
      <div class="grid-header">
        ${this.showSelection ? html`
          <div class="selection-header">
             ${this.selectionMode === 'multiple'
                    ? html`<div class="checkbox ${isAllSelected ? 'checked' : ''}" @click=${this.selectAll}></div>`
                    : nothing}
          </div>
        ` : nothing}
        ${activeCols.map((col) => {
                        const sortIdx = this.multiSort.findIndex(s => s.key === col.key);
                        const sort = this.multiSort[sortIdx];
                        const isGrouped = this.multiGrouping.includes(col.key);
                        const colWidth = col.width || 150;
                        const justify = col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'space-between';

                        return html`
            <div 
              class="header-cell ${this.draggingColumn === col.key ? 'dragging' : ''}" 
              draggable="true"
              style="width: ${colWidth}px; min-width: ${colWidth}px; justify-content: ${justify};"
              @click=${(e: MouseEvent) => this.handleSort(col.key, e.shiftKey)}
              @dragstart=${(e: DragEvent) => this.onDragStart(e, col.key)}
              @dragover=${(e: DragEvent) => this.onDragOver(e, 'header')}
              @dragleave=${this.onDragLeave}
              @drop=${(e: DragEvent) => this.onDrop(e, col.key)}
              @dragend=${this.onDragEnd}
            >
              <div style="display: flex; align-items: center; overflow: hidden; pointer-events: none;">
                <span style="overflow: hidden; text-overflow: ellipsis;">${col.label}</span>
                ${sort ? html`
                  <span class="sort-indicator">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 4px;"><path d="${sort.order === 'asc' ? 'M12 4l-8 8h16l-8-8z' : 'M12 20l8-8H4l8 8z'}"/></svg>
                    ${this.multiSort.length > 1 ? html`<small style="font-size: 8px; margin-left: 2px; color: var(--grid-emerald); font-weight: bold;">[${sortIdx + 1}]</small>` : nothing}
                  </span>
                ` : nothing}
              </div>
              <button 
                class="group-btn ${isGrouped ? 'active' : ''}" 
                title="Toggle Grouping"
                @click=${(e: Event) => { e.stopPropagation(); this.toggleGroup(col.key); }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
              </button>
              <div class="resize-handle" @mousedown=${(e: MouseEvent) => this.startResizing(e, col.key, colWidth)}></div>
            </div>
          `;
                    })}
      </div>
    `;
    }

    private renderRow(row: any, activeCols: ColumnDefinition[]) {
        // Memory-efficient row: if it's a raw DataItem, treat as type 'row'
        const isRawRow = row && !row.type;
        const rowType = isRawRow ? 'row' : row.type;
        const rowData = isRawRow ? row : row.data;

        if (rowType === 'header') {
            const basePadding = this.density === 'compact' ? 12 : 24;
            const style = `padding-left: ${basePadding + (row.level * basePadding)}px`;
            const iconStyle = `transform: ${row.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};`;
            return html`
        <div class="group-header" style="${style}" @click=${() => this.toggleGroupCollapse(row.path)}>
          <span class="collapse-icon" style="${iconStyle}">▶</span>
          <span class="group-label">${row.label}</span>
          <span class="badge">${row.count} Nodes</span>
        </div>
      `;
        }

        if (rowType === 'footer') {
            const basePadding = this.density === 'compact' ? 12 : 24;
            return html`
        <div class="grid-row" style="background: rgba(16, 185, 129, 0.02);">
          ${this.showSelection ? html`<div class="selection-cell"></div>` : nothing}
          ${activeCols.map((col, idx) => {
                const val = row.data[col.key];
                let content: any = '';
                if (val !== undefined) {
                    if (col.aggType === 'sum') content = `∑ ${Number(val).toLocaleString()}`;
                    else if (col.aggType === 'avg') content = `μ ${Number(val).toFixed(2)}`;
                    else if (col.aggType === 'count') content = `# ${Number(val).toLocaleString()}`;
                }
                if (idx === 0) content = row.label;

                const colWidth = col.width || 150;
                const cellStyle = `width: ${colWidth}px; min-width: ${colWidth}px; color: ${idx === 0 ? 'var(--grid-muted)' : 'var(--grid-emerald)'}; font-size: 10px; font-weight: bold; padding-left: ${idx === 0 ? `${basePadding + (row.level * basePadding) + 20}px` : ''}`;

                return html`
              <div class="grid-cell" style="${cellStyle}">
                ${content}
              </div>
            `;
            })}
        </div>
      `;
        }

        const isSelected = this.selectedIds.has(rowData.id);
        const isFocused = this.focusedId === rowData.id;
        const rowClass = `grid-row ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`;

        return html`
      <div class="${rowClass}" @click=${(e: MouseEvent) => this.handleRowClick(e, rowData)}>
        ${this.showSelection ? html`
          <div class="selection-cell">
             <div class="${this.selectionMode === 'multiple' ? 'checkbox' : 'radio'} ${isSelected ? 'checked' : ''}"></div>
          </div>
        ` : nothing}
        ${activeCols.map((col) => {
            const val = rowData[col.key];
            let formatted: any = col.formatter ? col.formatter(val) : this.highlightText(val, this.searchTerm);

            if (!col.formatter) {
                if (col.dataType === 'status') {
                    const isActive = val === 'Active';
                    formatted = html`
                <span class="status-dot ${isActive ? 'status-active' : 'status-inactive'}"></span>
                ${this.highlightText(val != null ? String(val).toUpperCase() : '', this.searchTerm)}
              `;
                } else if (col.dataType === 'throughput') {
                    formatted = html`<span style="color: #10B981; font-weight: bold;">${val != null ? Number(val).toLocaleString() : '0'} MB/s</span>`;
                } else if (col.dataType === 'date') {
                    formatted = html`<span style="color: #64748B;">${this.highlightText(val != null ? String(val) : '', this.searchTerm)}</span>`;
                }
            }

            const colWidth = col.width || 150;
            const justify = col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start';
            return html`
            <div class="grid-cell" style="width: ${colWidth}px; min-width: ${colWidth}px; justify-content: ${justify};">
              ${formatted}
            </div>
          `;
        })}
      </div>
    `;
    }

    private renderStickyFooter(activeCols: ColumnDefinition[], globalAggs: any) {
        if (!this.aggregatesEnabled || !globalAggs) return nothing;

        return html`
      <div class="sticky-footer-container">
        <div class="grid-sticky-footer">
          <div class="grid-footer-row">
            ${this.showSelection ? html`<div class="selection-cell"></div>` : nothing}
            ${activeCols.map((col) => {
            const val = globalAggs[col.key];
            let content: any = '';
            if (val !== undefined) {
                if (col.aggType === 'sum') content = `∑ ${Number(val).toLocaleString()}`;
                else if (col.aggType === 'avg') content = `μ ${Number(val).toFixed(2)}`;
                else if (col.aggType === 'count') content = `# ${Number(val).toLocaleString()}`;
            }
            const colWidth = col.width || 150;
            const justify = col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start';
            return html`
                <div class="footer-cell" style="width: ${colWidth}px; min-width: ${colWidth}px; justify-content: ${justify};">
                  ${content}
                </div>
              `;
        })}
          </div>
        </div>
      </div>
    `;
    }

    render() {
        const displayRows = this._displayRows;
        const globalAggs = this._globalAggs;
        const activeCols = this._activeCols;
        const rowHeight = this.density === 'compact' ? 32 : 48;
        const gridHeight = this.bodyElement?.clientHeight || 500;
        const buffer = 10;
        const totalHeight = displayRows.length * rowHeight;
        const startIndex = Math.max(0, Math.floor(this.currentScrollTop / rowHeight) - buffer);
        const endIndex = Math.min(displayRows.length - 1, Math.floor((this.currentScrollTop + gridHeight) / rowHeight) + buffer);
        const visibleRows = displayRows.slice(startIndex, endIndex + 1);
        const offsetY = startIndex * rowHeight;
        const totalWidth = this._totalWidth;

        return html`
      <slot style="display: none;" @slotchange=${this._syncColumnsFromTags}></slot>
      <div class="toolbar">
        <div class="search-container">
          <svg class="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" class="search-input" placeholder="Search dataset..." .value=${this.searchTerm} @input=${this.onSearch} />
        </div>
        <div class="controls">
          <button class="btn" style="font-size: 10px;" @click=${() => {
                this.selectionMode = this.selectionMode === 'multiple' ? 'single' : 'multiple';
                this.selectedIds = new Set();
            }}>
            MODE: ${this.selectionMode.toUpperCase()}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${() => this.showSelection = !this.showSelection}>
            SELECTION COL: ${this.showSelection ? 'HIDE' : 'SHOW'}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${this.toggleDensity}>
            DENSITY: ${this.density.toUpperCase()}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${() => this.showGroupPanel = !this.showGroupPanel}>
            GROUP PANEL: ${this.showGroupPanel ? 'HIDE' : 'SHOW'}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${this.toggleMode}>
            ${this.paginationEnabled ? 'PAGINATION: ON' : 'VIRTUAL MODE: ON'}
          </button>
          <button class="btn" style="font-size: 10px; ${this.aggregatesEnabled ? 'color: var(--grid-emerald); border-color: var(--grid-emerald);' : ''}" @click=${this.toggleAggregates}>
            AGGREGATES: ${this.aggregatesEnabled ? 'ON' : 'OFF'}
          </button>
          <select class="btn" style="background: var(--grid-surface); font-size: 10px;" @change=${this.handleColumnToggle}>
            <option value="">MANAGE COLUMNS</option>
            ${this.columns.map(c => html`<option value="${c.key}">${c.visible ? 'HIDE' : 'SHOW'} ${c.label}</option>`)}
          </select>
          <button class="btn" @click=${this.exportCSV}>CSV EXPORT</button>
        </div>
      </div>
      
      <div class="grid-container">
        ${this.showGroupPanel ? html`
          <div 
            class="group-panel"
            @dragover=${(e: DragEvent) => this.onDragOver(e, 'panel')}
            @dragleave=${this.onDragLeave}
            @drop=${(e: DragEvent) => this.onDrop(e)}
          >
            ${this.multiGrouping.length === 0 ? 'Drag columns here to group data' : nothing}
            ${this.multiGrouping.map((key, idx) => {
                const col = this.columns.find(c => c.key === key);
                return html`
                <div class="group-tag" @click=${() => this.toggleGroup(key as keyof DataItem)}>
                  <div class="group-idx">${idx + 1}</div>
                  <span>${col?.label}</span>
                  <span style="margin-left: 8px;">✕</span>
                </div>
              `;
            })}
          </div>
        ` : nothing}
        
        ${this.renderHeader()}
        
        <div id="body" class="grid-body custom-scrollbar" @scroll=${this.onBodyScroll} @keydown=${this.onKeyDown} tabindex="0">
          <div class="virtual-spacer" style="height: ${totalHeight}px; width: ${totalWidth}px;"></div>
          <div class="rows-container" style="transform: translateY(${offsetY}px); width: ${totalWidth}px;">
            ${visibleRows.map((row, idx) => {
                const rowKey = row.type ? (row.type === 'row' ? row.data.id : `${row.type}-${row.path || idx}`) : row.id;
                return keyed(rowKey, this.renderRow(row, activeCols));
            })}
          </div>
          ${this.loading ? html`
            <div class="loading-overlay">
              <div class="spinner"></div>
            </div>
          ` : nothing}
        </div>
        
        ${this.renderStickyFooter(activeCols, globalAggs)}
      </div>

      <div class="footer">
        <div>Total Found: <strong>${(this.total ?? 0).toLocaleString()}</strong> Records | <strong>${this.selectedIds.size}</strong> Selected</div>
        ${this.paginationEnabled ? html`
          <div class="pagination">
            <button class="btn" ?disabled=${this.page === 1} @click=${() => { this.page--; this.fetchData(); }}>PREV</button>
            <span style="color: var(--grid-muted)">Page ${this.page} of ${Math.ceil((this.total ?? 0) / this.pageSize)}</span>
            <button class="btn" ?disabled=${this.page >= Math.ceil((this.total ?? 0) / this.pageSize)} @click=${() => { this.page++; this.fetchData(); }}>NEXT</button>
          </div>
        ` : nothing}
      </div>
    `;
    }
}
