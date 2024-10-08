import { TemplateResult, CSSResultArray } from "lit";
import { ValuesOf } from "../base/Typings.js";
import { Focusable } from "../base/Focusable.js";
export declare const ButtonType: {
    submin: string;
    reset: string;
    button: string;
};
export type ButtonType = ValuesOf<typeof ButtonType>;
declare const Button_base: typeof Focusable & {
    new (...args: any[]): import("../base/FormElement.js").IFormElement;
    prototype: import("../base/FormElement.js").IFormElement;
} & {
    new (...args: any[]): import("../base/AnchorLike.js").IAnchorLike;
    prototype: import("../base/AnchorLike.js").IAnchorLike;
};
export declare class Button extends Button_base {
    private _buttonRef;
    static get styles(): CSSResultArray;
    active: boolean;
    type: ButtonType;
    private anchorElement;
    get focusElement(): HTMLElement;
    protected render(): TemplateResult;
    private handleClick;
    private handleMouseDown;
    private handleMouseDown1;
    connectedCallback(): void;
}
export {};
