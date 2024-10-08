import { LitElement, html, TemplateResult, CSSResultArray, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Icons, IconName } from "./MaterialIcons.js";
import { IconSize } from "./Icons.js";
import style from "./MaterialIcon.css";

export class MaterialIcon extends LitElement {

    private _glyph?: string;
    constructor() {
        super();
    }
    public static override get styles(): CSSResultArray {
        return [style];
    }

    @property({ type: String })
    public glyph?: IconName;

    @property({ type: String, reflect: true })
    public size: IconSize = "n";

    @property({ type: Boolean, reflect: true })
    public outlined = false;

    @property({ type: Boolean, reflect: true })
    public rounded = false;

    @property({ type: Boolean, reflect: true })
    public sharp = true;

    @property()
    public weight?: number;

    @property({ type: Boolean })
    public fill = false;

    protected render(): TemplateResult {
        return html`<span>${this._glyph}</span>`;
    }

    override willUpdate(changes: PropertyValues<this>): void {
        if (changes.has("glyph")) {
            this._glyph = this.getGlyph();
        }
        super.willUpdate(changes);
    }

    protected updated(changed: PropertyValues<this>): void {
        if (changed.has("weight") || changed.has("fill")) {
            const fontVariations = [];
            if (this.hasAttribute("weight")) {
                fontVariations.push(`'wght' ${this.getAttribute("weight")}`);
            }
            if (this.hasAttribute("fill")) {
                fontVariations.push("'FILL' 1");
            }
            else {
                fontVariations.push("'FILL' 0");
            }
            this.style.setProperty("--font-variation-settings", fontVariations.join(", "));
        }
        super.updated(changed);
    }

    private getGlyph(): string {
        const name = this.getAttribute("glyph");
        return name ? Icons[name as IconName] : "";
    }
}


defineElement(`${prefix}-material-icon`, MaterialIcon)