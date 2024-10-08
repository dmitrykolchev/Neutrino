import { CSSResultArray, TemplateResult } from "lit";
import { Focusable } from "../base/Focusable.js";
import { SidebarItem } from "./SidebarItem.js";
export interface SidebarSelectDetail {
    value: string;
}
export declare class Sidebar extends Focusable {
    private _items;
    static get styles(): CSSResultArray;
    value: string | undefined;
    label?: string | undefined;
    get focusElement(): HTMLElement;
    protected render(): TemplateResult;
    private handleSelect;
    startTrackingSelection(item: SidebarItem): void;
    stopTrackingSelection(item: SidebarItem): void;
}
