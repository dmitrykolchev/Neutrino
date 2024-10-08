import { CSSResultArray, PropertyValues, TemplateResult } from "lit";
import { Sidebar } from "./Sidebar.js";
import { Focusable } from "../base/Focusable.js";
declare const SidebarItem_base: typeof Focusable & {
    new (...args: any[]): import("../base/AnchorLike.js").IAnchorLike;
    prototype: import("../base/AnchorLike.js").IAnchorLike;
};
export declare class SidebarItem extends SidebarItem_base {
    private _parentSidebar;
    static get styles(): CSSResultArray;
    value: string | undefined;
    selected: boolean;
    expanded: boolean;
    get parentSidebar(): Sidebar | undefined;
    get focusElement(): HTMLElement;
    protected get hasChildren(): boolean;
    protected render(): TemplateResult;
    protected firstUpdated(changed: PropertyValues<this>): void;
    protected update(changes: PropertyValues): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    click(): void;
    handleSidebarSelect(event: Event): void;
    private handleClick;
    private announceSelected;
}
export {};
