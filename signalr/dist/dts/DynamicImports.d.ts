import { CookieJar } from "@types/tough-cookie";
export declare function configureFetch(obj: {
    _fetchType?: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    _jar?: CookieJar;
}): boolean;
export declare function configureAbortController(obj: {
    _abortControllerType: {
        prototype: AbortController;
        new (): AbortController;
    };
}): boolean;
export declare function getWS(): any;
export declare function getEventSource(): any;
