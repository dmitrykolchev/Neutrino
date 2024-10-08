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
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
export const AnchorTarget = {
    blank: "_blank",
    self: "_self",
    parent: "_parent",
    top: "_top"
};
export function AnchorLike(constructor) {
    class AnchorLikeElement extends constructor {
        renderAnchor({ id, className, ariaHidden, labelledby, tabindex, anchorContent = html `<slot></slot>`, }) {
            return html `<a
                    id=${id}
                    class=${ifDefined(className)}
                    href=${ifDefined(this.href)}
                    download=${ifDefined(this.download)}
                    target=${ifDefined(this.target)}
                    aria-label=${ifDefined(this.label)}
                    aria-labelledby=${ifDefined(labelledby)}
                    aria-hidden=${ifDefined(ariaHidden ? 'true' : undefined)}
                    tabindex=${ifDefined(tabindex)}
                    referrerpolicy=${ifDefined(this.referrerpolicy)}
                    rel=${ifDefined(this.rel)}
                >${anchorContent}</a>`;
        }
    }
    __decorate([
        property(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "download", void 0);
    __decorate([
        property(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "label", void 0);
    __decorate([
        property(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "href", void 0);
    __decorate([
        property(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "target", void 0);
    __decorate([
        property(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "rel", void 0);
    __decorate([
        property(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "referrerpolicy", void 0);
    return AnchorLikeElement;
}
//# sourceMappingURL=AnchorLike.js.map