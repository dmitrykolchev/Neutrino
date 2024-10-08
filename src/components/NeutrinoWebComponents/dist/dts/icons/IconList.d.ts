import { TemplateResult, PropertyValues, CSSResultArray } from 'lit';
import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { IconSize } from "./Icons.js";
export declare enum IconType {
    Material = 0,
    Fluent = 1,
    Fabric = 2
}
export interface IconListItemSelectDetail {
    value: string;
}
declare class IconListItem extends NeutrinoElement {
    private _handleClick?;
    private _parentSet?;
    static get styles(): CSSResultArray;
    protected get parentSet(): IconList | undefined;
    value: string | undefined;
    type: IconType;
    size: IconSize;
    selected: boolean;
    protected willUpdate(changes: PropertyValues<this>): void;
    protected update(changes: PropertyValues<this>): void;
    protected render(): TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    handleSelect(event: Event): void;
    private handleClick;
}
export declare class IconList extends NeutrinoElement {
    private _selectedItem?;
    static get styles(): CSSResultArray;
    value: string | undefined;
    type: IconType;
    filter?: string;
    size: IconSize;
    protected render(): TemplateResult;
    protected updated(changes: PropertyValues<this>): void;
    private getIcons;
    private addChildren;
    connectedCallback(): void;
    get selected(): IconListItem | undefined;
    set selected(value: IconListItem | undefined);
    handleSelect(event: CustomEvent<IconListItemSelectDetail> & {
        target: IconListItem;
    }): void;
}
export {};
