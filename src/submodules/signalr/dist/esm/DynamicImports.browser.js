export function configureFetch() {
    return false;
}
export function configureAbortController() {
    return false;
}
export function getWS() {
    throw new Error("Trying to import 'ws' in the browser.");
}
export function getEventSource() {
    throw new Error("Trying to import 'eventsource' in the browser.");
}
//# sourceMappingURL=DynamicImports.browser.js.map