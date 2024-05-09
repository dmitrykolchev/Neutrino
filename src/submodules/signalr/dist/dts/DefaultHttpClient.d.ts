import { HttpClient, HttpRequest, HttpResponse } from "./HttpClient";
import { ILogger } from "./ILogger";
export declare class DefaultHttpClient extends HttpClient {
    private readonly _httpClient;
    constructor(logger: ILogger);
    send(request: HttpRequest): Promise<HttpResponse>;
    getCookieString(url: string): string;
}
