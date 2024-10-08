import { CSSResultArray, TemplateResult } from "lit";
import { Focusable } from "../base/Focusable.js";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarHeading } from "./SidebarHeading.js";
export declare class Sidebar extends Focusable {
    private _items;
    static get styles(): CSSResultArray;
    constructor();
    get focusElement(): HTMLElement;
    protected render(): TemplateResult;
    startTrackingItem(item: SidebarItem | SidebarHeading): void;
    stopTrackingItem(item: SidebarItem | SidebarHeading): void;
}
