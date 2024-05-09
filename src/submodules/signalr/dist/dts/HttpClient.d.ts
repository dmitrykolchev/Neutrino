import { AbortSignal } from "./AbortController";
import { MessageHeaders } from "./IHubProtocol";
export interface HttpRequest {
    method?: string;
    url?: string;
    content?: string | ArrayBuffer;
    headers?: MessageHeaders;
    responseType?: XMLHttpRequestResponseType;
    abortSignal?: AbortSignal;
    timeout?: number;
    withCredentials?: boolean;
}
export declare class HttpResponse {
    readonly statusCode: number;
    readonly statusText?: string | undefined;
    readonly content?: string | ArrayBuffer | undefined;
    constructor(statusCode: number);
    constructor(statusCode: number, statusText: string);
    constructor(statusCode: number, statusText: string, content: string);
    constructor(statusCode: number, statusText: string, content: ArrayBuffer);
    constructor(statusCode: number, statusText: string, content: string | ArrayBuffer);
}
export declare abstract class HttpClient {
    get(url: string): Promise<HttpResponse>;
    get(url: string, options: HttpRequest): Promise<HttpResponse>;
    post(url: string): Promise<HttpResponse>;
    post(url: string, options: HttpRequest): Promise<HttpResponse>;
    delete(url: string): Promise<HttpResponse>;
    delete(url: string, options: HttpRequest): Promise<HttpResponse>;
    abstract send(request: HttpRequest): Promise<HttpResponse>;
    getCookieString(url: string): string;
}
