﻿import { CSSResultArray, html, PropertyValues, TemplateResult } from "lit";
import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { property } from "lit/decorators.js";
import { Sidebar } from "./Sidebar.js";

import style from "./SidebarHeading.css";

export class SidebarHeading extends NeutrinoElement {

    private _parentSidebar: Sidebar | undefined;

    public static get styles(): CSSResultArray {
        return [style];
    }

    @property()
    public label?: string;

    public get parentSidebar() {
        return this._parentSidebar ??= this.closest("neu-sidebar") as Sidebar | undefined;
    }

    protected override render(): TemplateResult {
        return html`
            <div id="item-heading">
            <slot name="start"></slot>
            <span>${this.label}<slot></slot></span>
            <slot name="end"></slot>
            </div>
            <div aria-labelledby="item-header" role="list">
                <slot name="descendant"></slot>
            </div>
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

//    public override async connectedCallback() {
//        super.connectedCallback();
//        const parent = this.parentSidebar;
//        if (parent) {
//            await parent.updateComplete;
//            parent.startTrackingSelection(this);
//        }
//    }

//    public override disconnectedCallback(): void {
//        super.disconnectedCallback();
//        this.parentSidebar?.stopTrackingSelection(this);
//    }
}
