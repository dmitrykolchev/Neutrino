import { NeuFormElement } from "../element.js";
export declare class CheckBox extends NeuFormElement {
    static define(tag?: string): void;
    constructor();
    get caption(): string;
    protected connectedCallback(): void;
    protected getTemplateInternal(): HTMLTemplateElement;
    protected getCssRules(): string;
    get checked(): boolean;
    set checked(value: boolean);
    protected attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private handleClick;
    protected updateRendering(): void;
}
