export declare const adoptedStyleSheets: CSSStyleSheet[];
export interface ValueConverter {
    toView(value: any): any;
    fromView(value: any): any;
}
export type AttributeMode = "reflect" | "boolean" | "fromView";
export type AttributeConfiguration = {
    property: string;
    attribute?: string;
    mode?: AttributeMode;
    converter?: ValueConverter;
};
export declare const booleanConverter: ValueConverter;
export declare const nullableBooleanConverter: ValueConverter;
export declare const nullableNumberConverter: ValueConverter;
export interface Accessor {
    name: string;
    getValue(source: any): any;
    setValue(source: any, value: any): void;
}
export declare abstract class NeuElement extends HTMLElement {
    private static _template;
    private _shadow;
    private _eventsUnwireController;
    private _styleElement;
    constructor();
    protected get shadow(): ShadowRoot;
    protected abstract getTemplateInternal(): HTMLTemplateElement;
    protected abstract getCssRules(): string;
    getTemplate(): Node;
    protected get eventsUnwireController(): AbortController;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    protected updateRendering(): void;
}
export declare abstract class NeuFormElement extends NeuElement {
    private _internals;
    static formAssociated(): boolean;
    static observedAttributes: string[];
    constructor();
    protected get internals(): ElementInternals;
    get form(): HTMLFormElement | null;
    get name(): string | null;
    get type(): string;
}
