import { html } from "lit";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import style from "./Sidebar.css";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarHeading } from "./SidebarHeading.js";
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
    render() {
        return html `
            <nav>
                <div role="list">
                    <slot name="descendant"></slot>
                </div>
            </nav>
        `;
    }
    startTrackingItem(item) {
        if (item) {
            this._items.add(item);
            if (!item.slot) {
                item.slot = "descendant";
            }
        }
    }
    stopTrackingItem(item) {
        if (item) {
            this._items.delete(item);
        }
    }
}
defineElement(`${prefix}-sidebar`, Sidebar);
defineElement(`${prefix}-sidebar-item`, SidebarItem);
defineElement(`${prefix}-sidebar-header`, SidebarHeading);
//# sourceMappingURL=Sidebar.js.map