import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { Sidebar } from "./Sidebar.js";
import { CSSResultArray, TemplateResult } from "lit";
export interface IItemContainer<TItem> {
    readonly items: Iterable<TItem>;
    readonly hasChildren: boolean;
    readonly parent: IItemContainer<TItem> | unknown;
    startTrackingItem(item: TItem): void;
    stopTrackingItem(item: TItem): void;
}
declare const SidebarItem_base: typeof NeutrinoElement & {
    new (...args: any[]): import("../base/AnchorLike.js").IAnchorLike;
    prototype: import("../base/AnchorLike.js").IAnchorLike;
};
export declare class SidebarItem extends SidebarItem_base implements IItemContainer<SidebarItem> {
    private _parentSidebar;
    private _items;
    private _parent;
    static get styles(): CSSResultArray;
    constructor();
    value: string | undefined;
    selected: boolean;
    expanded: boolean;
    get items(): Set<SidebarItem>;
    get parent(): IItemContainer<SidebarItem> | undefined;
    get hasChildren(): boolean;
    get parentSidebar(): Sidebar | undefined;
    startTrackingItem(item: SidebarItem): void;
    stopTrackingItem(item: SidebarItem): void;
    protected render(): TemplateResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export {};
