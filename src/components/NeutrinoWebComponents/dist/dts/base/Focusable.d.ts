import { NeutrinoElement } from "./NeutrinoElement.js";
import { PropertyValues } from "lit";
type DisableableElement = HTMLElement & {
    disabled?: boolean;
};
export declare class Focusable extends NeutrinoElement {
    private _tabIndex;
    constructor();
    disabled: boolean;
    autofocus: boolean;
    get tabIndex(): number;
    set tabIndex(tabIndex: number);
    private onPointerdownManagementOfTabIndex;
    private manageFocusElementTabindex;
    private manipulatingTabindex;
    get focusElement(): DisableableElement;
    get selfManageFocusElement(): boolean;
    focus(options?: FocusOptions): void;
    blur(): void;
    click(): void;
    protected manageAutoFocus(): void;
    protected firstUpdated(changes: PropertyValues): void;
    protected update(changedProperties: PropertyValues): void;
    protected updated(changedProperties: PropertyValues): void;
    private handleDisabledChanged;
    protected getUpdateComplete(): Promise<boolean>;
    private autofocusReady;
    connectedCallback(): void;
}
export {};
