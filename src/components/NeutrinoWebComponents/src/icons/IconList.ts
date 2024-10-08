import { TemplateResult, PropertyValues, html, CSSResultArray } from 'lit';
import { property } from "lit/decorators.js";
import { defineElement, prefix } from "../base/DefineElement.js";
import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { IconSize } from "./Icons.js";
import { IconName as MaterialIconName, Icons as MaterialIcons } from "./MaterialIcons.js";
import { MaterialIcon } from './MaterialIcon.js';
import style from "./IconList.css";
import previewStyle from "./IconListItem.css";

export enum IconType {
    Material,
    Fluent,
    Fabric
}

export interface IconListItemSelectDetail {
    value: string;
}

class IconListItem extends NeutrinoElement {

    private _handleClick?: (e?: Event) => void;
    private _parentSet?: IconList;

    public static override get styles(): CSSResultArray {
        return [previewStyle];
    }
    protected get parentSet(): IconList | undefined {
        if (!this._parentSet) {
            this._parentSet = this.closest("neu-iconlist") as
                | IconList
                | undefined;
        }
        return this._parentSet;
    }

    @property()
    public value: string | undefined = undefined;

    @property()
    public type: IconType = IconType.Material

    @property()
    public size: IconSize = "n";

    @property({ type: Boolean, reflect: true })
    public selected: boolean = false;

    protected willUpdate(changes: PropertyValues<this>): void {
        if (changes.has("value")) {
            this.setAttribute("title", this.value!);
        }
        super.willUpdate(changes);
    }

    protected update(changes: PropertyValues<this>): void {
        if (!this.hasAttribute("slot")) {
            this.slot = "items";
        }
        super.update(changes);
    }

    protected render() {
        return html`<div class="icon"><neu-material-icon glyph="${this.value}" size="${this.size}"></neu-material-icon></div>
        <div class="caption"><div>${this.value}</div></div>`;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this._handleClick = this.handleClick.bind(this);
        this.addEventListener("click", this._handleClick);
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("click", this._handleClick!);
    }

    public handleSelect(event: Event): void {
        this.selected = event.target === this;
    }

    private handleClick(event?: Event): void {
        if (this.parentSet) {
            this.parentSet.selected = this;
        }
    }
}

export class IconList extends NeutrinoElement {
    private _selectedItem?: IconListItem;
    public static override get styles(): CSSResultArray {
        return [style];
    }

    @property({ reflect: true })
    public value: string | undefined;

    @property({ attribute: "type" })
    public type: IconType = IconType.Material;

    @property({ type: String })
    public filter?: string;

    @property({ type: String })
    public size: IconSize = "n";

    protected render(): TemplateResult {
        return html`<div role="list"><slot name="items"></slot></div>`;
    }

    protected updated(changes: PropertyValues<this>): void {
        if (changes.has("filter")) {
            this.addChildren();
        }
    }

    private getIcons(icons: any): TemplateResult[] {
        return Object
            .entries(icons)
            .map(icon => html`<neu-iconlist-item type="${this.type}" size="${this.size}" value="${icon[0]}"></neu-iconlist-item>`);
    }

    private addChildren(): void {
        if (this.type) {
            const createItem = (key: string): IconListItem => {
                const element = document.createElement("neu-iconlist-item") as IconListItem;
                element.type = this.type;
                element.size = this.size;
                element.value = key;
                return element;
            }
            let predicate;
            if (this.filter) {
                const filterLower = this.filter.toUpperCase();
                predicate = (key: string): boolean => {
                    return key.toUpperCase().includes(filterLower);
                }
            }
            else {
                predicate = (key: string) => true;
            }
            const children: IconListItem[] = [];
            for (const icon in MaterialIcons) {
                if (predicate(icon)) {
                    children.push(createItem(icon));
                }
            }
            this.replaceChildren(...children);
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addChildren();
    }

    public get selected(): IconListItem | undefined {
        return this._selectedItem;
    }

    public set selected(value: IconListItem | undefined) {
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

    public handleSelect(event: CustomEvent<IconListItemSelectDetail> & { target: IconListItem }): void {
        event.stopPropagation();
        if (this.value == event.detail.value) {
            return;
        }
        const oldValue = this.value;
        this.value = event.detail.value;
        const applyDefault = this.dispatchEvent(
            new Event("change", { bubbles: true, composed: true, cancelable: true })
        );
        if (!applyDefault) {
            this.value = oldValue;
            event.target.selected = false;
            event.preventDefault();
        }
        else {
            this.querySelectorAll("nav-iconlist-item").forEach((item) => (item as IconListItem).handleSelect(event))
        }
    }
}

defineElement(`${prefix}-iconlist`, IconList);
defineElement(`${prefix}-iconlist-item`, IconListItem);