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
import { defineElement, prefix } from "../base/DefineElement.js";
import { Focusable } from "../base/Focusable.js";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarHeading } from "./SidebarHeading.js";
import style from "./Sidebar.css";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
export class Sidebar extends Focusable {
    constructor() {
        super(...arguments);
        this._items = new Set();
        this.value = undefined;
        this.label = undefined;
    }
    static get styles() {
        return [style];
    }
    get focusElement() {
        return this;
    }
    render() {
        return html `
            <nav
                @sidebar-select=${this.handleSelect}
                aria-label=${ifDefined(this.label)}
            >
                <div role="list">
                    <slot name="descendant"></slot>
                </div>
            </nav>
        `;
    }
    handleSelect(event) {
        event.stopPropagation();
        if (this.value === event.detail.value) {
            return;
        }
        const oldValue = this.value;
        this.value = event.detail.value;
        const applyDefault = this.dispatchEvent(new Event('change', {
            bubbles: true,
            composed: true,
            cancelable: true,
        }));
        if (!applyDefault) {
            this.value = oldValue;
            event.target.selected = false;
            event.preventDefault();
        }
        else {
            this._items.forEach((item) => item.handleSidebarSelect(event));
        }
    }
    startTrackingSelection(item) {
        if (item) {
            this._items.add(item);
        }
    }
    stopTrackingSelection(item) {
        if (item) {
            this._items.delete(item);
        }
    }
}
__decorate([
    property({ reflect: true }),
    __metadata("design:type", Object)
], Sidebar.prototype, "value", void 0);
__decorate([
    property({ reflect: true }),
    __metadata("design:type", Object)
], Sidebar.prototype, "label", void 0);
defineElement(`${prefix}-sidebar`, Sidebar);
defineElement(`${prefix}-sidebar-item`, SidebarItem);
defineElement(`${prefix}-sidebar-header`, SidebarHeading);
//# sourceMappingURL=Sidebar.js.map