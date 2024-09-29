import { NeuElement } from './element.js';
import { ThemeManagerInstance } from './theme.js';
export class Button extends NeuElement {
    static observedAttributes = ["text", "image"];
    _text = null;
    _button;
    _handleButtonClick;
    static define(tag = "neu-button") {
        customElements.define(tag, Button);
    }
    constructor() {
        super();
        this._button = this.shadow.querySelector("button");
        this._handleButtonClick = this.handleButtonClick.bind(this);
    }
    getCssRules() {
        return `
            span {
              color: var(--text-color);
              border: 4px dotted var(--border-color);
              background-color: var(--background-color);
              padding: 4px;
            }`;
    }
    getTemplateInternal() {
        return new DOMParser().parseFromString(`<template>
          <span>
            <slot name="inner-text">I'm in the shadow DOM</slot>
            <button type="button">
                <slot="button-text">Change</slot>
            </button>
          </span>
        </template>`, "text/html").querySelector("template");
    }
    handleButtonClick(e) {
        const colors = ThemeManagerInstance.getTheme().getColors();
        const sheets = this.shadowRoot?.adoptedStyleSheets[0];
        const index = Math.floor(Math.random() * 2);
        sheets.replaceSync(`:host {
            --text-color: ${["red", "green"][index]};
            --border-color: ${colors.borderColor};
            --background-color: ${colors.backgroundColor};
        }`);
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this.setAttribute("text", value);
    }
    connectedCallback() {
        this._text = this.getAttribute("text");
        const { signal } = this.eventsUnwireController;
        this._button.addEventListener("click", this._handleButtonClick, { signal });
        super.connectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this._text = newValue;
        }
        console.log(`${name}: ${oldValue} => ${newValue}`);
    }
    adoptedCallback() {
        console.log("adoptedCallback");
    }
}
Button.define();
//# sourceMappingURL=button.js.map