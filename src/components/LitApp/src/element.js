import { ThemeManagerInstance } from "./theme.js";
export const adoptedStyleSheets = [ThemeManagerInstance.getCSSStyleSheet()];
export const booleanConverter = {
    toView(value) {
        return value ? "true" : "false";
    },
    fromView(value) {
        return value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
            ? false
            : true;
    },
};
export const nullableBooleanConverter = {
    toView(value) {
        return typeof value === "boolean" ? value.toString() : "";
    },
    fromView(value) {
        return [null, undefined, void 0].includes(value)
            ? null
            : booleanConverter.fromView(value);
    },
};
function toNumber(value) {
    if (value === null || value === undefined) {
        return null;
    }
    const number = value * 1;
    return isNaN(number) ? null : number;
}
export const nullableNumberConverter = {
    toView(value) {
        const output = toNumber(value);
        return output ? output.toString() : output;
    },
    fromView: toNumber,
};
export class NeuElement extends HTMLElement {
    static _template;
    _shadow;
    _eventsUnwireController;
    _styleElement;
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.adoptedStyleSheets = adoptedStyleSheets;
        this._styleElement = document.createElement("style");
        this._styleElement.textContent = this.getCssRules();
        this._shadow.appendChild(this._styleElement);
        this._shadow.appendChild(this.getTemplate());
    }
    get shadow() {
        return this._shadow;
    }
    getTemplate() {
        const proto = Object.getPrototypeOf(this);
        if (!proto._template) {
            proto._template = this.getTemplateInternal();
        }
        return proto._template.content.cloneNode(true);
    }
    get eventsUnwireController() {
        return this._eventsUnwireController ??= new AbortController();
    }
    connectedCallback() {
        this.updateRendering();
        console.log("connectedCallback");
    }
    disconnectedCallback() {
        this.eventsUnwireController.abort();
    }
    updateRendering() {
    }
}
export class NeuFormElement extends NeuElement {
    _internals;
    static formAssociated() {
        return true;
    }
    static observedAttributes = ["checked"];
    constructor() {
        super();
        this._internals = this.attachInternals();
        console.debug(this._internals);
    }
    get internals() {
        return this._internals;
    }
    get form() {
        return this._internals.form;
    }
    get name() {
        return this.getAttribute("name");
    }
    get type() {
        return this.localName;
    }
}
//# sourceMappingURL=element.js.map