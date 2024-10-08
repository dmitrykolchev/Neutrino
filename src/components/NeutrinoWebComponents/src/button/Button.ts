import { TemplateResult, html, CSSResultArray } from "lit";
import { property, query } from "lit/decorators.js";
import { Ref, ref, createRef } from "lit/directives/ref.js";
import { defineElement } from "../base/DefineElement.js";
import { ValuesOf } from "../base/Typings.js";
import { Focusable } from "../base/Focusable.js";
import { AnchorLike } from "../base/AnchorLike.js";
import style from "./Button.css";
import { FormElement } from "../base/FormElement.js";

const template = html`<button type="button">Hello World!</button>`;

export const ButtonType =
{
    submin: "submit",
    reset: "reset",
    button: "button"
}

export type ButtonType = ValuesOf<typeof ButtonType>;

export class Button extends AnchorLike(FormElement(Focusable)) {

    private _buttonRef: Ref<HTMLButtonElement> = createRef();

    public static get styles(): CSSResultArray {
        return [style];
    }

    @property({ type: Boolean, reflect: true })
    public active = false;

    @property({ type: String })
    public type: ButtonType = 'button';

    @query('.anchor')
    private anchorElement!: HTMLButtonElement;

    public get focusElement(): HTMLElement {
        return this;
    }

    protected render(): TemplateResult {
        return html`<button 
            type="${this.type}" 
            ${ref(this._buttonRef)}
            @click=${(c: Event) => this.handleClick(c)}>
            <slot name="start" part="start"></slot>
            <slot part="caption"></slot>
            <slot name="end" part="end"></slot>
            </button>`;
    }

    private handleClick(c: Event) {
        console.log(`Button click ${this._buttonRef}`);
    }

    private handleMouseDown = (e: MouseEvent): void => {
        console.debug(this);
    }

    private handleMouseDown1(e: MouseEvent): void {
        console.debug(this);
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousedown", this.handleMouseDown1);
    }
}

defineElement("neu-button", Button);