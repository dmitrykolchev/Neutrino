import { CSSResultArray, html, TemplateResult } from "lit";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import style from "./Sidebar.css";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarHeading } from "./SidebarHeading.js";

type SidebarItemType = SidebarItem | SidebarHeading;

export class Sidebar extends Focusable {
    private _items: Set<SidebarItemType> = new Set<SidebarItemType>();

    public static get styles(): CSSResultArray {
        return [style];
    }

    constructor() {
        super();
    }

    public get focusElement(): HTMLElement {
        return this;
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

    public startTrackingItem(item: SidebarItem | SidebarHeading): void {
        if (item) {
            this._items.add(item);
            if (!item.slot) {
                item.slot = "descendant";
            }
        }
    }

    public stopTrackingItem(item: SidebarItem | SidebarHeading): void {
        if (item) {
            this._items.delete(item);
        }
    }
}

defineElement(`${prefix}-sidebar`, Sidebar)
defineElement(`${prefix}-sidebar-item`, SidebarItem)
defineElement(`${prefix}-sidebar-header`, SidebarHeading)
