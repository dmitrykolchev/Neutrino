import { Platform } from "./Utils";
export function configureFetch(obj) {
    if (typeof fetch === "undefined" || Platform.isNode) {
        obj._jar = new (require("tough-cookie")).CookieJar();
        if (typeof fetch === "undefined") {
            obj._fetchType = require("node-fetch");
        }
        else {
            obj._fetchType = fetch;
        }
        obj._fetchType = require("fetch-cookie")(obj._fetchType, obj._jar);
        return true;
    }
    return false;
}
export function configureAbortController(obj) {
    if (typeof AbortController === "undefined") {
        obj._abortControllerType = require("abort-controller");
        return true;
    }
    return false;
}
export function getWS() {
    return require("ws");
}
export function getEventSource() {
    return require("eventsource");
}
//# sourceMappingURL=DynamicImports.js.map