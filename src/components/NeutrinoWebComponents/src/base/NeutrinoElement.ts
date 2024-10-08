import { LitElement, ReactiveElement} from "lit";
import { version } from "./Version.js";

export class NeutrinoElement extends LitElement {
    static VERSION = version;

    constructor() {
        super();
    }
}