var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { defineElement, prefix } from "../base/DefineElement.js";
import { Icons } from "./MaterialIcons.js";
import style from "./MaterialIcon.css";
export class MaterialIcon extends LitElement {
    constructor() {
        super();
        this.size = "n";
        this.outlined = false;
        this.rounded = false;
        this.sharp = true;
        this.fill = false;
    }
    static get styles() {
        return [style];
    }
    render() {
        return html `<span>${this._glyph}</span>`;
    }
    willUpdate(changes) {
        if (changes.has("glyph")) {
            this._glyph = this.getGlyph();
        }
        super.willUpdate(changes);
    }
    updated(changed) {
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
    getGlyph() {
        const name = this.getAttribute("glyph");
        return name ? Icons[name] : "";
    }
}
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], MaterialIcon.prototype, "glyph", void 0);
__decorate([
    property({ type: String, reflect: true }),
    __metadata("design:type", String)
], MaterialIcon.prototype, "size", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "outlined", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "rounded", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "sharp", void 0);
__decorate([
    property(),
    __metadata("design:type", Number)
], MaterialIcon.prototype, "weight", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "fill", void 0);
defineElement(`${prefix}-material-icon`, MaterialIcon);
//# sourceMappingURL=MaterialIcon.js.map