import { html } from "lit";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import style from "./Sidebar.css";
import { SidebarItem } from "./SidebarItem.js";
export class Sidebar extends Focusable {
    static get styles() {
        return [style];
    }
    constructor() {
        super();
        this._items = new Set();
    }
    get focusElement() {
        return this;
    }
    get items() {
        return this._items;
    }
    get hasChildren() {
        return !!this.querySelector('sp-sidenav-item');
    }
    get parent() {
        return undefined;
    }
    startTrackingItem(item) {
        this._items.add(item);
        if (!item.slot) {
            item.slot = "descendant";
        }
    }
    stopTrackingItem(item) {
        this._items.delete(item);
    }
    render() {
        return html `
            <nav>
                <div role="list">
                    <slot name="descendant"></slot>
                </div>
            </nav>
        `;
    }
}
defineElement(`${prefix}-sidebar`, Sidebar);
defineElement(`${prefix}-sidebar-item`, SidebarItem);
//# sourceMappingURL=Sidebar.js.map