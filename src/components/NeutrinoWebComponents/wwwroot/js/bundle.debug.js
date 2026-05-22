/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$4=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o$3=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$3=t=>new n$3("string"==typeof t?t:t+"",void 0,s),i$2=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s)},S$1=(s,o)=>{if(e$4)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$1,defineProperty:e$3,getOwnPropertyDescriptor:r$2,getOwnPropertyNames:h$2,getOwnPropertySymbols:o$2,getPrototypeOf:n$2}=Object,a=globalThis,c$1=a.trustedTypes,l=c$1?c$1.emptyScript:"",p=a.reactiveElementPolyfillSupport,d=(t,s)=>t,u={toAttribute(t,s){switch(s){case Boolean:t=t?l:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$2=(t,s)=>!i$1(t,s),y={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:f$2};Symbol.metadata??=Symbol("metadata"),a.litPropertyMetadata??=new WeakMap;class b extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=y){if(s.state&&(s.attribute=!1),this._$Ei(),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,s);void 0!==r&&e$3(this.prototype,t,r);}}static getPropertyDescriptor(t,s,i){const{get:e,set:h}=r$2(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get(){return e?.call(this)},set(s){const r=e?.call(this);h.call(this,s),this.requestUpdate(t,r,i);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(d("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d("properties"))){const t=this.properties,s=[...h$2(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return !1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$EC(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:u).toAttribute(s,i.type);this._$Em=t,null==r?this.removeAttribute(e):this.setAttribute(e,r),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u;this._$Em=e,this[e]=r.fromAttribute(s,t.type),this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??f$2)(this[t],s))return;this.P(t,s,i);}!1===this.isUpdatePending&&(this._$ES=this._$ET());}P(t,s,i){this._$AL.has(t)||this._$AL.set(t,s),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t);}async _$ET(){this.isUpdatePending=!0;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t)!0!==i.wrapped||this._$AL.has(s)||void 0===this[s]||this.P(s,this[s],i);}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EU();}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EU(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return !0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU();}updated(t){}firstUpdated(t){}}b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[d("elementProperties")]=new Map,b[d("finalized")]=new Map,p?.({ReactiveElement:b}),(a.reactiveElementVersions??=[]).push("2.0.4");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n$1=globalThis,c=n$1.trustedTypes,h$1=c?c.createPolicy("lit-html",{createHTML:t=>t}):void 0,f$1="$lit$",v=`lit$${Math.random().toFixed(9).slice(2)}$`,m="?"+v,_=`<${m}>`,w=document,lt=()=>w.createComment(""),st=t=>null===t||"object"!=typeof t&&"function"!=typeof t,g=Array.isArray,$=t=>g(t)||"function"==typeof t?.[Symbol.iterator],x="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,E=/-->/g,k=/>/g,O=RegExp(`>|${x}(?:([^\\s"'>=/]+)(${x}*=${x}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),S=/'/g,j=/"/g,M=/^(?:script|style|textarea|title)$/i,P=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),ke=P(1),R=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),V=new WeakMap,I=w.createTreeWalker(w,129);function N(t,i){if(!g(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==h$1?h$1.createHTML(i):i}const U=(t,i)=>{const s=t.length-1,e=[];let h,o=2===i?"<svg>":3===i?"<math>":"",n=T;for(let i=0;i<s;i++){const s=t[i];let r,l,c=-1,a=0;for(;a<s.length&&(n.lastIndex=a,l=n.exec(s),null!==l);)a=n.lastIndex,n===T?"!--"===l[1]?n=E:void 0!==l[1]?n=k:void 0!==l[2]?(M.test(l[2])&&(h=RegExp("</"+l[2],"g")),n=O):void 0!==l[3]&&(n=O):n===O?">"===l[0]?(n=h??T,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,r=l[1],n=void 0===l[3]?O:'"'===l[3]?j:S):n===j||n===S?n=O:n===E||n===k?n=T:(n=O,h=void 0);const u=n===O&&t[i+1].startsWith("/>")?" ":"";o+=n===T?s+_:c>=0?(e.push(r),s.slice(0,c)+f$1+s.slice(c)+v+u):s+v+(-2===c?i:u);}return [N(t,o+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class B{constructor({strings:t,_$litType$:i},s){let e;this.parts=[];let h=0,o=0;const n=t.length-1,r=this.parts,[l,a]=U(t,i);if(this.el=B.createElement(l,s),I.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(e=I.nextNode())&&r.length<n;){if(1===e.nodeType){if(e.hasAttributes())for(const t of e.getAttributeNames())if(t.endsWith(f$1)){const i=a[o++],s=e.getAttribute(t).split(v),n=/([.?@])?(.*)/.exec(i);r.push({type:1,index:h,name:n[2],strings:s,ctor:"."===n[1]?Y:"?"===n[1]?Z:"@"===n[1]?q:G}),e.removeAttribute(t);}else t.startsWith(v)&&(r.push({type:6,index:h}),e.removeAttribute(t));if(M.test(e.tagName)){const t=e.textContent.split(v),i=t.length-1;if(i>0){e.textContent=c?c.emptyScript:"";for(let s=0;s<i;s++)e.append(t[s],lt()),I.nextNode(),r.push({type:2,index:++h});e.append(t[i],lt());}}}else if(8===e.nodeType)if(e.data===m)r.push({type:2,index:h});else {let t=-1;for(;-1!==(t=e.data.indexOf(v,t+1));)r.push({type:7,index:h}),t+=v.length-1;}h++;}}static createElement(t,i){const s=w.createElement("template");return s.innerHTML=t,s}}function z(t,i,s=t,e){if(i===R)return i;let h=void 0!==e?s.o?.[e]:s.l;const o=st(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s.o??=[])[e]=h:s.l=h),void 0!==h&&(i=z(t,h._$AS(t,i.values),h,e)),i}class F{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??w).importNode(i,!0);I.currentNode=e;let h=I.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new et(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new K(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=I.nextNode(),o++);}return I.currentNode=w,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class et{get _$AU(){return this._$AM?._$AU??this.v}constructor(t,i,s,e){this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this.v=e?.isConnected??!0;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=z(this,t,i),st(t)?t===D||null==t||""===t?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==R&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):$(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==D&&st(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=B.createElement(N(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new F(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=V.get(t.strings);return void 0===i&&V.set(t.strings,i=new B(t)),i}k(t){g(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new et(this.O(lt()),this.O(lt()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){void 0===this._$AM&&(this.v=t,this._$AP?.(t));}}class G{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=D;}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=z(this,t,i,0),o=!st(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=z(this,e[s+n],i,n),r===R&&(r=this._$AH[n]),o||=!st(r)||r!==this._$AH[n],r===D?t=D:t!==D&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class Y extends G{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===D?void 0:t;}}class Z extends G{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==D);}}class q extends G{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=z(this,t,i,0)??D)===R)return;const s=this._$AH,e=t===D&&s!==D||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==D&&(s===D||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class K{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){z(this,t);}}const Re=n$1.litHtmlPolyfillSupport;Re?.(B,et),(n$1.litHtmlVersions??=[]).push("3.2.0");const Q=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new et(i.insertBefore(lt(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class h extends b{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Q(e,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this.o?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this.o?.setConnected(!1);}render(){return R}}h._$litElement$=!0,h["finalized"]=!0,globalThis.litElementHydrateSupport?.({LitElement:h});const f=globalThis.litElementPolyfillSupport;f?.({LitElement:h});(globalThis.litElementVersions??=[]).push("4.1.0");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o$1={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:f$2},r$1=(t=o$1,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.P(o,void 0,t),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,r?{...t,wrapped:!0}:t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:!0,attribute:!1})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$2=(e,t,c)=>(c.configurable=!0,c.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,c),c);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e$1(e,r){return (n,s,i)=>{const o=t=>t.renderRoot?.querySelector(e)??null;return e$2(n,s,{get(){return o(this)}})}}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function o(o){return (e,n)=>{const{slot:r,selector:s}=o??{},c="slot"+(r?`[name=${r}]`:":not([name])");return e$2(e,n,{get(){const t=this.renderRoot?.querySelector(c),e=t?.assignedElements(o)??[];return void 0===s?e:e.filter((t=>t.matches(s)))}})}}

let SimpleGreeting = class SimpleGreeting extends h {
    constructor() {
        super(...arguments);
        this.name = 'World';
    }
    render() {
        return ke `<p>Hello, ${this.name}!</p>`;
    }
};
SimpleGreeting.styles = i$2 `
    :host {
      color: blue;
    }
  `;
__decorate([
    n(),
    __metadata("design:type", String)
], SimpleGreeting.prototype, "name", void 0);
SimpleGreeting = __decorate([
    t$1('simple-greeting')
], SimpleGreeting);

const version = "0.1.0";

class NeutrinoElement extends h {
    constructor() {
        super();
    }
}
NeutrinoElement.VERSION = version;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const rt=o=>void 0===o.strings,ht={},dt=(o,t=ht)=>o._$AH=t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this.t=t,this._$AM=e,this.i=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=(i,t)=>{const e=i._$AN;if(void 0===e)return !1;for(const i of e)i._$AO?.(t,!1),mt(i,t);return !0},_t=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},wt=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),gt(t);}};function bt(i){void 0!==this._$AN?(_t(this),this._$AM=i,wt(this)):this._$AM=i;}function yt(i,t=!1,e=0){const s=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(s))for(let i=e;i<s.length;i++)mt(s[i],!1),_t(s[i]);else null!=s&&(mt(s,!1),_t(s));else mt(this,i);}const gt=i=>{i.type==t.CHILD&&(i._$AP??=yt,i._$AQ??=bt);};class $t extends i{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),wt(this),this.isConnected=i._$AU;}_$AO(i,t=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(mt(this,i),_t(this));}setValue(i){if(rt(this.t))this.t._$AI(i,this);else {const t=[...this.t._$AH];t[this.i]=i,this.t._$AI(t,this,0);}}disconnected(){}reconnected(){}}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ii=()=>new Zt;class Zt{}const qt=new WeakMap,Kt=e(class extends $t{render(t){return D}update(t,[i]){const s=i!==this.Y;return s&&void 0!==this.Y&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.Y=i,this.ht=t.options?.host,this.rt(this.ct=t.element)),D}rt(t){if(this.isConnected||(t=void 0),"function"==typeof this.Y){const i=this.ht??globalThis;let s=qt.get(i);void 0===s&&(s=new WeakMap,qt.set(i,s)),void 0!==s.get(this.Y)&&this.Y.call(this.ht,void 0),s.set(this.Y,t),void 0!==t&&this.Y.call(this.ht,t);}else this.Y.value=t;}get lt(){return "function"==typeof this.Y?qt.get(this.ht??globalThis)?.get(this.Y):this.Y?.value}disconnected(){this.lt===this.ct&&this.rt(void 0);}reconnected(){this.rt(this.ct);}});

const prefix = "neu";
function defineElement(name, constructor) {
    customElements.define(name, constructor);
}

function nextFrame() {
    return new Promise((res) => requestAnimationFrame(() => res()));
}
class Focusable extends NeutrinoElement {
    constructor() {
        super();
        this._tabIndex = 0;
        this.disabled = false;
        this.autofocus = false;
        this.manipulatingTabindex = false;
        this.autofocusReady = Promise.resolve();
    }
    get tabIndex() {
        if (this.focusElement === this) {
            const tabindex = this.hasAttribute('tabindex')
                ? Number(this.getAttribute('tabindex'))
                : NaN;
            return !isNaN(tabindex) ? tabindex : -1;
        }
        const tabIndexAttribute = parseFloat(this.hasAttribute('tabindex')
            ? this.getAttribute('tabindex') || '0'
            : '0');
        if (this.disabled || tabIndexAttribute < 0) {
            return -1;
        }
        if (!this.focusElement) {
            return tabIndexAttribute;
        }
        return this._tabIndex;
    }
    set tabIndex(tabIndex) {
        if (this.manipulatingTabindex) {
            this.manipulatingTabindex = false;
            return;
        }
        if (this.focusElement === this) {
            if (this.disabled) {
                this._tabIndex = tabIndex;
            }
            else if (tabIndex !== this._tabIndex) {
                this._tabIndex = tabIndex;
                const tabindex = '' + tabIndex;
                this.manipulatingTabindex = true;
                this.setAttribute('tabindex', tabindex);
            }
            return;
        }
        if (tabIndex === -1) {
            this.addEventListener('pointerdown', this.onPointerdownManagementOfTabIndex);
        }
        else {
            this.manipulatingTabindex = true;
            this.removeEventListener('pointerdown', this.onPointerdownManagementOfTabIndex);
        }
        if (tabIndex === -1 || this.disabled) {
            this.manipulatingTabindex = true;
            this.setAttribute('tabindex', '-1');
            this.removeAttribute('focusable');
            if (this.selfManageFocusElement) {
                return;
            }
            if (tabIndex !== -1) {
                this._tabIndex = tabIndex;
                this.manageFocusElementTabindex(tabIndex);
            }
            else {
                this.focusElement?.removeAttribute('tabindex');
            }
            return;
        }
        this.setAttribute('focusable', '');
        if (this.hasAttribute('tabindex')) {
            this.removeAttribute('tabindex');
        }
        else {
            this.manipulatingTabindex = false;
        }
        this._tabIndex = tabIndex;
        this.manageFocusElementTabindex(tabIndex);
    }
    onPointerdownManagementOfTabIndex() {
        if (this.tabIndex === -1) {
            setTimeout(() => {
                this.tabIndex = 0;
                this.focus({ preventScroll: true });
                this.tabIndex = -1;
            });
        }
    }
    async manageFocusElementTabindex(tabIndex) {
        if (!this.focusElement) {
            await this.updateComplete;
        }
        if (tabIndex === null) {
            this.focusElement.removeAttribute('tabindex');
        }
        else {
            if (this.focusElement !== this) {
                this.focusElement.tabIndex = tabIndex;
            }
        }
    }
    get focusElement() {
        throw new Error('Must implement focusElement getter!');
    }
    get selfManageFocusElement() {
        return false;
    }
    focus(options) {
        if (this.disabled || !this.focusElement) {
            return;
        }
        if (this.focusElement !== this) {
            this.focusElement.focus(options);
        }
        else {
            HTMLElement.prototype.focus.apply(this, [options]);
        }
    }
    blur() {
        const focusElement = this.focusElement || this;
        if (focusElement !== this) {
            focusElement.blur();
        }
        else {
            HTMLElement.prototype.blur.apply(this);
        }
    }
    click() {
        if (this.disabled) {
            return;
        }
        const focusElement = this.focusElement || this;
        if (focusElement !== this) {
            focusElement.click();
        }
        else {
            HTMLElement.prototype.click.apply(this);
        }
    }
    manageAutoFocus() {
        if (this.autofocus) {
            this.dispatchEvent(new KeyboardEvent('keydown', {
                code: 'Tab',
            }));
            this.focusElement.focus();
        }
    }
    firstUpdated(changes) {
        super.firstUpdated(changes);
        if (!this.hasAttribute('tabindex') ||
            this.getAttribute('tabindex') !== '-1') {
            this.setAttribute('focusable', '');
        }
    }
    update(changedProperties) {
        if (changedProperties.has('disabled')) {
            this.handleDisabledChanged(this.disabled, changedProperties.get('disabled'));
        }
        super.update(changedProperties);
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('disabled') && this.disabled) {
            this.blur();
        }
    }
    async handleDisabledChanged(disabled, oldDisabled) {
        const canSetDisabled = () => this.focusElement !== this &&
            typeof this.focusElement.disabled !== 'undefined';
        if (disabled) {
            this.manipulatingTabindex = true;
            this.setAttribute('tabindex', '-1');
            await this.updateComplete;
            if (canSetDisabled()) {
                this.focusElement.disabled = true;
            }
            else {
                this.setAttribute('aria-disabled', 'true');
            }
        }
        else if (oldDisabled) {
            this.manipulatingTabindex = true;
            if (this.focusElement === this) {
                this.setAttribute('tabindex', '' + this._tabIndex);
            }
            else {
                this.removeAttribute('tabindex');
            }
            await this.updateComplete;
            if (canSetDisabled()) {
                this.focusElement.disabled = false;
            }
            else {
                this.removeAttribute('aria-disabled');
            }
        }
    }
    async getUpdateComplete() {
        const complete = (await super.getUpdateComplete());
        await this.autofocusReady;
        return complete;
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.autofocus) {
            this.autofocusReady = new Promise(async (res) => {
                await nextFrame();
                await nextFrame();
                res();
            });
            this.updateComplete.then(() => {
                this.manageAutoFocus();
            });
        }
    }
}
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], Focusable.prototype, "disabled", void 0);
__decorate([
    n({ type: Boolean }),
    __metadata("design:type", Object)
], Focusable.prototype, "autofocus", void 0);
__decorate([
    n({ type: Number }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], Focusable.prototype, "tabIndex", null);

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const to=t=>t??D;

function AnchorLike(constructor) {
    class AnchorLikeElement extends constructor {
        renderAnchor({ id, className, ariaHidden, labelledby, tabindex, anchorContent = ke `<slot></slot>`, }) {
            return ke `<a
                    id=${id}
                    class=${to(className)}
                    href=${to(this.href)}
                    download=${to(this.download)}
                    target=${to(this.target)}
                    aria-label=${to(this.label)}
                    aria-labelledby=${to(labelledby)}
                    aria-hidden=${to(ariaHidden ? 'true' : undefined)}
                    tabindex=${to(tabindex)}
                    referrerpolicy=${to(this.referrerpolicy)}
                    rel=${to(this.rel)}
                >${anchorContent}</a>`;
        }
    }
    __decorate([
        n(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "download", void 0);
    __decorate([
        n(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "label", void 0);
    __decorate([
        n(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "href", void 0);
    __decorate([
        n(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "target", void 0);
    __decorate([
        n(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "rel", void 0);
    __decorate([
        n(),
        __metadata("design:type", String)
    ], AnchorLikeElement.prototype, "referrerpolicy", void 0);
    return AnchorLikeElement;
}

const styles$8 = i$2`:root {
    --icon-spacing: 8px;
}

:host {
    display: inline-block;
}

button {
    min-width: 120px;
    height: 48px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
}

[slot='start'], ::slotted([slot='start']) {
    margin-inline-end: 8px;
}

[slot='end'], ::slotted([slot='end']) {
    margin-inline-start: 8px;
}
`;

function FormElement(constructor) {
    class FormAssociatedElement extends constructor {
        static get formAssociated() {
            return true;
        }
        constructor(...args) {
            super(...args);
            this.name = null;
            this._internals = this.attachInternals();
        }
        get form() {
            return this._internals.form;
        }
        get type() {
            return this.localName;
        }
        get internals() {
            return this._internals;
        }
    }
    __decorate([
        n({ type: String }),
        __metadata("design:type", Object)
    ], FormAssociatedElement.prototype, "name", void 0);
    return FormAssociatedElement;
}

const ButtonType = {
    submin: "submit",
    reset: "reset",
    button: "button"
};
class Button extends AnchorLike(FormElement(Focusable)) {
    constructor() {
        super(...arguments);
        this._buttonRef = ii();
        this.active = false;
        this.type = 'button';
        this.handleMouseDown = (e) => {
            console.debug(this);
        };
    }
    static get styles() {
        return [styles$8];
    }
    get focusElement() {
        return this;
    }
    render() {
        return ke `<button 
            type="${this.type}" 
            ${Kt(this._buttonRef)}
            @click=${(c) => this.handleClick(c)}>
            <slot name="start" part="start"></slot>
            <slot part="caption"></slot>
            <slot name="end" part="end"></slot>
            </button>`;
    }
    handleClick(c) {
        console.log(`Button click ${this._buttonRef}`);
    }
    handleMouseDown1(e) {
        console.debug(this);
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mousedown", this.handleMouseDown1);
    }
}
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], Button.prototype, "active", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", String)
], Button.prototype, "type", void 0);
__decorate([
    e$1('.anchor'),
    __metadata("design:type", HTMLButtonElement)
], Button.prototype, "anchorElement", void 0);
defineElement("neu-button", Button);

const styles$7 = i$2`:host {
    display: inline;
}

:host(:focus) {
    outline: none;
}

:host([disabled]) {
    pointer-events: none;
}

a#anchor, a#anchor:visited {
    font-family: var(--typography-body1-stronger-font-family);
    font-weight: var(--typography-body1-stronger-font-weight);
    font-size: var(--typography-body1-stronger-font-size);
    line-height: var(--typography-body1-stronger-line-height);
    color: var(--color-brand-800);
    text-decoration: none;
}

a#anchor:hover {
    color: var(--color-brand-600);
}
`;

class Link extends AnchorLike(Focusable) {
    static get styles() {
        return [styles$7];
    }
    get focusElement() {
        return this.anchorElement;
    }
    render() {
        return this.renderAnchor({ id: 'anchor' });
    }
}
__decorate([
    e$1('#anchor'),
    __metadata("design:type", HTMLAnchorElement)
], Link.prototype, "anchorElement", void 0);
defineElement("neu-link", Link);

const styles$6 = i$2`:host {
    display: block;
}

:host div[role="list"] {
    display: flex;
    flex-direction: column;
    margin-inline-start: var(--spacing-l);
}

#item-link, #item-link:visited {
    display: flex;
    flex-direction: row;
    text-decoration: none;
    padding-block-start: var(--spacing-s);
    padding-block-end: var(--spacing-s);
    padding-inline-start: calc(var(--spacing-s) - var(--spacing-xs));
    padding-inline-end: var(--spacing-s);
    column-gap: var(--spacing-s);
    align-items: flex-start;
    color: var(--default-foreground-color);
    font-family: var(--typography-body1-strong-font-family);
    font-weight: var(--typography-body1-strong-font-weight);
    font-size: var(--typography-body1-strong-font-size);
    line-height: var(--typography-body1-strong-line-height);
    border-left: var(--spacing-xs) solid transparent;
}

#item-link ::slotted([slot="start"]) {
    color: var(--color-brand-800);
    flex: 0 0 0;
}

#item-link ::slotted([slot="end"]) {
    flex: 0 0 0;
}

#item-link span[part="content"] {
    flex: 1 1 0;
}

#item-link:hover, 
:host([selected]) #item-link:hover {
    background-color: var(--color-neutral-300);
}

:host([selected]) #item-link {
    background-color: var(--color-neutral-200);
    border-left: var(--spacing-xs) solid var(--color-brand-800);
}
`;

class SidebarItem extends AnchorLike(Focusable) {
    constructor() {
        super(...arguments);
        this.value = undefined;
        this.selected = false;
        this.expanded = false;
    }
    static get styles() {
        return [styles$6];
    }
    get parentSidebar() {
        return this._parentSidebar ?? (this._parentSidebar = this.closest("neu-sidebar"));
    }
    get focusElement() {
        return this;
    }
    get hasChildren() {
        return !!this.querySelector('neu-sidebar-item');
    }
    render() {
        return ke `
            <a 
                id="item-link"
                href=${this.href || "#"}
                target=${to(this.target)}
                download=${to(this.download)}
                rel=${to(this.rel)}
                @click="${this.handleClick}"
            >
            <slot name="start"></slot>
            <span part="content">${this.label}<slot></slot></span>
            <slot name="end"></slot>
            </a>
            ${this.expanded
            ? ke `
                      <div aria-labelledby="item-link" role="list">
                          <slot name="descendant"></slot>
                      </div>
                  `
            : D}
            `;
    }
    firstUpdated(changed) {
        super.firstUpdated(changed);
        this.setAttribute('role', 'listitem');
    }
    update(changes) {
        if (!this.hasAttribute('slot')) {
            this.slot = "descendant";
        }
        super.update(changes);
    }
    async connectedCallback() {
        super.connectedCallback();
        const parent = this.parentSidebar;
        if (parent) {
            await parent.updateComplete;
            parent.startTrackingSelection(this);
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.parentSidebar?.stopTrackingSelection(this);
    }
    click() {
        this.handleClick();
    }
    handleSidebarSelect(event) {
        this.selected = event.target === this;
    }
    handleClick(event) {
        if (!this.href && event) {
            event.preventDefault();
        }
        if (!this.disabled && (!this.href || event?.defaultPrevented)) {
            if (this.hasChildren) {
                this.expanded = !this.expanded;
            }
            else if (this.value) {
                this.announceSelected(this.value);
            }
        }
    }
    announceSelected(value) {
        const selectDetail = {
            value
        };
        const selectionEvent = new CustomEvent('sidebar-select', {
            bubbles: true,
            composed: true,
            detail: selectDetail,
        });
        this.dispatchEvent(selectionEvent);
    }
}
__decorate([
    n(),
    __metadata("design:type", Object)
], SidebarItem.prototype, "value", void 0);
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], SidebarItem.prototype, "selected", void 0);
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], SidebarItem.prototype, "expanded", void 0);

const styles$5 = i$2`:host {
    display: block;
}

:host div[role="list"] {
    display: flex;
    flex-direction: column;
}

#item-heading {
    display: flex;
    flex-direction: row;
    text-decoration: none;
    padding-block-start: var(--spacing-l);
    padding-block-end: var(--spacing-s);
    padding-inline-start: var(--spacing-s);
    padding-inline-end: var(--spacing-s);
    column-gap: var(--spacing-s);
    align-items: center;
    color: var(--theme-foreground30);
    font-family: var(--typography-caption1-strong-font-family);
    font-weight: var(--typography-caption1-strong-font-weight);
    font-size: var(--typography-caption1-strong-font-size);
    line-height: var(--typography-caption1-strong-line-height);
}
`;

class SidebarHeading extends NeutrinoElement {
    static get styles() {
        return [styles$5];
    }
    get parentSidebar() {
        return this._parentSidebar ?? (this._parentSidebar = this.closest("neu-sidebar"));
    }
    render() {
        return ke `
            <div id="item-heading">
            <slot name="start"></slot>
            <span>${this.label}<slot></slot></span>
            <slot name="end"></slot>
            </div>
            <div aria-labelledby="item-header" role="list">
                <slot name="descendant"></slot>
            </div>
        `;
    }
    firstUpdated(changed) {
        super.firstUpdated(changed);
        this.setAttribute('role', 'listitem');
    }
    update(changes) {
        if (!this.hasAttribute('slot')) {
            this.slot = "descendant";
        }
        super.update(changes);
    }
}
__decorate([
    n(),
    __metadata("design:type", String)
], SidebarHeading.prototype, "label", void 0);

const styles$4 = i$2`:host {
    display: block;
    background-color: var(--color-neutral-100);
    padding: var(--spacing-xs);
    overflow-y: auto;
}

:host div[role="list"] {
    display: flex;
    flex-direction: column;
}
`;

class Sidebar extends Focusable {
    constructor() {
        super(...arguments);
        this._items = new Set();
        this.value = undefined;
        this.label = undefined;
    }
    static get styles() {
        return [styles$4];
    }
    get focusElement() {
        return this;
    }
    render() {
        return ke `
            <nav
                @sidebar-select=${this.handleSelect}
                aria-label=${to(this.label)}
            >
                <div role="list">
                    <slot name="descendant"></slot>
                </div>
            </nav>
        `;
    }
    handleSelect(event) {
        event.stopPropagation();
        if (this.value === event.detail.value) {
            return;
        }
        const oldValue = this.value;
        this.value = event.detail.value;
        const applyDefault = this.dispatchEvent(new Event('change', {
            bubbles: true,
            composed: true,
            cancelable: true,
        }));
        if (!applyDefault) {
            this.value = oldValue;
            event.target.selected = false;
            event.preventDefault();
        }
        else {
            this._items.forEach((item) => item.handleSidebarSelect(event));
        }
    }
    startTrackingSelection(item) {
        if (item) {
            this._items.add(item);
        }
    }
    stopTrackingSelection(item) {
        if (item) {
            this._items.delete(item);
        }
    }
}
__decorate([
    n({ reflect: true }),
    __metadata("design:type", Object)
], Sidebar.prototype, "value", void 0);
__decorate([
    n({ reflect: true }),
    __metadata("design:type", Object)
], Sidebar.prototype, "label", void 0);
defineElement(`${prefix}-sidebar`, Sidebar);
defineElement(`${prefix}-sidebar-item`, SidebarItem);
defineElement(`${prefix}-sidebar-header`, SidebarHeading);

const materialIcons = {
    "10k": '\ue951',
    "10mp": '\ue952',
    "11mp": '\ue953',
    "123": '\ueb8d',
    "12mp": '\ue954',
    "13mp": '\ue955',
    "14mp": '\ue956',
    "15mp": '\ue957',
    "16mp": '\ue958',
    "17mp": '\ue959',
    "18UpRating": '\uf8fd',
    "18mp": '\ue95a',
    "19mp": '\ue95b',
    "1k": '\ue95c',
    "1kPlus": '\ue95d',
    "1xMobiledata": '\uefcd',
    "1xMobiledataBadge": '\uf7f1',
    "20mp": '\ue95e',
    "21mp": '\ue95f',
    "22mp": '\ue960',
    "23mp": '\ue961',
    "24mp": '\ue962',
    "2d": '\uef37',
    "2k": '\ue963',
    "2kPlus": '\ue964',
    "2mp": '\ue965',
    "30fps": '\uefce',
    "30fpsSelect": '\uefcf',
    "360": '\ue577',
    "3dRotation": '\ue84d',
    "3gMobiledata": '\uefd0',
    "3gMobiledataBadge": '\uf7f0',
    "3k": '\ue966',
    "3kPlus": '\ue967',
    "3mp": '\ue968',
    "3p": '\uefd1',
    "4gMobiledata": '\uefd2',
    "4gMobiledataBadge": '\uf7ef',
    "4gPlusMobiledata": '\uefd3',
    "4k": '\ue072',
    "4kPlus": '\ue969',
    "4mp": '\ue96a',
    "50mp": '\uf6f3',
    "5g": '\uef38',
    "5gMobiledataBadge": '\uf7ee',
    "5k": '\ue96b',
    "5kPlus": '\ue96c',
    "5mp": '\ue96d',
    "60fps": '\uefd4',
    "60fpsSelect": '\uefd5',
    "6FtApart": '\uf21e',
    "6k": '\ue96e',
    "6kPlus": '\ue96f',
    "6mp": '\ue970',
    "7k": '\ue971',
    "7kPlus": '\ue972',
    "7mp": '\ue973',
    "8k": '\ue974',
    "8kPlus": '\ue975',
    "8mp": '\ue976',
    "9k": '\ue977',
    "9kPlus": '\ue978',
    "9mp": '\ue979',
    "Abc": '\ueb94',
    "AcUnit": '\ueb3b',
    "AccessAlarm": '\ue855',
    "AccessAlarms": '\ue855',
    "AccessTime": '\uefd6',
    "AccessTimeFilled": '\uefd6',
    "Accessibility": '\ue84e',
    "AccessibilityNew": '\ue92c',
    "Accessible": '\ue914',
    "AccessibleForward": '\ue934',
    "AccountBalance": '\ue84f',
    "AccountBalanceWallet": '\ue850',
    "AccountBox": '\ue851',
    "AccountCircle": '\uf20b',
    "AccountCircleFilled": '\uf20b',
    "AccountCircleOff": '\uf7b3',
    "AccountTree": '\ue97a',
    "ActivityZone": '\ue1e6',
    "Acute": '\ue4cb',
    "Ad": '\ue65a',
    "AdGroup": '\ue65b',
    "AdGroupOff": '\ueae5',
    "AdOff": '\uf7b2',
    "AdUnits": '\uef39',
    "Adb": '\ue60e',
    "Add": '\ue145',
    "AddAPhoto": '\ue439',
    "AddAd": '\ue72a',
    "AddAlarm": '\ue856',
    "AddAlert": '\ue003',
    "AddBox": '\ue146',
    "AddBusiness": '\ue729',
    "AddCall": '\uf0b7',
    "AddCard": '\ueb86',
    "AddChart": '\uef3c',
    "AddCircle": '\ue3ba',
    "AddCircleOutline": '\ue3ba',
    "AddComment": '\ue266',
    "AddHome": '\uf8eb',
    "AddHomeWork": '\uf8ed',
    "AddIcCall": '\uf0b7',
    "AddLink": '\ue178',
    "AddLocation": '\ue567',
    "AddLocationAlt": '\uef3a',
    "AddModerator": '\ue97d',
    "AddNotes": '\ue091',
    "AddPhotoAlternate": '\ue43e',
    "AddReaction": '\ue1d3',
    "AddRoad": '\uef3b',
    "AddShoppingCart": '\ue854',
    "AddTask": '\uf23a',
    "AddToDrive": '\ue65c',
    "AddToHomeScreen": '\ue1fe',
    "AddToPhotos": '\ue39d',
    "AddToQueue": '\ue05c',
    "Addchart": '\uef3c',
    "AdfScanner": '\ueada',
    "Adjust": '\ue39e',
    "AdminMeds": '\ue48d',
    "AdminPanelSettings": '\uef3d',
    "AdsClick": '\ue762',
    "Agender": '\uf888',
    "Agriculture": '\uea79',
    "Air": '\uefd8',
    "AirFreshener": '\ue2ca',
    "AirPurifierGen": '\ue829',
    "AirlineSeatFlat": '\ue630',
    "AirlineSeatFlatAngled": '\ue631',
    "AirlineSeatIndividualSuite": '\ue632',
    "AirlineSeatLegroomExtra": '\ue633',
    "AirlineSeatLegroomNormal": '\ue634',
    "AirlineSeatLegroomReduced": '\ue635',
    "AirlineSeatReclineExtra": '\ue636',
    "AirlineSeatReclineNormal": '\ue637',
    "AirlineStops": '\ue7d0',
    "Airlines": '\ue7ca',
    "AirplaneTicket": '\uefd9',
    "AirplanemodeActive": '\ue53d',
    "AirplanemodeInactive": '\ue194',
    "Airplay": '\ue055',
    "AirportShuttle": '\ueb3c',
    "Airware": '\uf154',
    "Airwave": '\uf154',
    "Alarm": '\ue855',
    "AlarmAdd": '\ue856',
    "AlarmOff": '\ue857',
    "AlarmOn": '\ue858',
    "AlarmSmartWake": '\uf6b0',
    "Album": '\ue019',
    "AlignCenter": '\ue356',
    "AlignEnd": '\uf797',
    "AlignFlexCenter": '\uf796',
    "AlignFlexEnd": '\uf795',
    "AlignFlexStart": '\uf794',
    "AlignHorizontalCenter": '\ue00f',
    "AlignHorizontalLeft": '\ue00d',
    "AlignHorizontalRight": '\ue010',
    "AlignItemsStretch": '\uf793',
    "AlignJustifyCenter": '\uf792',
    "AlignJustifyFlexEnd": '\uf791',
    "AlignJustifyFlexStart": '\uf790',
    "AlignJustifySpaceAround": '\uf78f',
    "AlignJustifySpaceBetween": '\uf78e',
    "AlignJustifySpaceEven": '\uf78d',
    "AlignJustifyStretch": '\uf78c',
    "AlignSelfStretch": '\uf78b',
    "AlignSpaceAround": '\uf78a',
    "AlignSpaceBetween": '\uf789',
    "AlignSpaceEven": '\uf788',
    "AlignStart": '\uf787',
    "AlignStretch": '\uf786',
    "AlignVerticalBottom": '\ue015',
    "AlignVerticalCenter": '\ue011',
    "AlignVerticalTop": '\ue00c',
    "AllInbox": '\ue97f',
    "AllInclusive": '\ueb3d',
    "AllMatch": '\ue093',
    "AllOut": '\ue90b',
    "Allergies": '\ue094',
    "Allergy": '\ue64e',
    "AltRoute": '\uf184',
    "AlternateEmail": '\ue0e6',
    "Altitude": '\uf873',
    "AmbientScreen": '\uf6c4',
    "Ambulance": '\uf803',
    "Amend": '\uf802',
    "AmpStories": '\uea13',
    "Analytics": '\uef3e',
    "Anchor": '\uf1cd',
    "Android": '\ue859',
    "Animation": '\ue71c',
    "Announcement": '\ue87f',
    "Aod": '\uefda',
    "AodTablet": '\uf89f',
    "AodWatch": '\uf6ac',
    "Apartment": '\uea40',
    "Api": '\uf1b7',
    "ApkDocument": '\uf88e',
    "ApkInstall": '\uf88f',
    "AppBadging": '\uf72f',
    "AppBlocking": '\uef3f',
    "AppPromo": '\ue981',
    "AppRegistration": '\uef40',
    "AppSettingsAlt": '\uef41',
    "AppShortcut": '\ueae4',
    "Approval": '\ue982',
    "ApprovalDelegation": '\uf84a',
    "Apps": '\ue5c3',
    "AppsOutage": '\ue7cc',
    "Aq": '\uf55a',
    "AqIndoor": '\uf55b',
    "ArOnYou": '\uef7c',
    "Architecture": '\uea3b',
    "Archive": '\ue149',
    "AreaChart": '\ue770',
    "ArmingCountdown": '\ue78a',
    "ArrowAndEdge": '\uf5d7',
    "ArrowBack": '\ue5c4',
    "ArrowBackIos": '\ue5e0',
    "ArrowBackIosNew": '\ue2ea',
    "ArrowCircleDown": '\uf181',
    "ArrowCircleLeft": '\ueaa7',
    "ArrowCircleRight": '\ueaaa',
    "ArrowCircleUp": '\uf182',
    "ArrowDownward": '\ue5db',
    "ArrowDownwardAlt": '\ue984',
    "ArrowDropDown": '\ue5c5',
    "ArrowDropDownCircle": '\ue5c6',
    "ArrowDropUp": '\ue5c7',
    "ArrowForward": '\ue5c8',
    "ArrowForwardIos": '\ue5e1',
    "ArrowInsert": '\uf837',
    "ArrowLeft": '\ue5de',
    "ArrowLeftAlt": '\uef7d',
    "ArrowOrEdge": '\uf5d6',
    "ArrowOutward": '\uf8ce',
    "ArrowRange": '\uf69b',
    "ArrowRight": '\ue5df',
    "ArrowRightAlt": '\ue941',
    "ArrowSelectorTool": '\uf82f',
    "ArrowSplit": '\uea04',
    "ArrowTopLeft": '\uf72e',
    "ArrowTopRight": '\uf72d',
    "ArrowUpward": '\ue5d8',
    "ArrowUpwardAlt": '\ue986',
    "ArrowsMoreDown": '\uf8ab',
    "ArrowsMoreUp": '\uf8ac',
    "ArrowsOutward": '\uf72c',
    "ArtTrack": '\ue060',
    "Article": '\uef42',
    "ArticleShortcut": '\uf587',
    "AspectRatio": '\ue85b',
    "Assessment": '\uf0cc',
    "Assignment": '\ue85d',
    "AssignmentAdd": '\uf848',
    "AssignmentInd": '\ue85e',
    "AssignmentLate": '\ue85f',
    "AssignmentReturn": '\ue860',
    "AssignmentReturned": '\ue861',
    "AssignmentTurnedIn": '\ue862',
    "AssistWalker": '\uf8d5',
    "Assistant": '\ue39f',
    "AssistantDirection": '\ue988',
    "AssistantNavigation": '\ue989',
    "AssistantOnHub": '\uf6c1',
    "AssistantPhoto": '\uf0c6',
    "AssuredWorkload": '\ueb6f',
    "AstrophotographyAuto": '\uf1d9',
    "AstrophotographyOff": '\uf1da',
    "Atm": '\ue573',
    "Atr": '\uebc7',
    "AttachEmail": '\uea5e',
    "AttachFile": '\ue226',
    "AttachFileAdd": '\uf841',
    "AttachMoney": '\ue227',
    "Attachment": '\ue2bc',
    "Attractions": '\uea52',
    "Attribution": '\uefdb',
    "AudioDescription": '\uf58c',
    "AudioFile": '\ueb82',
    "AudioVideoReceiver": '\uf5d3',
    "Audiotrack": '\ue405',
    "AutoActivityZone": '\uf8ad',
    "AutoAwesome": '\ue65f',
    "AutoAwesomeMosaic": '\ue660',
    "AutoAwesomeMotion": '\ue661',
    "AutoDelete": '\uea4c',
    "AutoDetectVoice": '\uf83e',
    "AutoFix": '\ue663',
    "AutoFixHigh": '\ue663',
    "AutoFixNormal": '\ue664',
    "AutoFixOff": '\ue665',
    "AutoGraph": '\ue4fb',
    "AutoLabel": '\uf6be',
    "AutoMeetingRoom": '\uf6bf',
    "AutoMode": '\uec20',
    "AutoReadPause": '\uf219',
    "AutoReadPlay": '\uf216',
    "AutoSchedule": '\ue214',
    "AutoStories": '\ue666',
    "AutoTimer": '\uef7f',
    "AutoVideocam": '\uf6c0',
    "AutofpsSelect": '\uefdc',
    "Autopause": '\uf6b6',
    "Autopay": '\uf84b',
    "Autoplay": '\uf6b5',
    "Autorenew": '\ue863',
    "Autostop": '\uf682',
    "AvTimer": '\ue01b',
    "AvgPace": '\uf6bb',
    "AvgTime": '\uf813',
    "AwardStar": '\uf612',
    "Azm": '\uf6ec',
    "BabyChangingStation": '\uf19b',
    "BackHand": '\ue764',
    "BackToTab": '\uf72b',
    "BackgroundDotLarge": '\uf79e',
    "BackgroundGridSmall": '\uf79d',
    "BackgroundReplace": '\uf20a',
    "BacklightHigh": '\uf7ed',
    "BacklightLow": '\uf7ec',
    "Backpack": '\uf19c',
    "Backspace": '\ue14a',
    "Backup": '\ue864',
    "BackupTable": '\uef43',
    "Badge": '\uea67',
    "BadgeCriticalBattery": '\uf156',
    "BakeryDining": '\uea53',
    "Balance": '\ueaf6',
    "Balcony": '\ue58f',
    "Ballot": '\ue172',
    "BarChart": '\ue26b',
    "BarChart4Bars": '\uf681',
    "Barcode": '\ue70b',
    "BarcodeReader": '\uf85c',
    "BarcodeScanner": '\ue70c',
    "Barefoot": '\uf871',
    "BatchPrediction": '\uf0f5',
    "BathOutdoor": '\uf6fb',
    "BathPrivate": '\uf6fa',
    "BathPublicLarge": '\uf6f9',
    "Bathroom": '\uefdd',
    "Bathtub": '\uea41',
    "Battery0Bar": '\uebdc',
    "Battery1Bar": '\uf09c',
    "Battery20": '\uf09c',
    "Battery2Bar": '\uf09d',
    "Battery30": '\uf09d',
    "Battery3Bar": '\uf09e',
    "Battery4Bar": '\uf09f',
    "Battery50": '\uf09e',
    "Battery5Bar": '\uf0a0',
    "Battery60": '\uf09f',
    "Battery6Bar": '\uf0a1',
    "Battery80": '\uf0a0',
    "Battery90": '\uf0a1',
    "BatteryAlert": '\ue19c',
    "BatteryChange": '\uf7eb',
    "BatteryCharging20": '\uf0a2',
    "BatteryCharging30": '\uf0a3',
    "BatteryCharging50": '\uf0a4',
    "BatteryCharging60": '\uf0a5',
    "BatteryCharging80": '\uf0a6',
    "BatteryCharging90": '\uf0a7',
    "BatteryChargingFull": '\ue1a3',
    "BatteryError": '\uf7ea',
    "BatteryFull": '\ue1a5',
    "BatteryFullAlt": '\uf13b',
    "BatteryHoriz000": '\uf8ae',
    "BatteryHoriz050": '\uf8af',
    "BatteryHoriz075": '\uf8b0',
    "BatteryLow": '\uf155',
    "BatteryPlus": '\uf7e9',
    "BatteryProfile": '\ue206',
    "BatterySaver": '\uefde',
    "BatteryShare": '\uf67e',
    "BatteryStatusGood": '\uf67d',
    "BatteryStd": '\ue1a5',
    "BatteryUnknown": '\ue1a6',
    "BatteryVert005": '\uf8b1',
    "BatteryVert020": '\uf8b2',
    "BatteryVert050": '\uf8b3',
    "BatteryVeryLow": '\uf156',
    "BeachAccess": '\ueb3e',
    "Bed": '\uefdf',
    "BedroomBaby": '\uefe0',
    "BedroomChild": '\uefe1',
    "BedroomParent": '\uefe2',
    "Bedtime": '\uef44',
    "BedtimeOff": '\ueb76',
    "Beenhere": '\ue52d',
    "Bento": '\uf1f4',
    "Bia": '\uf6eb',
    "BidLandscape": '\ue678',
    "BidLandscapeDisabled": '\uef81',
    "BikeScooter": '\uef45',
    "Biotech": '\uea3a',
    "Blanket": '\ue828',
    "Blender": '\uefe3',
    "Blind": '\uf8d6',
    "Blinds": '\ue286',
    "BlindsClosed": '\uec1f',
    "Block": '\uf08c',
    "BloodPressure": '\ue097',
    "Bloodtype": '\uefe4',
    "Bluetooth": '\ue1a7',
    "BluetoothAudio": '\ue60f',
    "BluetoothConnected": '\ue1a8',
    "BluetoothDisabled": '\ue1a9',
    "BluetoothDrive": '\uefe5',
    "BluetoothSearching": '\ue60f',
    "BlurCircular": '\ue3a2',
    "BlurLinear": '\ue3a3',
    "BlurMedium": '\ue84c',
    "BlurOff": '\ue3a4',
    "BlurOn": '\ue3a5',
    "BlurShort": '\ue8cf',
    "BodyFat": '\ue098',
    "BodySystem": '\ue099',
    "Bolt": '\uea0b',
    "Bomb": '\uf568',
    "Book": '\ue86e',
    "BookOnline": '\uf217',
    "Bookmark": '\ue8e7',
    "BookmarkAdd": '\ue598',
    "BookmarkAdded": '\ue599',
    "BookmarkBorder": '\ue8e7',
    "BookmarkManager": '\uf7b1',
    "BookmarkRemove": '\ue59a',
    "Bookmarks": '\ue98b',
    "BorderAll": '\ue228',
    "BorderBottom": '\ue229',
    "BorderClear": '\ue22a',
    "BorderColor": '\ue22b',
    "BorderHorizontal": '\ue22c',
    "BorderInner": '\ue22d',
    "BorderLeft": '\ue22e',
    "BorderOuter": '\ue22f',
    "BorderRight": '\ue230',
    "BorderStyle": '\ue231',
    "BorderTop": '\ue232',
    "BorderVertical": '\ue233',
    "BottomAppBar": '\ue730',
    "BottomDrawer": '\ue72d',
    "BottomNavigation": '\ue98c',
    "BottomPanelClose": '\uf72a',
    "BottomPanelOpen": '\uf729',
    "BottomRightClick": '\uf684',
    "BottomSheets": '\ue98d',
    "Box": '\uf5a4',
    "BoxAdd": '\uf5a5',
    "BoxEdit": '\uf5a6',
    "Boy": '\ueb67',
    "BrandAwareness": '\ue98e',
    "BrandingWatermark": '\ue06b',
    "BreakfastDining": '\uea54',
    "BreakingNews": '\uea08',
    "BreakingNewsAlt1": '\uf0ba',
    "Breastfeeding": '\uf856',
    "Brightness1": '\ue3fa',
    "Brightness2": '\uf036',
    "Brightness3": '\ue3a8',
    "Brightness4": '\ue3a9',
    "Brightness5": '\ue3aa',
    "Brightness6": '\ue3ab',
    "Brightness7": '\ue3ac',
    "BrightnessAlert": '\uf5cf',
    "BrightnessAuto": '\ue1ab',
    "BrightnessEmpty": '\uf7e8',
    "BrightnessHigh": '\ue1ac',
    "BrightnessLow": '\ue1ad',
    "BrightnessMedium": '\ue1ae',
    "BringYourOwnIp": '\ue016',
    "BroadcastOnHome": '\uf8f8',
    "BroadcastOnPersonal": '\uf8f9',
    "BrokenImage": '\ue3ad',
    "Browse": '\ueb13',
    "BrowseActivity": '\uf8a5',
    "BrowseGallery": '\uebd1',
    "BrowserNotSupported": '\uef47',
    "BrowserUpdated": '\ue7cf',
    "BrunchDining": '\uea73',
    "Brush": '\ue3ae',
    "Bubble": '\uef83',
    "BubbleChart": '\ue6dd',
    "Bubbles": '\uf64e',
    "BugReport": '\ue868',
    "Build": '\uf8cd',
    "BuildCircle": '\uef48',
    "Bungalow": '\ue591',
    "BurstMode": '\ue43c',
    "BusAlert": '\ue98f',
    "Business": '\ue7ee',
    "BusinessCenter": '\ueb3f',
    "BusinessChip": '\uf84c',
    "BusinessMessages": '\uef84',
    "ButtonsAlt": '\ue72f',
    "Cabin": '\ue589',
    "Cable": '\uefe6',
    "Cached": '\ue86a',
    "Cake": '\ue7e9',
    "CakeAdd": '\uf85b',
    "Calculate": '\uea5f',
    "CalendarAddOn": '\uef85',
    "CalendarAppsScript": '\uf0bb',
    "CalendarMonth": '\uebcc',
    "CalendarToday": '\ue935',
    "CalendarViewDay": '\ue936',
    "CalendarViewMonth": '\uefe7',
    "CalendarViewWeek": '\uefe8',
    "Call": '\uf0d4',
    "CallEnd": '\uf0bc',
    "CallEndAlt": '\uf0bc',
    "CallLog": '\ue08e',
    "CallMade": '\ue0b2',
    "CallMerge": '\ue0b3',
    "CallMissed": '\ue0b4',
    "CallMissedOutgoing": '\ue0e4',
    "CallQuality": '\uf652',
    "CallReceived": '\ue0b5',
    "CallSplit": '\ue0b6',
    "CallToAction": '\ue06c',
    "Camera": '\ue3af',
    "CameraAlt": '\ue412',
    "CameraEnhance": '\ue8fc',
    "CameraFront": '\ue3b1',
    "CameraIndoor": '\uefe9',
    "CameraOutdoor": '\uefea',
    "CameraRear": '\ue3b2',
    "CameraRoll": '\ue3b3',
    "CameraVideo": '\uf7a6',
    "Cameraswitch": '\uefeb',
    "Campaign": '\uef49',
    "Camping": '\uf8a2',
    "Cancel": '\ue888',
    "CancelPresentation": '\ue0e9',
    "CancelScheduleSend": '\uea39',
    "Candle": '\uf588',
    "CandlestickChart": '\uead4',
    "CaptivePortal": '\uf728',
    "Capture": '\uf727',
    "CarCrash": '\uebf2',
    "CarRental": '\uea55',
    "CarRepair": '\uea56',
    "CardGiftcard": '\ue8f6',
    "CardMembership": '\ue8f7',
    "CardTravel": '\ue8f8',
    "Cardiology": '\ue09c',
    "Cards": '\ue991',
    "Carpenter": '\uf1f8',
    "Cases": '\ue992',
    "Casino": '\ueb40',
    "Cast": '\ue307',
    "CastConnected": '\ue308',
    "CastForEducation": '\uefec',
    "CastPause": '\uf5f0',
    "CastWarning": '\uf5ef',
    "Castle": '\ueab1',
    "Category": '\ue574',
    "Celebration": '\uea65',
    "CellMerge": '\uf82e',
    "CellTower": '\uebba',
    "CellWifi": '\ue0ec',
    "CenterFocusStrong": '\ue3b4',
    "CenterFocusWeak": '\ue3b5',
    "Chair": '\uefed',
    "ChairAlt": '\uefee',
    "Chalet": '\ue585',
    "ChangeCircle": '\ue2e7',
    "ChangeHistory": '\ue86b',
    "Charger": '\ue2ae',
    "ChargingStation": '\uf19d',
    "ChartData": '\ue473',
    "Chat": '\ue0c9',
    "ChatAddOn": '\uf0f3',
    "ChatAppsScript": '\uf0bd',
    "ChatBubble": '\ue0cb',
    "ChatBubbleOutline": '\ue0cb',
    "ChatError": '\uf7ac',
    "ChatPasteGo": '\uf6bd',
    "Check": '\ue5ca',
    "CheckBox": '\ue834',
    "CheckBoxOutlineBlank": '\ue835',
    "CheckCircle": '\uf0be',
    "CheckCircleFilled": '\uf0be',
    "CheckCircleOutline": '\uf0be',
    "CheckInOut": '\uf6f6',
    "CheckIndeterminateSmall": '\uf88a',
    "CheckSmall": '\uf88b',
    "Checklist": '\ue6b1',
    "ChecklistRtl": '\ue6b3',
    "Checkroom": '\uf19e',
    "Cheer": '\uf6a8',
    "Chess": '\uf5e7',
    "ChevronLeft": '\ue5cb',
    "ChevronRight": '\ue5cc',
    "ChildCare": '\ueb41',
    "ChildFriendly": '\ueb42',
    "ChipExtraction": '\uf821',
    "Chips": '\ue993',
    "ChromeReaderMode": '\ue86d',
    "Chromecast2": '\uf17b',
    "ChromecastDevice": '\ue83c',
    "Chronic": '\uebb2',
    "Church": '\ueaae',
    "CinematicBlur": '\uf853',
    "Circle": '\uef4a',
    "CircleNotifications": '\ue994',
    "Circles": '\ue7ea',
    "CirclesExt": '\ue7ec',
    "Clarify": '\uf0bf',
    "Class": '\ue86e',
    "CleanHands": '\uf21f',
    "CleaningBucket": '\uf8b4',
    "CleaningServices": '\uf0ff',
    "Clear": '\ue5cd',
    "ClearAll": '\ue0b8',
    "ClearDay": '\uf157',
    "ClearNight": '\uf159',
    "ClimateMiniSplit": '\uf8b5',
    "ClinicalNotes": '\ue09e',
    "ClockLoader10": '\uf726',
    "ClockLoader20": '\uf725',
    "ClockLoader40": '\uf724',
    "ClockLoader60": '\uf723',
    "ClockLoader80": '\uf722',
    "ClockLoader90": '\uf721',
    "Close": '\ue5cd',
    "CloseFullscreen": '\uf1cf',
    "ClosedCaption": '\ue996',
    "ClosedCaptionDisabled": '\uf1dc',
    "ClosedCaptionOff": '\ue996',
    "Cloud": '\uf15c',
    "CloudCircle": '\ue2be',
    "CloudDone": '\ue2bf',
    "CloudDownload": '\ue2c0',
    "CloudOff": '\ue2c1',
    "CloudQueue": '\uf15c',
    "CloudSync": '\ueb5a',
    "CloudUpload": '\ue2c3',
    "Cloudy": '\uf15c',
    "CloudyFilled": '\uf15c',
    "CloudySnowing": '\ue810',
    "Co2": '\ue7b0',
    "CoPresent": '\ueaf0',
    "Code": '\ue86f',
    "CodeBlocks": '\uf84d',
    "CodeOff": '\ue4f3',
    "Coffee": '\uefef',
    "CoffeeMaker": '\ueff0',
    "Cognition": '\ue09f',
    "CollapseAll": '\ue944',
    "Collections": '\ue3d3',
    "CollectionsBookmark": '\ue431',
    "ColorLens": '\ue40a',
    "Colorize": '\ue3b8',
    "Colors": '\ue997',
    "ComicBubble": '\uf5dd',
    "Comment": '\ue24c',
    "CommentBank": '\uea4e',
    "CommentsDisabled": '\ue7a2',
    "Commit": '\ueaf5',
    "Communication": '\ue27c',
    "Communities": '\ueb16',
    "CommunitiesFilled": '\ueb16',
    "Commute": '\ue940',
    "Compare": '\ue3b9',
    "CompareArrows": '\ue915',
    "CompassCalibration": '\ue57c',
    "ComponentExchange": '\uf1e7',
    "Compost": '\ue761',
    "Compress": '\ue94d',
    "Computer": '\ue31e',
    "Concierge": '\uf561',
    "Conditions": '\ue0a0',
    "ConfirmationNumber": '\ue638',
    "Congenital": '\ue0a1',
    "ConnectWithoutContact": '\uf223',
    "ConnectedTv": '\ue998',
    "ConnectingAirports": '\ue7c9',
    "Construction": '\uea3c',
    "ContactEmergency": '\uf8d1',
    "ContactMail": '\ue0d0',
    "ContactPage": '\uf22e',
    "ContactPhone": '\uf0c0',
    "ContactPhoneFilled": '\uf0c0',
    "ContactSupport": '\ue94c',
    "Contactless": '\uea71',
    "ContactlessOff": '\uf858',
    "Contacts": '\ue0ba',
    "ContentCopy": '\ue14d',
    "ContentCut": '\ue14e',
    "ContentPaste": '\ue14f',
    "ContentPasteGo": '\uea8e',
    "ContentPasteOff": '\ue4f8',
    "ContentPasteSearch": '\uea9b',
    "Contract": '\uf5a0',
    "ContractDelete": '\uf5a2',
    "ContractEdit": '\uf5a1',
    "Contrast": '\ueb37',
    "ContrastRtlOff": '\uec72',
    "ControlCamera": '\ue074',
    "ControlPoint": '\ue3ba',
    "ControlPointDuplicate": '\ue3bb',
    "ControllerGen": '\ue83d',
    "ConversionPath": '\uf0c1',
    "ConversionPathOff": '\uf7b4',
    "ConveyorBelt": '\uf867',
    "Cookie": '\ueaac',
    "CookieOff": '\uf79a',
    "Cooking": '\ue2b6',
    "CoolToDry": '\ue276',
    "CopyAll": '\ue2ec',
    "Copyright": '\ue90c',
    "Coronavirus": '\uf221',
    "CorporateFare": '\uf1d0',
    "Cottage": '\ue587',
    "Counter0": '\uf785',
    "Counter1": '\uf784',
    "Counter2": '\uf783',
    "Counter3": '\uf782',
    "Counter4": '\uf781',
    "Counter5": '\uf780',
    "Counter6": '\uf77f',
    "Counter7": '\uf77e',
    "Counter8": '\uf77d',
    "Counter9": '\uf77c',
    "Countertops": '\uf1f7',
    "Create": '\uf097',
    "CreateNewFolder": '\ue2cc',
    "CreditCard": '\ue8a1',
    "CreditCardOff": '\ue4f4',
    "CreditScore": '\ueff1',
    "Crib": '\ue588',
    "CrisisAlert": '\uebe9',
    "Crop": '\ue3be',
    "Crop169": '\ue3bc',
    "Crop32": '\ue3bd',
    "Crop54": '\ue3bf',
    "Crop75": '\ue3c0',
    "Crop916": '\uf549',
    "CropDin": '\ue3c6',
    "CropFree": '\ue3c2',
    "CropLandscape": '\ue3c3',
    "CropOriginal": '\ue3f4',
    "CropPortrait": '\ue3c5',
    "CropRotate": '\ue437',
    "CropSquare": '\ue3c6',
    "Crossword": '\uf5e5',
    "Crowdsource": '\ueb18',
    "CrueltyFree": '\ue799',
    "Css": '\ueb93',
    "Csv": '\ue6cf',
    "CurrencyBitcoin": '\uebc5',
    "CurrencyExchange": '\ueb70',
    "CurrencyFranc": '\ueafa',
    "CurrencyLira": '\ueaef',
    "CurrencyPound": '\ueaf1',
    "CurrencyRuble": '\ueaec',
    "CurrencyRupee": '\ueaf7',
    "CurrencyYen": '\ueafb',
    "CurrencyYuan": '\ueaf9',
    "Curtains": '\uec1e',
    "CurtainsClosed": '\uec1d',
    "CustomTypography": '\ue732',
    "Cut": '\uf08b',
    "Cycle": '\uf854',
    "Cyclone": '\uebd5',
    "Dangerous": '\ue99a',
    "DarkMode": '\ue51c',
    "Dashboard": '\ue871',
    "DashboardCustomize": '\ue99b',
    "DataAlert": '\uf7f6',
    "DataArray": '\uead1',
    "DataCheck": '\uf7f2',
    "DataExploration": '\ue76f',
    "DataInfoAlert": '\uf7f5',
    "DataLossPrevention": '\ue2dc',
    "DataObject": '\uead3',
    "DataSaverOff": '\ueff2',
    "DataSaverOn": '\ueff3',
    "DataTable": '\ue99c',
    "DataThresholding": '\ueb9f',
    "DataUsage": '\ueff2',
    "Database": '\uf20e',
    "Dataset": '\uf8ee',
    "DatasetLinked": '\uf8ef',
    "DateRange": '\ue916',
    "Deblur": '\ueb77',
    "Deceased": '\ue0a5',
    "DecimalDecrease": '\uf82d',
    "DecimalIncrease": '\uf82c',
    "Deck": '\uea42',
    "Dehaze": '\ue3c7',
    "Delete": '\ue92e',
    "DeleteForever": '\ue92b',
    "DeleteOutline": '\ue92e',
    "DeleteSweep": '\ue16c',
    "Demography": '\ue489',
    "DensityLarge": '\ueba9',
    "DensityMedium": '\ueb9e',
    "DensitySmall": '\ueba8',
    "Dentistry": '\ue0a6',
    "DepartureBoard": '\ue576',
    "DeployedCode": '\uf720',
    "DeployedCodeAlert": '\uf5f2',
    "DeployedCodeHistory": '\uf5f3',
    "DeployedCodeUpdate": '\uf5f4',
    "Dermatology": '\ue0a7',
    "Description": '\ue873',
    "Deselect": '\uebb6',
    "DesignServices": '\uf10a',
    "Desk": '\uf8f4',
    "Deskphone": '\uf7fa',
    "DesktopAccessDisabled": '\ue99d',
    "DesktopMac": '\ue30b',
    "DesktopWindows": '\ue30c',
    "Destruction": '\uf585',
    "Details": '\ue3c8',
    "DetectionAndZone": '\ue29f',
    "Detector": '\ue282',
    "DetectorAlarm": '\ue1f7',
    "DetectorBattery": '\ue204',
    "DetectorCo": '\ue2af',
    "DetectorOffline": '\ue223',
    "DetectorSmoke": '\ue285',
    "DetectorStatus": '\ue1e8',
    "DeveloperBoard": '\ue30d',
    "DeveloperBoardOff": '\ue4ff',
    "DeveloperGuide": '\ue99e',
    "DeveloperMode": '\ue1b0',
    "DeveloperModeTv": '\ue874',
    "DeviceHub": '\ue335',
    "DeviceReset": '\ue8b3',
    "DeviceThermostat": '\ue1ff',
    "DeviceUnknown": '\ue339',
    "Devices": '\ue326',
    "DevicesFold": '\uebde',
    "DevicesOff": '\uf7a5',
    "DevicesOther": '\ue337',
    "DevicesWearables": '\uf6ab',
    "DewPoint": '\uf879',
    "Diagnosis": '\ue0a8',
    "DialerSip": '\ue0bb',
    "Dialogs": '\ue99f',
    "Dialpad": '\ue0bc',
    "Diamond": '\uead5',
    "Difference": '\ueb7d',
    "DigitalOutOfHome": '\uf1de',
    "Dining": '\ueff4',
    "DinnerDining": '\uea57',
    "Directions": '\ue52e',
    "DirectionsAlt": '\uf880',
    "DirectionsAltOff": '\uf881',
    "DirectionsBike": '\ue52f',
    "DirectionsBoat": '\ueff5',
    "DirectionsBoatFilled": '\ueff5',
    "DirectionsBus": '\ueff6',
    "DirectionsBusFilled": '\ueff6',
    "DirectionsCar": '\ueff7',
    "DirectionsCarFilled": '\ueff7',
    "DirectionsOff": '\uf10f',
    "DirectionsRailway": '\ueff8',
    "DirectionsRailwayFilled": '\ueff8',
    "DirectionsRun": '\ue566',
    "DirectionsSubway": '\ueffa',
    "DirectionsSubwayFilled": '\ueffa',
    "DirectionsTransit": '\ueffa',
    "DirectionsTransitFilled": '\ueffa',
    "DirectionsWalk": '\ue536',
    "DirectorySync": '\ue394',
    "DirtyLens": '\uef4b',
    "DisabledByDefault": '\uf230',
    "DisabledVisible": '\ue76e',
    "DiscFull": '\ue610',
    "DiscoverTune": '\ue018',
    "DishwasherGen": '\ue832',
    "DisplayExternalInput": '\uf7e7',
    "DisplaySettings": '\ueb97',
    "Distance": '\uf6ea',
    "Diversity1": '\uf8d7',
    "Diversity2": '\uf8d8',
    "Diversity3": '\uf8d9',
    "Diversity4": '\uf857',
    "Dns": '\ue875',
    "DoDisturb": '\uf08c',
    "DoDisturbAlt": '\uf08d',
    "DoDisturbOff": '\uf08e',
    "DoDisturbOn": '\uf08f',
    "DoNotDisturb": '\uf08d',
    "DoNotDisturbAlt": '\uf08c',
    "DoNotDisturbOff": '\uf08e',
    "DoNotDisturbOn": '\uf08f',
    "DoNotDisturbOnTotalSilence": '\ueffb',
    "DoNotStep": '\uf19f',
    "DoNotTouch": '\uf1b0',
    "Dock": '\ue30e',
    "DockToBottom": '\uf7e6',
    "DockToLeft": '\uf7e5',
    "DockToRight": '\uf7e4',
    "DocsAddOn": '\uf0c2',
    "DocsAppsScript": '\uf0c3',
    "DocumentScanner": '\ue5fa',
    "Domain": '\ue7ee',
    "DomainAdd": '\ueb62',
    "DomainDisabled": '\ue0ef',
    "DomainVerification": '\uef4c',
    "DomainVerificationOff": '\uf7b0',
    "DominoMask": '\uf5e4',
    "Done": '\ue876',
    "DoneAll": '\ue877',
    "DoneOutline": '\ue92f',
    "DonutLarge": '\ue917',
    "DonutSmall": '\ue918',
    "DoorBack": '\ueffc',
    "DoorFront": '\ueffd',
    "DoorOpen": '\ue77c',
    "DoorSensor": '\ue28a',
    "DoorSliding": '\ueffe',
    "Doorbell": '\uefff',
    "Doorbell3p": '\ue1e7',
    "DoorbellChime": '\ue1f3',
    "DoubleArrow": '\uea50',
    "DownhillSkiing": '\ue509',
    "Download": '\uf090',
    "DownloadDone": '\uf091',
    "DownloadForOffline": '\uf000',
    "Downloading": '\uf001',
    "Draft": '\ue66d',
    "DraftOrders": '\ue7b3',
    "Drafts": '\ue151',
    "DragClick": '\uf71f',
    "DragHandle": '\ue25d',
    "DragIndicator": '\ue945',
    "DragPan": '\uf71e',
    "Draw": '\ue746',
    "DrawAbstract": '\uf7f8',
    "DrawCollage": '\uf7f7',
    "Dresser": '\ue210',
    "DriveEta": '\ueff7',
    "DriveFileMove": '\ue9a1',
    "DriveFileMoveOutline": '\ue9a1',
    "DriveFileMoveRtl": '\ue9a1',
    "DriveFileRenameOutline": '\ue9a2',
    "DriveFolderUpload": '\ue9a3',
    "DriveFusiontable": '\ue678',
    "Dropdown": '\ue9a4',
    "Dry": '\uf1b3',
    "DryCleaning": '\uea58',
    "DualScreen": '\uf6cf',
    "Duo": '\ue9a5',
    "Dvr": '\ue1b2',
    "DynamicFeed": '\uea14',
    "DynamicForm": '\uf1bf',
    "E911Avatar": '\uf11a',
    "E911Emergency": '\uf119',
    "EMobiledata": '\uf002',
    "EMobiledataBadge": '\uf7e3',
    "Earbuds": '\uf003',
    "EarbudsBattery": '\uf004',
    "EarlyOn": '\ue2ba',
    "Earthquake": '\uf64f',
    "East": '\uf1df',
    "Ecg": '\uf80f',
    "EcgHeart": '\uf6e9',
    "Eco": '\uea35',
    "Eda": '\uf6e8',
    "EdgesensorHigh": '\uf005',
    "EdgesensorLow": '\uf006',
    "Edit": '\uf097',
    "EditAttributes": '\ue578',
    "EditCalendar": '\ue742',
    "EditDocument": '\uf88c',
    "EditLocation": '\ue568',
    "EditLocationAlt": '\ue1c5',
    "EditNote": '\ue745',
    "EditNotifications": '\ue525',
    "EditOff": '\ue950',
    "EditRoad": '\uef4d',
    "EditSquare": '\uf88d',
    "Egg": '\ueacc',
    "EggAlt": '\ueac8',
    "Eject": '\ue8fb',
    "Elderly": '\uf21a',
    "ElderlyWoman": '\ueb69',
    "ElectricBike": '\ueb1b',
    "ElectricBolt": '\uec1c',
    "ElectricCar": '\ueb1c',
    "ElectricMeter": '\uec1b',
    "ElectricMoped": '\ueb1d',
    "ElectricRickshaw": '\ueb1e',
    "ElectricScooter": '\ueb1f',
    "ElectricalServices": '\uf102',
    "Elevation": '\uf6e7',
    "Elevator": '\uf1a0',
    "Email": '\ue159',
    "Emergency": '\ue1eb',
    "EmergencyHeat": '\uf15d',
    "EmergencyHome": '\ue82a',
    "EmergencyRecording": '\uebf4',
    "EmergencyShare": '\uebf6',
    "EmergencyShareOff": '\uf59e',
    "EmojiEmotions": '\uea22',
    "EmojiEvents": '\uea23',
    "EmojiFlags": '\uf0c6',
    "EmojiFoodBeverage": '\uea1b',
    "EmojiNature": '\uea1c',
    "EmojiObjects": '\uea24',
    "EmojiPeople": '\uea1d',
    "EmojiSymbols": '\uea1e',
    "EmojiTransportation": '\uea1f',
    "Emoticon": '\ue5f3',
    "EmptyDashboard": '\uf844',
    "Enable": '\uf188',
    "Encrypted": '\ue593',
    "Endocrinology": '\ue0a9',
    "EnergyProgramSaving": '\uf15f',
    "EnergyProgramTimeUsed": '\uf161',
    "EnergySavingsLeaf": '\uec1a',
    "Engineering": '\uea3d',
    "EnhancedEncryption": '\ue63f',
    "Ent": '\ue0aa',
    "Equal": '\uf77b',
    "Equalizer": '\ue01d',
    "Error": '\uf8b6',
    "ErrorCircleRounded": '\uf8b6',
    "ErrorMed": '\ue49b',
    "ErrorOutline": '\uf8b6',
    "Escalator": '\uf1a1',
    "EscalatorWarning": '\uf1ac',
    "Euro": '\uea15',
    "EuroSymbol": '\ue926',
    "EvCharger": '\ue56d',
    "EvMobiledataBadge": '\uf7e2',
    "EvShadow": '\uef8f',
    "EvShadowAdd": '\uf580',
    "EvShadowMinus": '\uf57f',
    "EvStation": '\ue56d',
    "Event": '\ue878',
    "EventAvailable": '\ue614',
    "EventBusy": '\ue615',
    "EventList": '\uf683',
    "EventNote": '\ue616',
    "EventRepeat": '\ueb7b',
    "EventSeat": '\ue903',
    "EventUpcoming": '\uf238',
    "Exclamation": '\uf22f',
    "Exercise": '\uf6e6',
    "ExitToApp": '\ue879',
    "Expand": '\ue94f',
    "ExpandAll": '\ue946',
    "ExpandCircleDown": '\ue7cd',
    "ExpandCircleRight": '\uf591',
    "ExpandCircleUp": '\uf5d2',
    "ExpandContent": '\uf830',
    "ExpandLess": '\ue5ce',
    "ExpandMore": '\ue5cf',
    "Explicit": '\ue01e',
    "Explore": '\ue87a',
    "ExploreOff": '\ue9a8',
    "Explosion": '\uf685',
    "ExportNotes": '\ue0ac',
    "Exposure": '\ue3f6',
    "ExposureNeg1": '\ue3cb',
    "ExposureNeg2": '\ue3cc',
    "ExposurePlus1": '\ue800',
    "ExposurePlus2": '\ue3ce',
    "ExposureZero": '\ue3cf',
    "Extension": '\ue87b',
    "ExtensionOff": '\ue4f5',
    "Eyeglasses": '\uf6ee',
    "Face": '\uf008',
    "Face2": '\uf8da',
    "Face3": '\uf8db',
    "Face4": '\uf8dc',
    "Face5": '\uf8dd',
    "Face6": '\uf8de',
    "FaceRetouchingNatural": '\uef4e',
    "FaceRetouchingOff": '\uf007',
    "FaceUnlock": '\uf008',
    "FactCheck": '\uf0c5',
    "Factory": '\uebbc',
    "Falling": '\uf60d',
    "FamiliarFaceAndZone": '\ue21c',
    "FamilyHistory": '\ue0ad',
    "FamilyLink": '\ueb19',
    "FamilyRestroom": '\uf1a2',
    "FarsightDigital": '\uf559',
    "FastForward": '\ue01f',
    "FastRewind": '\ue020',
    "Fastfood": '\ue57a',
    "Faucet": '\ue278',
    "Favorite": '\ue87e',
    "FavoriteBorder": '\ue87e',
    "Fax": '\uead8',
    "FeatureSearch": '\ue9a9',
    "FeaturedPlayList": '\ue06d',
    "FeaturedVideo": '\ue06e',
    "Feed": '\uf009',
    "Feedback": '\ue87f',
    "Female": '\ue590',
    "Femur": '\uf891',
    "FemurAlt": '\uf892',
    "Fence": '\uf1f6',
    "Fertile": '\uf6e5',
    "Festival": '\uea68',
    "FiberDvr": '\ue05d',
    "FiberManualRecord": '\ue061',
    "FiberNew": '\ue05e',
    "FiberPin": '\ue06a',
    "FiberSmartRecord": '\ue062',
    "FileCopy": '\ue173',
    "FileDownload": '\uf090',
    "FileDownloadDone": '\uf091',
    "FileDownloadOff": '\ue4fe',
    "FileOpen": '\ueaf3',
    "FilePresent": '\uea0e',
    "FileUpload": '\uf09b',
    "FileUploadOff": '\uf886',
    "Filter": '\ue3d3',
    "Filter1": '\ue3d0',
    "Filter2": '\ue3d1',
    "Filter3": '\ue3d2',
    "Filter4": '\ue3d4',
    "Filter5": '\ue3d5',
    "Filter6": '\ue3d6',
    "Filter7": '\ue3d7',
    "Filter8": '\ue3d8',
    "Filter9": '\ue3d9',
    "Filter9Plus": '\ue3da',
    "FilterAlt": '\uef4f',
    "FilterAltOff": '\ueb32',
    "FilterBAndW": '\ue3db',
    "FilterCenterFocus": '\ue3dc',
    "FilterDrama": '\ue3dd',
    "FilterFrames": '\ue3de',
    "FilterHdr": '\ue3df',
    "FilterList": '\ue152',
    "FilterListAlt": '\ue94e',
    "FilterListOff": '\ueb57',
    "FilterNone": '\ue3e0',
    "FilterTiltShift": '\ue3e2',
    "FilterVintage": '\ue3e3',
    "Finance": '\ue6bf',
    "FinanceChip": '\uf84e',
    "FindInPage": '\ue880',
    "FindReplace": '\ue881',
    "Fingerprint": '\ue90d',
    "FireExtinguisher": '\uf1d8',
    "FireHydrant": '\uf1a3',
    "FireTruck": '\uf8f2',
    "Fireplace": '\uea43',
    "FirstPage": '\ue5dc',
    "FitPage": '\uf77a',
    "FitScreen": '\uea10',
    "FitWidth": '\uf779',
    "FitnessCenter": '\ueb43',
    "Flag": '\uf0c6',
    "FlagCircle": '\ueaf8',
    "FlagFilled": '\uf0c6',
    "Flaky": '\uef50',
    "Flare": '\ue3e4',
    "FlashAuto": '\ue3e5',
    "FlashOff": '\ue3e6',
    "FlashOn": '\ue3e7',
    "FlashlightOff": '\uf00a',
    "FlashlightOn": '\uf00b',
    "Flatware": '\uf00c',
    "FlexDirection": '\uf778',
    "FlexNoWrap": '\uf777',
    "FlexWrap": '\uf776',
    "Flight": '\ue539',
    "FlightClass": '\ue7cb',
    "FlightLand": '\ue904',
    "FlightTakeoff": '\ue905',
    "Flightsmode": '\uef93',
    "Flip": '\ue3e8',
    "FlipCameraAndroid": '\uea37',
    "FlipCameraIos": '\uea38',
    "FlipToBack": '\ue882',
    "FlipToFront": '\ue883',
    "Flood": '\uebe6',
    "Floor": '\uf6e4',
    "FloorLamp": '\ue21e',
    "Flourescent": '\uf07d',
    "Flowsheet": '\ue0ae',
    "Fluid": '\ue483',
    "FluidBalance": '\uf80d',
    "FluidMed": '\uf80c',
    "Fluorescent": '\uf07d',
    "Flutter": '\uf1dd',
    "FlutterDash": '\ue00b',
    "FmdBad": '\uf00e',
    "FmdGood": '\uf1db',
    "Foggy": '\ue818',
    "FoldedHands": '\uf5ed',
    "Folder": '\ue2c7',
    "FolderCopy": '\uebbd',
    "FolderData": '\uf586',
    "FolderDelete": '\ueb34',
    "FolderManaged": '\uf775',
    "FolderOff": '\ueb83',
    "FolderOpen": '\ue2c8',
    "FolderShared": '\ue2c9',
    "FolderSpecial": '\ue617',
    "FolderSupervised": '\uf774',
    "FolderZip": '\ueb2c',
    "FollowTheSigns": '\uf222',
    "FontDownload": '\ue167',
    "FontDownloadOff": '\ue4f9',
    "FoodBank": '\uf1f2',
    "FootBones": '\uf893',
    "Footprint": '\uf87d',
    "Forest": '\uea99',
    "ForkLeft": '\ueba0',
    "ForkRight": '\uebac',
    "Forklift": '\uf868',
    "FormatAlignCenter": '\ue234',
    "FormatAlignJustify": '\ue235',
    "FormatAlignLeft": '\ue236',
    "FormatAlignRight": '\ue237',
    "FormatBold": '\ue238',
    "FormatClear": '\ue239',
    "FormatColorFill": '\ue23a',
    "FormatColorReset": '\ue23b',
    "FormatColorText": '\ue23c',
    "FormatH1": '\uf85d',
    "FormatH2": '\uf85e',
    "FormatH3": '\uf85f',
    "FormatH4": '\uf860',
    "FormatH5": '\uf861',
    "FormatH6": '\uf862',
    "FormatImageLeft": '\uf863',
    "FormatImageRight": '\uf864',
    "FormatIndentDecrease": '\ue23d',
    "FormatIndentIncrease": '\ue23e',
    "FormatInkHighlighter": '\uf82b',
    "FormatItalic": '\ue23f',
    "FormatLetterSpacing": '\uf773',
    "FormatLetterSpacing2": '\uf618',
    "FormatLetterSpacingStandard": '\uf617',
    "FormatLetterSpacingWide": '\uf616',
    "FormatLetterSpacingWider": '\uf615',
    "FormatLineSpacing": '\ue240',
    "FormatListBulleted": '\ue241',
    "FormatListBulletedAdd": '\uf849',
    "FormatListNumbered": '\ue242',
    "FormatListNumberedRtl": '\ue267',
    "FormatOverline": '\ueb65',
    "FormatPaint": '\ue243',
    "FormatParagraph": '\uf865',
    "FormatQuote": '\ue244',
    "FormatShapes": '\ue25e',
    "FormatSize": '\ue245',
    "FormatStrikethrough": '\ue246',
    "FormatTextClip": '\uf82a',
    "FormatTextOverflow": '\uf829',
    "FormatTextWrap": '\uf828',
    "FormatTextdirectionLToR": '\ue247',
    "FormatTextdirectionRToL": '\ue248',
    "FormatUnderlined": '\ue249',
    "FormatUnderlinedSquiggle": '\uf885',
    "FormsAddOn": '\uf0c7',
    "FormsAppsScript": '\uf0c8',
    "Fort": '\ueaad',
    "Forum": '\ue8af',
    "Forward": '\uf57a',
    "Forward10": '\ue056',
    "Forward30": '\ue057',
    "Forward5": '\ue058',
    "ForwardCircle": '\uf6f5',
    "ForwardMedia": '\uf6f4',
    "ForwardToInbox": '\uf187',
    "Foundation": '\uf200',
    "FrameInspect": '\uf772',
    "FramePerson": '\uf8a6',
    "FramePersonOff": '\uf7d1',
    "FrameReload": '\uf771',
    "FrameSource": '\uf770',
    "FreeBreakfast": '\ueb44',
    "FreeCancellation": '\ue748',
    "FrontHand": '\ue769',
    "FrontLoader": '\uf869',
    "FullCoverage": '\ueb12',
    "FullHd": '\uf58b',
    "FullStackedBarChart": '\uf212',
    "Fullscreen": '\ue5d0',
    "FullscreenExit": '\ue5d1',
    "Function": '\uf866',
    "Functions": '\ue24a',
    "GMobiledata": '\uf010',
    "GMobiledataBadge": '\uf7e1',
    "GTranslate": '\ue927',
    "GalleryThumbnail": '\uf86f',
    "Gamepad": '\ue30f',
    "Games": '\ue30f',
    "Garage": '\uf011',
    "GarageHome": '\ue82d',
    "GardenCart": '\uf8a9',
    "GasMeter": '\uec19',
    "Gastroenterology": '\ue0f1',
    "Gate": '\ue277',
    "Gavel": '\ue90e',
    "GeneratingTokens": '\ue749',
    "Genetics": '\ue0f3',
    "Genres": '\ue6ee',
    "Gesture": '\ue155',
    "GestureSelect": '\uf657',
    "GetApp": '\uf090',
    "Gif": '\ue908',
    "GifBox": '\ue7a3',
    "Girl": '\ueb68',
    "Gite": '\ue58b',
    "GlassCup": '\uf6e3',
    "Globe": '\ue64c',
    "GlobeAsia": '\uf799',
    "GlobeUk": '\uf798',
    "Glucose": '\ue4a0',
    "Glyphs": '\uf8a3',
    "GoToLine": '\uf71d',
    "GolfCourse": '\ueb45',
    "GooglePlusReshare": '\uf57a',
    "GoogleTvRemote": '\uf5db',
    "GoogleWifi": '\uf579',
    "GppBad": '\uf012',
    "GppGood": '\uf013',
    "GppMaybe": '\uf014',
    "GpsFixed": '\ue55c',
    "GpsNotFixed": '\ue1b7',
    "GpsOff": '\ue1b6',
    "Grade": '\ue885',
    "Gradient": '\ue3e9',
    "Grading": '\uea4f',
    "Grain": '\ue3ea',
    "GraphicEq": '\ue1b8',
    "Grass": '\uf205',
    "Grid3x3": '\uf015',
    "Grid3x3Off": '\uf67c',
    "Grid4x4": '\uf016',
    "GridGoldenratio": '\uf017',
    "GridGuides": '\uf76f',
    "GridOff": '\ue3eb',
    "GridOn": '\ue3ec',
    "GridView": '\ue9b0',
    "Group": '\uea21',
    "GroupAdd": '\ue7f0',
    "GroupAuto": '\uf551',
    "GroupOff": '\ue747',
    "GroupRemove": '\ue7ad',
    "GroupWork": '\ue886',
    "GroupedBarChart": '\uf211',
    "Groups": '\uf233',
    "Groups2": '\uf8df',
    "Groups3": '\uf8e0',
    "Gynecology": '\ue0f4',
    "HMobiledata": '\uf018',
    "HMobiledataBadge": '\uf7e0',
    "HPlusMobiledata": '\uf019',
    "HPlusMobiledataBadge": '\uf7df',
    "Hail": '\ue9b1',
    "Hallway": '\ue6f8',
    "HandBones": '\uf894',
    "HandGesture": '\uef9c',
    "Handshake": '\uebcb',
    "Handyman": '\uf10b',
    "HangoutVideo": '\ue0c1',
    "HangoutVideoOff": '\ue0c2',
    "HardDrive": '\uf80e',
    "HardDrive2": '\uf7a4',
    "Hardware": '\uea59',
    "Hd": '\ue052',
    "HdrAuto": '\uf01a',
    "HdrAutoSelect": '\uf01b',
    "HdrEnhancedSelect": '\uef51',
    "HdrOff": '\ue3ed',
    "HdrOffSelect": '\uf01c',
    "HdrOn": '\ue3ee',
    "HdrOnSelect": '\uf01d',
    "HdrPlus": '\uf01e',
    "HdrStrong": '\ue3f1',
    "HdrWeak": '\ue3f2',
    "Headphones": '\uf01f',
    "HeadphonesBattery": '\uf020',
    "Headset": '\uf01f',
    "HeadsetMic": '\ue311',
    "HeadsetOff": '\ue33a',
    "Healing": '\ue3f3',
    "HealthAndSafety": '\ue1d5',
    "HealthMetrics": '\uf6e2',
    "HeapSnapshotLarge": '\uf76e',
    "HeapSnapshotMultiple": '\uf76d',
    "HeapSnapshotThumbnail": '\uf76c',
    "Hearing": '\ue023',
    "HearingDisabled": '\uf104',
    "HeartBroken": '\ueac2',
    "HeartCheck": '\uf60a',
    "HeartMinus": '\uf883',
    "HeartPlus": '\uf884',
    "HeatPump": '\uec18',
    "HeatPumpBalance": '\ue27e',
    "Height": '\uea16',
    "Helicopter": '\uf60c',
    "Help": '\ue8fd',
    "HelpCenter": '\uf1c0',
    "HelpClinic": '\uf810',
    "HelpOutline": '\ue8fd',
    "Hematology": '\ue0f6',
    "Hevc": '\uf021',
    "Hexagon": '\ueb39',
    "Hide": '\uef9e',
    "HideImage": '\uf022',
    "HideSource": '\uf023',
    "HighDensity": '\uf79c',
    "HighQuality": '\ue024',
    "HighRes": '\uf54b',
    "Highlight": '\ue25f',
    "HighlightOff": '\ue888',
    "HighlighterSize1": '\uf76b',
    "HighlighterSize2": '\uf76a',
    "HighlighterSize3": '\uf769',
    "HighlighterSize4": '\uf768',
    "HighlighterSize5": '\uf767',
    "Hiking": '\ue50a',
    "History": '\ue8b3',
    "HistoryEdu": '\uea3e',
    "HistoryToggleOff": '\uf17d',
    "Hive": '\ueaa6',
    "Hls": '\ueb8a',
    "HlsOff": '\ueb8c',
    "HolidayVillage": '\ue58a',
    "Home": '\ue9b2',
    "HomeAppLogo": '\ue295',
    "HomeFilled": '\ue9b2',
    "HomeHealth": '\ue4b9',
    "HomeIotDevice": '\ue283',
    "HomeMax": '\uf024',
    "HomeMaxDots": '\ue849',
    "HomeMini": '\uf025',
    "HomePin": '\uf14d',
    "HomeRepairService": '\uf100',
    "HomeSpeaker": '\uf11c',
    "HomeStorage": '\uf86c',
    "HomeWork": '\uf030',
    "HorizontalDistribute": '\ue014',
    "HorizontalRule": '\uf108',
    "HorizontalSplit": '\ue947',
    "HotTub": '\ueb46',
    "Hotel": '\ue549',
    "HotelClass": '\ue743',
    "Hourglass": '\uebff',
    "HourglassBottom": '\uea5c',
    "HourglassDisabled": '\uef53',
    "HourglassEmpty": '\ue88b',
    "HourglassFull": '\ue88c',
    "HourglassTop": '\uea5b',
    "House": '\uea44',
    "HouseSiding": '\uf202',
    "HouseWithShield": '\ue786',
    "Houseboat": '\ue584',
    "HowToReg": '\ue174',
    "HowToVote": '\ue175',
    "HrResting": '\uf6ba',
    "Html": '\ueb7e',
    "Http": '\ue902',
    "Https": '\ue899',
    "Hub": '\ue9f4',
    "Humerus": '\uf895',
    "HumerusAlt": '\uf896',
    "HumidityHelper": '\uf55f',
    "HumidityHigh": '\uf163',
    "HumidityIndoor": '\uf558',
    "HumidityLow": '\uf164',
    "HumidityMid": '\uf165',
    "HumidityPercentage": '\uf87e',
    "Hvac": '\uf10e',
    "IceSkating": '\ue50b',
    "Icecream": '\uea69',
    "Ifl": '\ue025',
    "Iframe": '\uf71b',
    "IframeOff": '\uf71c',
    "Image": '\ue3f4',
    "ImageAspectRatio": '\ue3f5',
    "ImageNotSupported": '\uf116',
    "ImageSearch": '\ue43f',
    "ImagesearchRoller": '\ue9b4',
    "Imagesmode": '\uefa2',
    "Immunology": '\ue0fb',
    "ImportContacts": '\ue0e0',
    "ImportExport": '\ue8d5',
    "ImportantDevices": '\ue912',
    "InHomeMode": '\ue833',
    "InactiveOrder": '\ue0fc',
    "Inbox": '\ue156',
    "InboxCustomize": '\uf859',
    "IncompleteCircle": '\ue79b',
    "IndeterminateCheckBox": '\ue909',
    "IndeterminateQuestionBox": '\uf56d',
    "Info": '\ue88e',
    "InfoI": '\uf59b',
    "Infrared": '\uf87c',
    "InkEraser": '\ue6d0',
    "InkEraserOff": '\ue7e3',
    "InkHighlighter": '\ue6d1',
    "InkMarker": '\ue6d2',
    "InkPen": '\ue6d3',
    "Inpatient": '\ue0fe',
    "Input": '\ue890',
    "InputCircle": '\uf71a',
    "InsertChart": '\uf0cc',
    "InsertChartFilled": '\uf0cc',
    "InsertChartOutlined": '\uf0cc',
    "InsertComment": '\ue24c',
    "InsertDriveFile": '\ue66d',
    "InsertEmoticon": '\uea22',
    "InsertInvitation": '\ue878',
    "InsertLink": '\ue250',
    "InsertPageBreak": '\ueaca',
    "InsertPhoto": '\ue3f4',
    "InsertText": '\uf827',
    "Insights": '\uf092',
    "InstallDesktop": '\ueb71',
    "InstallMobile": '\ueb72',
    "InstantMix": '\ue026',
    "IntegrationInstructions": '\uef54',
    "InteractiveSpace": '\uf7ff',
    "Interests": '\ue7c8',
    "InterpreterMode": '\ue83b',
    "Inventory": '\ue179',
    "Inventory2": '\ue1a1',
    "InvertColors": '\ue891',
    "InvertColorsOff": '\ue0c4',
    "IosShare": '\ue6b8',
    "Iron": '\ue583',
    "Iso": '\ue3f6',
    "JamboardKiosk": '\ue9b5',
    "Javascript": '\ueb7c',
    "Join": '\uf84f',
    "JoinFull": '\uf84f',
    "JoinInner": '\ueaf4',
    "JoinLeft": '\ueaf2',
    "JoinRight": '\ueaea',
    "Joystick": '\uf5ee',
    "JumpToElement": '\uf719',
    "Kayaking": '\ue50c',
    "KebabDining": '\ue842',
    "KeepPublic": '\uf56f',
    "Kettle": '\ue2b9',
    "Key": '\ue73c',
    "KeyOff": '\ueb84',
    "KeyVisualizer": '\uf199',
    "Keyboard": '\ue312',
    "KeyboardAlt": '\uf028',
    "KeyboardArrowDown": '\ue313',
    "KeyboardArrowLeft": '\ue314',
    "KeyboardArrowRight": '\ue315',
    "KeyboardArrowUp": '\ue316',
    "KeyboardBackspace": '\ue317',
    "KeyboardCapslock": '\ue318',
    "KeyboardCapslockBadge": '\uf7de',
    "KeyboardCommandKey": '\ueae7',
    "KeyboardControlKey": '\ueae6',
    "KeyboardDoubleArrowDown": '\uead0',
    "KeyboardDoubleArrowLeft": '\ueac3',
    "KeyboardDoubleArrowRight": '\ueac9',
    "KeyboardDoubleArrowUp": '\ueacf',
    "KeyboardExternalInput": '\uf7dd',
    "KeyboardFull": '\uf7dc',
    "KeyboardHide": '\ue31a',
    "KeyboardKeys": '\uf67b',
    "KeyboardOff": '\uf67a',
    "KeyboardOnscreen": '\uf7db',
    "KeyboardOptionKey": '\ueae8',
    "KeyboardPreviousLanguage": '\uf7da',
    "KeyboardReturn": '\ue31b',
    "KeyboardTab": '\ue31c',
    "KeyboardTabRtl": '\uec73',
    "KeyboardVoice": '\ue31d',
    "KingBed": '\uea45',
    "Kitchen": '\ueb47',
    "Kitesurfing": '\ue50d',
    "LabPanel": '\ue103',
    "LabProfile": '\ue104',
    "LabResearch": '\uf80b',
    "Label": '\ue893',
    "LabelImportant": '\ue948',
    "LabelImportantOutline": '\ue948',
    "LabelOff": '\ue9b6',
    "LabelOutline": '\ue893',
    "Labs": '\ue105',
    "Lan": '\ueb2f',
    "Landscape": '\ue564',
    "Landslide": '\uebd7',
    "Language": '\ue894',
    "LanguageChineseArray": '\uf766',
    "LanguageChineseCangjie": '\uf765',
    "LanguageChineseDayi": '\uf764',
    "LanguageChinesePinyin": '\uf763',
    "LanguageChineseQuick": '\uf762',
    "LanguageChineseWubi": '\uf761',
    "LanguageFrench": '\uf760',
    "LanguageGbEnglish": '\uf75f',
    "LanguageInternational": '\uf75e',
    "LanguageKoreanLatin": '\uf75d',
    "LanguagePinyin": '\uf75c',
    "LanguageSpanish": '\uf5e9',
    "LanguageUs": '\uf759',
    "LanguageUsColemak": '\uf75b',
    "LanguageUsDvorak": '\uf75a',
    "Laps": '\uf6b9',
    "Laptop": '\ue31e',
    "LaptopChromebook": '\ue31f',
    "LaptopMac": '\ue320',
    "LaptopWindows": '\ue321',
    "LassoSelect": '\ueb03',
    "LastPage": '\ue5dd',
    "Launch": '\ue89e',
    "Laundry": '\ue2a8',
    "Layers": '\ue53b',
    "LayersClear": '\ue53c',
    "Lda": '\ue106',
    "Leaderboard": '\uf20c',
    "LeafSpark": '\uf55e',
    "LeakAdd": '\ue3f8',
    "LeakRemove": '\ue3f9',
    "LeftClick": '\uf718',
    "LeftPanelClose": '\uf717',
    "LeftPanelOpen": '\uf716',
    "LegendToggle": '\uf11b',
    "Lens": '\ue3fa',
    "LensBlur": '\uf029',
    "LetterSwitch": '\uf758',
    "LibraryAdd": '\ue03c',
    "LibraryAddCheck": '\ue9b7',
    "LibraryBooks": '\ue02f',
    "LibraryMusic": '\ue030',
    "LiftToTalk": '\uefa3',
    "Light": '\uf02a',
    "LightGroup": '\ue28b',
    "LightMode": '\ue518',
    "Lightbulb": '\ue90f',
    "LightbulbCircle": '\uebfe',
    "LightbulbOutline": '\ue90f',
    "LineAxis": '\uea9a',
    "LineCurve": '\uf757',
    "LineEnd": '\uf826',
    "LineEndArrow": '\uf81d',
    "LineEndArrowNotch": '\uf81c',
    "LineEndCircle": '\uf81b',
    "LineEndDiamond": '\uf81a',
    "LineEndSquare": '\uf819',
    "LineStart": '\uf825',
    "LineStartArrow": '\uf818',
    "LineStartArrowNotch": '\uf817',
    "LineStartCircle": '\uf816',
    "LineStartDiamond": '\uf815',
    "LineStartSquare": '\uf814',
    "LineStyle": '\ue919',
    "LineWeight": '\ue91a',
    "LinearScale": '\ue260',
    "Link": '\ue250',
    "LinkOff": '\ue16f',
    "LinkedCamera": '\ue438',
    "Liquor": '\uea60',
    "List": '\ue896',
    "ListAlt": '\ue0ee',
    "ListAltAdd": '\uf756',
    "Lists": '\ue9b9',
    "LiveHelp": '\ue0c6',
    "LiveTv": '\ue63a',
    "Living": '\uf02b',
    "LocalActivity": '\ue553',
    "LocalAirport": '\ue53d',
    "LocalAtm": '\ue53e',
    "LocalBar": '\ue540',
    "LocalCafe": '\ueb44',
    "LocalCarWash": '\ue542',
    "LocalConvenienceStore": '\ue543',
    "LocalDining": '\ue561',
    "LocalDrink": '\ue544',
    "LocalFireDepartment": '\uef55',
    "LocalFlorist": '\ue545',
    "LocalGasStation": '\ue546',
    "LocalGroceryStore": '\ue8cc',
    "LocalHospital": '\ue548',
    "LocalHotel": '\ue549',
    "LocalLaundryService": '\ue54a',
    "LocalLibrary": '\ue54b',
    "LocalMall": '\ue54c',
    "LocalMovies": '\ue8da',
    "LocalOffer": '\uf05b',
    "LocalParking": '\ue54f',
    "LocalPharmacy": '\ue550',
    "LocalPhone": '\uf0d4',
    "LocalPizza": '\ue552',
    "LocalPlay": '\ue553',
    "LocalPolice": '\uef56',
    "LocalPostOffice": '\ue554',
    "LocalPrintshop": '\ue8ad',
    "LocalSee": '\ue557',
    "LocalShipping": '\ue558',
    "LocalTaxi": '\ue559',
    "LocationAutomation": '\uf14f',
    "LocationAway": '\uf150',
    "LocationChip": '\uf850',
    "LocationCity": '\ue7f1',
    "LocationDisabled": '\ue1b6',
    "LocationHome": '\uf152',
    "LocationOff": '\ue0c7',
    "LocationOn": '\uf1db',
    "LocationPin": '\uf1db',
    "LocationSearching": '\ue1b7',
    "LocatorTag": '\uf8c1',
    "Lock": '\ue899',
    "LockClock": '\uef57',
    "LockOpen": '\ue898',
    "LockOpenRight": '\uf656',
    "LockOutline": '\ue899',
    "LockPerson": '\uf8f3',
    "LockReset": '\ueade',
    "Login": '\uea77',
    "LogoDev": '\uead6',
    "Logout": '\ue9ba',
    "Looks": '\ue3fc',
    "Looks3": '\ue3fb',
    "Looks4": '\ue3fd',
    "Looks5": '\ue3fe',
    "Looks6": '\ue3ff',
    "LooksOne": '\ue400',
    "LooksTwo": '\ue401',
    "Loop": '\ue863',
    "Loupe": '\ue402',
    "LowDensity": '\uf79b',
    "LowPriority": '\ue16d',
    "Loyalty": '\ue89a',
    "LteMobiledata": '\uf02c',
    "LteMobiledataBadge": '\uf7d9',
    "LtePlusMobiledata": '\uf02d',
    "LtePlusMobiledataBadge": '\uf7d8',
    "Luggage": '\uf235',
    "LunchDining": '\uea61',
    "Lyrics": '\uec0b',
    "MacroAuto": '\uf6f2',
    "MacroOff": '\uf8d2',
    "MagicButton": '\uf136',
    "MagicExchange": '\uf7f4',
    "MagicTether": '\uf7d7',
    "MagnificationLarge": '\uf83d',
    "MagnificationSmall": '\uf83c',
    "MagnifyDocked": '\uf7d6',
    "MagnifyFullscreen": '\uf7d5',
    "Mail": '\ue159',
    "MailLock": '\uec0a',
    "MailOutline": '\ue159',
    "Male": '\ue58e',
    "Man": '\ue4eb',
    "Man2": '\uf8e1',
    "Man3": '\uf8e2',
    "Man4": '\uf8e3',
    "ManageAccounts": '\uf02e',
    "ManageHistory": '\uebe7',
    "ManageSearch": '\uf02f',
    "Manga": '\uf5e3',
    "Map": '\ue55b',
    "MapsHomeWork": '\uf030',
    "MapsUgc": '\uef58',
    "Margin": '\ue9bb',
    "MarkAsUnread": '\ue9bc',
    "MarkChatRead": '\uf18b',
    "MarkChatUnread": '\uf189',
    "MarkEmailRead": '\uf18c',
    "MarkEmailUnread": '\uf18a',
    "MarkUnreadChatAlt": '\ueb9d',
    "Markdown": '\uf552',
    "MarkdownCopy": '\uf553',
    "MarkdownPaste": '\uf554',
    "Markunread": '\ue159',
    "MarkunreadMailbox": '\ue89b',
    "MaskedTransitions": '\ue72e',
    "Masks": '\uf218',
    "MatchCase": '\uf6f1',
    "MatchWord": '\uf6f0',
    "Matter": '\ue907',
    "Maximize": '\ue930',
    "MeasuringTape": '\uf6af',
    "MediaBluetoothOff": '\uf031',
    "MediaBluetoothOn": '\uf032',
    "MediaLink": '\uf83f',
    "Mediation": '\uefa7',
    "MedicalInformation": '\uebed',
    "MedicalMask": '\uf80a',
    "MedicalServices": '\uf109',
    "Medication": '\uf033',
    "MedicationLiquid": '\uea87',
    "MeetingRoom": '\ueb4f',
    "Memory": '\ue322',
    "MemoryAlt": '\uf7a3',
    "MenstrualHealth": '\uf6e1',
    "Menu": '\ue5d2',
    "MenuBook": '\uea19',
    "MenuOpen": '\ue9bd',
    "Merge": '\ueb98',
    "MergeType": '\ue252',
    "Message": '\ue0c9',
    "Metabolism": '\ue10b',
    "MfgNestYaleLock": '\uf11d',
    "Mic": '\ue31d',
    "MicDouble": '\uf5d1',
    "MicExternalOff": '\uef59',
    "MicExternalOn": '\uef5a',
    "MicNone": '\ue31d',
    "MicOff": '\ue02b',
    "Microbiology": '\ue10c',
    "Microwave": '\uf204',
    "MicrowaveGen": '\ue847',
    "MilitaryTech": '\uea3f',
    "Mimo": '\ue9be',
    "MimoDisconnect": '\ue9bf',
    "Mindfulness": '\uf6e0',
    "Minimize": '\ue931',
    "MinorCrash": '\uebf1',
    "MissedVideoCall": '\uf0ce',
    "MissedVideoCallFilled": '\uf0ce',
    "Mist": '\ue188',
    "MixtureMed": '\ue4c8',
    "Mms": '\ue618',
    "MobileFriendly": '\ue200',
    "MobileOff": '\ue201',
    "MobileScreenShare": '\ue0e7',
    "MobiledataOff": '\uf034',
    "Mode": '\uf097',
    "ModeComment": '\ue253',
    "ModeCool": '\uf166',
    "ModeCoolOff": '\uf167',
    "ModeDual": '\uf557',
    "ModeEdit": '\uf097',
    "ModeEditOutline": '\uf097',
    "ModeFan": '\uf168',
    "ModeFanOff": '\uec17',
    "ModeHeat": '\uf16a',
    "ModeHeatCool": '\uf16b',
    "ModeHeatOff": '\uf16d',
    "ModeNight": '\uf036',
    "ModeOfTravel": '\ue7ce',
    "ModeOffOn": '\uf16f',
    "ModeStandby": '\uf037',
    "ModelTraining": '\uf0cf',
    "MonetizationOn": '\ue263',
    "Money": '\ue57d',
    "MoneyOff": '\uf038',
    "MoneyOffCsred": '\uf038',
    "Monitor": '\uef5b',
    "MonitorHeart": '\ueaa2',
    "MonitorWeight": '\uf039',
    "MonitorWeightGain": '\uf6df',
    "MonitorWeightLoss": '\uf6de',
    "Monitoring": '\uf190',
    "MonochromePhotos": '\ue403',
    "Mood": '\uea22',
    "MoodBad": '\ue7f3',
    "Mop": '\ue28d',
    "More": '\ue619',
    "MoreDown": '\uf196',
    "MoreHoriz": '\ue5d3',
    "MoreTime": '\uea5d',
    "MoreUp": '\uf197',
    "MoreVert": '\ue5d4',
    "Mosque": '\ueab2',
    "MotionBlur": '\uf0d0',
    "MotionMode": '\uf842',
    "MotionPhotosAuto": '\uf03a',
    "MotionPhotosOff": '\ue9c0',
    "MotionPhotosOn": '\ue9c1',
    "MotionPhotosPause": '\uf227',
    "MotionPhotosPaused": '\uf227',
    "MotionSensorActive": '\ue792',
    "MotionSensorAlert": '\ue784',
    "MotionSensorIdle": '\ue783',
    "MotionSensorUrgent": '\ue78e',
    "Motorcycle": '\ue91b',
    "MountainFlag": '\uf5e2',
    "Mouse": '\ue323',
    "Move": '\ue740',
    "MoveDown": '\ueb61',
    "MoveGroup": '\uf715',
    "MoveItem": '\uf1ff',
    "MoveLocation": '\ue741',
    "MoveSelectionDown": '\uf714',
    "MoveSelectionLeft": '\uf713',
    "MoveSelectionRight": '\uf712',
    "MoveSelectionUp": '\uf711',
    "MoveToInbox": '\ue168',
    "MoveUp": '\ueb64',
    "MovedLocation": '\ue594',
    "Movie": '\ue404',
    "MovieCreation": '\ue404',
    "MovieEdit": '\uf840',
    "MovieFilter": '\ue43a',
    "MovieInfo": '\ue02d',
    "Moving": '\ue501',
    "MovingBeds": '\ue73d',
    "MovingMinistry": '\ue73e',
    "Mp": '\ue9c3',
    "Multicooker": '\ue293',
    "MultilineChart": '\ue6df',
    "MultipleStop": '\uf1b9',
    "Museum": '\uea36',
    "MusicNote": '\ue405',
    "MusicOff": '\ue440',
    "MusicVideo": '\ue063',
    "MyLocation": '\ue55c',
    "Mystery": '\uf5e1',
    "Nat": '\uef5c',
    "Nature": '\ue406',
    "NaturePeople": '\ue407',
    "NavigateBefore": '\ue408',
    "NavigateNext": '\ue409',
    "Navigation": '\ue55d',
    "NearMe": '\ue569',
    "NearMeDisabled": '\uf1ef',
    "Nearby": '\ue6b7',
    "NearbyError": '\uf03b',
    "NearbyOff": '\uf03c',
    "Nephrology": '\ue10d',
    "NestAudio": '\uebbf',
    "NestCamFloodlight": '\uf8b7',
    "NestCamIndoor": '\uf11e',
    "NestCamIq": '\uf11f',
    "NestCamIqOutdoor": '\uf120',
    "NestCamMagnetMount": '\uf8b8',
    "NestCamOutdoor": '\uf121',
    "NestCamStand": '\uf8b9',
    "NestCamWallMount": '\uf8ba',
    "NestCamWiredStand": '\uec16',
    "NestClockFarsightAnalog": '\uf8bb',
    "NestClockFarsightDigital": '\uf8bc',
    "NestConnect": '\uf122',
    "NestDetect": '\uf123',
    "NestDisplay": '\uf124',
    "NestDisplayMax": '\uf125',
    "NestDoorbellVisitor": '\uf8bd',
    "NestEcoLeaf": '\uf8be',
    "NestFarsightWeather": '\uf8bf',
    "NestFoundSavings": '\uf8c0',
    "NestGaleWifi": '\uf579',
    "NestHeatLinkE": '\uf126',
    "NestHeatLinkGen3": '\uf127',
    "NestHelloDoorbell": '\ue82c',
    "NestLocatorTag": '\uf8c1',
    "NestMini": '\ue789',
    "NestMultiRoom": '\uf8c2',
    "NestProtect": '\ue68e',
    "NestRemote": '\uf5db',
    "NestRemoteComfortSensor": '\uf12a',
    "NestSecureAlarm": '\uf12b',
    "NestSunblock": '\uf8c3',
    "NestTag": '\uf8c1',
    "NestThermostat": '\ue68f',
    "NestThermostatEEu": '\uf12d',
    "NestThermostatGen3": '\uf12e',
    "NestThermostatSensor": '\uf12f',
    "NestThermostatSensorEu": '\uf130',
    "NestThermostatZirconiumEu": '\uf131',
    "NestTrueRadiant": '\uf8c4',
    "NestWakeOnApproach": '\uf8c5',
    "NestWakeOnPress": '\uf8c6',
    "NestWifiGale": '\uf132',
    "NestWifiMistral": '\uf133',
    "NestWifiPoint": '\uf134',
    "NestWifiPointVento": '\uf134',
    "NestWifiPro": '\uf56b',
    "NestWifiPro2": '\uf56a',
    "NestWifiRouter": '\uf133',
    "NetworkCell": '\ue1b9',
    "NetworkCheck": '\ue640',
    "NetworkIntelligenceHistory": '\uf5f6',
    "NetworkIntelligenceUpdate": '\uf5f5',
    "NetworkLocked": '\ue61a',
    "NetworkManage": '\uf7ab',
    "NetworkNode": '\uf56e',
    "NetworkPing": '\uebca',
    "NetworkWifi": '\ue1ba',
    "NetworkWifi1Bar": '\uebe4',
    "NetworkWifi1BarLocked": '\uf58f',
    "NetworkWifi2Bar": '\uebd6',
    "NetworkWifi2BarLocked": '\uf58e',
    "NetworkWifi3Bar": '\uebe1',
    "NetworkWifi3BarLocked": '\uf58d',
    "Neurology": '\ue10e',
    "NewLabel": '\ue609',
    "NewReleases": '\uef76',
    "NewWindow": '\uf710',
    "News": '\ue032',
    "Newsmode": '\uefad',
    "Newspaper": '\ueb81',
    "NextPlan": '\uef5d',
    "NextWeek": '\ue16a',
    "Nfc": '\ue1bb',
    "NightShelter": '\uf1f1',
    "NightSightAuto": '\uf1d7',
    "NightSightAutoOff": '\uf1f9',
    "NightSightMax": '\uf6c3',
    "Nightlife": '\uea62',
    "Nightlight": '\uf03d',
    "NightlightRound": '\uf03d',
    "NightsStay": '\uea46',
    "NoAccounts": '\uf03e',
    "NoAdultContent": '\uf8fe',
    "NoBackpack": '\uf237',
    "NoCrash": '\uebf0',
    "NoDrinks": '\uf1a5',
    "NoEncryption": '\uf03f',
    "NoEncryptionGmailerrorred": '\uf03f',
    "NoFlash": '\uf1a6',
    "NoFood": '\uf1a7',
    "NoLuggage": '\uf23b',
    "NoMeals": '\uf1d6',
    "NoMeetingRoom": '\ueb4e',
    "NoPhotography": '\uf1a8',
    "NoSim": '\ue1ce',
    "NoSound": '\ue710',
    "NoStroller": '\uf1af',
    "NoTransfer": '\uf1d5',
    "NoiseAware": '\uebec',
    "NoiseControlOff": '\uebf3',
    "NoiseControlOn": '\uf8a8',
    "NordicWalking": '\ue50e',
    "North": '\uf1e0',
    "NorthEast": '\uf1e1',
    "NorthWest": '\uf1e2',
    "NotAccessible": '\uf0fe',
    "NotAccessibleForward": '\uf54a',
    "NotInterested": '\uf08c',
    "NotListedLocation": '\ue575',
    "NotStarted": '\uf0d1',
    "Note": '\ue66d',
    "NoteAdd": '\ue89c',
    "NoteAlt": '\uf040',
    "NoteStack": '\uf562',
    "NoteStackAdd": '\uf563',
    "Notes": '\ue26c',
    "NotificationAdd": '\ue399',
    "NotificationImportant": '\ue004',
    "NotificationMultiple": '\ue6c2',
    "Notifications": '\ue7f5',
    "NotificationsActive": '\ue7f7',
    "NotificationsNone": '\ue7f5',
    "NotificationsOff": '\ue7f6',
    "NotificationsPaused": '\ue7f8',
    "Numbers": '\ueac7',
    "Nutrition": '\ue110',
    "Ods": '\ue6e8',
    "Odt": '\ue6e9',
    "OfflineBolt": '\ue932',
    "OfflinePin": '\ue90a',
    "OfflineShare": '\ue9c5',
    "OilBarrel": '\uec15',
    "OnDeviceTraining": '\uebfd',
    "Oncology": '\ue114',
    "OndemandVideo": '\ue63a',
    "OnlinePrediction": '\uf0eb',
    "Onsen": '\uf6f8',
    "Opacity": '\ue91c',
    "OpenInBrowser": '\ue89d',
    "OpenInFull": '\uf1ce',
    "OpenInNew": '\ue89e',
    "OpenInNewDown": '\uf70f',
    "OpenInNewOff": '\ue4f6',
    "OpenInPhone": '\ue702',
    "OpenJam": '\uefae',
    "OpenWith": '\ue89f',
    "Ophthalmology": '\ue115',
    "OralDisease": '\ue116',
    "OrderApprove": '\uf812',
    "OrderPlay": '\uf811',
    "Orthopedics": '\uf897',
    "OtherAdmission": '\ue47b',
    "OtherHouses": '\ue58c',
    "Outbound": '\ue1ca',
    "Outbox": '\uef5f',
    "OutboxAlt": '\ueb17',
    "OutdoorGarden": '\ue205',
    "OutdoorGrill": '\uea47',
    "OutgoingMail": '\uf0d2',
    "Outlet": '\uf1d4',
    "OutlinedFlag": '\uf0c6',
    "Outpatient": '\ue118',
    "OutpatientMed": '\ue119',
    "Output": '\uebbe',
    "OutputCircle": '\uf70e',
    "OvenGen": '\ue843',
    "Overview": '\ue4a7',
    "OverviewKey": '\uf7d4',
    "OxygenSaturation": '\ue4de',
    "Pace": '\uf6b8',
    "Pacemaker": '\ue656',
    "Package": '\ue48f',
    "Package2": '\uf569',
    "Padding": '\ue9c8',
    "PageControl": '\ue731',
    "PageInfo": '\uf614',
    "Pages": '\ue7f9',
    "Pageview": '\ue8a0',
    "Paid": '\uf041',
    "Palette": '\ue40a',
    "Pallet": '\uf86a',
    "PanTool": '\ue925',
    "PanToolAlt": '\uebb9',
    "PanZoom": '\uf655',
    "Panorama": '\ue40b',
    "PanoramaFishEye": '\ue40c',
    "PanoramaHorizontal": '\ue40d',
    "PanoramaPhotosphere": '\ue9c9',
    "PanoramaVertical": '\ue40e',
    "PanoramaWideAngle": '\ue40f',
    "Paragliding": '\ue50f',
    "Park": '\uea63',
    "PartlyCloudyDay": '\uf172',
    "PartlyCloudyNight": '\uf174',
    "PartnerExchange": '\uf7f9',
    "PartnerReports": '\uefaf',
    "PartyMode": '\ue7fa',
    "Passkey": '\uf87f',
    "Password": '\uf042',
    "PatientList": '\ue653',
    "Pattern": '\uf043',
    "Pause": '\ue034',
    "PauseCircle": '\ue1a2',
    "PauseCircleFilled": '\ue1a2',
    "PauseCircleOutline": '\ue1a2',
    "PausePresentation": '\ue0ea',
    "Payment": '\ue8a1',
    "Payments": '\uef63',
    "PedalBike": '\ueb29',
    "Pediatrics": '\ue11d',
    "PenSize1": '\uf755',
    "PenSize2": '\uf754',
    "PenSize3": '\uf753',
    "PenSize4": '\uf752',
    "PenSize5": '\uf751',
    "Pending": '\uef64',
    "PendingActions": '\uf1bb',
    "Pentagon": '\ueb50',
    "People": '\uea21',
    "PeopleAlt": '\uea21',
    "PeopleOutline": '\uea21',
    "Percent": '\ueb58',
    "PerformanceMax": '\ue51a',
    "Pergola": '\ue203',
    "PermCameraMic": '\ue8a2',
    "PermContactCalendar": '\ue8a3',
    "PermDataSetting": '\ue8a4',
    "PermDeviceInformation": '\ue8a5',
    "PermIdentity": '\uf0d3',
    "PermMedia": '\ue8a7',
    "PermPhoneMsg": '\ue8a8',
    "PermScanWifi": '\ue8a9',
    "Person": '\uf0d3',
    "Person2": '\uf8e4',
    "Person3": '\uf8e5',
    "Person4": '\uf8e6',
    "PersonAdd": '\uea4d',
    "PersonAddAlt": '\uea4d',
    "PersonAddDisabled": '\ue9cb',
    "PersonAlert": '\uf567',
    "PersonApron": '\uf5a3',
    "PersonBook": '\uf5e8',
    "PersonCancel": '\uf566',
    "PersonCelebrate": '\uf7fe',
    "PersonCheck": '\uf565',
    "PersonFilled": '\uf0d3',
    "PersonOff": '\ue510',
    "PersonOutline": '\uf0d3',
    "PersonPin": '\ue55a',
    "PersonPinCircle": '\ue56a',
    "PersonPlay": '\uf7fd',
    "PersonRaisedHand": '\uf59a',
    "PersonRemove": '\uef66',
    "PersonSearch": '\uf106',
    "PersonalInjury": '\ue6da',
    "PersonalVideo": '\ue63b',
    "PestControl": '\uf0fa',
    "PestControlRodent": '\uf0fd',
    "PetSupplies": '\uefb1',
    "Pets": '\ue91d',
    "Phishing": '\uead7',
    "Phone": '\uf0d4',
    "PhoneAlt": '\uf0d4',
    "PhoneAndroid": '\ue324',
    "PhoneBluetoothSpeaker": '\ue61b',
    "PhoneCallback": '\ue649',
    "PhoneDisabled": '\ue9cc',
    "PhoneEnabled": '\ue9cd',
    "PhoneForwarded": '\ue61c',
    "PhoneInTalk": '\ue61d',
    "PhoneIphone": '\ue325',
    "PhoneLocked": '\ue61e',
    "PhoneMissed": '\ue61f',
    "PhonePaused": '\ue620',
    "Phonelink": '\ue326',
    "PhonelinkErase": '\ue0db',
    "PhonelinkLock": '\ue0dc',
    "PhonelinkOff": '\ue327',
    "PhonelinkRing": '\ue0dd',
    "PhonelinkRingOff": '\uf7aa',
    "PhonelinkSetup": '\uef41',
    "Photo": '\ue432',
    "PhotoAlbum": '\ue411',
    "PhotoCamera": '\ue412',
    "PhotoCameraBack": '\uef68',
    "PhotoCameraFront": '\uef69',
    "PhotoFilter": '\ue43b',
    "PhotoFrame": '\uf0d9',
    "PhotoLibrary": '\ue413',
    "PhotoPrints": '\uefb2',
    "PhotoSizeSelectActual": '\ue432',
    "PhotoSizeSelectLarge": '\ue433',
    "PhotoSizeSelectSmall": '\ue434',
    "Php": '\ueb8f',
    "PhysicalTherapy": '\ue11e',
    "Piano": '\ue521',
    "PianoOff": '\ue520',
    "PictureAsPdf": '\ue415',
    "PictureInPicture": '\ue8aa',
    "PictureInPictureAlt": '\ue911',
    "PictureInPictureCenter": '\uf550',
    "PictureInPictureLarge": '\uf54f',
    "PictureInPictureMedium": '\uf54e',
    "PictureInPictureSmall": '\uf54d',
    "PieChart": '\uf0da',
    "PieChartFilled": '\uf0da',
    "PieChartOutline": '\uf0da',
    "PieChartOutlined": '\uf0da',
    "Pill": '\ue11f',
    "PillOff": '\uf809',
    "Pin": '\uf045',
    "PinDrop": '\ue55e',
    "PinEnd": '\ue767',
    "PinInvoke": '\ue763',
    "Pinch": '\ueb38',
    "PinchZoomIn": '\uf1fa',
    "PinchZoomOut": '\uf1fb',
    "Pip": '\uf64d',
    "PipExit": '\uf70d',
    "PivotTableChart": '\ue9ce',
    "Place": '\uf1db',
    "PlaceItem": '\uf1f0',
    "Plagiarism": '\uea5a',
    "PlannerBannerAdPt": '\ue692',
    "PlayArrow": '\ue037',
    "PlayCircle": '\ue1c4',
    "PlayDisabled": '\uef6a',
    "PlayForWork": '\ue906',
    "PlayLesson": '\uf047',
    "PlayMusic": '\ue6ee',
    "PlayPause": '\uf137',
    "PlayShapes": '\uf7fc',
    "PlayingCards": '\uf5dc',
    "PlaylistAdd": '\ue03b',
    "PlaylistAddCheck": '\ue065',
    "PlaylistAddCheckCircle": '\ue7e6',
    "PlaylistAddCircle": '\ue7e5',
    "PlaylistPlay": '\ue05f',
    "PlaylistRemove": '\ueb80',
    "Plumbing": '\uf107',
    "PlusOne": '\ue800',
    "Podcasts": '\uf048',
    "Podiatry": '\ue120',
    "Podium": '\uf7fb',
    "PointOfSale": '\uf17e',
    "PointScan": '\uf70c',
    "Policy": '\uea17',
    "Poll": '\uf0cc',
    "Polyline": '\uebbb',
    "Polymer": '\ue8ab',
    "Pool": '\ueb48',
    "PortableWifiOff": '\uf087',
    "Portrait": '\ue851',
    "PositionBottomLeft": '\uf70b',
    "PositionBottomRight": '\uf70a',
    "PositionTopRight": '\uf709',
    "Post": '\ue705',
    "PostAdd": '\uea20',
    "PottedPlant": '\uf8aa',
    "Power": '\ue63c',
    "PowerInput": '\ue336',
    "PowerOff": '\ue646',
    "PowerRounded": '\uf8c7',
    "PowerSettingsNew": '\uf8c7',
    "PrayerTimes": '\uf838',
    "PrecisionManufacturing": '\uf049',
    "Pregnancy": '\uf5f1',
    "PregnantWoman": '\uf5f1',
    "Preliminary": '\ue7d8',
    "Prescriptions": '\ue121',
    "PresentToAll": '\ue0df',
    "Preview": '\uf1c5',
    "PreviewOff": '\uf7af',
    "PriceChange": '\uf04a',
    "PriceCheck": '\uf04b',
    "Print": '\ue8ad',
    "PrintAdd": '\uf7a2',
    "PrintConnect": '\uf7a1',
    "PrintDisabled": '\ue9cf',
    "PrintError": '\uf7a0',
    "PrintLock": '\uf651',
    "Priority": '\ue19f',
    "PriorityHigh": '\ue645',
    "Privacy": '\uf148',
    "PrivacyTip": '\uf0dc',
    "PrivateConnectivity": '\ue744',
    "Problem": '\ue122',
    "Procedure": '\ue651',
    "ProcessChart": '\uf855',
    "ProductionQuantityLimits": '\ue1d1',
    "Productivity": '\ue296',
    "ProgressActivity": '\ue9d0',
    "Propane": '\uec14',
    "PropaneTank": '\uec13',
    "Psychiatry": '\ue123',
    "Psychology": '\uea4a',
    "PsychologyAlt": '\uf8ea',
    "Public": '\ue80b',
    "PublicOff": '\uf1ca',
    "Publish": '\ue255',
    "PublishedWithChanges": '\uf232',
    "Pulmonology": '\ue124',
    "PunchClock": '\ueaa8',
    "PushPin": '\uf10d',
    "QrCode": '\uef6b',
    "QrCode2": '\ue00a',
    "QrCode2Add": '\uf658',
    "QrCodeScanner": '\uf206',
    "QueryBuilder": '\uefd6',
    "QueryStats": '\ue4fc',
    "QuestionAnswer": '\ue8af',
    "QuestionExchange": '\uf7f3',
    "QuestionMark": '\ueb8b',
    "Queue": '\ue03c',
    "QueueMusic": '\ue03d',
    "QueuePlayNext": '\ue066',
    "QuickPhrases": '\ue7d1',
    "QuickReference": '\ue46e',
    "QuickReferenceAll": '\uf801',
    "Quickreply": '\uef6c',
    "QuietTime": '\ue1f9',
    "QuietTimeActive": '\ue291',
    "Quiz": '\uf04c',
    "RMobiledata": '\uf04d',
    "Radar": '\uf04e',
    "Radio": '\ue03e',
    "RadioButtonChecked": '\ue837',
    "RadioButtonPartial": '\uf560',
    "RadioButtonUnchecked": '\ue836',
    "Radiology": '\ue125',
    "RailwayAlert": '\ue9d1',
    "Rainy": '\uf176',
    "RainyHeavy": '\uf61f',
    "RainyLight": '\uf61e',
    "RainySnow": '\uf61d',
    "RamenDining": '\uea64',
    "RampLeft": '\ueb9c',
    "RampRight": '\ueb96',
    "RangeHood": '\ue1ea',
    "RateReview": '\ue560',
    "Raven": '\uf555',
    "RawOff": '\uf04f',
    "RawOn": '\uf050',
    "ReadMore": '\uef6d',
    "ReadinessScore": '\uf6dd',
    "RealEstateAgent": '\ue73a',
    "RearCamera": '\uf6c2',
    "Rebase": '\uf845',
    "RebaseEdit": '\uf846',
    "Receipt": '\ue8b0',
    "ReceiptLong": '\uef6e',
    "RecentActors": '\ue03f',
    "RecentPatient": '\uf808',
    "Recommend": '\ue9d2',
    "RecordVoiceOver": '\ue91f',
    "Rectangle": '\ueb54',
    "Recycling": '\ue760',
    "Redeem": '\ue8f6',
    "Redo": '\ue15a',
    "ReduceCapacity": '\uf21c',
    "Refresh": '\ue5d5',
    "RegularExpression": '\uf750',
    "Relax": '\uf6dc',
    "ReleaseAlert": '\uf654',
    "RememberMe": '\uf051',
    "Reminder": '\ue6c6',
    "RemindersAlt": '\ue6c6',
    "RemoteGen": '\ue83e',
    "Remove": '\ue15b',
    "RemoveCircle": '\uf08f',
    "RemoveCircleOutline": '\uf08f',
    "RemoveDone": '\ue9d3',
    "RemoveFromQueue": '\ue067',
    "RemoveModerator": '\ue9d4',
    "RemoveRedEye": '\ue8f4',
    "RemoveRoad": '\uebfc',
    "RemoveSelection": '\ue9d5',
    "RemoveShoppingCart": '\ue928',
    "ReopenWindow": '\uf708',
    "Reorder": '\ue8fe',
    "Repartition": '\uf8e8',
    "Repeat": '\ue040',
    "RepeatOn": '\ue9d6',
    "RepeatOne": '\ue041',
    "RepeatOneOn": '\ue9d7',
    "Replay": '\ue042',
    "Replay10": '\ue059',
    "Replay30": '\ue05a',
    "Replay5": '\ue05b',
    "ReplayCircleFilled": '\ue9d8',
    "Reply": '\ue15e',
    "ReplyAll": '\ue15f',
    "Report": '\uf052',
    "ReportGmailerrorred": '\uf052',
    "ReportOff": '\ue170',
    "ReportProblem": '\uf083',
    "RequestPage": '\uf22c',
    "RequestQuote": '\uf1b6',
    "ResetImage": '\uf824',
    "ResetTv": '\ue9d9',
    "ResetWrench": '\uf56c',
    "Resize": '\uf707',
    "RespiratoryRate": '\ue127',
    "RestartAlt": '\uf053',
    "Restaurant": '\ue56c',
    "RestaurantMenu": '\ue561',
    "Restore": '\ue8b3',
    "RestoreFromTrash": '\ue938',
    "RestorePage": '\ue929',
    "Resume": '\uf7d0',
    "Reviews": '\uf07c',
    "RewardedAds": '\uefb6',
    "Rheumatology": '\ue128',
    "RibCage": '\uf898',
    "RiceBowl": '\uf1f5',
    "RightClick": '\uf706',
    "RightPanelClose": '\uf705',
    "RightPanelOpen": '\uf704',
    "RingVolume": '\uf0dd',
    "RingVolumeFilled": '\uf0dd',
    "Ripples": '\ue9db',
    "Robot": '\uf882',
    "Robot2": '\uf5d0',
    "Rocket": '\ueba5',
    "RocketLaunch": '\ueb9b',
    "RollerShades": '\uec12',
    "RollerShadesClosed": '\uec11',
    "RollerSkating": '\uebcd',
    "Roofing": '\uf201',
    "Room": '\uf1db',
    "RoomPreferences": '\uf1b8',
    "RoomService": '\ueb49',
    "Rotate90DegreesCcw": '\ue418',
    "Rotate90DegreesCw": '\ueaab',
    "RotateLeft": '\ue419',
    "RotateRight": '\ue41a',
    "RoundaboutLeft": '\ueb99',
    "RoundaboutRight": '\ueba3',
    "RoundedCorner": '\ue920',
    "Route": '\ueacd',
    "Router": '\ue328',
    "Routine": '\ue20c',
    "Rowing": '\ue921',
    "RssFeed": '\ue0e5',
    "Rsvp": '\uf055',
    "Rtt": '\ue9ad',
    "Rule": '\uf1c2',
    "RuleFolder": '\uf1c9',
    "RuleSettings": '\uf64c',
    "RunCircle": '\uef6f',
    "RunningWithErrors": '\ue51d',
    "RvHookup": '\ue642',
    "SafetyCheck": '\uebef',
    "SafetyCheckOff": '\uf59d',
    "SafetyDivider": '\ue1cc',
    "Sailing": '\ue502',
    "Salinity": '\uf876',
    "Sanitizer": '\uf21d',
    "Satellite": '\ue562',
    "SatelliteAlt": '\ueb3a',
    "Sauna": '\uf6f7',
    "Save": '\ue161',
    "SaveAlt": '\uf090',
    "SaveAs": '\ueb60',
    "SavedSearch": '\uea11',
    "Savings": '\ue2eb',
    "Scale": '\ueb5f',
    "Scan": '\uf74e',
    "ScanDelete": '\uf74f',
    "Scanner": '\ue329',
    "ScatterPlot": '\ue268',
    "Scene": '\ue2a7',
    "Schedule": '\uefd6',
    "ScheduleSend": '\uea0a',
    "Schema": '\ue4fd',
    "School": '\ue80c',
    "Science": '\uea4b',
    "Score": '\ue269',
    "Scoreboard": '\uebd0',
    "ScreenLockLandscape": '\ue1be',
    "ScreenLockPortrait": '\ue1bf',
    "ScreenLockRotation": '\ue1c0',
    "ScreenRecord": '\uf679',
    "ScreenRotation": '\ue1c1',
    "ScreenRotationAlt": '\uebee',
    "ScreenRotationUp": '\uf678',
    "ScreenSearchDesktop": '\uef70',
    "ScreenShare": '\ue0e2',
    "Screenshot": '\uf056',
    "ScreenshotFrame": '\uf677',
    "ScreenshotKeyboard": '\uf7d3',
    "ScreenshotMonitor": '\uec08',
    "ScreenshotRegion": '\uf7d2',
    "ScreenshotTablet": '\uf697',
    "ScrollableHeader": '\ue9dc',
    "ScubaDiving": '\uebce',
    "Sd": '\ue9dd',
    "SdCard": '\ue623',
    "SdCardAlert": '\uf057',
    "SdStorage": '\ue623',
    "Search": '\ue8b6',
    "SearchCheck": '\uf800',
    "SearchOff": '\uea76',
    "Security": '\ue32a',
    "SecurityUpdate": '\uf072',
    "SecurityUpdateGood": '\uf073',
    "SecurityUpdateWarning": '\uf074',
    "Segment": '\ue94b',
    "Select": '\uf74d',
    "SelectAll": '\ue162',
    "SelectCheckBox": '\uf1fe',
    "SelectToSpeak": '\uf7cf',
    "SelectWindow": '\ue6fa',
    "SelectWindowOff": '\ue506',
    "SelfCare": '\uf86d',
    "SelfImprovement": '\uea78',
    "Sell": '\uf05b',
    "Send": '\ue163',
    "SendAndArchive": '\uea0c',
    "SendMoney": '\ue8b7',
    "SendTimeExtension": '\ueadb',
    "SendToMobile": '\uf05c',
    "SensorDoor": '\uf1b5',
    "SensorOccupied": '\uec10',
    "SensorWindow": '\uf1b4',
    "Sensors": '\ue51e',
    "SensorsKrx": '\uf556',
    "SensorsOff": '\ue51f',
    "SentimentCalm": '\uf6a7',
    "SentimentContent": '\uf6a6',
    "SentimentDissatisfied": '\ue811',
    "SentimentExcited": '\uf6a5',
    "SentimentExtremelyDissatisfied": '\uf194',
    "SentimentFrustrated": '\uf6a4',
    "SentimentNeutral": '\ue812',
    "SentimentSad": '\uf6a3',
    "SentimentSatisfied": '\ue813',
    "SentimentSatisfiedAlt": '\ue813',
    "SentimentStressed": '\uf6a2',
    "SentimentVeryDissatisfied": '\ue814',
    "SentimentVerySatisfied": '\ue815',
    "SentimentWorried": '\uf6a1',
    "SetMeal": '\uf1ea',
    "Settings": '\ue8b8',
    "SettingsAccessibility": '\uf05d',
    "SettingsAccountBox": '\uf835',
    "SettingsAlert": '\uf143',
    "SettingsApplications": '\ue8b9',
    "SettingsBRoll": '\uf625',
    "SettingsBackupRestore": '\ue8ba',
    "SettingsBluetooth": '\ue8bb',
    "SettingsBrightness": '\ue8bd',
    "SettingsCell": '\ue8bc',
    "SettingsCinematicBlur": '\uf624',
    "SettingsEthernet": '\ue8be',
    "SettingsInputAntenna": '\ue8bf',
    "SettingsInputComponent": '\ue8c1',
    "SettingsInputComposite": '\ue8c1',
    "SettingsInputHdmi": '\ue8c2',
    "SettingsInputSvideo": '\ue8c3',
    "SettingsMotionMode": '\uf833',
    "SettingsNightSight": '\uf832',
    "SettingsOverscan": '\ue8c4',
    "SettingsPanorama": '\uf831',
    "SettingsPhone": '\ue8c5',
    "SettingsPhotoCamera": '\uf834',
    "SettingsPower": '\ue8c6',
    "SettingsRemote": '\ue8c7',
    "SettingsSlowMotion": '\uf623',
    "SettingsSuggest": '\uf05e',
    "SettingsSystemDaydream": '\ue1c3',
    "SettingsTimelapse": '\uf622',
    "SettingsVideoCamera": '\uf621',
    "SettingsVoice": '\ue8c8',
    "SettopComponent": '\ue2ac',
    "SevereCold": '\uebd3',
    "Shadow": '\ue9df',
    "ShadowAdd": '\uf584',
    "ShadowMinus": '\uf583',
    "ShapeLine": '\uf8d3',
    "Shapes": '\ue602',
    "Share": '\ue80d',
    "ShareLocation": '\uf05f',
    "ShareOff": '\uf6cb',
    "ShareReviews": '\uf8a4',
    "ShareWindows": '\uf613',
    "SheetsRtl": '\uf823',
    "ShelfAutoHide": '\uf703',
    "ShelfPosition": '\uf702',
    "Shelves": '\uf86e',
    "Shield": '\ue9e0',
    "ShieldLock": '\uf686',
    "ShieldLocked": '\uf592',
    "ShieldMoon": '\ueaa9',
    "ShieldPerson": '\uf650',
    "ShieldSpark": '\uf55d',
    "ShieldWithHeart": '\ue78f',
    "ShieldWithHouse": '\ue78d',
    "Shift": '\ue5f2',
    "ShiftLock": '\uf7ae',
    "Shop": '\ue8c9',
    "Shop2": '\ue8ca',
    "ShopTwo": '\ue8ca',
    "ShoppingBag": '\uf1cc',
    "ShoppingBasket": '\ue8cb',
    "ShoppingCart": '\ue8cc',
    "ShoppingCartCheckout": '\ueb88',
    "ShortStay": '\ue4d0',
    "ShortText": '\ue261',
    "Shortcut": '\uf57a',
    "ShowChart": '\ue6e1',
    "Shower": '\uf061',
    "Shuffle": '\ue043',
    "ShuffleOn": '\ue9e1',
    "ShutterSpeed": '\ue43d',
    "ShutterSpeedAdd": '\uf57e',
    "ShutterSpeedMinus": '\uf57d',
    "Sick": '\uf220',
    "SideNavigation": '\ue9e2',
    "SignLanguage": '\uebe5',
    "SignalCellular0Bar": '\uf0a8',
    "SignalCellular1Bar": '\uf0a9',
    "SignalCellular2Bar": '\uf0aa',
    "SignalCellular3Bar": '\uf0ab',
    "SignalCellular4Bar": '\ue1c8',
    "SignalCellularAdd": '\uf7a9',
    "SignalCellularAlt": '\ue202',
    "SignalCellularAlt1Bar": '\uebdf',
    "SignalCellularAlt2Bar": '\uebe3',
    "SignalCellularConnectedNoInternet0Bar": '\uf0ac',
    "SignalCellularConnectedNoInternet4Bar": '\ue1cd',
    "SignalCellularNoSim": '\ue1ce',
    "SignalCellularNodata": '\uf062',
    "SignalCellularNull": '\ue1cf',
    "SignalCellularOff": '\ue1d0',
    "SignalCellularPause": '\uf5a7',
    "SignalDisconnected": '\uf239',
    "SignalWifi0Bar": '\uf0b0',
    "SignalWifi4Bar": '\uf065',
    "SignalWifi4BarLock": '\ue1e1',
    "SignalWifiBad": '\uf064',
    "SignalWifiConnectedNoInternet4": '\uf064',
    "SignalWifiOff": '\ue1da',
    "SignalWifiStatusbar4Bar": '\uf065',
    "SignalWifiStatusbarNotConnected": '\uf0ef',
    "SignalWifiStatusbarNull": '\uf067',
    "Signature": '\uf74c',
    "Signpost": '\ueb91',
    "SimCard": '\ue32b',
    "SimCardAlert": '\uf057',
    "SimCardDownload": '\uf068',
    "SingleBed": '\uea48',
    "Sip": '\uf069',
    "Skateboarding": '\ue511',
    "Skeleton": '\uf899',
    "SkipNext": '\ue044',
    "SkipPrevious": '\ue045',
    "Skull": '\uf89a',
    "Sledding": '\ue512',
    "Sleep": '\ue213',
    "SleepScore": '\uf6b7',
    "SlideLibrary": '\uf822',
    "Sliders": '\ue9e3',
    "Slideshow": '\ue41b',
    "SlowMotionVideo": '\ue068',
    "SmartButton": '\uf1c1',
    "SmartDisplay": '\uf06a',
    "SmartOutlet": '\ue844',
    "SmartScreen": '\uf06b',
    "SmartToy": '\uf06c',
    "SmartVentilation": '\uf55c',
    "Smartphone": '\ue32c',
    "SmbShare": '\uf74b',
    "SmokeFree": '\ueb4a',
    "SmokingRooms": '\ueb4b',
    "Sms": '\ue625',
    "SmsFailed": '\ue87f',
    "SnippetFolder": '\uf1c7',
    "Snooze": '\ue046',
    "Snowboarding": '\ue513',
    "Snowing": '\ue80f',
    "SnowingHeavy": '\uf61c',
    "Snowmobile": '\ue503',
    "Snowshoeing": '\ue514',
    "Soap": '\uf1b2',
    "SocialDistance": '\ue1cb',
    "SocialLeaderboard": '\uf6a0',
    "SolarPower": '\uec0f',
    "Sort": '\ue164',
    "SortByAlpha": '\ue053',
    "Sos": '\uebf7',
    "SoundDetectionDogBarking": '\uf149',
    "SoundDetectionGlassBreak": '\uf14a',
    "SoundDetectionLoudSound": '\uf14b',
    "SoundSampler": '\uf6b4',
    "SoupKitchen": '\ue7d3',
    "Source": '\uf1c8',
    "SourceNotes": '\ue12d',
    "South": '\uf1e3',
    "SouthAmerica": '\ue7e4',
    "SouthEast": '\uf1e4',
    "SouthWest": '\uf1e5',
    "Spa": '\ueb4c',
    "SpaceBar": '\ue256',
    "SpaceDashboard": '\ue66b',
    "SpatialAudio": '\uebeb',
    "SpatialAudioOff": '\uebe8',
    "SpatialTracking": '\uebea',
    "Speaker": '\ue32d',
    "SpeakerGroup": '\ue32e',
    "SpeakerNotes": '\ue8cd',
    "SpeakerNotesOff": '\ue92a',
    "SpeakerPhone": '\ue0d2',
    "SpecialCharacter": '\uf74a',
    "SpecificGravity": '\uf872',
    "SpeechToText": '\uf8a7',
    "Speed": '\ue9e4',
    "Spellcheck": '\ue8ce',
    "Splitscreen": '\uf06d',
    "SplitscreenBottom": '\uf676',
    "SplitscreenLeft": '\uf675',
    "SplitscreenRight": '\uf674',
    "SplitscreenTop": '\uf673',
    "Spo2": '\uf6db',
    "Spoke": '\ue9a7',
    "Sports": '\uea30',
    "SportsBar": '\uf1f3',
    "SportsBaseball": '\uea51',
    "SportsBasketball": '\uea26',
    "SportsCricket": '\uea27',
    "SportsEsports": '\uea28',
    "SportsFootball": '\uea29',
    "SportsGolf": '\uea2a',
    "SportsGymnastics": '\uebc4',
    "SportsHandball": '\uea33',
    "SportsHockey": '\uea2b',
    "SportsKabaddi": '\uea34',
    "SportsMartialArts": '\ueae9',
    "SportsMma": '\uea2c',
    "SportsMotorsports": '\uea2d',
    "SportsRugby": '\uea2e',
    "SportsScore": '\uf06e',
    "SportsSoccer": '\uea2f',
    "SportsTennis": '\uea32',
    "SportsVolleyball": '\uea31',
    "Sprinkler": '\ue29a',
    "Sprint": '\uf81f',
    "Square": '\ueb36',
    "SquareFoot": '\uea49',
    "SsidChart": '\ueb66',
    "Stack": '\uf609',
    "StackOff": '\uf608',
    "StackStar": '\uf607',
    "StackedBarChart": '\ue9e6',
    "StackedEmail": '\ue6c7',
    "StackedInbox": '\ue6c9',
    "StackedLineChart": '\uf22b',
    "StadiaController": '\uf135',
    "Stadium": '\ueb90',
    "Stairs": '\uf1a9',
    "Star": '\uf09a',
    "StarBorder": '\uf09a',
    "StarBorderPurple500": '\uf09a',
    "StarHalf": '\ue839',
    "StarOutline": '\uf09a',
    "StarPurple500": '\uf09a',
    "StarRate": '\uf0ec',
    "StarRateHalf": '\uec45',
    "Stars": '\ue8d0',
    "Start": '\ue089',
    "Stat1": '\ue698',
    "Stat2": '\ue699',
    "Stat3": '\ue69a',
    "StatMinus1": '\ue69b',
    "StatMinus2": '\ue69c',
    "StatMinus3": '\ue69d',
    "StayCurrentLandscape": '\ue0d3',
    "StayCurrentPortrait": '\ue0d4',
    "StayPrimaryLandscape": '\ue0d5',
    "StayPrimaryPortrait": '\ue0d6',
    "Step": '\uf6fe',
    "StepInto": '\uf701',
    "StepOut": '\uf700',
    "StepOver": '\uf6ff',
    "Steppers": '\ue9e7',
    "Steps": '\uf6da',
    "Stethoscope": '\uf805',
    "StethoscopeArrow": '\uf807',
    "StethoscopeCheck": '\uf806',
    "StickyNote": '\ue9e8',
    "StickyNote2": '\uf1fc',
    "StockMedia": '\uf570',
    "Stop": '\ue047',
    "StopCircle": '\uef71',
    "StopScreenShare": '\ue0e3',
    "Storage": '\ue1db',
    "Store": '\ue8d1',
    "StoreMallDirectory": '\ue8d1',
    "Storefront": '\uea12',
    "Storm": '\uf070',
    "Straight": '\ueb95',
    "Straighten": '\ue41c',
    "Strategy": '\uf5df',
    "Stream": '\ue9e9',
    "StreamApps": '\uf79f',
    "Streetview": '\ue56e',
    "StressManagement": '\uf6d9',
    "StrikethroughS": '\ue257',
    "StrokeFull": '\uf749',
    "StrokePartial": '\uf748',
    "Stroller": '\uf1ae',
    "Style": '\ue41d',
    "Styler": '\ue273',
    "Stylus": '\uf604',
    "StylusLaserPointer": '\uf747',
    "StylusNote": '\uf603',
    "SubdirectoryArrowLeft": '\ue5d9',
    "SubdirectoryArrowRight": '\ue5da',
    "Subheader": '\ue9ea',
    "Subject": '\ue8d2',
    "Subscript": '\uf111',
    "Subscriptions": '\ue064',
    "Subtitles": '\ue048',
    "SubtitlesOff": '\uef72',
    "Subway": '\ue56f',
    "Summarize": '\uf071',
    "Sunny": '\ue81a',
    "SunnySnowing": '\ue819',
    "Superscript": '\uf112',
    "SupervisedUserCircle": '\ue939',
    "SupervisedUserCircleOff": '\uf60e',
    "SupervisorAccount": '\ue8d3',
    "Support": '\uef73',
    "SupportAgent": '\uf0e2',
    "Surfing": '\ue515',
    "Surgical": '\ue131',
    "SurroundSound": '\ue049',
    "SwapCalls": '\ue0d7',
    "SwapDrivingAppsWheel": '\ue69f',
    "SwapHoriz": '\ue8d4',
    "SwapHorizontalCircle": '\ue933',
    "SwapVert": '\ue8d5',
    "SwapVerticalCircle": '\ue8d6',
    "Sweep": '\ue6ac',
    "Swipe": '\ue9ec',
    "SwipeDown": '\ueb53',
    "SwipeDownAlt": '\ueb30',
    "SwipeLeft": '\ueb59',
    "SwipeLeftAlt": '\ueb33',
    "SwipeRight": '\ueb52',
    "SwipeRightAlt": '\ueb56',
    "SwipeUp": '\ueb2e',
    "SwipeUpAlt": '\ueb35',
    "SwipeVertical": '\ueb51',
    "Switch": '\ue1f4',
    "SwitchAccess": '\uf6fd',
    "SwitchAccessShortcut": '\ue7e1',
    "SwitchAccessShortcutAdd": '\ue7e2',
    "SwitchAccount": '\ue9ed',
    "SwitchCamera": '\ue41e',
    "SwitchLeft": '\uf1d1',
    "SwitchRight": '\uf1d2',
    "SwitchVideo": '\ue41f',
    "Switches": '\ue733',
    "SwordRose": '\uf5de',
    "Swords": '\uf889',
    "Symptoms": '\ue132',
    "Synagogue": '\ueab0',
    "Sync": '\ue627',
    "SyncAlt": '\uea18',
    "SyncDisabled": '\ue628',
    "SyncLock": '\ueaee',
    "SyncProblem": '\ue629',
    "SyncSavedLocally": '\uf820',
    "Syringe": '\ue133',
    "SystemSecurityUpdate": '\uf072',
    "SystemSecurityUpdateGood": '\uf073',
    "SystemSecurityUpdateWarning": '\uf074',
    "SystemUpdate": '\uf072',
    "SystemUpdateAlt": '\ue8d7',
    "Tab": '\ue8d8',
    "TabClose": '\uf745',
    "TabCloseRight": '\uf746',
    "TabDuplicate": '\uf744',
    "TabGroup": '\uf743',
    "TabMove": '\uf742',
    "TabNewRight": '\uf741',
    "TabRecent": '\uf740',
    "TabUnselected": '\ue8d9',
    "Table": '\uf191',
    "TableBar": '\uead2',
    "TableChart": '\ue265',
    "TableChartView": '\uf6ef',
    "TableLamp": '\ue1f2',
    "TableRestaurant": '\ueac6',
    "TableRows": '\uf101',
    "TableRowsNarrow": '\uf73f',
    "TableView": '\uf1be',
    "Tablet": '\ue32f',
    "TabletAndroid": '\ue330',
    "TabletMac": '\ue331',
    "Tabs": '\ue9ee',
    "Tactic": '\uf564',
    "Tag": '\ue9ef',
    "TagFaces": '\uea22',
    "TakeoutDining": '\uea74',
    "TamperDetectionOff": '\ue82e',
    "TamperDetectionOn": '\uf8c8',
    "TapAndPlay": '\ue62b',
    "Tapas": '\uf1e9',
    "Target": '\ue719',
    "Task": '\uf075',
    "TaskAlt": '\ue2e6',
    "Taunt": '\uf69f',
    "TaxiAlert": '\uef74',
    "TeamDashboard": '\ue013',
    "TempPreferencesCustom": '\uf8c9',
    "TempPreferencesEco": '\uf8ca',
    "TempleBuddhist": '\ueab3',
    "TempleHindu": '\ueaaf',
    "Tenancy": '\uf0e3',
    "Terminal": '\ueb8e',
    "Terrain": '\ue564',
    "TextAd": '\ue728',
    "TextDecrease": '\ueadd',
    "TextFields": '\ue262',
    "TextFormat": '\ue165',
    "TextIncrease": '\ueae2',
    "TextRotateUp": '\ue93a',
    "TextRotateVertical": '\ue93b',
    "TextRotationAngledown": '\ue93c',
    "TextRotationAngleup": '\ue93d',
    "TextRotationDown": '\ue93e',
    "TextRotationNone": '\ue93f',
    "TextSelectEnd": '\uf73e',
    "TextSelectJumpToBeginning": '\uf73d',
    "TextSelectJumpToEnd": '\uf73c',
    "TextSelectMoveBackCharacter": '\uf73b',
    "TextSelectMoveBackWord": '\uf73a',
    "TextSelectMoveDown": '\uf739',
    "TextSelectMoveForwardCharacter": '\uf738',
    "TextSelectMoveForwardWord": '\uf737',
    "TextSelectMoveUp": '\uf736',
    "TextSelectStart": '\uf735',
    "TextSnippet": '\uf1c6',
    "TextToSpeech": '\uf1bc',
    "Textsms": '\ue625',
    "Texture": '\ue421',
    "TextureAdd": '\uf57c',
    "TextureMinus": '\uf57b',
    "TheaterComedy": '\uea66',
    "Theaters": '\ue8da',
    "Thermometer": '\ue846',
    "ThermometerAdd": '\uf582',
    "ThermometerGain": '\uf6d8',
    "ThermometerLoss": '\uf6d7',
    "ThermometerMinus": '\uf581',
    "Thermostat": '\uf076',
    "ThermostatAuto": '\uf077',
    "ThermostatCarbon": '\uf178',
    "ThumbDown": '\uf578',
    "ThumbDownAlt": '\uf578',
    "ThumbDownFilled": '\uf578',
    "ThumbDownOff": '\uf578',
    "ThumbDownOffAlt": '\uf578',
    "ThumbUp": '\uf577',
    "ThumbUpAlt": '\uf577',
    "ThumbUpFilled": '\uf577',
    "ThumbUpOff": '\uf577',
    "ThumbUpOffAlt": '\uf577',
    "ThumbnailBar": '\uf734',
    "ThumbsUpDown": '\ue8dd',
    "Thunderstorm": '\uebdb',
    "Tibia": '\uf89b',
    "TibiaAlt": '\uf89c',
    "TimeAuto": '\uf0e4',
    "TimeToLeave": '\ueff7',
    "Timelapse": '\ue422',
    "Timeline": '\ue922',
    "Timer": '\ue425',
    "Timer10": '\ue423',
    "Timer10Alt1": '\uefbf',
    "Timer10Select": '\uf07a',
    "Timer3": '\ue424',
    "Timer3Alt1": '\uefc0',
    "Timer3Select": '\uf07b',
    "TimerOff": '\ue426',
    "TipsAndUpdates": '\ue79a',
    "TireRepair": '\uebc8',
    "Title": '\ue264',
    "Toast": '\uefc1',
    "Toc": '\ue8de',
    "Today": '\ue8df',
    "ToggleOff": '\ue9f5',
    "ToggleOn": '\ue9f6',
    "Token": '\uea25',
    "Toll": '\ue8e0',
    "Tonality": '\ue427',
    "Toolbar": '\ue9f7',
    "ToolsFlatHead": '\uf8cb',
    "ToolsInstallationKit": '\ue2ab',
    "ToolsLadder": '\ue2cb',
    "ToolsLevel": '\ue77b',
    "ToolsPhillips": '\uf8cc',
    "ToolsPliersWireStripper": '\ue2aa',
    "ToolsPowerDrill": '\ue1e9',
    "ToolsWrench": '\uf8cd',
    "Tooltip": '\ue9f8',
    "TopPanelClose": '\uf733',
    "TopPanelOpen": '\uf732',
    "Topic": '\uf1c8',
    "Tornado": '\ue199',
    "TotalDissolvedSolids": '\uf877',
    "TouchApp": '\ue913',
    "TouchpadMouse": '\uf687',
    "Tour": '\uef75',
    "Toys": '\ue332',
    "ToysFan": '\uf887',
    "TrackChanges": '\ue8e1',
    "Traffic": '\ue565',
    "TrailLength": '\ueb5e',
    "TrailLengthMedium": '\ueb63',
    "TrailLengthShort": '\ueb6d',
    "Train": '\ue570',
    "Tram": '\ue571',
    "Transcribe": '\uf8ec',
    "TransferWithinAStation": '\ue572',
    "Transform": '\ue428',
    "Transgender": '\ue58d',
    "TransitEnterexit": '\ue579',
    "Translate": '\ue8e2',
    "Transportation": '\ue21d',
    "Travel": '\uef93',
    "TravelExplore": '\ue2db',
    "TrendingDown": '\ue8e3',
    "TrendingFlat": '\ue8e4',
    "TrendingUp": '\ue8e5',
    "TripOrigin": '\ue57b',
    "Trolley": '\uf86b',
    "Trophy": '\uea23',
    "Troubleshoot": '\ue1d2',
    "Try": '\uf07c',
    "Tsunami": '\uebd8',
    "Tsv": '\ue6d6',
    "Tty": '\uf1aa',
    "Tune": '\ue429',
    "Tungsten": '\uf07d',
    "TurnLeft": '\ueba6',
    "TurnRight": '\uebab',
    "TurnSharpLeft": '\ueba7',
    "TurnSharpRight": '\uebaa',
    "TurnSlightLeft": '\ueba4',
    "TurnSlightRight": '\ueb9a',
    "TurnedIn": '\ue8e7',
    "TurnedInNot": '\ue8e7',
    "Tv": '\ue63b',
    "TvGen": '\ue830',
    "TvGuide": '\ue1dc',
    "TvOff": '\ue647',
    "TvOptionsEditChannels": '\ue1dd',
    "TvRemote": '\uf5d9',
    "TvSignin": '\ue71b',
    "TvWithAssistant": '\ue785',
    "TwoWheeler": '\ue9f9',
    "TypeSpecimen": '\uf8f0',
    "UTurnLeft": '\ueba1',
    "UTurnRight": '\ueba2',
    "UlnaRadius": '\uf89d',
    "UlnaRadiusAlt": '\uf89e',
    "Umbrella": '\uf1ad',
    "Unarchive": '\ue169',
    "Undo": '\ue166',
    "UnfoldLess": '\ue5d6',
    "UnfoldLessDouble": '\uf8cf',
    "UnfoldMore": '\ue5d7',
    "UnfoldMoreDouble": '\uf8d0',
    "Ungroup": '\uf731',
    "UniversalCurrencyAlt": '\ue734',
    "Unknown2": '\ue6a2',
    "Unknown5": '\ue6a5',
    "UnknownDocument": '\uf804',
    "UnknownMed": '\ueabd',
    "Unpublished": '\uf236',
    "Unsubscribe": '\ue0eb',
    "Upcoming": '\uf07e',
    "Update": '\ue923',
    "UpdateDisabled": '\ue075',
    "Upgrade": '\uf0fb',
    "Upload": '\uf09b',
    "UploadFile": '\ue9fc',
    "Urology": '\ue137',
    "Usb": '\ue1e0',
    "UsbOff": '\ue4fa',
    "Vaccines": '\ue138',
    "Valve": '\ue224',
    "VapeFree": '\uebc6',
    "VapingRooms": '\uebcf',
    "Variables": '\uf851',
    "Ventilator": '\ue139',
    "Verified": '\uef76',
    "VerifiedUser": '\uf013',
    "VerticalAlignBottom": '\ue258',
    "VerticalAlignCenter": '\ue259',
    "VerticalAlignTop": '\ue25a',
    "VerticalDistribute": '\ue076',
    "VerticalShades": '\uec0e',
    "VerticalShadesClosed": '\uec0d',
    "VerticalSplit": '\ue949',
    "Vibration": '\ue62d',
    "VideoCall": '\ue070',
    "VideoCameraBack": '\uf07f',
    "VideoCameraFront": '\uf080',
    "VideoCameraFrontOff": '\uf83b',
    "VideoChat": '\uf8a0',
    "VideoFile": '\ueb87',
    "VideoLabel": '\ue071',
    "VideoLibrary": '\ue04a',
    "VideoSearch": '\uefc6',
    "VideoSettings": '\uea75',
    "VideoStable": '\uf081',
    "Videocam": '\ue04b',
    "VideocamOff": '\ue04c',
    "VideogameAsset": '\ue338',
    "VideogameAssetOff": '\ue500',
    "ViewAgenda": '\ue8e9',
    "ViewArray": '\ue8ea',
    "ViewCarousel": '\ue8eb',
    "ViewColumn": '\ue8ec',
    "ViewColumn2": '\uf847',
    "ViewComfy": '\ue42a',
    "ViewComfyAlt": '\ueb73',
    "ViewCompact": '\ue42b',
    "ViewCompactAlt": '\ueb74',
    "ViewCozy": '\ueb75',
    "ViewDay": '\ue8ed',
    "ViewHeadline": '\ue8ee',
    "ViewInAr": '\uefc9',
    "ViewInArNew": '\uefc9',
    "ViewInArOff": '\uf61b',
    "ViewKanban": '\ueb7f',
    "ViewList": '\ue8ef',
    "ViewModule": '\ue8f0',
    "ViewQuilt": '\ue8f1',
    "ViewSidebar": '\uf114',
    "ViewStream": '\ue8f2',
    "ViewTimeline": '\ueb85',
    "ViewWeek": '\ue8f3',
    "Vignette": '\ue435',
    "Villa": '\ue586',
    "Visibility": '\ue8f4',
    "VisibilityLock": '\uf653',
    "VisibilityOff": '\ue8f5',
    "VitalSigns": '\ue650',
    "Vitals": '\ue13b',
    "VoiceChat": '\ue62e',
    "VoiceOverOff": '\ue94a',
    "VoiceSelection": '\uf58a',
    "Voicemail": '\ue0d9',
    "Volcano": '\uebda',
    "VolumeDown": '\ue04d',
    "VolumeDownAlt": '\ue79c',
    "VolumeMute": '\ue04e',
    "VolumeOff": '\ue04f',
    "VolumeUp": '\ue050',
    "VolunteerActivism": '\uea70',
    "VotingChip": '\uf852',
    "VpnKey": '\ue0da',
    "VpnKeyAlert": '\uf6cc',
    "VpnKeyOff": '\ueb7a',
    "VpnLock": '\ue62f',
    "Vr180Create2d": '\uefca',
    "Vr180Create2dOff": '\uf571',
    "Vrpano": '\uf082',
    "WallArt": '\uefcb',
    "WallLamp": '\ue2b4',
    "Wallet": '\uf8ff',
    "Wallpaper": '\ue1bc',
    "WallpaperSlideshow": '\uf672',
    "Ward": '\ue13c',
    "Warehouse": '\uebb8',
    "Warning": '\uf083',
    "WarningAmber": '\uf083',
    "WarningOff": '\uf7ad',
    "Wash": '\uf1b1',
    "Watch": '\ue334',
    "WatchButtonPress": '\uf6aa',
    "WatchLater": '\uefd6',
    "WatchOff": '\ueae3',
    "WatchScreentime": '\uf6ae',
    "WatchWake": '\uf6a9',
    "Water": '\uf084',
    "WaterBottle": '\uf69d',
    "WaterBottleLarge": '\uf69e',
    "WaterDamage": '\uf203',
    "WaterDo": '\uf870',
    "WaterDrop": '\ue798',
    "WaterEc": '\uf875',
    "WaterFull": '\uf6d6',
    "WaterHeater": '\ue284',
    "WaterLock": '\uf6ad',
    "WaterLoss": '\uf6d5',
    "WaterLux": '\uf874',
    "WaterMedium": '\uf6d4',
    "WaterOrp": '\uf878',
    "WaterPh": '\uf87a',
    "WaterPump": '\uf5d8',
    "WaterVoc": '\uf87b',
    "WaterfallChart": '\uea00',
    "Waves": '\ue176',
    "WavingHand": '\ue766',
    "WbAuto": '\ue42c',
    "WbCloudy": '\uf15c',
    "WbIncandescent": '\ue42e',
    "WbIridescent": '\uf07d',
    "WbShade": '\uea01',
    "WbSunny": '\ue430',
    "WbTwilight": '\ue1c6',
    "Wc": '\ue63d',
    "WeatherHail": '\uf67f',
    "WeatherMix": '\uf60b',
    "WeatherSnowy": '\ue2cd',
    "Web": '\ue051',
    "WebAsset": '\ue069',
    "WebAssetOff": '\uef47',
    "WebStories": '\ue595',
    "Webhook": '\ueb92',
    "Weekend": '\ue16b',
    "Weight": '\ue13d',
    "West": '\uf1e6',
    "Whatshot": '\ue80e',
    "WheelchairPickup": '\uf1ab',
    "WhereToVote": '\ue177',
    "Widgets": '\ue1bd',
    "Width": '\uf730',
    "WidthFull": '\uf8f5',
    "WidthNormal": '\uf8f6',
    "WidthWide": '\uf8f7',
    "Wifi": '\ue63e',
    "Wifi1Bar": '\ue4ca',
    "Wifi2Bar": '\ue4d9',
    "WifiAdd": '\uf7a8',
    "WifiCalling": '\uef77',
    "WifiCalling1": '\uf0f6',
    "WifiCalling2": '\uf0f6',
    "WifiCalling3": '\uf0f6',
    "WifiChannel": '\ueb6a',
    "WifiFind": '\ueb31',
    "WifiHome": '\uf671',
    "WifiLock": '\ue1e1',
    "WifiNotification": '\uf670',
    "WifiOff": '\ue648',
    "WifiPassword": '\ueb6b',
    "WifiProtectedSetup": '\uf0fc',
    "WifiProxy": '\uf7a7',
    "WifiTethering": '\ue1e2',
    "WifiTetheringError": '\uead9',
    "WifiTetheringOff": '\uf087',
    "WindPower": '\uec0c',
    "Window": '\uf088',
    "WindowClosed": '\ue77e',
    "WindowOpen": '\ue78c',
    "WindowSensor": '\ue2bb',
    "WineBar": '\uf1e8',
    "Woman": '\ue13e',
    "Woman2": '\uf8e7',
    "Work": '\ue943',
    "WorkAlert": '\uf5f7',
    "WorkHistory": '\uec09',
    "WorkOff": '\ue942',
    "WorkOutline": '\ue943',
    "WorkUpdate": '\uf5f8',
    "Workflow": '\uea04',
    "WorkspacePremium": '\ue7af',
    "Workspaces": '\uea0f',
    "WorkspacesOutline": '\uea0f',
    "WoundsInjuries": '\ue13f',
    "WrapText": '\ue25b',
    "Wrist": '\uf69c',
    "WrongLocation": '\uef78',
    "Wysiwyg": '\uf1c3',
    "Yard": '\uf089',
    "YourTrips": '\ueb2b',
    "YoutubeActivity": '\uf85a',
    "YoutubeSearchedFor": '\ue8fa',
    "ZonePersonAlert": '\ue781',
    "ZonePersonIdle": '\ue77a',
    "ZonePersonUrgent": '\ue788',
    "ZoomIn": '\ue8ff',
    "ZoomInMap": '\ueb2d',
    "ZoomOut": '\ue900',
    "ZoomOutMap": '\ue56b'
};
const Icons = Object.freeze(materialIcons);

const styles$3 = i$2`:host {
    display: inline-flex;
    --material-icon-size-xxs: 12px;
    --material-icon-font-size-xxs: 12px;
    --material-icon-size-xs: 16px;
    --material-icon-font-size-xs: 16px;
    --material-icon-size-s: 20px;
    --material-icon-font-size-s: 20px;
    --material-icon-size-n: 24px;
    --material-icon-font-size-n: 24px;
    --material-icon-size-m: 32px;
    --material-icon-font-size-m: 32px;
    --material-icon-size-l: 40px;
    --material-icon-font-size-l: 40px;
    --material-icon-size-xl: 48px;
    --material-icon-font-size-xl: 48px;
    --material-icon-size-xxl: 64px;
    --material-icon-font-size-xxl: 64px;
    line-height: 1;
    overflow: visible;
    align-items: center;
    justify-content: center;
    font-family: MaterialSymbolsSharp;
    font-style: normal;
    font-weight: normal !important;
    font-variant: normal;
    text-transform: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-variation-settings: var(--font-variation-settings);
}

:host([outlined]) {
    font-family: MaterialSymbolsOutlined;
}
:host([rounded]) {
    font-family: MaterialSymbolsRounded;
}

:host([size='xxs']) {
    min-width: var(--material-icon-size-xxs);
    max-width: var(--material-icon-size-xxs);
    min-height: var(--material-icon-size-xxs);
    max-height: var(--material-icon-size-xxs);
    font-size: var(--material-icon-font-size-xxs);
}

:host([size='xs']) {
    min-width: var(--material-icon-size-xs);
    max-width: var(--material-icon-size-xs);
    min-height: var(--material-icon-size-xs);
    max-height: var(--material-icon-size-xs);
    font-size: var(--material-icon-font-size-xs);
}

:host([size='s']) {
    min-width: var(--material-icon-size-s);
    max-width: var(--material-icon-size-s);
    min-height: var(--material-icon-size-s);
    max-height: var(--material-icon-size-s);
    font-size: var(--material-icon-font-size-s);
}

:host([size='n']) {
    min-width: var(--material-icon-size-n);
    max-width: var(--material-icon-size-n);
    min-height: var(--material-icon-size-n);
    max-height: var(--material-icon-size-n);
    font-size: var(--material-icon-font-size-n);
}

:host([size='m']) {
    min-width: var(--material-icon-size-m);
    max-width: var(--material-icon-size-m);
    min-height: var(--material-icon-size-m);
    max-height: var(--material-icon-size-m);
    font-size: var(--material-icon-font-size-m);
}

:host([size='l']) {
    min-width: var(--material-icon-size-l);
    max-width: var(--material-icon-size-l);
    min-height: var(--material-icon-size-l);
    max-height: var(--material-icon-size-l);
    font-size: var(--material-icon-font-size-l);
}

:host([size='xl']) {
    min-width: var(--material-icon-size-xl);
    max-width: var(--material-icon-size-xl);
    min-height: var(--material-icon-size-xl);
    max-height: var(--material-icon-size-xl);
    font-size: var(--material-icon-font-size-xl);
}

:host([size='xxl']) {
    min-width: var(--material-icon-size-xxl);
    max-width: var(--material-icon-size-xxl);
    min-height: var(--material-icon-size-xxl);
    max-height: var(--material-icon-size-xxl);
    font-size: var(--material-icon-font-size-xxl);
}
`;

class MaterialIcon extends h {
    constructor() {
        super(...arguments);
        this.size = "n";
        this.outlined = false;
        this.rounded = false;
        this.sharp = true;
        this.fill = false;
    }
    static get styles() {
        return [styles$3];
    }
    render() {
        return ke `<span>${this._glyph}</span>`;
    }
    willUpdate(changes) {
        if (changes.has("glyph")) {
            this._glyph = this.getGlyph();
        }
        super.willUpdate(changes);
    }
    updated(changed) {
        if (changed.has("weight") || changed.has("fill")) {
            const fontVariations = [];
            if (this.hasAttribute("weight")) {
                fontVariations.push(`'wght' ${this.getAttribute("weight")}`);
            }
            if (this.hasAttribute("fill")) {
                fontVariations.push("'FILL' 1");
            }
            else {
                fontVariations.push("'FILL' 0");
            }
            this.style.setProperty("--font-variation-settings", fontVariations.join(", "));
        }
        super.updated(changed);
    }
    getGlyph() {
        const name = this.getAttribute("glyph");
        return name ? Icons[name] : "";
    }
}
__decorate([
    n({ type: String }),
    __metadata("design:type", String)
], MaterialIcon.prototype, "glyph", void 0);
__decorate([
    n({ type: String, reflect: true }),
    __metadata("design:type", String)
], MaterialIcon.prototype, "size", void 0);
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "outlined", void 0);
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "rounded", void 0);
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "sharp", void 0);
__decorate([
    n(),
    __metadata("design:type", Number)
], MaterialIcon.prototype, "weight", void 0);
__decorate([
    n({ type: Boolean }),
    __metadata("design:type", Object)
], MaterialIcon.prototype, "fill", void 0);
defineElement(`${prefix}-material-icon`, MaterialIcon);

const styles$2 = i$2`:host {
    position: relative;
    display: block;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid darkgray;
}

div[role='list'] {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    height: 100%;
    width: 100%;
    align-content: flex-start;
}
`;

const styles$1 = i$2`:host {
    display: flex;
    flex-direction: column;
    border: 1px solid darkgray;
    min-width: 82px;
    max-width: 82px;
    height: 110px;
    justify-items: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
}

:host([selected]), :host([selected]:hover) {
    border: 1px solid red;
}

    :host(:hover) {
        background-color: #F0F0F0;
        color: black;
        border: 1px solid #333;
    }

.caption {
    padding: 0;
    overflow: hidden;
    width: 100%;
    text-align: center;
    pointer-events: none;
}

    .caption > div {
        white-space: nowrap;
        margin: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
    }

.icon {
    margin: auto;
    width: 100%;
    text-align: center;
    padding-top: 8px;
    pointer-events: none;
}
`;

var IconType;
(function (IconType) {
    IconType[IconType["Material"] = 0] = "Material";
    IconType[IconType["Fluent"] = 1] = "Fluent";
    IconType[IconType["Fabric"] = 2] = "Fabric";
})(IconType || (IconType = {}));
class IconListItem extends NeutrinoElement {
    constructor() {
        super(...arguments);
        this.value = undefined;
        this.type = IconType.Material;
        this.size = "n";
        this.selected = false;
    }
    static get styles() {
        return [styles$1];
    }
    get parentSet() {
        if (!this._parentSet) {
            this._parentSet = this.closest("neu-iconlist");
        }
        return this._parentSet;
    }
    willUpdate(changes) {
        if (changes.has("value")) {
            this.setAttribute("title", this.value);
        }
        super.willUpdate(changes);
    }
    update(changes) {
        if (!this.hasAttribute("slot")) {
            this.slot = "items";
        }
        super.update(changes);
    }
    render() {
        return ke `<div class="icon"><neu-material-icon glyph="${this.value}" size="${this.size}"></neu-material-icon></div>
        <div class="caption"><div>${this.value}</div></div>`;
    }
    connectedCallback() {
        super.connectedCallback();
        this._handleClick = this.handleClick.bind(this);
        this.addEventListener("click", this._handleClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("click", this._handleClick);
    }
    handleSelect(event) {
        this.selected = event.target === this;
    }
    handleClick(event) {
        if (this.parentSet) {
            this.parentSet.selected = this;
        }
    }
}
__decorate([
    n(),
    __metadata("design:type", Object)
], IconListItem.prototype, "value", void 0);
__decorate([
    n(),
    __metadata("design:type", Number)
], IconListItem.prototype, "type", void 0);
__decorate([
    n(),
    __metadata("design:type", String)
], IconListItem.prototype, "size", void 0);
__decorate([
    n({ type: Boolean, reflect: true }),
    __metadata("design:type", Boolean)
], IconListItem.prototype, "selected", void 0);
class IconList extends NeutrinoElement {
    constructor() {
        super(...arguments);
        this.type = IconType.Material;
        this.size = "n";
    }
    static get styles() {
        return [styles$2];
    }
    render() {
        return ke `<div role="list"><slot name="items"></slot></div>`;
    }
    updated(changes) {
        if (changes.has("filter")) {
            this.addChildren();
        }
    }
    getIcons(icons) {
        return Object
            .entries(icons)
            .map(icon => ke `<neu-iconlist-item type="${this.type}" size="${this.size}" value="${icon[0]}"></neu-iconlist-item>`);
    }
    addChildren() {
        if (this.type) {
            const createItem = (key) => {
                const element = document.createElement("neu-iconlist-item");
                element.type = this.type;
                element.size = this.size;
                element.value = key;
                return element;
            };
            let predicate;
            if (this.filter) {
                const filterLower = this.filter.toUpperCase();
                predicate = (key) => {
                    return key.toUpperCase().includes(filterLower);
                };
            }
            else {
                predicate = (key) => true;
            }
            const children = [];
            for (const icon in Icons) {
                if (predicate(icon)) {
                    children.push(createItem(icon));
                }
            }
            this.replaceChildren(...children);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.addChildren();
    }
    get selected() {
        return this._selectedItem;
    }
    set selected(value) {
        if (this._selectedItem !== value) {
            if (this._selectedItem) {
                this._selectedItem.selected = false;
            }
            this._selectedItem = value;
            if (this._selectedItem) {
                this._selectedItem.selected = true;
            }
        }
    }
    handleSelect(event) {
        event.stopPropagation();
        if (this.value == event.detail.value) {
            return;
        }
        const oldValue = this.value;
        this.value = event.detail.value;
        const applyDefault = this.dispatchEvent(new Event("change", { bubbles: true, composed: true, cancelable: true }));
        if (!applyDefault) {
            this.value = oldValue;
            event.target.selected = false;
            event.preventDefault();
        }
        else {
            this.querySelectorAll("nav-iconlist-item").forEach((item) => item.handleSelect(event));
        }
    }
}
__decorate([
    n({ reflect: true }),
    __metadata("design:type", Object)
], IconList.prototype, "value", void 0);
__decorate([
    n({ attribute: "type" }),
    __metadata("design:type", Number)
], IconList.prototype, "type", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", String)
], IconList.prototype, "filter", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", String)
], IconList.prototype, "size", void 0);
defineElement(`${prefix}-iconlist`, IconList);
defineElement(`${prefix}-iconlist-item`, IconListItem);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bt=e(class extends i{constructor(){super(...arguments),this.key=D;}render(r,t){return this.key=r,t}update(r,[t,e]){return t!==this.key&&(dt(r),this.key=t),e}});

const styles = i$2`:host {
    --grid-bg: #0F1115;
    --grid-surface: #1A1D23;
    --grid-border: #2D3748;
    --grid-text: #E2E8F0;
    --grid-muted: #64748B;
    --grid-accent: #3B82F6;
    --grid-emerald: #10B981;
    --grid-amber: #F59E0B;
    --grid-red: #EF4444;
    --row-height: 48px;
    --header-height: 48px;
    --cell-padding: 0 24px;
    --header-padding: 12px 24px;
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--grid-bg);
    color: var(--grid-text);
    font-family: var(--font-sans);
    overflow: hidden;
    box-sizing: border-box;
    outline: none;
}

:host([density="compact"]) {
    --row-height: 32px;
    --header-height: 36px;
    --cell-padding: 0 12px;
    --header-padding: 8px 12px;
}

*, *::before, *::after {
    box-sizing: border-box;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: var(--grid-surface);
    border-bottom: 1px solid var(--grid-border);
    gap: 16px;
}

.search-container {
    position: relative;
    flex: 1;
    max-width: 400px;
}

.search-input {
    width: 100%;
    background: var(--grid-bg);
    border: 1px solid var(--grid-border);
    border-radius: 4px;
    padding: 8px 12px 8px 36px;
    color: var(--grid-text);
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
}

    .search-input:focus {
        border-color: var(--grid-accent);
    }

.icon-search {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--grid-muted);
    pointer-events: none;
}

.controls {
    display: flex;
    gap: 8px;
}

.grid-container {
    flex: 1;
    position: relative;
    background: var(--grid-surface);
    border: 1px solid var(--grid-border);
    margin: 16px;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.group-panel {
    padding: 12px 24px;
    background: var(--grid-surface);
    border-bottom: 1px solid var(--grid-border);
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 52px;
    color: var(--grid-muted);
    font-size: 11px;
    transition: background 0.2s;
}

    .group-panel.drag-over {
        background: rgba(59, 130, 246, 0.1);
        border-bottom-color: var(--grid-accent);
    }

.group-tag {
    background: var(--grid-bg);
    border: 1px solid var(--grid-border);
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--grid-text);
    font-weight: bold;
    cursor: pointer;
}

.group-idx {
    background: var(--grid-amber);
    color: black;
    font-size: 8px;
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
}

.grid-header {
    display: flex;
    background: #14171D;
    border-bottom: 1px solid var(--grid-border);
    z-index: 10;
    width: 100%;
    overflow: hidden;
    flex-shrink: 0;
    height: var(--header-height);
}

.header-cell {
    padding: var(--header-padding);
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--grid-muted);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.2s, opacity 0.2s;
}

    .header-cell.dragging {
        opacity: 0.4;
    }

    .header-cell.drop-target {
        border-left: 2px solid var(--grid-accent);
    }

    .header-cell:hover {
        background: rgba(255, 255, 255, 0.05);
    }

.resize-handle {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: col-resize;
    background: transparent;
    transition: background 0.1s;
    z-index: 20;
}

    .resize-handle:hover, .resize-handle.active {
        background: var(--grid-accent);
    }

.grid-body {
    flex: 1;
    overflow: auto;
    position: relative;
}

.virtual-spacer {
    width: 100%;
    pointer-events: none;
}

.rows-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.grid-row {
    display: flex;
    height: var(--row-height);
    border-bottom: 1px solid rgba(45, 55, 72, 0.2);
    align-items: center;
    transition: background 0.1s;
    cursor: pointer;
    user-select: none;
}

    .grid-row:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    .grid-row.selected {
        background: rgba(59, 130, 246, 0.15) !important;
    }

    .grid-row.focused {
        outline: 1px inset var(--grid-accent);
        z-index: 2;
    }

.grid-cell {
    padding: var(--cell-padding);
    font-size: 13px;
    font-family: var(--font-mono);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 100%;
}

.selection-cell, .selection-header {
    width: 48px;
    min-width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    flex-shrink: 0;
}

.selection-cell {
    border-right: 1px solid rgba(45, 55, 72, 0.1);
}

.selection-header {
    border-right: 1px solid var(--grid-border);
}

.checkbox, .radio {
    width: 18px;
    height: 18px;
    border: 2px solid var(--grid-border);
    background: var(--grid-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
}

.radio {
    border-radius: 50%;
}

.checkbox {
    border-radius: 4px;
}

    .checkbox.checked, .radio.checked {
        background: var(--grid-accent);
        border-color: var(--grid-accent);
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
    }

        .checkbox.checked::after {
            content: '✓';
            color: white;
            font-size: 11px;
            font-weight: 900;
        }

        .radio.checked::after {
            content: '';
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
        }

.group-header {
    display: flex;
    align-items: center;
    height: var(--row-height);
    padding: var(--cell-padding);
    background: #0A0C10;
    border-bottom: 1px solid var(--grid-border);
    cursor: pointer;
    z-index: 5;
    position: sticky;
    left: 0;
}

.group-label {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--grid-amber);
}

.badge {
    margin-left: 12px;
    padding: 2px 6px;
    background: rgba(45, 55, 72, 0.4);
    border-radius: 4px;
    font-size: 9px;
    color: var(--grid-muted);
}

.collapse-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    transition: transform 0.2s;
    font-size: 8px;
    color: var(--grid-amber);
}

.footer {
    padding: 12px 24px;
    background: var(--grid-surface);
    border-top: 1px solid var(--grid-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
}

.pagination {
    display: flex;
    gap: 8px;
    align-items: center;
}

.btn {
    background: var(--grid-bg);
    border: 1px solid var(--grid-border);
    color: var(--grid-muted);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.2s;
}

    .btn:hover {
        border-color: var(--grid-accent);
        color: var(--grid-text);
    }

    .btn.active {
        background: var(--grid-accent);
        color: white;
        border-color: var(--grid-accent);
    }

    .btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-flex;
    margin-right: 8px;
    flex-shrink: 0;
}

.status-active {
    background: var(--grid-emerald);
    box-shadow: 0 0 8px var(--grid-emerald);
}

.status-inactive {
    background: var(--grid-muted);
}

.loading-overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 17, 21, 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 2px solid var(--grid-accent);
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.selection-header {
    width: 48px;
    min-width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid var(--grid-border);
    flex-shrink: 0;
}

.group-btn {
    margin-left: 8px;
    opacity: 0.4;
    transition: opacity 0.2s;
    background: none;
    border: none;
    font-size: 10px;
    cursor: pointer;
    color: inherit;
    padding: 0;
    display: flex;
    align-items: center;
}

    .group-btn:hover {
        opacity: 1;
    }

    .group-btn.active {
        opacity: 1;
        color: var(--grid-amber);
    }

.sticky-footer-container {
    overflow: hidden;
    background: #0A0C10;
    border-top: 1px solid var(--grid-border);
    flex-shrink: 0;
}

.grid-sticky-footer {
    background: #0A0C10;
    width: max-content;
}

.grid-footer-row {
    display: flex;
    height: var(--row-height);
    align-items: center;
}

.footer-cell {
    padding: var(--cell-padding);
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--grid-emerald);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: var(--grid-bg);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--grid-border);
    border-radius: 4px;
}

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: var(--grid-muted);
    }

.custom-scrollbar::-webkit-scrollbar-corner {
    background: var(--grid-bg);
}
`;

let QuantumGrid = class QuantumGrid extends h {
    constructor() {
        super(...arguments);
        this.data = [];
        this.total = 0;
        this.page = 1;
        this.pageSize = 100;
        this.loading = false;
        this.currentScrollTop = 0;
        this.searchTerm = '';
        this.density = 'standard';
        this.paginationEnabled = true;
        this.aggregatesEnabled = true;
        this.showGroupPanel = true;
        this.multiSort = [];
        this.multiGrouping = [];
        this.collapsedGroups = new Set();
        this.columns = [];
        this.draggingColumn = null;
        this.selectedIds = new Set();
        this.focusedId = null;
        this.selectionMode = 'multiple';
        this.showSelection = true;
        this._collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        this._resizeObserver = null;
        this.resizer = null;
        this._resizeFrame = null;
        this._cachedProcessedData = [];
        this._cachedDisplayRows = [];
        this._cachedGlobalAggs = null;
        this._lastFilterKey = '';
        this._lastGroupKey = '';
        this._activeCols = [];
        this._totalWidth = 0;
        this._displayRows = [];
        this._globalAggs = null;
        this._idToDataIndexMap = new Map();
        this._searchRegExp = null;
        this._resizeTimeout = null;
        this.onMouseMove = (e) => {
            if (!this.resizer)
                return;
            if (this._resizeFrame)
                return;
            this._resizeFrame = requestAnimationFrame(() => {
                if (!this.resizer)
                    return;
                const delta = e.pageX - this.resizer.startX;
                const newWidth = Math.max(50, this.resizer.startWidth + delta);
                this.columns = this.columns.map(c => c.key === this.resizer?.key ? { ...c, width: newWidth } : c);
                this._resizeFrame = null;
            });
        };
        this.onMouseUp = () => {
            if (!this.resizer)
                return;
            this.resizer = null;
            document.body.style.cursor = '';
            if (this._resizeFrame) {
                cancelAnimationFrame(this._resizeFrame);
                this._resizeFrame = null;
            }
        };
    }
    _syncColumnsFromTags() {
        if (this._colElements && this._colElements.length > 0) {
            this.columns = this._colElements.map(el => {
                const columnKey = (el.key || el.columnKey || el.name || el.getAttribute('column-key') || el.getAttribute('key') || el.getAttribute('name') || '');
                return {
                    key: columnKey,
                    label: el.label || el.title || el.getAttribute('label') || el.getAttribute('title') || String(columnKey).toUpperCase(),
                    visible: !el.hidden && !el.hasAttribute('hidden'),
                    width: Number(el.width) || 150,
                    align: (el.align || el.getAttribute('align') || 'left'),
                    aggType: (el.aggType || el.getAttribute('agg-type')),
                    dataType: el.dataType || el.getAttribute('data-type') || undefined
                };
            });
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.fetchData();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this.tabIndex = 0;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        if (this._resizeObserver)
            this._resizeObserver.disconnect();
        if (this._resizeFrame)
            cancelAnimationFrame(this._resizeFrame);
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('data')) {
            this._lastFilterKey = '';
            this._lastGroupKey = '';
        }
        if (changedProperties.has('data') ||
            changedProperties.has('searchTerm') ||
            changedProperties.has('multiGrouping') ||
            changedProperties.has('multiSort') ||
            changedProperties.has('collapsedGroups') ||
            changedProperties.has('columns') ||
            changedProperties.has('showSelection') ||
            changedProperties.has('aggregatesEnabled') ||
            changedProperties.has('paginationEnabled')) {
            this._activeCols = this.columns.filter(c => c.visible);
            this._totalWidth = this._activeCols.reduce((sum, c) => sum + (c.width || 150), 0) + (this.showSelection ? 48 : 0);
            if (this.searchTerm) {
                this._searchRegExp = new RegExp(`(${this.searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            }
            else {
                this._searchRegExp = null;
            }
            const { rows, globalAggs } = this.getDisplayRows();
            this._displayRows = rows;
            this._globalAggs = globalAggs;
            this._idToDataIndexMap.clear();
            for (let i = 0; i < this._displayRows.length; i++) {
                const row = this._displayRows[i];
                const id = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                if (id !== null) {
                    this._idToDataIndexMap.set(id, i);
                }
            }
        }
    }
    firstUpdated() {
        if (this.bodyElement) {
            this._resizeObserver = new ResizeObserver(() => {
                if (this._resizeTimeout)
                    cancelAnimationFrame(this._resizeTimeout);
                this._resizeTimeout = requestAnimationFrame(() => this.requestUpdate());
            });
            this._resizeObserver.observe(this.bodyElement);
        }
    }
    async fetchData() {
        this.loading = true;
        try {
            const url = this.paginationEnabled
                ? `/api/data?page=${this.page}&pageSize=${this.pageSize}`
                : `/api/data?all=true`;
            const response = await fetch(url);
            const result = await response.json();
            this.data = result.data;
            this.total = result.total;
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
        finally {
            this.loading = false;
        }
    }
    highlightText(text, search) {
        if (!search || !this._searchRegExp)
            return text;
        const str = String(text);
        if (!str.toLowerCase().includes(search.toLowerCase()))
            return text;
        const parts = str.split(this._searchRegExp);
        return ke `${parts.map(p => p.toLowerCase() === search.toLowerCase()
            ? ke `<mark style="background: rgba(245, 158, 11, 0.3); color: inherit; border-radius: 2px; padding: 0 1px;">${p}</mark>`
            : p)}`;
    }
    onSearch(e) {
        this.searchTerm = e.target.value;
        this.page = 1;
    }
    toggleDensity() {
        this.density = this.density === 'standard' ? 'compact' : 'standard';
        if (this.density === 'compact') {
            this.setAttribute('density', 'compact');
        }
        else {
            this.removeAttribute('density');
        }
    }
    toggleMode() {
        this.paginationEnabled = !this.paginationEnabled;
        this.page = 1;
        this.currentScrollTop = 0;
        if (this.bodyElement)
            this.bodyElement.scrollTop = 0;
        this.fetchData();
    }
    toggleAggregates() {
        this.aggregatesEnabled = !this.aggregatesEnabled;
    }
    handleColumnToggle(e) {
        const key = e.target.value;
        if (!key)
            return;
        this.columns = this.columns.map(c => c.key === key ? { ...c, visible: !c.visible } : c);
        e.target.value = '';
    }
    handleSort(key, isMulti) {
        const existingIndex = this.multiSort.findIndex(s => s.key === key);
        const isGroup = this.multiGrouping.includes(key);
        if (isMulti) {
            if (existingIndex === -1) {
                this.multiSort = [...this.multiSort, { key, order: 'asc' }];
            }
            else if (this.multiSort[existingIndex].order === 'asc') {
                const newSort = [...this.multiSort];
                newSort[existingIndex] = { ...newSort[existingIndex], order: 'desc' };
                this.multiSort = newSort;
            }
            else {
                if (isGroup) {
                    const newSort = [...this.multiSort];
                    newSort[existingIndex] = { ...newSort[existingIndex], order: 'asc' };
                    this.multiSort = newSort;
                }
                else {
                    this.multiSort = this.multiSort.filter((_, i) => i !== existingIndex);
                }
            }
        }
        else {
            const groupSorts = this.multiSort.filter(s => this.multiGrouping.includes(s.key));
            const currentSort = this.multiSort[existingIndex];
            const otherGroupSorts = groupSorts.filter(s => s.key !== key);
            if (!currentSort) {
                this.multiSort = [...otherGroupSorts, { key, order: 'asc' }];
            }
            else if (currentSort.order === 'asc') {
                this.multiSort = [...otherGroupSorts, { key, order: 'desc' }];
            }
            else {
                if (isGroup) {
                    this.multiSort = [...otherGroupSorts, { key, order: 'asc' }];
                }
                else {
                    this.multiSort = [...otherGroupSorts];
                }
            }
        }
        this.reorderSort();
    }
    reorderSort() {
        const groupSorts = this.multiGrouping.map(key => {
            const existing = this.multiSort.find(s => s.key === key);
            return { key, order: existing ? existing.order : 'asc' };
        });
        const otherSorts = this.multiSort.filter(s => !this.multiGrouping.includes(s.key));
        this.multiSort = [...groupSorts, ...otherSorts];
    }
    toggleGroup(key) {
        if (this.multiGrouping.includes(key)) {
            this.multiGrouping = this.multiGrouping.filter(k => k !== key);
            this.multiSort = this.multiSort.filter(s => s.key !== key);
        }
        else {
            this.multiGrouping = [...this.multiGrouping, key];
            if (!this.multiSort.find(s => s.key === key)) {
                this.multiSort = [...this.multiSort, { key, order: 'asc' }];
            }
        }
        this.reorderSort();
    }
    toggleGroupCollapse(path) {
        const newCollapsed = new Set(this.collapsedGroups);
        if (newCollapsed.has(path)) {
            newCollapsed.delete(path);
        }
        else {
            newCollapsed.add(path);
        }
        this.collapsedGroups = newCollapsed;
    }
    handleRowClick(e, item) {
        const isMulti = e.ctrlKey || e.metaKey || this.selectionMode === 'multiple';
        const isRange = e.shiftKey;
        this.toggleSelection(item.id, isMulti, isRange);
        this.focusedId = item.id;
    }
    toggleSelection(id, isMulti, isRange) {
        const newSelected = new Set(this.selectedIds);
        if (this.selectionMode === 'single') {
            newSelected.clear();
            newSelected.add(id);
        }
        else {
            if (isRange && this.focusedId !== null) {
                const startIdx = this._idToDataIndexMap.get(this.focusedId) ?? -1;
                const endIdx = this._idToDataIndexMap.get(id) ?? -1;
                if (startIdx > -1 && endIdx > -1) {
                    const min = Math.min(startIdx, endIdx);
                    const max = Math.max(startIdx, endIdx);
                    if (!isMulti)
                        newSelected.clear();
                    for (let i = min; i <= max; i++) {
                        const row = this._displayRows[i];
                        const rowId = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                        if (rowId !== null)
                            newSelected.add(rowId);
                    }
                }
            }
            else if (isMulti) {
                if (newSelected.has(id)) {
                    newSelected.delete(id);
                }
                else {
                    newSelected.add(id);
                }
            }
            else {
                newSelected.clear();
                newSelected.add(id);
            }
        }
        this.selectedIds = new Set(newSelected);
    }
    selectAll() {
        const processed = this.getProcessedData();
        if (this.selectedIds.size === processed.length && processed.length > 0) {
            this.selectedIds = new Set();
        }
        else {
            this.selectedIds = new Set(processed.map(d => d.id));
        }
    }
    onKeyDown(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const displayRows = this._displayRows;
            if (displayRows.length === 0)
                return;
            let nextIdx = -1;
            if (this.focusedId !== null) {
                const currentIdx = this._idToDataIndexMap.get(this.focusedId) ?? -1;
                if (currentIdx !== -1) {
                    let searchIdx = e.key === 'ArrowDown' ? currentIdx + 1 : currentIdx - 1;
                    while (searchIdx >= 0 && searchIdx < displayRows.length) {
                        const row = displayRows[searchIdx];
                        const id = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                        if (id !== null) {
                            nextIdx = searchIdx;
                            break;
                        }
                        searchIdx = e.key === 'ArrowDown' ? searchIdx + 1 : searchIdx - 1;
                    }
                }
            }
            else if (e.key === 'ArrowDown') {
                for (let i = 0; i < displayRows.length; i++) {
                    const row = displayRows[i];
                    const id = row.type ? (row.type === 'row' ? row.data.id : null) : row.id;
                    if (id !== null) {
                        nextIdx = i;
                        break;
                    }
                }
            }
            if (nextIdx !== -1) {
                const nextRow = displayRows[nextIdx];
                const id = nextRow.type ? nextRow.data.id : nextRow.id;
                this.focusedId = id;
                this.toggleSelection(id, e.shiftKey, e.shiftKey);
                const rowHeight = this.density === 'compact' ? 32 : 48;
                const targetTop = nextIdx * rowHeight;
                if (this.bodyElement) {
                    if (targetTop < this.bodyElement.scrollTop) {
                        this.bodyElement.scrollTop = targetTop;
                    }
                    else if (targetTop + rowHeight > this.bodyElement.scrollTop + this.bodyElement.clientHeight) {
                        this.bodyElement.scrollTop = targetTop - this.bodyElement.clientHeight + rowHeight;
                    }
                }
            }
        }
    }
    startResizing(e, key, width) {
        e.preventDefault();
        e.stopPropagation();
        this.resizer = { key, startX: e.pageX, startWidth: width };
        document.body.style.cursor = 'col-resize';
    }
    onDragStart(e, key) {
        this.draggingColumn = key;
        e.dataTransfer?.setData('text/plain', String(key));
        if (e.dataTransfer)
            e.dataTransfer.effectAllowed = 'move';
    }
    onDragOver(e, type) {
        e.preventDefault();
        if (e.dataTransfer)
            e.dataTransfer.dropEffect = 'move';
        if (type === 'panel') {
            e.currentTarget.classList.add('drag-over');
        }
        else {
            e.currentTarget.classList.add('drop-target');
        }
    }
    onDragLeave(e) {
        e.currentTarget.classList.remove('drag-over', 'drop-target');
    }
    onDrop(e, targetKey) {
        e.preventDefault();
        const sourceKey = e.dataTransfer?.getData('text/plain');
        const panel = this.shadowRoot?.querySelector('.group-panel');
        panel?.classList.remove('drag-over');
        this.shadowRoot?.querySelectorAll('.header-cell').forEach(h => h.classList.remove('drop-target'));
        if (!sourceKey)
            return;
        if (!targetKey) {
            if (!this.multiGrouping.includes(sourceKey)) {
                this.toggleGroup(sourceKey);
            }
            return;
        }
        if (sourceKey === targetKey)
            return;
        const newCols = [...this.columns];
        const srcIdx = newCols.findIndex(c => c.key === sourceKey);
        const destIdx = newCols.findIndex(c => c.key === targetKey);
        if (srcIdx > -1 && destIdx > -1) {
            const [removed] = newCols.splice(srcIdx, 1);
            newCols.splice(destIdx, 0, removed);
            this.columns = newCols;
        }
        this.draggingColumn = null;
    }
    onDragEnd() {
        this.draggingColumn = null;
        this.shadowRoot?.querySelectorAll('.header-cell').forEach(h => h.classList.remove('drop-target', 'dragging'));
        this.shadowRoot?.querySelector('.group-panel')?.classList.remove('drag-over');
    }
    onBodyScroll() {
        if (this.bodyElement) {
            this.currentScrollTop = this.bodyElement.scrollTop;
            const sl = this.bodyElement.scrollLeft;
            if (this.headerElement)
                this.headerElement.scrollLeft = sl;
            if (this.footerElement)
                this.footerElement.scrollLeft = sl;
            this.requestUpdate();
        }
    }
    getProcessedData() {
        const filterKey = `${this.searchTerm}|${this.multiSort.map(s => `${String(s.key)}:${s.order}`).join(',')}`;
        if (this._lastFilterKey === filterKey && this._cachedProcessedData.length > 0) {
            return this._cachedProcessedData;
        }
        let result = [...this.data];
        if (this.searchTerm) {
            const lower = this.searchTerm.toLowerCase();
            result = result.filter(item => {
                for (const col of this.columns) {
                    const val = item[col.key];
                    if (val != null && String(val).toLowerCase().includes(lower)) {
                        return true;
                    }
                }
                return false;
            });
        }
        if (this.multiSort.length > 0) {
            const collator = this._collator;
            result.sort((a, b) => {
                for (const sort of this.multiSort) {
                    const aVal = a[sort.key];
                    const bVal = b[sort.key];
                    if (aVal !== bVal) {
                        const modifier = sort.order === 'asc' ? 1 : -1;
                        if (typeof aVal === 'number' && typeof bVal === 'number') {
                            return (aVal - bVal) * modifier;
                        }
                        return collator.compare(String(aVal), String(bVal)) * modifier;
                    }
                }
                return 0;
            });
        }
        this._cachedProcessedData = result;
        this._lastFilterKey = filterKey;
        return result;
    }
    calculateAggregates(items) {
        if (!this.aggregatesEnabled)
            return null;
        const aggs = {};
        this.columns.forEach(col => {
            if (!col.aggType)
                return;
            const values = items.map(d => Number(d[col.key]) || 0);
            if (col.aggType === 'sum') {
                aggs[col.key] = values.reduce((a, b) => a + b, 0);
            }
            else if (col.aggType === 'avg') {
                aggs[col.key] = values.reduce((a, b) => a + b, 0) / (values.length || 1);
            }
            else if (col.aggType === 'count') {
                aggs[col.key] = items.length;
            }
        });
        return aggs;
    }
    getDisplayRows() {
        const processed = this.getProcessedData();
        const groupKey = `${this.multiGrouping.join(',')}|${this.collapsedGroups.size}|${this.aggregatesEnabled}|${this._lastFilterKey}`;
        if (this._lastGroupKey === groupKey && this._cachedDisplayRows.length > 0) {
            return { rows: this._cachedDisplayRows, globalAggs: this._cachedGlobalAggs };
        }
        let rows = [];
        let globalAggs = null;
        if (this.multiGrouping.length === 0) {
            rows = processed;
            globalAggs = this.calculateAggregates(processed);
        }
        else {
            const groupRecursive = (items, level, path) => {
                if (level >= this.multiGrouping.length) {
                    return { type: 'data', items };
                }
                const key = this.multiGrouping[level];
                const groups = {};
                items.forEach(item => {
                    const val = String(item[key]);
                    if (!groups[val])
                        groups[val] = [];
                    groups[val].push(item);
                });
                const sort = this.multiSort.find(s => s.key === key);
                const order = sort ? sort.order : 'asc';
                const sortedKeys = Object.keys(groups).sort((a, b) => {
                    const modifier = order === 'asc' ? 1 : -1;
                    return this._collator.compare(a, b) * modifier;
                });
                return {
                    type: 'node',
                    key,
                    level,
                    children: sortedKeys.map(name => {
                        const subItems = groups[name];
                        const currentPath = path ? `${path}|${name}` : name;
                        return {
                            name,
                            path: currentPath,
                            aggs: this.calculateAggregates(subItems),
                            subtree: groupRecursive(subItems, level + 1, currentPath),
                            count: subItems.length
                        };
                    })
                };
            };
            const tree = groupRecursive(processed, 0, '');
            const flat = [];
            const flatten = (node) => {
                if (node.type === 'data') {
                    node.items.forEach((d) => flat.push({ type: 'row', data: d, level: this.multiGrouping.length }));
                    return;
                }
                node.children.forEach((child) => {
                    const isCollapsed = this.collapsedGroups.has(child.path);
                    flat.push({
                        type: 'header',
                        label: child.name,
                        count: child.count,
                        level: node.level,
                        path: child.path,
                        collapsed: isCollapsed,
                        aggregates: child.aggs
                    });
                    if (!isCollapsed) {
                        flatten(child.subtree);
                        if (child.aggs) {
                            flat.push({
                                type: 'footer',
                                data: child.aggs,
                                level: node.level,
                                label: `Total ${child.name}`
                            });
                        }
                    }
                });
            };
            flatten(tree);
            rows = flat;
            globalAggs = this.calculateAggregates(processed);
        }
        this._cachedDisplayRows = rows;
        this._cachedGlobalAggs = globalAggs;
        this._lastGroupKey = groupKey;
        return { rows, globalAggs };
    }
    exportCSV() {
        const processed = this.getProcessedData();
        const headers = this.columns.filter(c => c.visible).map(c => c.label).join(',');
        const rows = processed.map(d => this.columns.filter(c => c.visible).map(c => `"${String(d[c.key]).replace(/"/g, '""')}"`).join(','));
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quantum_export_${new Date().getTime()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
    renderHeader() {
        const activeCols = this.columns.filter(c => c.visible);
        const isAllSelected = this.selectedIds.size > 0 && this.selectedIds.size === this._cachedProcessedData.length;
        return ke `
      <div class="grid-header">
        ${this.showSelection ? ke `
          <div class="selection-header">
             ${this.selectionMode === 'multiple'
            ? ke `<div class="checkbox ${isAllSelected ? 'checked' : ''}" @click=${this.selectAll}></div>`
            : D}
          </div>
        ` : D}
        ${activeCols.map((col) => {
            const sortIdx = this.multiSort.findIndex(s => s.key === col.key);
            const sort = this.multiSort[sortIdx];
            const isGrouped = this.multiGrouping.includes(col.key);
            const colWidth = col.width || 150;
            const justify = col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'space-between';
            return ke `
            <div 
              class="header-cell ${this.draggingColumn === col.key ? 'dragging' : ''}" 
              draggable="true"
              style="width: ${colWidth}px; min-width: ${colWidth}px; justify-content: ${justify};"
              @click=${(e) => this.handleSort(col.key, e.shiftKey)}
              @dragstart=${(e) => this.onDragStart(e, col.key)}
              @dragover=${(e) => this.onDragOver(e, 'header')}
              @dragleave=${this.onDragLeave}
              @drop=${(e) => this.onDrop(e, col.key)}
              @dragend=${this.onDragEnd}
            >
              <div style="display: flex; align-items: center; overflow: hidden; pointer-events: none;">
                <span style="overflow: hidden; text-overflow: ellipsis;">${col.label}</span>
                ${sort ? ke `
                  <span class="sort-indicator">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 4px;"><path d="${sort.order === 'asc' ? 'M12 4l-8 8h16l-8-8z' : 'M12 20l8-8H4l8 8z'}"/></svg>
                    ${this.multiSort.length > 1 ? ke `<small style="font-size: 8px; margin-left: 2px; color: var(--grid-emerald); font-weight: bold;">[${sortIdx + 1}]</small>` : D}
                  </span>
                ` : D}
              </div>
              <button 
                class="group-btn ${isGrouped ? 'active' : ''}" 
                title="Toggle Grouping"
                @click=${(e) => { e.stopPropagation(); this.toggleGroup(col.key); }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
              </button>
              <div class="resize-handle" @mousedown=${(e) => this.startResizing(e, col.key, colWidth)}></div>
            </div>
          `;
        })}
      </div>
    `;
    }
    renderRow(row, activeCols) {
        const isRawRow = row && !row.type;
        const rowType = isRawRow ? 'row' : row.type;
        const rowData = isRawRow ? row : row.data;
        if (rowType === 'header') {
            const basePadding = this.density === 'compact' ? 12 : 24;
            const style = `padding-left: ${basePadding + (row.level * basePadding)}px`;
            const iconStyle = `transform: ${row.collapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};`;
            return ke `
        <div class="group-header" style="${style}" @click=${() => this.toggleGroupCollapse(row.path)}>
          <span class="collapse-icon" style="${iconStyle}">▶</span>
          <span class="group-label">${row.label}</span>
          <span class="badge">${row.count} Nodes</span>
        </div>
      `;
        }
        if (rowType === 'footer') {
            const basePadding = this.density === 'compact' ? 12 : 24;
            return ke `
        <div class="grid-row" style="background: rgba(16, 185, 129, 0.02);">
          ${this.showSelection ? ke `<div class="selection-cell"></div>` : D}
          ${activeCols.map((col, idx) => {
                const val = row.data[col.key];
                let content = '';
                if (val !== undefined) {
                    if (col.aggType === 'sum')
                        content = `∑ ${Number(val).toLocaleString()}`;
                    else if (col.aggType === 'avg')
                        content = `μ ${Number(val).toFixed(2)}`;
                    else if (col.aggType === 'count')
                        content = `# ${Number(val).toLocaleString()}`;
                }
                if (idx === 0)
                    content = row.label;
                const colWidth = col.width || 150;
                const cellStyle = `width: ${colWidth}px; min-width: ${colWidth}px; color: ${idx === 0 ? 'var(--grid-muted)' : 'var(--grid-emerald)'}; font-size: 10px; font-weight: bold; padding-left: ${idx === 0 ? `${basePadding + (row.level * basePadding) + 20}px` : ''}`;
                return ke `
              <div class="grid-cell" style="${cellStyle}">
                ${content}
              </div>
            `;
            })}
        </div>
      `;
        }
        const isSelected = this.selectedIds.has(rowData.id);
        const isFocused = this.focusedId === rowData.id;
        const rowClass = `grid-row ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`;
        return ke `
      <div class="${rowClass}" @click=${(e) => this.handleRowClick(e, rowData)}>
        ${this.showSelection ? ke `
          <div class="selection-cell">
             <div class="${this.selectionMode === 'multiple' ? 'checkbox' : 'radio'} ${isSelected ? 'checked' : ''}"></div>
          </div>
        ` : D}
        ${activeCols.map((col) => {
            const val = rowData[col.key];
            let formatted = col.formatter ? col.formatter(val) : this.highlightText(val, this.searchTerm);
            if (!col.formatter) {
                if (col.dataType === 'status') {
                    const isActive = val === 'Active';
                    formatted = ke `
                <span class="status-dot ${isActive ? 'status-active' : 'status-inactive'}"></span>
                ${this.highlightText(val != null ? String(val).toUpperCase() : '', this.searchTerm)}
              `;
                }
                else if (col.dataType === 'throughput') {
                    formatted = ke `<span style="color: #10B981; font-weight: bold;">${val != null ? Number(val).toLocaleString() : '0'} MB/s</span>`;
                }
                else if (col.dataType === 'date') {
                    formatted = ke `<span style="color: #64748B;">${this.highlightText(val != null ? String(val) : '', this.searchTerm)}</span>`;
                }
            }
            const colWidth = col.width || 150;
            const justify = col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start';
            return ke `
            <div class="grid-cell" style="width: ${colWidth}px; min-width: ${colWidth}px; justify-content: ${justify};">
              ${formatted}
            </div>
          `;
        })}
      </div>
    `;
    }
    renderStickyFooter(activeCols, globalAggs) {
        if (!this.aggregatesEnabled || !globalAggs)
            return D;
        return ke `
      <div class="sticky-footer-container">
        <div class="grid-sticky-footer">
          <div class="grid-footer-row">
            ${this.showSelection ? ke `<div class="selection-cell"></div>` : D}
            ${activeCols.map((col) => {
            const val = globalAggs[col.key];
            let content = '';
            if (val !== undefined) {
                if (col.aggType === 'sum')
                    content = `∑ ${Number(val).toLocaleString()}`;
                else if (col.aggType === 'avg')
                    content = `μ ${Number(val).toFixed(2)}`;
                else if (col.aggType === 'count')
                    content = `# ${Number(val).toLocaleString()}`;
            }
            const colWidth = col.width || 150;
            const justify = col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start';
            return ke `
                <div class="footer-cell" style="width: ${colWidth}px; min-width: ${colWidth}px; justify-content: ${justify};">
                  ${content}
                </div>
              `;
        })}
          </div>
        </div>
      </div>
    `;
    }
    render() {
        const displayRows = this._displayRows;
        const globalAggs = this._globalAggs;
        const activeCols = this._activeCols;
        const rowHeight = this.density === 'compact' ? 32 : 48;
        const gridHeight = this.bodyElement?.clientHeight || 500;
        const buffer = 10;
        const totalHeight = displayRows.length * rowHeight;
        const startIndex = Math.max(0, Math.floor(this.currentScrollTop / rowHeight) - buffer);
        const endIndex = Math.min(displayRows.length - 1, Math.floor((this.currentScrollTop + gridHeight) / rowHeight) + buffer);
        const visibleRows = displayRows.slice(startIndex, endIndex + 1);
        const offsetY = startIndex * rowHeight;
        const totalWidth = this._totalWidth;
        return ke `
      <slot style="display: none;" @slotchange=${this._syncColumnsFromTags}></slot>
      <div class="toolbar">
        <div class="search-container">
          <svg class="icon-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" class="search-input" placeholder="Search dataset..." .value=${this.searchTerm} @input=${this.onSearch} />
        </div>
        <div class="controls">
          <button class="btn" style="font-size: 10px;" @click=${() => {
            this.selectionMode = this.selectionMode === 'multiple' ? 'single' : 'multiple';
            this.selectedIds = new Set();
        }}>
            MODE: ${this.selectionMode.toUpperCase()}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${() => this.showSelection = !this.showSelection}>
            SELECTION COL: ${this.showSelection ? 'HIDE' : 'SHOW'}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${this.toggleDensity}>
            DENSITY: ${this.density.toUpperCase()}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${() => this.showGroupPanel = !this.showGroupPanel}>
            GROUP PANEL: ${this.showGroupPanel ? 'HIDE' : 'SHOW'}
          </button>
          <button class="btn" style="font-size: 10px;" @click=${this.toggleMode}>
            ${this.paginationEnabled ? 'PAGINATION: ON' : 'VIRTUAL MODE: ON'}
          </button>
          <button class="btn" style="font-size: 10px; ${this.aggregatesEnabled ? 'color: var(--grid-emerald); border-color: var(--grid-emerald);' : ''}" @click=${this.toggleAggregates}>
            AGGREGATES: ${this.aggregatesEnabled ? 'ON' : 'OFF'}
          </button>
          <select class="btn" style="background: var(--grid-surface); font-size: 10px;" @change=${this.handleColumnToggle}>
            <option value="">MANAGE COLUMNS</option>
            ${this.columns.map(c => ke `<option value="${c.key}">${c.visible ? 'HIDE' : 'SHOW'} ${c.label}</option>`)}
          </select>
          <button class="btn" @click=${this.exportCSV}>CSV EXPORT</button>
        </div>
      </div>
      
      <div class="grid-container">
        ${this.showGroupPanel ? ke `
          <div 
            class="group-panel"
            @dragover=${(e) => this.onDragOver(e, 'panel')}
            @dragleave=${this.onDragLeave}
            @drop=${(e) => this.onDrop(e)}
          >
            ${this.multiGrouping.length === 0 ? 'Drag columns here to group data' : D}
            ${this.multiGrouping.map((key, idx) => {
            const col = this.columns.find(c => c.key === key);
            return ke `
                <div class="group-tag" @click=${() => this.toggleGroup(key)}>
                  <div class="group-idx">${idx + 1}</div>
                  <span>${col?.label}</span>
                  <span style="margin-left: 8px;">✕</span>
                </div>
              `;
        })}
          </div>
        ` : D}
        
        ${this.renderHeader()}
        
        <div id="body" class="grid-body custom-scrollbar" @scroll=${this.onBodyScroll} @keydown=${this.onKeyDown} tabindex="0">
          <div class="virtual-spacer" style="height: ${totalHeight}px; width: ${totalWidth}px;"></div>
          <div class="rows-container" style="transform: translateY(${offsetY}px); width: ${totalWidth}px;">
            ${visibleRows.map((row, idx) => {
            const rowKey = row.type ? (row.type === 'row' ? row.data.id : `${row.type}-${row.path || idx}`) : row.id;
            return Bt(rowKey, this.renderRow(row, activeCols));
        })}
          </div>
          ${this.loading ? ke `
            <div class="loading-overlay">
              <div class="spinner"></div>
            </div>
          ` : D}
        </div>
        
        ${this.renderStickyFooter(activeCols, globalAggs)}
      </div>

      <div class="footer">
        <div>Total Found: <strong>${(this.total ?? 0).toLocaleString()}</strong> Records | <strong>${this.selectedIds.size}</strong> Selected</div>
        ${this.paginationEnabled ? ke `
          <div class="pagination">
            <button class="btn" ?disabled=${this.page === 1} @click=${() => { this.page--; this.fetchData(); }}>PREV</button>
            <span style="color: var(--grid-muted)">Page ${this.page} of ${Math.ceil((this.total ?? 0) / this.pageSize)}</span>
            <button class="btn" ?disabled=${this.page >= Math.ceil((this.total ?? 0) / this.pageSize)} @click=${() => { this.page++; this.fetchData(); }}>NEXT</button>
          </div>
        ` : D}
      </div>
    `;
    }
};
QuantumGrid.styles = styles;
__decorate([
    r(),
    __metadata("design:type", Array)
], QuantumGrid.prototype, "data", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "total", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "page", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "pageSize", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "loading", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "searchTerm", void 0);
__decorate([
    r(),
    __metadata("design:type", String)
], QuantumGrid.prototype, "density", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "paginationEnabled", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "aggregatesEnabled", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "showGroupPanel", void 0);
__decorate([
    r(),
    __metadata("design:type", Array)
], QuantumGrid.prototype, "multiSort", void 0);
__decorate([
    r(),
    __metadata("design:type", Array)
], QuantumGrid.prototype, "multiGrouping", void 0);
__decorate([
    r(),
    __metadata("design:type", Set)
], QuantumGrid.prototype, "collapsedGroups", void 0);
__decorate([
    r(),
    __metadata("design:type", Array)
], QuantumGrid.prototype, "columns", void 0);
__decorate([
    o({ flatten: true, selector: 'quantum-grid-column' }),
    __metadata("design:type", Array)
], QuantumGrid.prototype, "_colElements", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "draggingColumn", void 0);
__decorate([
    r(),
    __metadata("design:type", Set)
], QuantumGrid.prototype, "selectedIds", void 0);
__decorate([
    r(),
    __metadata("design:type", Object)
], QuantumGrid.prototype, "focusedId", void 0);
__decorate([
    r(),
    __metadata("design:type", String)
], QuantumGrid.prototype, "selectionMode", void 0);
__decorate([
    r(),
    __metadata("design:type", Boolean)
], QuantumGrid.prototype, "showSelection", void 0);
__decorate([
    e$1('#body'),
    __metadata("design:type", HTMLDivElement)
], QuantumGrid.prototype, "bodyElement", void 0);
__decorate([
    e$1('.grid-header'),
    __metadata("design:type", HTMLDivElement)
], QuantumGrid.prototype, "headerElement", void 0);
__decorate([
    e$1('.sticky-footer-container'),
    __metadata("design:type", HTMLDivElement)
], QuantumGrid.prototype, "footerElement", void 0);
QuantumGrid = __decorate([
    t$1('quantum-grid')
], QuantumGrid);

let QuantumGridColumn = class QuantumGridColumn extends h {
    constructor() {
        super(...arguments);
        this.key = '';
        this.label = '';
        this.title = '';
        this.hidden = false;
        this.width = 150;
        this.align = 'left';
    }
    connectedCallback() {
        super.connectedCallback();
        this._notifyParent();
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        this._notifyParent();
    }
    disconnectedCallback() {
        this._notifyParent();
        super.disconnectedCallback();
    }
    _notifyParent() {
        const parent = this.closest('quantum-grid');
        if (parent && typeof parent._syncColumnsFromTags === 'function') {
            parent._syncColumnsFromTags();
        }
    }
    createRenderRoot() {
        return this;
    }
    render() {
        return null;
    }
};
__decorate([
    n({ type: String }),
    __metadata("design:type", Object)
], QuantumGridColumn.prototype, "key", void 0);
__decorate([
    n({ type: String, attribute: 'column-key' }),
    __metadata("design:type", String)
], QuantumGridColumn.prototype, "columnKey", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", String)
], QuantumGridColumn.prototype, "name", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", Object)
], QuantumGridColumn.prototype, "label", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", Object)
], QuantumGridColumn.prototype, "title", void 0);
__decorate([
    n({ type: Boolean }),
    __metadata("design:type", Object)
], QuantumGridColumn.prototype, "hidden", void 0);
__decorate([
    n({ type: Number }),
    __metadata("design:type", Object)
], QuantumGridColumn.prototype, "width", void 0);
__decorate([
    n({ type: String }),
    __metadata("design:type", String)
], QuantumGridColumn.prototype, "align", void 0);
__decorate([
    n({ type: String, attribute: 'agg-type' }),
    __metadata("design:type", String)
], QuantumGridColumn.prototype, "aggType", void 0);
__decorate([
    n({ type: String, attribute: 'data-type' }),
    __metadata("design:type", String)
], QuantumGridColumn.prototype, "dataType", void 0);
QuantumGridColumn = __decorate([
    t$1('quantum-grid-column')
], QuantumGridColumn);

export { Button, ButtonType, IconList, IconType, Icons, Link, MaterialIcon, NeutrinoElement, QuantumGrid, QuantumGridColumn, Sidebar, SimpleGreeting };
//# sourceMappingURL=bundle.debug.js.map
