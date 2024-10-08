import { ReactiveElement, TemplateResult } from "lit";
import { ValuesOf } from "./Typings";
type Constructor<T = Record<string, unknown>> = {
    new (...args: any[]): T;
    prototype: T;
};
type RenderAnchorOptions = {
    id: string;
    className?: string;
    ariaHidden?: boolean;
    anchorContent?: TemplateResult | TemplateResult[];
    labelledby?: string;
    tabindex?: -1 | 0;
};
export declare const AnchorTarget: {
    readonly blank: "_blank";
    readonly self: "_self";
    readonly parent: "_parent";
    readonly top: "_top";
};
export type AnchorTarget = ValuesOf<typeof AnchorTarget>;
export interface IAnchorLike {
    download?: string;
    label?: string;
    href?: string;
    rel?: string;
    target?: AnchorTarget;
    renderAnchor(options: RenderAnchorOptions): TemplateResult;
}
export declare function AnchorLike<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<IAnchorLike>;
export {};
