import { CSSResultArray, LitElement } from "lit";
import { defineElement, prefix } from "../base/DefineElement";

import style from "./RstView.css";

export class RstView extends LitElement {

    public static override get styles(): CSSResultArray {
        return [style];
    }
}


defineElement(`${prefix}-rst-view`, RstView)
