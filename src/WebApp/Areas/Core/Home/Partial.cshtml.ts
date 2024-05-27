import { sayHello as hello } from "./Index.cshtml.js";



export default function initialize(element: HTMLElement) {
    alert("Initialized");
    alert(hello())
}

export function sayHello() {
    alert("Hello World!");
}
