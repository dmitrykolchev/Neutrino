import { CSSResultArray, TemplateResult } from "lit";
import { Focusable } from "../base/Focusable.js";
import { IItemContainer, SidebarItem } from "./SidebarItem.js";
export declare class Sidebar extends Focusable implements IItemContainer<SidebarItem> {
    private _items;
    static get styles(): CSSResultArray;
    constructor();
    get focusElement(): HTMLElement;
    get items(): Set<SidebarItem>;
    get hasChildren(): boolean;
    get parent(): IItemContainer<SidebarItem> | undefined;
    startTrackingItem(item: SidebarItem): void;
    stopTrackingItem(item: SidebarItem): void;
    protected render(): TemplateResult;
}
