import { CSSResultArray, TemplateResult } from "lit";
import { defineElement } from "../base/DefineElement.js";
import { AnchorLike } from "../base/AnchorLike.js";
import { Focusable } from "../base/Focusable.js";
import { query } from "lit/decorators.js";

import style from "./Link.css";

export class Link extends AnchorLike(Focusable) {
    public static get styles(): CSSResultArray {
        return [style];
    }

    @query('#anchor')
    anchorElement!: HTMLAnchorElement;

    public override get focusElement(): HTMLElement {
        return this.anchorElement;
    }

    protected override render(): TemplateResult {
        return this.renderAnchor({ id: 'anchor' });
    }
}

defineElement("neu-link", Link);
