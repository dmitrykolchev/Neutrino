import { ThemeManagerInstance } from "./theme.js";

export const adoptedStyleSheets: CSSStyleSheet[] = [ThemeManagerInstance.getCSSStyleSheet()];

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
}

export const booleanConverter: ValueConverter = {
    toView(value: any): string {
        return value ? "true" : "false";
    },

    fromView(value: any): any {
        return value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
            ? false
            : true;
    },
};

export const nullableBooleanConverter: ValueConverter = {
    toView(value: any): string {
        return typeof value === "boolean" ? value.toString() : "";
    },

    fromView(value: any): any {
        return [null, undefined, void 0].includes(value)
            ? null
            : booleanConverter.fromView(value);
    },
};

function toNumber(value: any): any {
    if (value === null || value === undefined) {
        return null;
    }
    const number: number = value * 1;
    return isNaN(number) ? null : number;
}

export const nullableNumberConverter: ValueConverter = {
    toView(value: any): string | null {
        const output = toNumber(value);
        return output ? output.toString() : output;
    },

    fromView: toNumber,
};

export interface Accessor {
    /**
     * The name of the property.
     */
    name: string;

    /**
     * Gets the value of the property on the source object.
     * @param source - The source object to access.
     */
    getValue(source: any): any;

    /**
     * Sets the value of the property on the source object.
     * @param source - The source object to access.
     * @param value - The value to set the property to.
     */
    setValue(source: any, value: any): void;
}

export abstract class NeuElement extends HTMLElement {
    private static _template: HTMLTemplateElement;
    private _shadow: ShadowRoot;
    private _eventsUnwireController!: AbortController;
    private _styleElement: HTMLStyleElement;

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.adoptedStyleSheets = adoptedStyleSheets;
        this._styleElement = document.createElement("style");
        this._styleElement.textContent = this.getCssRules();
        this._shadow.appendChild(this._styleElement);
        this._shadow.appendChild(this.getTemplate());
    }

    protected get shadow(): ShadowRoot {
        return this._shadow;
    }

    protected abstract getTemplateInternal(): HTMLTemplateElement;

    protected abstract getCssRules(): string;

    public getTemplate(): Node {
        const proto = Object.getPrototypeOf(this);
        if (!proto._template) {
            proto._template = this.getTemplateInternal();
        }
        return proto._template.content.cloneNode(true);
    }

    protected get eventsUnwireController(): AbortController {
        return this._eventsUnwireController ??= new AbortController();
    }

    protected connectedCallback(): void {
        this.updateRendering();
        console.log("connectedCallback");
    }

    protected disconnectedCallback(): void {
        this.eventsUnwireController.abort();
    }

    protected updateRendering() {
    }
}


export abstract class NeuFormElement extends NeuElement {
    private _internals: ElementInternals;

    public static formAssociated(): boolean {
        return true;
    }

    public static observedAttributes = ["checked"];

    constructor() {
        super();
        this._internals = this.attachInternals();
        console.debug(this._internals);
    }

    protected get internals(): ElementInternals {
        return this._internals;
    }

    public get form(): HTMLFormElement | null {
        return this._internals.form;
    }

    public get name() {
        return this.getAttribute("name");
    }

    public get type() {
        return this.localName;
    }
}
