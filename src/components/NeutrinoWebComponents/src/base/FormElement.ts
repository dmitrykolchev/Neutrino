import { ReactiveElement } from "lit";
import { property } from "lit/decorators.js";


type Constructor<T = Record<string, unknown>> = {
    new(...args: any[]): T;
    prototype: T;
};


export interface IFormElement {
    readonly form: HTMLFormElement | null;
    readonly name: string | null;
}


export function FormElement<T extends Constructor<ReactiveElement>>(constructor: T):
    T & Constructor<IFormElement> {
    class FormAssociatedElement extends constructor {
        private _internals: ElementInternals;

        public static get formAssociated(): boolean {
            return true;
        }

        constructor(...args:any[]) {
            super(...args);
            this._internals = this.attachInternals();
        }

        public get form(): HTMLFormElement | null {
            return this._internals.form;
        }

        @property({ type: String })
        public name: string | null = null;

        public get type(): string {
            return this.localName;
        }

        public get internals(): ElementInternals {
            return this._internals;
        }
    }
    return FormAssociatedElement;
}
