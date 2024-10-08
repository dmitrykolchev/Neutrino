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
import { html, nothing } from "lit";
import { AnchorLike } from "../base/AnchorLike.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Focusable } from "../base/Focusable.js";
import style from "./SidebarItem.css";
export class SidebarItem extends AnchorLike(Focusable) {
    constructor() {
        super(...arguments);
        this.value = undefined;
        this.selected = false;
        this.expanded = false;
    }
    static get styles() {
        return [style];
    }
    get parentSidebar() {
        return this._parentSidebar ?? (this._parentSidebar = this.closest("neu-sidebar"));
    }
    get focusElement() {
        return this;
    }
    get hasChildren() {
        return !!this.querySelector('neu-sidebar-item');
    }
    render() {
        return html `
            <a 
                id="item-link"
                href=${this.href || "#"}
                target=${ifDefined(this.target)}
                download=${ifDefined(this.download)}
                rel=${ifDefined(this.rel)}
                @click="${this.handleClick}"
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
    firstUpdated(changed) {
        super.firstUpdated(changed);
        this.setAttribute('role', 'listitem');
    }
    update(changes) {
        if (!this.hasAttribute('slot')) {
            this.slot = "descendant";
        }
        super.update(changes);
    }
    async connectedCallback() {
        super.connectedCallback();
        const parent = this.parentSidebar;
        if (parent) {
            await parent.updateComplete;
            parent.startTrackingSelection(this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.parentSidebar?.stopTrackingSelection(this);
    }
    click() {
        this.handleClick();
    }
    handleSidebarSelect(event) {
        this.selected = event.target === this;
    }
    handleClick(event) {
        if (!this.href && event) {
            event.preventDefault();
        }
        if (!this.disabled && (!this.href || event?.defaultPrevented)) {
            if (this.hasChildren) {
                this.expanded = !this.expanded;
            }
            else if (this.value) {
                this.announceSelected(this.value);
            }
        }
    }
    announceSelected(value) {
        const selectDetail = {
            value
        };
        const selectionEvent = new CustomEvent('sidebar-select', {
            bubbles: true,
            composed: true,
            detail: selectDetail,
        });
        this.dispatchEvent(selectionEvent);
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