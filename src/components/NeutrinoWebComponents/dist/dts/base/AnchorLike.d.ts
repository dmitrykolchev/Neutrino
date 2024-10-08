import { ReactiveElement } from "lit";
import { ValuesOf } from "./Typings";
type Constructor<T = Record<string, unknown>> = {
    new (...args: any[]): T;
    prototype: T;
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
}
export declare function AnchorLike<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<IAnchorLike>;
export {};
