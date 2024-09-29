import { NeuFormElement } from "../element.js";
import { html } from 'lit-html';
export class CheckBox extends NeuFormElement {
    static define(tag = "neu-checkbox") {
        customElements.define(tag, CheckBox);
    }
    constructor() {
        super();
        this.internals.ariaChecked = "false";
        this.internals.role = "checkbox";
    }
    get caption() {
        return "caption";
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.handleClick.bind(this), { signal: this.eventsUnwireController.signal });
    }
    getTemplateInternal() {
        const template = (data) => html `<template>
          <span>
            <slot="text">${() => data.caption}</slot>
          </span>
        </template>`;
        console.debug(template(this));
        return new DOMParser().parseFromString(`<template>
          <span>
            <slot="text">Control text</slot>
          </span>
        </template>`, "text/html").querySelector("template");
    }
    getCssRules() {
        return `:host::before {
         content: '[ ]';
         white-space: pre;
         font-family: monospace;
       }
       :host(:state(checked))::before {
           content: '[x]'
       }`;
    }
    get checked() {
        return this.hasAttribute("checked");
    }
    set checked(value) {
        this.toggleAttribute("checked", value);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "checked") {
            if (this.checked) {
                this.internals.states.add("checked");
            }
            else {
                this.internals.states.delete("checked");
            }
            this.internals.setFormValue(this.checked ? "on" : null);
            this.internals.ariaChecked = this.checked ? "true" : "false";
        }
        this.updateRendering();
    }
    handleClick(e) {
        this.checked = !this.checked;
        console.log("handleClick called");
    }
    updateRendering() {
        super.updateRendering();
        const container = this.shadow.querySelector("span");
        if (container) {
            container.textContent = (this.checked ? "checked" : "not checked");
        }
    }
}
CheckBox.define();
//# sourceMappingURL=checkbox.js.map