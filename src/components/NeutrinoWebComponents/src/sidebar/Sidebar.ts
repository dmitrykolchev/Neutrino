import { CSSResultArray, html, TemplateResult } from "lit";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarHeading } from "./SidebarHeading.js";

import style from "./Sidebar.css";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

export interface SidebarSelectDetail {
    value: string;
}

export class Sidebar extends Focusable {
    private _items: Set<SidebarItem> = new Set<SidebarItem>();

    public static get styles(): CSSResultArray {
        return [style];
    }

    @property({ reflect: true })
    public value: string | undefined = undefined;

    @property({ reflect: true })
    public label?: string | undefined = undefined;

    public get focusElement(): HTMLElement {
        return this;
    }

    protected override render(): TemplateResult {
        return html`
            <nav
                @sidebar-select=${this.handleSelect}
                aria-label=${ifDefined(this.label)}
            >
                <div role="list">
                    <slot name="descendant"></slot>
                </div>
            </nav>
        `;
    }

    private handleSelect(
        event: CustomEvent<SidebarSelectDetail> & { target: SidebarItem }
    ): void {
        event.stopPropagation();
        if (this.value === event.detail.value) {
            return;
        }
        const oldValue = this.value;
        this.value = event.detail.value;
        const applyDefault = this.dispatchEvent(
            new Event('change', {
                bubbles: true,
                composed: true,
                cancelable: true,
            })
        );
        if (!applyDefault) {
            this.value = oldValue;
            event.target.selected = false;
            event.preventDefault();
        }
        else {
            this._items.forEach((item) => item.handleSidebarSelect(event));
        }
    }

    public startTrackingSelection(item: SidebarItem): void {
        if (item) {
            this._items.add(item);
        }
    }

    public stopTrackingSelection(item: SidebarItem): void {
        if (item) {
            this._items.delete(item);
        }
    }
}

defineElement(`${prefix}-sidebar`, Sidebar)
defineElement(`${prefix}-sidebar-item`, SidebarItem)
defineElement(`${prefix}-sidebar-header`, SidebarHeading)
