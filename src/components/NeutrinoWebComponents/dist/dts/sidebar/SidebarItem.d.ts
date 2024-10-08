import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { CSSResultArray, TemplateResult } from "lit";
import { Sidebar } from "./Sidebar.js";
declare const SidebarItem_base: typeof NeutrinoElement & {
    new (...args: any[]): import("../base/AnchorLike.js").IAnchorLike;
    prototype: import("../base/AnchorLike.js").IAnchorLike;
};
export declare class SidebarItem extends SidebarItem_base {
    private _parentSidebar;
    static get styles(): CSSResultArray;
    constructor();
    value: string | undefined;
    selected: boolean;
    expanded: boolean;
    get parentSidebar(): Sidebar | undefined;
    protected render(): TemplateResult;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
}
export {};
