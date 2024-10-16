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
import { NeutrinoElement } from "./NeutrinoElement.js";
function nextFrame() {
    return new Promise((res) => requestAnimationFrame(() => res()));
}
export class Focusable extends NeutrinoElement {
    constructor() {
        super();
        this._tabIndex = 0;
        this.disabled = false;
        this.autofocus = false;
        this.manipulatingTabindex = false;
        this.autofocusReady = Promise.resolve();
    }
    get tabIndex() {
        if (this.focusElement === this) {
            const tabindex = this.hasAttribute('tabindex')
                ? Number(this.getAttribute('tabindex'))
                : NaN;
            return !isNaN(tabindex) ? tabindex : -1;
        }
        const tabIndexAttribute = parseFloat(this.hasAttribute('tabindex')
            ? this.getAttribute('tabindex') || '0'
            : '0');
        if (this.disabled || tabIndexAttribute < 0) {
            return -1;
        }
        if (!this.focusElement) {
            return tabIndexAttribute;
        }
        return this._tabIndex;
    }
    set tabIndex(tabIndex) {
        if (this.manipulatingTabindex) {
            this.manipulatingTabindex = false;
            return;
        }
        if (this.focusElement === this) {
            if (this.disabled) {
                this._tabIndex = tabIndex;
            }
            else if (tabIndex !== this._tabIndex) {
                this._tabIndex = tabIndex;
                const tabindex = '' + tabIndex;
                this.manipulatingTabindex = true;
                this.setAttribute('tabindex', tabindex);
            }
            return;
        }
        if (tabIndex === -1) {
            this.addEventListener('pointerdown', this.onPointerdownManagementOfTabIndex);
        }
        else {
            this.manipulatingTabindex = true;
            this.removeEventListener('pointerdown', this.onPointerdownManagementOfTabIndex);
        }
        if (tabIndex === -1 || this.disabled) {
            this.manipulatingTabindex = true;
            this.setAttribute('tabindex', '-1');
            this.removeAttribute('focusable');
            if (this.selfManageFocusElement) {
                return;
            }
            if (tabIndex !== -1) {
                this._tabIndex = tabIndex;
                this.manageFocusElementTabindex(tabIndex);
            }
            else {
                this.focusElement?.removeAttribute('tabindex');
            }
            return;
        }
        this.setAttribute('focusable', '');
        if (this.hasAttribute('tabindex')) {
            this.removeAttribute('tabindex');
        }
        else {
            this.manipulatingTabindex = false;
        }
        this._tabIndex = tabIndex;
        this.manageFocusElementTabindex(tabIndex);
    }
    onPointerdownManagementOfTabIndex() {
        if (this.tabIndex === -1) {
            setTimeout(() => {
                this.tabIndex = 0;
                this.focus({ preventScroll: true });
                this.tabIndex = -1;
            });
        }
    }
    async manageFocusElementTabindex(tabIndex) {
        if (!this.focusElement) {
            await this.updateComplete;
        }
        if (tabIndex === null) {
            this.focusElement.removeAttribute('tabindex');
        }
        else {
            if (this.focusElement !== this) {
                this.focusElement.tabIndex = tabIndex;
            }
        }
    }
    get focusElement() {
        throw new Error('Must implement focusElement getter!');
    }
    get selfManageFocusElement() {
        return false;
    }
    focus(options) {
        if (this.disabled || !this.focusElement) {
            return;
        }
        if (this.focusElement !== this) {
            this.focusElement.focus(options);
        }
        else {
            HTMLElement.prototype.focus.apply(this, [options]);
        }
    }
    blur() {
        const focusElement = this.focusElement || this;
        if (focusElement !== this) {
            focusElement.blur();
        }
        else {
            HTMLElement.prototype.blur.apply(this);
        }
    }
    click() {
        if (this.disabled) {
            return;
        }
        const focusElement = this.focusElement || this;
        if (focusElement !== this) {
            focusElement.click();
        }
        else {
            HTMLElement.prototype.click.apply(this);
        }
    }
    manageAutoFocus() {
        if (this.autofocus) {
            this.dispatchEvent(new KeyboardEvent('keydown', {
                code: 'Tab',
            }));
            this.focusElement.focus();
        }
    }
    firstUpdated(changes) {
        super.firstUpdated(changes);
        if (!this.hasAttribute('tabindex') ||
            this.getAttribute('tabindex') !== '-1') {
            this.setAttribute('focusable', '');
        }
    }
    update(changedProperties) {
        if (changedProperties.has('disabled')) {
            this.handleDisabledChanged(this.disabled, changedProperties.get('disabled'));
        }
        super.update(changedProperties);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('disabled') && this.disabled) {
            this.blur();
        }
    }
    async handleDisabledChanged(disabled, oldDisabled) {
        const canSetDisabled = () => this.focusElement !== this &&
            typeof this.focusElement.disabled !== 'undefined';
        if (disabled) {
            this.manipulatingTabindex = true;
            this.setAttribute('tabindex', '-1');
            await this.updateComplete;
            if (canSetDisabled()) {
                this.focusElement.disabled = true;
            }
            else {
                this.setAttribute('aria-disabled', 'true');
            }
        }
        else if (oldDisabled) {
            this.manipulatingTabindex = true;
            if (this.focusElement === this) {
                this.setAttribute('tabindex', '' + this._tabIndex);
            }
            else {
                this.removeAttribute('tabindex');
            }
            await this.updateComplete;
            if (canSetDisabled()) {
                this.focusElement.disabled = false;
            }
            else {
                this.removeAttribute('aria-disabled');
            }
        }
    }
    async getUpdateComplete() {
        const complete = (await super.getUpdateComplete());
        await this.autofocusReady;
        return complete;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.autofocus) {
            this.autofocusReady = new Promise(async (res) => {
                await nextFrame();
                await nextFrame();
                res();
            });
            this.updateComplete.then(() => {
                this.manageAutoFocus();
            });
        }
    }
}
__decorate([
    property({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], Focusable.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], Focusable.prototype, "autofocus", void 0);
__decorate([
    property({ type: Number }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], Focusable.prototype, "tabIndex", null);
//# sourceMappingURL=Focusable.js.map