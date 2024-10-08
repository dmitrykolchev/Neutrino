var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { property } from "lit/decorators.js";
import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { Sidebar } from "./Sidebar.js";
import { html, nothing } from "lit";
import { AnchorLike } from "../base/AnchorLike.js";
import style from "./SidebarItem.css";
export class SidebarItem extends AnchorLike(NeutrinoElement) {
    static get styles() {
        return [style];
    }
    constructor() {
        super();
        this._items = new Set();
        this.value = undefined;
        this.selected = false;
        this.expanded = false;
    }
    get items() {
        return this._items;
    }
    get parent() {
        if (!this._parent) {
            let element = this.parentElement;
            while (element) {
                if (element instanceof SidebarItem || element instanceof Sidebar) {
                    this._parent = element;
                    break;
                }
                element = this.parentElement;
            }
        }
        return this._parent;
    }
    get hasChildren() {
        return !!this.querySelector('sp-sidenav-item');
    }
    get parentSidebar() {
        return this._parentSidebar ?? (this._parentSidebar = this.closest("neu-sidebar"));
    }
    startTrackingItem(item) {
        this._items.add(item);
        if (!item.slot) {
            item.slot = "descendant";
        }
    }
    stopTrackingItem(item) {
        this._items.delete(item);
    }
    render() {
        return html `
            <a id="item-link"
                href=${this.href || "#"}
            >
            <slot name="start"></slot>
            <span>${this.label}<slot></slot></span>
            <slot name="end"></slot>
            </a>
            ${this.expanded
            ? html `
                      <div aria-labelledby="item-link" role="list">
                          <slot name="descendant"></slot>
                      </div>
                  `
            : nothing}
            `;
    }
    connectedCallback() {
        super.connectedCallback();
        const parent = this.parent;
        if (parent) {
            parent.startTrackingItem(this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        const parent = this.parent;
        if (parent) {
            parent.stopTrackingItem(this);
        }
    }
}
__decorate([
    property(),
    __metadata("design:type", Object)
], SidebarItem.prototype, "value", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], SidebarItem.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], SidebarItem.prototype, "expanded", void 0);
//# sourceMappingURL=SidebarItem.js.map