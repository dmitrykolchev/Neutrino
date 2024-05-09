import { HttpClient } from "./HttpClient";
import { MessageHeaders } from "./IHubProtocol";
import { ILogger, LogLevel } from "./ILogger";
import { HttpTransportType, ITransport } from "./ITransport";
import { EventSourceConstructor, WebSocketConstructor } from "./Polyfills";
export interface IHttpConnectionOptions {
    headers?: MessageHeaders;
    httpClient?: HttpClient;
    transport?: HttpTransportType | ITransport;
    logger?: ILogger | LogLevel;
    accessTokenFactory?(): string | Promise<string>;
    logMessageContent?: boolean;
    skipNegotiation?: boolean;
    WebSocket?: WebSocketConstructor;
    EventSource?: EventSourceConstructor;
    withCredentials?: boolean;
    timeout?: number;
    _useStatefulReconnect?: boolean;
}
