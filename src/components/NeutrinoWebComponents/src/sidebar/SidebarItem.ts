import { property } from "lit/decorators.js";
import { defineElement, prefix } from "../base/DefineElement.js";
import { NeutrinoElement } from "../base/NeutrinoElement.js";
import { Sidebar } from "./Sidebar.js";
import { CSSResultArray, TemplateResult, html, nothing } from "lit";
import { AnchorLike } from "../base/AnchorLike.js";
import style from "./SidebarItem.css";

export interface IItemContainer<TItem> {
    readonly items: Iterable<TItem>;
    readonly hasChildren: boolean;
    readonly parent: IItemContainer<TItem> | unknown;
    startTrackingItem(item: TItem): void;
    stopTrackingItem(item: TItem): void;
}


export class SidebarItem extends AnchorLike(NeutrinoElement)
    implements IItemContainer<SidebarItem>
{
    private _parentSidebar: Sidebar | undefined;
    private _items = new Set<SidebarItem>();
    private _parent: IItemContainer<SidebarItem> | undefined;

    public static get styles(): CSSResultArray {
        return [style];
    }

    constructor() {
        super();
    }

    @property()
    public value: string | undefined = undefined;

    @property({ type: Boolean, reflect: true })
    public selected = false;

    @property({ type: Boolean, reflect: true })
    public expanded = false;
    public get items(): Set<SidebarItem> {
        return this._items;
    }

    public get parent(): IItemContainer<SidebarItem> | undefined {
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

    public get hasChildren(): boolean {
        return !!this.querySelector('sp-sidenav-item');
    }

    public get parentSidebar() {
        return this._parentSidebar ??= this.closest("neu-sidebar") as Sidebar | undefined;
    }

    public startTrackingItem(item: SidebarItem) {
        this._items.add(item);
        if (!item.slot) {
            item.slot = "descendant";
        }
    }

    public stopTrackingItem(item: SidebarItem) {
        this._items.delete(item);
    }

    protected override render(): TemplateResult {
        return html`
            <a id="item-link"
                href=${this.href || "#"}
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

    public override connectedCallback(): void {
        super.connectedCallback();
        const parent = this.parent;
        if (parent) {
            parent.startTrackingItem(this);
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        const parent = this.parent;
        if (parent) {
            parent.stopTrackingItem(this);
        }
    }
}


