import { CSSResultArray, html, TemplateResult } from "lit";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import style from "./Sidebar.css";
import { ifDefined } from "lit/directives/if-defined.js";
import { IItemContainer, SidebarItem } from "./SidebarItem.js";


export class Sidebar extends Focusable
    implements IItemContainer<SidebarItem> {
    private _items = new Set<SidebarItem>();
    public static get styles(): CSSResultArray {
        return [style];
    }

    constructor() {
        super();
    }

    public get focusElement(): HTMLElement {
        return this;
    }

    public get items(): Set<SidebarItem> {
        return this._items;
    }

    public get hasChildren(): boolean {
        return !!this.querySelector('sp-sidenav-item');
    }

    public get parent(): IItemContainer<SidebarItem> | undefined {
        return undefined;
    }

    public startTrackingItem(item: SidebarItem) {
        this._items.add(item);
        if (!item.slot) {
            item.slot = "descendant";
        }
    }

    public stopTrackingItem(item: SidebarItem) {
        this._items.delete(item);
    }

    protected override render(): TemplateResult {
        return html`
            <nav>
                <div role="list">
                    <slot name="descendant"></slot>
                </div>
            </nav>
        `;
    }

}

defineElement(`${prefix}-sidebar`, Sidebar)
defineElement(`${prefix}-sidebar-item`, SidebarItem)