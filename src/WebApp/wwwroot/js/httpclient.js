const __SystemDefaultWebRequestTimeout = 30000;
export class Url {
    static createUrlQuery(url, data) {
        var params = [];
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
export class Headers {
    constructor() {
        this._headerFromKey = {};
        this._headers = [];
    }
    add(key, value) {
        this._headerFromKey[key.toLowerCase()] = { key: key, value: value };
        this._headers.push({ key: key, value: value });
    }
    get length() {
        return this._headers.length;
    }
    item(key) {
        if (typeof key === 'number') {
            return this._headers[key];
        }
        else if (typeof key === 'string') {
            return this._headerFromKey[key];
        }
        return undefined;
    }
    get(key) {
        if (typeof key === 'string') {
            var header = this._headerFromKey[key.toLowerCase()];
            return header ? header.value : undefined;
        }
        else if (typeof key === 'number') {
            return this._headers[key].value;
        }
        return undefined;
    }
    clear() {
        this._headerFromKey = {};
        this._headers = [];
    }
    has(key) {
        return this._headerFromKey.hasOwnProperty(key.toLowerCase());
    }
    static parse(allheaders) {
        let headers = new Headers();
        if (!allheaders) {
            return headers;
        }
        let headerPairs = allheaders.split('\u000d\u000a');
        for (let i = 0; i < headerPairs.length; i++) {
            let headerPair = headerPairs[i];
            let index = headerPair.indexOf('\u003a\u0020');
            if (index > 0) {
                let key = headerPair.substring(0, index);
                let val = headerPair.substring(index + 2);
                headers.add(key, val);
            }
        }
        return headers;
    }
    toString() {
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
export class RequestMessage {
    constructor() {
        this.headers = new Headers();
        this.method = HttpMethod.Get;
        this.timeout = __SystemDefaultWebRequestTimeout;
    }
}
export class HttpHeader {
}
HttpHeader.Accept = 'Accept';
HttpHeader.AcceptCharset = 'Accept-Charset';
HttpHeader.ContentType = 'Content-Type';
HttpHeader.AcceptLanguage = 'Accept-Language';
HttpHeader.CacheControl = 'Cache-Control';
HttpHeader.Date = 'Date';
HttpHeader.Referer = 'Referer';
HttpHeader.Location = 'Location';
HttpHeader.Server = 'Server';
HttpHeader.UserAgent = 'User-Agent';
HttpHeader.XRequestedWith = "X-Requested-With";
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
};
export class HttpMethod {
}
HttpMethod.Delete = 'DELETE';
HttpMethod.Get = 'GET';
HttpMethod.Head = 'HEAD';
HttpMethod.Options = 'OPTIONS';
HttpMethod.Post = 'POST';
HttpMethod.Put = 'PUT';
HttpMethod.Trace = 'TRACE';
HttpMethod.Connect = 'CONNECT';
HttpMethod.Patch = 'PATCH';
export class ResponseMessage {
    constructor(requestMessage, xhr, reason) {
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
                this._response = JSON.parse(decoder.decode(xhr.response));
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
            this._response = xhr.response;
        }
        else if (this._mimeType === MimeType.ProblemJson) {
            if (xhr.responseType === "arraybuffer") {
                const decoder = new TextDecoder("utf-8");
                this._response = JSON.parse(decoder.decode(xhr.response));
            }
            else {
                this._response = JSON.parse(xhr.responseText);
            }
        }
        else {
            if (xhr.responseType === "arraybuffer" && xhr.response) {
                const decoder = new TextDecoder("utf-8");
                this._response = decoder.decode(xhr.response);
            }
            else {
                this._response = xhr.response;
            }
        }
    }
    get requestMessage() {
        return this._requestMessage;
    }
    get success() {
        return this._success;
    }
    get status() {
        return this._status;
    }
    get statusText() {
        return this._statusText;
    }
    get response() {
        return this._response;
    }
    get responseType() {
        return this._responseType;
    }
    get mimeType() {
        return this._mimeType;
    }
    get reason() {
        return this._reason;
    }
    get headers() {
        return this._headers;
    }
}
export class RequestBuilder {
    constructor(client) {
        this._client = client;
        this.withResponseType("arraybuffer");
    }
    withUrl(url) {
        return this.add((c, p) => {
            p.url = url;
        });
    }
    withPost() {
        return this.add((c, p) => {
            p.method = HttpMethod.Post;
        });
    }
    withGet() {
        return this.add((c, p) => {
            p.method = HttpMethod.Get;
        });
    }
    withPut() {
        return this.add((c, p) => {
            p.method = HttpMethod.Put;
        });
    }
    withDelete() {
        return this.add((c, p) => {
            p.method = HttpMethod.Delete;
        });
    }
    withAuth(user, password) {
        return this.add((c, p) => {
            p.user = user;
            p.password = password;
        });
    }
    withTimeout(timeout) {
        return this.add((c, p) => {
            p.timeout = timeout;
        });
    }
    withContentType(contentType) {
        return this.withHeader(HttpHeader.ContentType, contentType);
    }
    withHeader(key, value) {
        return this.add((c, p) => {
            p.headers.add(key, value);
        });
    }
    withResponseType(responseType) {
        return this.add((c, p) => {
            p.responseType = responseType;
        });
    }
    withContent(content) {
        return this.add((c, p) => {
            p.content = content;
        });
    }
    add(fn) {
        this._client._transformers.push(fn);
        return this;
    }
    send(content) {
        if (content) {
            this.add((c, p) => {
                p.content = content;
            });
        }
        return this._client.send(this);
    }
}
export class HttpClient {
    constructor() {
        this._transformers = [];
    }
    createRequest(url) {
        let builder = new RequestBuilder(this);
        if (url) {
            builder.withUrl(url);
        }
        builder.withHeader(HttpHeader.XRequestedWith, "XMLHttpRequest");
        return builder;
    }
    get(url, data) {
        if (data) {
            url = Url.createUrlQuery(url, data);
        }
        return this.createRequest(url)
            .withGet();
    }
    post(url, content, contentType) {
        var builder = this.createRequest(url)
            .withPost()
            .withContent(content);
        if (contentType) {
            builder.withContentType(contentType);
        }
        return builder;
    }
    delete$(url, data) {
        if (data) {
            url = Url.createUrlQuery(url, data);
        }
        return this.createRequest(url)
            .withDelete();
    }
    send(r) {
        this._xhr = new XMLHttpRequest();
        const xhr = this._xhr;
        const instance = this;
        var result = new Promise((resolve, reject) => {
            const requestMessage = new RequestMessage();
            const transformers = instance._transformers;
            for (let index = 0, count = transformers.length; index < count; ++index) {
                transformers[index](instance, requestMessage);
            }
            xhr.open(requestMessage.method, requestMessage.url, true, requestMessage.user, requestMessage.password);
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
                let response = new ResponseMessage(requestMessage, xhr, 0);
                if (response.success) {
                    resolve(response);
                }
                else {
                    reject(response);
                }
            };
            xhr.onabort = function () {
                const response = new ResponseMessage(requestMessage, xhr, 3);
                reject(response);
            };
            xhr.ontimeout = function () {
                const response = new ResponseMessage(requestMessage, xhr, 2);
                reject(response);
            };
            xhr.onerror = function () {
                const response = new ResponseMessage(requestMessage, xhr, 1);
                reject(response);
            };
            try {
                xhr.send(requestMessage.content);
            }
            catch (e) {
                reject(e);
            }
        });
        return result;
    }
    abort() {
        if (this._xhr) {
            this._xhr.abort();
        }
    }
}
export class Helper {
    static get(url, data) {
        const client = new HttpClient();
        url = UrlUtils.buildUrl(url, data);
        return client.get(url).withTimeout(__SystemDefaultWebRequestTimeout).send();
    }
}
class UrlUtils {
    static objectToArray(prefix, value, list, indexArrays = false) {
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
    static objectToQueryString(value, prefix, indexArrays) {
        const list = [];
        UrlUtils.objectToArray(prefix, value, list, indexArrays);
        return list.join("&");
    }
    static buildFilterUrl(baseUrl, filter, indexArrays = false) {
        let filterValues = filter instanceof Array ? filter.map(x => x.value) : [filter];
        const queryString = UrlUtils.objectToQueryString(filterValues, "Filter", indexArrays);
        return UrlUtils.appendUrl(baseUrl, queryString);
    }
    static appendUrl(baseUrl, queryString) {
        if (baseUrl) {
            if (baseUrl.indexOf("?") >= 0) {
                return `${baseUrl}&${queryString}`;
            }
            return `${baseUrl}?${queryString}`;
        }
        return baseUrl;
    }
    static getPath(url) {
        if (url.indexOf("?") >= 0) {
            return url.split("?")[0];
        }
        return url;
    }
    static buildUrl(baseUrl, param, indexArrays = false) {
        if (param) {
            let queryString = UrlUtils.objectToQueryString(param, "", indexArrays);
            return this.appendUrl(baseUrl, queryString);
        }
        return baseUrl;
    }
}
//# sourceMappingURL=httpclient.js.map