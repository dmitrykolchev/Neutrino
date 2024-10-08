export const prefix = "neu";

export function defineElement(
    name: string,
    constructor: CustomElementConstructor
): void {
    customElements.define(name, constructor);
}


