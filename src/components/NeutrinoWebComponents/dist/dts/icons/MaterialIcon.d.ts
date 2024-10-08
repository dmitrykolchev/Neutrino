import { LitElement, TemplateResult, CSSResultArray, PropertyValues } from "lit";
import { IconName } from "./MaterialIcons.js";
import { IconSize } from "./Icons.js";
export declare class MaterialIcon extends LitElement {
    private _glyph?;
    constructor();
    static get styles(): CSSResultArray;
    glyph?: IconName;
    size: IconSize;
    outlined: boolean;
    rounded: boolean;
    sharp: boolean;
    weight?: number;
    fill: boolean;
    protected render(): TemplateResult;
    willUpdate(changes: PropertyValues<this>): void;
    protected updated(changed: PropertyValues<this>): void;
    private getGlyph;
}
