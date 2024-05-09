const __SystemDefaultWebRequestTimeout: number = 30000;

export interface KeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;
}

export class Url {
    /**
     * дабавляет параметры GET запроса
     * TODO: необходимо искейпить параметры
     * @param url
     * @param data
     */
    public static createUrlQuery(url: string, data: any): string {
        var params: string[] = [];
        for (let key in data) {
            params[params.length] = `${key}=${data[key]}`;
        }
        var query = params.join('&');
        if (url.indexOf('?') >= 0) {
            return `${url}&${query}`;
        }
        return `${url}?${query}`;
    }
}
/**
 * Header class
 */
export class Headers {
    private _headerFromKey: any = {};
    private _headers: KeyValuePair<string, string>[] = [];

    public add(key: string, value: string): void {
        this._headerFromKey[key.toLowerCase()] = { key: key, value: value };
        this._headers.push({ key: key, value: value });
    }
    public get length(): number {
        return this._headers.length;
    }

    public item(key: string | number): KeyValuePair<string, string> | undefined {
        if (typeof key === 'number') {
            return this._headers[key];
        }
        else if (typeof key === 'string') {
            return this._headerFromKey[key];
        }
        return undefined;
    }
    public get(key: string | number): string | undefined {
        if (typeof key === 'string') {
            var header = this._headerFromKey[key.toLowerCase()];
            return header ? header.value : undefined;
        }
        else if (typeof key === 'number') {
            return this._headers[key].value;
        }
        return undefined;
    }
    public clear() {
        this._headerFromKey = {};
        this._headers = [];
    }
    public has(key: string): boolean {
        return this._headerFromKey.hasOwnProperty(key.toLowerCase());
    }
    public static parse(allheaders: string): Headers {
        let headers = new Headers();
        if (!allheaders) {
            return headers;
        }
        let headerPairs = allheaders.split('\u000d\u000a');
        for (let i = 0; i < headerPairs.length; i++) {
            let headerPair = headerPairs[i];
            // Can't use split() here because it does the wrong thing
            // if the header value has the string ": " in it.
            let index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                let key = headerPair.substring(0, index);
                let val = headerPair.substring(index + 2);
                headers.add(key, val);
            }
        }
        return headers;
    }
    public toString(): string {
        var text = '';
        for (let index = 0, count = this.length; index < count; ++index) {
            const header = this.item(index);
            if (header) {
                text += `${header.key}\u003a\u0020${header.value}\u000d\u000a`;
            }
        }
        return text;
    }
}

/**
 * RequestMessage class
 */
export class RequestMessage {
    public headers: Headers = new Headers();
    public method: string = HttpMethod.Get;
    public url?: string;
    public responseType?: XMLHttpRequestResponseType;
    public timeout: number = __SystemDefaultWebRequestTimeout;
    public user?: string;
    public password?: string;
    public content: any;
}
/**
 * HTTP response status codes
 */
export const enum HttpResponseStatusCode {
    Continue = 100,
    Ok = 200,
    Created = 201,
    NoContent = 204,
    PartialContent = 206,
    MovedPermanently = 301,
    Found = 302,
    SeeOther = 303,
    NotModified = 304,
    TemporaryRedirect = 307,
    PermanentRedirect = 308,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    NotAcceptable = 406,
    Gone = 410,
    PreconditionFailed = 412,
    UnavailableForLegalReasons = 451,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504
}
/**
 * HTTP headers
 */
export class HttpHeader {
    public static readonly Accept: string = 'Accept';
    public static readonly AcceptCharset: string = 'Accept-Charset';
    public static readonly ContentType: string = 'Content-Type';
    public static readonly AcceptLanguage: string = 'Accept-Language';
    public static readonly CacheControl: string = 'Cache-Control';
    public static readonly Date: string = 'Date';
    public static readonly Referer: string = 'Referer';
    public static readonly Location: string = 'Location';
    public static readonly Server: string = 'Server';
    public static readonly UserAgent: string = 'User-Agent';
    public static readonly XRequestedWith: string = "X-Requested-With";
}
/**
 * MIME types
 */
export const MimeType = {
    All: '*/*',
    TextPlain: 'text/plain',
    TextHtml: 'text/html',
    TextCss: 'text/css',
    TextJavascript: 'text/javascript',
    TextCsv: 'text/csv',
    TextXml: 'text/xml',
    ProblemJson: 'application/problem+json',
    ApplicationJson: 'application/json',
    ApplicationZip: 'application/zip',
    ApplicationXml: 'application/xml',
    ApplicationJavascript: 'application/javascript',
    ApplicatioOctetStream: 'application/octet-stream',
    ApplicationBinaryDataStream: 'application/vnd.xobex.binary-data-stream',
    ApplicationTextDataStream: 'application/vnd.xobex.text-data-stream',
    ApplicationMessagePack: 'application/vnd.xobex.message-pack',
    Utf8: {
        ApplicationJson: 'application/json; charset=utf-8',
        ProblemJson: 'application/problem+json; charset=utf-8'
    }
}
/**
 * HTTP request methods
 */
export class HttpMethod {
    public static readonly Delete: string = 'DELETE';
    public static readonly Get: string = 'GET';
    public static readonly Head: string = 'HEAD';
    public static readonly Options: string = 'OPTIONS';
    public static readonly Post: string = 'POST';
    public static readonly Put: string = 'PUT';
    public static readonly Trace: string = 'TRACE';
    public static readonly Connect: string = 'CONNECT';
    public static readonly Patch: string = 'PATCH';
}

/**
 * Response reason
 */
export const enum ResponseReason {
    load,
    error,
    timeout,
    abort
}
/**
 * ResponseMessage class
 */
export class ResponseMessage {
    private _requestMessage: RequestMessage;
    private _success: boolean;
    private _status: number;
    private _statusText: string;
    private _response: any;
    private _responseType: string;
    private _mimeType?: string;
    private _reason: ResponseReason;
    private _headers: Headers;
    /**
     * constructor
     * @param requestMessage
     * @param xhr
     * @param reason
     */
    constructor(requestMessage: RequestMessage, xhr: XMLHttpRequest, reason: ResponseReason) {
        this._requestMessage = requestMessage;
        this._success = xhr.status >= 200 && xhr.status < 400;
        this._status = xhr.status;
        this._statusText = xhr.statusText;
        this._responseType = xhr.responseType;
        this._reason = reason;
        this._headers = Headers.parse(xhr.getAllResponseHeaders());
        var contentType = xhr.getResponseHeader(HttpHeader.ContentType);
        if (contentType) {
            this._mimeType = contentType.split(';')[0].trim();
        }
        if (this._mimeType === MimeType.ApplicationJson) {
            if (xhr.responseType === "" || xhr.responseType === "text") {
                this._response = JSON.parse(xhr.responseText);
            }
            else if (xhr.responseType === "arraybuffer") {
                const decoder = new TextDecoder("utf-8");
                this._response = JSON.parse(decoder.decode(<ArrayBuffer>xhr.response));
            }
            else {
                throw new Error("unsupported response type");
            }
        }
        else if (this._mimeType === MimeType.ApplicationZip || this._mimeType === MimeType.ApplicatioOctetStream
            || this.headers.get("Content-Disposition")) {
            if (xhr.responseType !== "arraybuffer") {
                throw new Error("unsupported response type");
            }
            this._response = <ArrayBuffer>xhr.response;
        }
        else if (this._mimeType === MimeType.ProblemJson) {
            if (xhr.responseType === "arraybuffer") {
                const decoder = new TextDecoder("utf-8");
                this._response = JSON.parse(decoder.decode(<ArrayBuffer>xhr.response));
            }
            else {
                this._response = JSON.parse(xhr.responseText);
            }
        }
        else {
            if (xhr.responseType === "arraybuffer" && xhr.response) {
                const decoder = new TextDecoder("utf-8");
                this._response = decoder.decode(<ArrayBuffer>xhr.response);
            }
            else {
                this._response = xhr.response;
            }
        }
    }
    /**
        returns RequestMessage
    */
    public get requestMessage(): RequestMessage {
        return this._requestMessage;
    }
    /**
        request succeeded
    */
    public get success(): boolean {
        return this._success;
    }
    /**
        status code 200-399 (success), 400 - ... (fail)
    */
    public get status(): number {
        return this._status;
    }
    /**
        status text that server returns
    */
    public get statusText(): string {
        return this._statusText;
    }
    /**
        response content data
    */
    public get response(): any {
        return this._response;
    }
    /**
        response content data type
    */
    public get responseType(): string {
        return this._responseType;
    }
    /**
        mime-type
    */
    public get mimeType(): string | undefined {
        return this._mimeType;
    }
    /**
        reason one of ResponseReason
    */
    public get reason(): ResponseReason {
        return this._reason;
    }
    /**
        response headers
    */
    public get headers(): Headers {
        return this._headers;
    }
}
/**
 * RequestBuilder class
 */
export class RequestBuilder {
    private _client: HttpClient;

    constructor(client: HttpClient) {
        this._client = client;
        this.withResponseType("arraybuffer");
    }
    /**
     * sets request url
     * @param url
     */
    public withUrl(url: string): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.url = url;
        });
    }
    /**
     * sets http method POST
     */
    public withPost(): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.method = HttpMethod.Post;
        });
    }
    /**
     * sets http method GET
     */
    public withGet(): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.method = HttpMethod.Get;
        });
    }
    /**
     * sets http method PUT
     */
    public withPut(): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.method = HttpMethod.Put;
        });
    }
    /**
     * sets http method DELETE
     */
    public withDelete(): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.method = HttpMethod.Delete;
        });
    }
    /**
     * sets request user name and password
     * @param user
     * @param password
     */
    public withAuth(user: string, password: string): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.user = user;
            p.password = password;
        });
    }
    /**
     * sets request timeout
     * @param timeout - timeout in milliseconds
     */
    public withTimeout(timeout: number): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.timeout = timeout;
        });
    }
    /**
     * set request header Content-Type
     * @param contentType
     */
    public withContentType(contentType: string): RequestBuilder {
        return this.withHeader(HttpHeader.ContentType, contentType);
    }
    /**
     * adds request header
     * @param key - header
     * @param value - header value
     */
    public withHeader(key: string, value: string): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.headers.add(key, value);
        });
    }

    public withResponseType(responseType: XMLHttpRequestResponseType): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.responseType = responseType;
        });
    }
    /**
     * sets request content
     * @param content
     */
    public withContent(content: any): RequestBuilder {
        return this.add((c: HttpClient, p: RequestMessage) => {
            p.content = content;
        });
    }
    private add(fn: (c: HttpClient, p: RequestMessage) => void): RequestBuilder {
        this._client._transformers.push(fn);
        return this;
    }
    /**
     * sends request to server
     * @param content - request content
     */
    public send(content?: string): Promise<ResponseMessage> {
        if (content) {
            this.add((c: HttpClient, p: RequestMessage) => {
                p.content = content;
            });
        }
        return this._client.send(this);
    }
}
/**
 * HttpClient class
 * based on aurelia HttpClient (http://aurelia.io/)
 */
export class HttpClient {
    public _transformers: ((c: HttpClient, p: RequestMessage) => void)[] = [];
    public _xhr: XMLHttpRequest | undefined;

    /**
     * Creates request builder with specified url
     * @param url
     */
    public createRequest(url?: string): RequestBuilder {
        let builder = new RequestBuilder(this);
        if (url) {
            builder.withUrl(url);
        }
        builder.withHeader(HttpHeader.XRequestedWith, "XMLHttpRequest");
        return builder;
    }
    /**
     * Creates request with specified url & query. Request uses http method GET
     * @param url
     * @param data
     */
    public get(url: string, data?: any): RequestBuilder {
        if (data) {
            url = Url.createUrlQuery(url, data);
        }
        return this.createRequest(url)
            .withGet();
    }
    /**
     * Creates request with specified url and content. Request uses http method POST
     * @param url
     * @param content
     * @param contentType
     */
    public post(url: string, content: any, contentType?: string): RequestBuilder {
        var builder = this.createRequest(url)
            .withPost()
            .withContent(content);
        if (contentType) {
            builder.withContentType(contentType);
        }
        return builder;
    }

    /**
     * Creates request with specified url & query. Request uses http method DELETE
     * @param url
     * @param data
     */
    public delete$(url: string, data?: any): RequestBuilder {
        if (data) {
            url = Url.createUrlQuery(url, data);
        }
        return this.createRequest(url)
            .withDelete();
    }
    /**
     * Sends request to server (for internal use only)
     * Don't use this method. You should use RequestBuilder.send method.
     * @param r
     */
    public send(r: RequestBuilder): Promise<ResponseMessage> {
        this._xhr = new XMLHttpRequest();
        const xhr = this._xhr;
        const instance = this;
        var result = new Promise<ResponseMessage>((resolve, reject) => {
            const requestMessage = new RequestMessage();
            const transformers = instance._transformers;
            for (let index = 0, count = transformers.length; index < count; ++index) {
                transformers[index](instance, requestMessage);
            }
            xhr.open(requestMessage.method, requestMessage.url!, true, requestMessage.user, requestMessage.password);
            if (requestMessage.timeout) {
                xhr.timeout = requestMessage.timeout;
            }
            if (requestMessage.responseType) {
                xhr.responseType = requestMessage.responseType;
            }
            const headers = requestMessage.headers;
            for (let index = 0, count = headers.length; index < count; ++index) {
                const header = requestMessage.headers.item(index);
                if (header) {
                    xhr.setRequestHeader(header.key, header.value);
                }
            }
            xhr.onload = function () {
                let response = new ResponseMessage(requestMessage, xhr, ResponseReason.load);
                if (response.success) {
                    resolve(response);
                }
                else {
                    reject(response);
                }
            }
            xhr.onabort = function () {
                const response = new ResponseMessage(requestMessage, xhr, ResponseReason.abort);
                reject(response);
            };
            xhr.ontimeout = function () {
                const response = new ResponseMessage(requestMessage, xhr, ResponseReason.timeout);
                reject(response);
            }
            xhr.onerror = function () {
                const response = new ResponseMessage(requestMessage, xhr, ResponseReason.error);
                reject(response);
            }
            try {
                xhr.send(requestMessage.content);
            }
            catch (e) {
                reject(e);
            }
        });
        return result;
    }
    /**
     * Aborts pending request
     */
    public abort(): void {
        if (this._xhr) {
            this._xhr.abort();
        }
    }
}

export class Helper {
    public static get(url: string, data?: any): Promise<ResponseMessage> {
        const client = new HttpClient();
        url = UrlUtils.buildUrl(url, data);
        return client.get(url).withTimeout(__SystemDefaultWebRequestTimeout).send();
    }
}

class UrlUtils {
    private static objectToArray(prefix: string, value: any, list: string[], indexArrays: boolean = false) {
        if (!!value) {
            if (value instanceof Array) {
                if (indexArrays) {
                    value.forEach((item, index) => UrlUtils.objectToArray(`${prefix}[${index}]`, item, list, indexArrays));
                }
                else {
                    value.forEach(item => UrlUtils.objectToArray(prefix, item, list, indexArrays));
                }
            }
            else if (typeof value === 'object') {
                Object.keys(value).forEach(key => UrlUtils.objectToArray(prefix ? `${prefix}.${key}` : key, value[key], list, indexArrays));
            }
            else {
                list.push(`${encodeURIComponent(prefix)}=${encodeURIComponent(value)}`);
            }
        }
    }

    private static objectToQueryString(value: any, prefix: string, indexArrays: boolean): string {
        const list: string[] = [];
        UrlUtils.objectToArray(prefix, value, list, indexArrays);
        return list.join("&");
    }
    /**
    * Построение адреса с указанием фильтра
    * @param baseUrl базовый адрес
    * @param filter объект со свойствами и значениями фильтров
    */
    public static buildFilterUrl(baseUrl: string, filter: Object, indexArrays: boolean = false) {
        // get values from Array<IUserFilter>
        let filterValues = filter instanceof Array ? filter.map(x => x.value) : [filter];
        const queryString = UrlUtils.objectToQueryString(filterValues, "Filter", indexArrays);
        return UrlUtils.appendUrl(baseUrl, queryString);
    }
    /**
     * Добавляет параметры к базовому URL
     * @param baseUrl базовый адрес
     * @param queryString строка с параметрами веб-запроса
     */
    public static appendUrl(baseUrl: string, queryString: string): string {
        if (baseUrl) {
            if (baseUrl.indexOf("?") >= 0) {
                return `${baseUrl}&${queryString}`;
            }
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }

    public static getPath(url: string): string {
        if (url.indexOf("?") >= 0) {
            return url.split("?")[0];
        }
        return url;
    }
    /**
    * Построение адреса с указанием параметров
    * @param baseUrl базовый адрес
    * @param param объект со свойствами и значениями параметров
    * @param indexArrays указывает следует ли индексировать параметры для элементов массива
    */
    public static buildUrl(baseUrl: string, param: any, indexArrays: boolean = false) {
        if (param) {
            let queryString = UrlUtils.objectToQueryString(param, "", indexArrays);
            return this.appendUrl(baseUrl, queryString);
        }
        return baseUrl;
    }
}


