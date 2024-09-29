import { NeuFormElement } from "../element.js";
import { html } from 'lit-html';

export class CheckBox extends NeuFormElement {

    public static define(tag: string = "neu-checkbox") {
        customElements.define(tag, CheckBox);
    }

    constructor() {
        super();
        this.internals.ariaChecked = "false";
        this.internals.role = "checkbox";
    }

    public get caption(): string {
        return "caption";
    }

    protected connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("click", this.handleClick.bind(this), { signal: this.eventsUnwireController.signal });
    }

    protected getTemplateInternal(): HTMLTemplateElement {
        const template = (data: CheckBox) => html`<template>
          <span>
            <slot="text">${() => data.caption}</slot>
          </span>
        </template>`;

        console.debug(template(this));

        return <HTMLTemplateElement>new DOMParser().parseFromString(`<template>
          <span>
            <slot="text">Control text</slot>
          </span>
        </template>`, "text/html").querySelector("template");
    }

    protected getCssRules(): string {
        return `:host::before {
         content: '[ ]';
         white-space: pre;
         font-family: monospace;
       }
       :host(:state(checked))::before {
           content: '[x]'
       }`;
    }
    public get checked(): boolean {
        return this.hasAttribute("checked");
    }

    public set checked(value: boolean) {
        this.toggleAttribute("checked", value);
    }

    protected attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (name == "checked") {
            if (this.checked) {
                (<any>this.internals.states).add("checked");
            }
            else {
                (<any>this.internals.states).delete("checked");
            }
            this.internals.setFormValue(this.checked ? "on" : null);
            this.internals.ariaChecked = this.checked ? "true" : "false";
        }
        this.updateRendering();
    }

    private handleClick(e: Event) {
        this.checked = !this.checked;
        console.log("handleClick called");
    }

    protected updateRendering() {
        super.updateRendering();
        const container = this.shadow.querySelector("span");
        if (container) {
            container.textContent = (this.checked ? "checked" : "not checked");
        }
    }

}


CheckBox.define();
