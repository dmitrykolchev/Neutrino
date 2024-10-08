var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { html } from "lit";
import { property, query } from "lit/decorators.js";
import { ref, createRef } from "lit/directives/ref.js";
import { defineElement } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import { AnchorLike } from "../base/AnchorLike.js";
import style from "./Button.css";
import { FormElement } from "../base/FormElement.js";
const template = html `<button type="button">Hello World!</button>`;
export const ButtonType = {
    submin: "submit",
    reset: "reset",
    button: "button"
};
export class Button extends AnchorLike(FormElement(Focusable)) {
    constructor() {
        super(...arguments);
        this._buttonRef = createRef();
        this.active = false;
        this.type = 'button';
        this.handleMouseDown = (e) => {
            console.debug(this);
        };
    }
    static get styles() {
        return [style];
    }
    get focusElement() {
        return this;
    }
    render() {
        return html `<button 
            type="${this.type}" 
            ${ref(this._buttonRef)}
            @click=${(c) => this.handleClick(c)}>
            <slot name="start" part="start"></slot>
            <slot part="caption"></slot>
            <slot name="end" part="end"></slot>
            </button>`;
    }
    handleClick(c) {
        console.log(`Button click ${this._buttonRef}`);
    }
    handleMouseDown1(e) {
        console.debug(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousedown", this.handleMouseDown1);
    }
}
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], Button.prototype, "active", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], Button.prototype, "type", void 0);
__decorate([
    query('.anchor'),
    __metadata("design:type", HTMLButtonElement)
], Button.prototype, "anchorElement", void 0);
defineElement("neu-button", Button);
//# sourceMappingURL=Button.js.map