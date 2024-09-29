var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { attr, css, FASTElement, html } from "@microsoft/fast-element";
const template = html `<span>Hello ${x => x.name}!</span>`;
const styles = css `
    :host {
      border: 1px solid blue;
    }

    span {
      color: red;
    }
`;
class HelloWorld extends FASTElement {
}
__decorate([
    attr,
    __metadata("design:type", String)
], HelloWorld.prototype, "name", void 0);
HelloWorld.define({
    name: "hello-world",
    template,
    styles,
});
//# sourceMappingURL=index.js.map