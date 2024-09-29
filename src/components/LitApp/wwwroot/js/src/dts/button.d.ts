import { NeuElement } from './element.js';
export declare class Button extends NeuElement {
    static observedAttributes: string[];
    private _text;
    private _button;
    private _handleButtonClick;
    static define(tag?: string): void;
    constructor();
    protected getCssRules(): string;
    protected getTemplateInternal(): HTMLTemplateElement;
    private handleButtonClick;
    get text(): string | null;
    set text(value: string);
    protected connectedCallback(): void;
    protected attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    adoptedCallback(): void;
}
