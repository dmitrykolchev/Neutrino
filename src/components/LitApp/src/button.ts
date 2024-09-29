
import { NeuElement } from './element.js';
import { ThemeManagerInstance, DarkTheme } from './theme.js';

export class Button extends NeuElement {

    static observedAttributes = ["text", "image"];
    private _text: string | null = null;
    private _button: HTMLButtonElement;
    private _handleButtonClick: (e: MouseEvent) => void;

    public static define(tag: string = "neu-button") {
        customElements.define(tag, Button);
    }

    constructor() {
        super();
        this._button = this.shadow.querySelector("button")!;
        this._handleButtonClick = this.handleButtonClick.bind(this);
    }

    protected getCssRules(): string {
        return `
            span {
              color: var(--text-color);
              border: 4px dotted var(--border-color);
              background-color: var(--background-color);
              padding: 4px;
            }`;
    }

    protected getTemplateInternal(): HTMLTemplateElement {
        return <HTMLTemplateElement>new DOMParser().parseFromString(`<template>
          <span>
            <slot name="inner-text">I'm in the shadow DOM</slot>
            <button type="button">
                <slot="button-text">Change</slot>
            </button>
          </span>
        </template>`, "text/html").querySelector("template");
    }


    private handleButtonClick(e: MouseEvent) {
        const colors = ThemeManagerInstance.getTheme().getColors();
        const sheets = this.shadowRoot?.adoptedStyleSheets[0]!;
        const index = Math.floor(Math.random() * 2);
        sheets.replaceSync(`:host {
            --text-color: ${["red", "green"][index]};
            --border-color: ${colors.borderColor};
            --background-color: ${colors.backgroundColor};
        }`);
    }

    public get text(): string | null {
        return this._text;
    }

    public set text(value: string) {
        this.setAttribute("text", value);
    }

    protected connectedCallback(): void {
        this._text = this.getAttribute("text");
        const { signal } = this.eventsUnwireController;
        this._button.addEventListener("click", this._handleButtonClick, { signal });
        super.connectedCallback();
    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name === "text") {
            this._text = newValue;
        }
        console.log(`${name}: ${oldValue} => ${newValue}`);
    }

    adoptedCallback(): void {
        console.log("adoptedCallback");
    }
}


Button.define();
