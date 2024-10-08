import { property } from "lit/decorators.js";
import { CSSResultArray, PropertyValues, TemplateResult, html, nothing } from "lit";
import { AnchorLike } from "../base/AnchorLike.js";
import { Sidebar, SidebarSelectDetail } from "./Sidebar.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { Focusable } from "../base/Focusable.js";

import style from "./SidebarItem.css";

export class SidebarItem extends AnchorLike(Focusable) {

    private _parentSidebar: Sidebar | undefined;

    public static get styles(): CSSResultArray {
        return [style];
    }

    @property()
    public value: string | undefined = undefined;

    @property({ type: Boolean, reflect: true })
    public selected = false;

    @property({ type: Boolean, reflect: true })
    public expanded = false;

    public get parentSidebar() {
        return this._parentSidebar ??= this.closest("neu-sidebar") as Sidebar | undefined;
    }

    public get focusElement(): HTMLElement {
        return this;
    }

    protected get hasChildren(): boolean {
        return !!this.querySelector('neu-sidebar-item');
    }

    protected override render(): TemplateResult {
        return html`
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
                ? html`
                      <div aria-labelledby="item-link" role="list">
                          <slot name="descendant"></slot>
                      </div>
                  `
                : nothing}
            `;
    }

    protected override firstUpdated(changed: PropertyValues<this>): void {
        super.firstUpdated(changed);
        this.setAttribute('role', 'listitem');
    }

    protected override update(changes: PropertyValues): void {
        if (!this.hasAttribute('slot')) {
            this.slot = "descendant";
        }
        super.update(changes);
    }

    public override async connectedCallback() {
        super.connectedCallback();
        const parent = this.parentSidebar;
        if (parent) {
            await parent.updateComplete;
            parent.startTrackingSelection(this);
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.parentSidebar?.stopTrackingSelection(this);
    }

    public override click(): void {
        this.handleClick();
    }

    public handleSidebarSelect(event: Event): void {
        this.selected = event.target === this;
    }

    private handleClick(event?: Event): void {
        if (!this.href && event) {
            event.preventDefault();
        }
        // With an `href` this click will change the page contents, not toggle its children or become "selected".
        if (!this.disabled && (!this.href || event?.defaultPrevented)) {
            if (this.hasChildren) {
                this.expanded = !this.expanded;
            } else if (this.value) {
                this.announceSelected(this.value);
            }
        }
    }

    private announceSelected(value: string): void {
        const selectDetail: SidebarSelectDetail = {
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


