import { ReactiveElement } from "lit";
type Constructor<T = Record<string, unknown>> = {
    new (...args: any[]): T;
    prototype: T;
};
export interface IFormElement {
    readonly form: HTMLFormElement | null;
    readonly name: string | null;
}
export declare function FormElement<T extends Constructor<ReactiveElement>>(constructor: T): T & Constructor<IFormElement>;
export {};
