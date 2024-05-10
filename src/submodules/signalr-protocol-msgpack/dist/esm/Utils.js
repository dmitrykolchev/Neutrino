export function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}
//# sourceMappingURL=Utils.js.map