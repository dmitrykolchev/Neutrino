import { ReactiveElement, html, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { ValuesOf } from "./Typings";

type Constructor<T = Record<string, unknown>> = {
    new(...args: any[]): T;
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

export const AnchorTarget = {
    blank: "_blank",
    self: "_self",
    parent: "_parent",
    top: "_top"
} as const;

export type AnchorTarget = ValuesOf<typeof AnchorTarget>;

export interface IAnchorLike {
    download?: string;
    label?: string;
    href?: string;
    rel?: string;
    target?: AnchorTarget;
    renderAnchor(options: RenderAnchorOptions): TemplateResult;
}


export function AnchorLike<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<IAnchorLike> {
    class AnchorLikeElement extends constructor {
        @property()
        public download?: string;

        @property()
        public label?: string;

        @property()
        public href?: string;

        @property()
        public target?: AnchorTarget;

        @property()
        public rel?: string;

        @property()
        public referrerpolicy?:
            | 'no-referrer'
            | 'no-referrer-when-downgrade'
            | 'origin'
            | 'origin-when-cross-origin'
            | 'same-origin'
            | 'strict-origin'
            | 'strict-origin-when-cross-origin'
            | 'unsafe-url';


        public renderAnchor({
            id,
            className,
            ariaHidden,
            labelledby,
            tabindex,
            anchorContent = html`<slot></slot>`,
        }: RenderAnchorOptions): TemplateResult {
            return html
                `<a
                    id=${id}
                    class=${ifDefined(className)}
                    href=${ifDefined(this.href)}
                    download=${ifDefined(this.download)}
                    target=${ifDefined(this.target)}
                    aria-label=${ifDefined(this.label)}
                    aria-labelledby=${ifDefined(labelledby)}
                    aria-hidden=${ifDefined(ariaHidden ? 'true' : undefined)}
                    tabindex=${ifDefined(tabindex)}
                    referrerpolicy=${ifDefined(this.referrerpolicy)}
                    rel=${ifDefined(this.rel)}
                >${anchorContent}</a>`;
        }
    }

    return AnchorLikeElement;
}
