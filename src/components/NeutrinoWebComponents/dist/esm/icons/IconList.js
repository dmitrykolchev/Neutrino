var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { html } from 'lit';
import { property } from "lit/decorators.js";
import { defineElement, prefix } from "../base/DefineElement.js";
import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { Icons as MaterialIcons } from "./MaterialIcons.js";
import style from "./IconList.css";
import previewStyle from "./IconListItem.css";
export var IconType;
(function (IconType) {
    IconType[IconType["Material"] = 0] = "Material";
    IconType[IconType["Fluent"] = 1] = "Fluent";
    IconType[IconType["Fabric"] = 2] = "Fabric";
})(IconType || (IconType = {}));
class IconListItem extends NeutrinoElement {
    constructor() {
        super(...arguments);
        this.value = undefined;
        this.type = IconType.Material;
        this.size = "n";
        this.selected = false;
    }
    static get styles() {
        return [previewStyle];
    }
    get parentSet() {
        if (!this._parentSet) {
            this._parentSet = this.closest("neu-iconlist");
        }
        return this._parentSet;
    }
    willUpdate(changes) {
        if (changes.has("value")) {
            this.setAttribute("title", this.value);
        }
        super.willUpdate(changes);
    }
    update(changes) {
        if (!this.hasAttribute("slot")) {
            this.slot = "items";
        }
        super.update(changes);
    }
    render() {
        return html `<div class="icon"><neu-material-icon glyph="${this.value}" size="${this.size}"></neu-material-icon></div>
        <div class="caption"><div>${this.value}</div></div>`;
    }
    connectedCallback() {
        super.connectedCallback();
        this._handleClick = this.handleClick.bind(this);
        this.addEventListener("click", this._handleClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("click", this._handleClick);
    }
    handleSelect(event) {
        this.selected = event.target === this;
    }
    handleClick(event) {
        if (this.parentSet) {
            this.parentSet.selected = this;
        }
    }
}
__decorate([
    property(),
    __metadata("design:type", Object)
], IconListItem.prototype, "value", void 0);
__decorate([
    property(),
    __metadata("design:type", Number)
], IconListItem.prototype, "type", void 0);
__decorate([
    property(),
    __metadata("design:type", String)
], IconListItem.prototype, "size", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Boolean)
], IconListItem.prototype, "selected", void 0);
export class IconList extends NeutrinoElement {
    constructor() {
        super(...arguments);
        this.type = IconType.Material;
        this.size = "n";
    }
    static get styles() {
        return [style];
    }
    render() {
        return html `<div role="list"><slot name="items"></slot></div>`;
    }
    updated(changes) {
        if (changes.has("filter")) {
            this.addChildren();
        }
    }
    getIcons(icons) {
        return Object
            .entries(icons)
            .map(icon => html `<neu-iconlist-item type="${this.type}" size="${this.size}" value="${icon[0]}"></neu-iconlist-item>`);
    }
    addChildren() {
        if (this.type) {
            const createItem = (key) => {
                const element = document.createElement("neu-iconlist-item");
                element.type = this.type;
                element.size = this.size;
                element.value = key;
                return element;
            };
            let predicate;
            if (this.filter) {
                const filterLower = this.filter.toUpperCase();
                predicate = (key) => {
                    return key.toUpperCase().includes(filterLower);
                };
            }
            else {
                predicate = (key) => true;
            }
            const children = [];
            for (const icon in MaterialIcons) {
                if (predicate(icon)) {
                    children.push(createItem(icon));
                }
            }
            this.replaceChildren(...children);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addChildren();
    }
    get selected() {
        return this._selectedItem;
    }
    set selected(value) {
        if (this._selectedItem !== value) {
            if (this._selectedItem) {
                this._selectedItem.selected = false;
            }
            this._selectedItem = value;
            if (this._selectedItem) {
                this._selectedItem.selected = true;
            }
        }
    }
    handleSelect(event) {
        event.stopPropagation();
        if (this.value == event.detail.value) {
            return;
        }
        const oldValue = this.value;
        this.value = event.detail.value;
        const applyDefault = this.dispatchEvent(new Event("change", { bubbles: true, composed: true, cancelable: true }));
        if (!applyDefault) {
            this.value = oldValue;
            event.target.selected = false;
            event.preventDefault();
        }
        else {
            this.querySelectorAll("nav-iconlist-item").forEach((item) => item.handleSelect(event));
        }
    }
}
__decorate([
    property({ reflect: true }),
    __metadata("design:type", Object)
], IconList.prototype, "value", void 0);
__decorate([
    property({ attribute: "type" }),
    __metadata("design:type", Number)
], IconList.prototype, "type", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], IconList.prototype, "filter", void 0);
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], IconList.prototype, "size", void 0);
defineElement(`${prefix}-iconlist`, IconList);
defineElement(`${prefix}-iconlist-item`, IconListItem);
//# sourceMappingURL=IconList.js.map