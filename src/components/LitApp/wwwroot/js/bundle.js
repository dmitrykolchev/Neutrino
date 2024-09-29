const getThemeVars = function (colors) {
    return `:host {
            --background-color: ${colors.backgroundColor};
            --text-color: ${colors.textColor};
            --border-color: ${colors.borderColor};
        }`;
};
class Theme {
}
const DarkThemeColors = Object.freeze({
    backgroundColor: "#333",
    textColor: "white",
    borderColor: "green",
});
class ThemeManager {
    _theme;
    _themeCss;
    constructor() {
        this.setTheme(new DarkTheme());
    }
    getTheme() {
        return this._theme;
    }
    setTheme(theme) {
        this._theme = theme;
        this.getCSSStyleSheet().replaceSync(getThemeVars(theme.getColors()));
    }
    getCSSStyleSheet() {
        return this._themeCss ??= new CSSStyleSheet();
    }
}
class DarkTheme extends Theme {
    getColors() {
        return DarkThemeColors;
    }
}
const ThemeManagerInstance = new ThemeManager();

const adoptedStyleSheets = [ThemeManagerInstance.getCSSStyleSheet()];
class NeuElement extends HTMLElement {
    static _template;
    _shadow;
    _eventsUnwireController;
    _styleElement;
    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
        this._shadow.adoptedStyleSheets = adoptedStyleSheets;
        this._styleElement = document.createElement("style");
        this._styleElement.textContent = this.getCssRules();
        this._shadow.appendChild(this._styleElement);
        this._shadow.appendChild(this.getTemplate());
    }
    get shadow() {
        return this._shadow;
    }
    getTemplate() {
        const proto = Object.getPrototypeOf(this);
        if (!proto._template) {
            proto._template = this.getTemplateInternal();
        }
        return proto._template.content.cloneNode(true);
    }
    get eventsUnwireController() {
        return this._eventsUnwireController ??= new AbortController();
    }
    connectedCallback() {
        this.updateRendering();
        console.log("connectedCallback");
    }
    disconnectedCallback() {
        this.eventsUnwireController.abort();
    }
    updateRendering() {
    }
}
class NeuFormElement extends NeuElement {
    _internals;
    static formAssociated() {
        return true;
    }
    static observedAttributes = ["checked"];
    constructor() {
        super();
        this._internals = this.attachInternals();
        console.debug(this._internals);
    }
    get internals() {
        return this._internals;
    }
    get form() {
        return this._internals.form;
    }
    get name() {
        return this.getAttribute("name");
    }
    get type() {
        return this.localName;
    }
}

class Button extends NeuElement {
    static observedAttributes = ["text", "image"];
    _text = null;
    _button;
    _handleButtonClick;
    static define(tag = "neu-button") {
        customElements.define(tag, Button);
    }
    constructor() {
        super();
        this._button = this.shadow.querySelector("button");
        this._handleButtonClick = this.handleButtonClick.bind(this);
    }
    getCssRules() {
        return `
            span {
              color: var(--text-color);
              border: 4px dotted var(--border-color);
              background-color: var(--background-color);
              padding: 4px;
            }`;
    }
    getTemplateInternal() {
        return new DOMParser().parseFromString(`<template>
          <span>
            <slot name="inner-text">I'm in the shadow DOM</slot>
            <button type="button">
                <slot="button-text">Change</slot>
            </button>
          </span>
        </template>`, "text/html").querySelector("template");
    }
    handleButtonClick(e) {
        const colors = ThemeManagerInstance.getTheme().getColors();
        const sheets = this.shadowRoot?.adoptedStyleSheets[0];
        const index = Math.floor(Math.random() * 2);
        sheets.replaceSync(`:host {
            --text-color: ${["red", "green"][index]};
            --border-color: ${colors.borderColor};
            --background-color: ${colors.backgroundColor};
        }`);
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this.setAttribute("text", value);
    }
    connectedCallback() {
        this._text = this.getAttribute("text");
        const { signal } = this.eventsUnwireController;
        this._button.addEventListener("click", this._handleButtonClick, { signal });
        super.connectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this._text = newValue;
        }
        console.log(`${name}: ${oldValue} => ${newValue}`);
    }
    adoptedCallback() {
        console.log("adoptedCallback");
    }
}
Button.define();

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n=globalThis,c=n.trustedTypes,h=c?c.createPolicy("lit-html",{createHTML:t=>t}):void 0,f="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,m="?"+v,_=`<${m}>`,w=document,lt=()=>w.createComment(""),st=t=>null===t||"object"!=typeof t&&"function"!=typeof t,g=Array.isArray,$=t=>g(t)||"function"==typeof t?.[Symbol.iterator],x="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,k=/>/g,O=RegExp(`>|${x}(?:([^\\s"'>=/]+)(${x}*=${x}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),S=/'/g,j=/"/g,M=/^(?:script|style|textarea|title)$/i,P=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),ke=P(1),R=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),V=new WeakMap,I=w.createTreeWalker(w,129);function N(t,i){if(!g(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==h?h.createHTML(i):i}const U=(t,i)=>{const s=t.length-1,e=[];let h,o=2===i?"<svg>":3===i?"<math>":"",n=T;for(let i=0;i<s;i++){const s=t[i];let r,l,c=-1,a=0;for(;a<s.length&&(n.lastIndex=a,l=n.exec(s),null!==l);)a=n.lastIndex,n===T?"!--"===l[1]?n=E:void 0!==l[1]?n=k:void 0!==l[2]?(M.test(l[2])&&(h=RegExp("</"+l[2],"g")),n=O):void 0!==l[3]&&(n=O):n===O?">"===l[0]?(n=h??T,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?O:'"'===l[3]?j:S):n===j||n===S?n=O:n===E||n===k?n=T:(n=O,h=void 0);const u=n===O&&t[i+1].startsWith("/>")?" ":"";o+=n===T?s+_:c>=0?(e.push(r),s.slice(0,c)+f+s.slice(c)+v+u):s+v+(-2===c?i:u);}return [N(t,o+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class B{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let h=0,o=0;const n=t.length-1,r=this.parts,[l,a]=U(t,i);if(this.el=B.createElement(l,s),I.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(e=I.nextNode())&&r.length<n;){if(1===e.nodeType){if(e.hasAttributes())for(const t of e.getAttributeNames())if(t.endsWith(f)){const i=a[o++],s=e.getAttribute(t).split(v),n=/([.?@])?(.*)/.exec(i);r.push({type:1,index:h,name:n[2],strings:s,ctor:"."===n[1]?Y:"?"===n[1]?Z:"@"===n[1]?q:G}),e.removeAttribute(t);}else t.startsWith(v)&&(r.push({type:6,index:h}),e.removeAttribute(t));if(M.test(e.tagName)){const t=e.textContent.split(v),i=t.length-1;if(i>0){e.textContent=c?c.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],lt()),I.nextNode(),r.push({type:2,index:++h});e.append(t[i],lt());}}}else if(8===e.nodeType)if(e.data===m)r.push({type:2,index:h});else {let t=-1;for(;-1!==(t=e.data.indexOf(v,t+1));)r.push({type:7,index:h}),t+=v.length-1;}h++;}}static createElement(t,i){const s=w.createElement("template");return s.innerHTML=t,s}}function z(t,i,s=t,e){if(i===R)return i;let h=void 0!==e?s.o?.[e]:s.l;const o=st(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s.o??=[])[e]=h:s.l=h),void 0!==h&&(i=z(t,h._$AS(t,i.values),h,e)),i}class F{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??w).importNode(i,!0);I.currentNode=e;let h=I.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new et(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new K(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=I.nextNode(),o++);}return I.currentNode=w,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class et{get _$AU(){return this._$AM?._$AU??this.v}constructor(t,i,s,e){this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this.v=e?.isConnected??!0;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=z(this,t,i),st(t)?t===D||null==t||""===t?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==R&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):$(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==D&&st(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=B.createElement(N(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new F(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=V.get(t.strings);return void 0===i&&V.set(t.strings,i=new B(t)),i}k(t){g(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new et(this.O(lt()),this.O(lt()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){void 0===this._$AM&&(this.v=t,this._$AP?.(t));}}class G{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=D;}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=z(this,t,i,0),o=!st(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=z(this,e[s+n],i,n),r===R&&(r=this._$AH[n]),o||=!st(r)||r!==this._$AH[n],r===D?t=D:t!==D&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class Y extends G{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===D?void 0:t;}}class Z extends G{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==D);}}class q extends G{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=z(this,t,i,0)??D)===R)return;const s=this._$AH,e=t===D&&s!==D||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==D&&(s===D||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class K{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t);}}const Re=n.litHtmlPolyfillSupport;Re?.(B,et),(n.litHtmlVersions??=[]).push("3.2.0");

class CheckBox extends NeuFormElement {
    static define(tag = "neu-checkbox") {
        customElements.define(tag, CheckBox);
    }
    constructor() {
        super();
        this.internals.ariaChecked = "false";
        this.internals.role = "checkbox";
    }
    get caption() {
        return "caption";
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.handleClick.bind(this), { signal: this.eventsUnwireController.signal });
    }
    getTemplateInternal() {
        const template = (data) => ke `<template>
          <span>
            <slot="text">${() => data.caption}</slot>
          </span>
        </template>`;
        console.debug(template(this));
        return new DOMParser().parseFromString(`<template>
          <span>
            <slot="text">Control text</slot>
          </span>
        </template>`, "text/html").querySelector("template");
    }
    getCssRules() {
        return `:host::before {
         content: '[ ]';
         white-space: pre;
         font-family: monospace;
       }
       :host(:state(checked))::before {
           content: '[x]'
       }`;
    }
    get checked() {
        return this.hasAttribute("checked");
    }
    set checked(value) {
        this.toggleAttribute("checked", value);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "checked") {
            if (this.checked) {
                this.internals.states.add("checked");
            }
            else {
                this.internals.states.delete("checked");
            }
            this.internals.setFormValue(this.checked ? "on" : null);
            this.internals.ariaChecked = this.checked ? "true" : "false";
        }
        this.updateRendering();
    }
    handleClick(e) {
        this.checked = !this.checked;
        console.log("handleClick called");
    }
    updateRendering() {
        super.updateRendering();
        const container = this.shadow.querySelector("span");
        if (container) {
            container.textContent = (this.checked ? "checked" : "not checked");
        }
    }
}
CheckBox.define();

export { Button, CheckBox, NeuElement };
//# sourceMappingURL=bundle.js.map
