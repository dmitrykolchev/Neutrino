interface AbortSignal {
    aborted: boolean;
    onabort: (() => void) | null;
}

declare enum HttpTransportType {
    None = 0,
    WebSockets = 1,
    ServerSentEvents = 2,
    LongPolling = 4
}
declare enum TransferFormat {
    Text = 1,
    Binary = 2
}
interface ITransport {
    connect(url: string, transferFormat: TransferFormat): Promise<void>;
    send(data: any): Promise<void>;
    stop(): Promise<void>;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((error?: Error) => void) | null;
}

declare class HttpError extends Error {
    private __proto__;
    statusCode: number;
    constructor(errorMessage: string, statusCode: number);
}
declare class TimeoutError extends Error {
    private __proto__;
    constructor(errorMessage?: string);
}
declare class AbortError extends Error {
    private __proto__;
    constructor(errorMessage?: string);
}

declare enum LogLevel {
    Trace = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Critical = 5,
    None = 6
}
interface ILogger {
    log(logLevel: LogLevel, message: string): void;
}

declare enum MessageType {
    Invocation = 1,
    StreamItem = 2,
    Completion = 3,
    StreamInvocation = 4,
    CancelInvocation = 5,
    Ping = 6,
    Close = 7,
    Ack = 8,
    Sequence = 9
}
interface MessageHeaders {
    [key: string]: string;
}
type HubMessage = InvocationMessage | StreamInvocationMessage | StreamItemMessage | CompletionMessage | CancelInvocationMessage | PingMessage | CloseMessage | AckMessage | SequenceMessage;
interface HubMessageBase {
    readonly type: MessageType;
}
interface HubInvocationMessage extends HubMessageBase {
    readonly headers?: MessageHeaders;
    readonly invocationId?: string;
}
interface InvocationMessage extends HubInvocationMessage {
    readonly type: MessageType.Invocation;
    readonly target: string;
    readonly arguments: any[];
    readonly streamIds?: string[];
}
interface StreamInvocationMessage extends HubInvocationMessage {
    readonly type: MessageType.StreamInvocation;
    readonly invocationId: string;
    readonly target: string;
    readonly arguments: any[];
    readonly streamIds?: string[];
}
interface StreamItemMessage extends HubInvocationMessage {
    readonly type: MessageType.StreamItem;
    readonly invocationId: string;
    readonly item?: any;
}
interface CompletionMessage extends HubInvocationMessage {
    readonly type: MessageType.Completion;
    readonly invocationId: string;
    readonly error?: string;
    readonly result?: any;
}
interface PingMessage extends HubMessageBase {
    readonly type: MessageType.Ping;
}
interface CloseMessage extends HubMessageBase {
    readonly type: MessageType.Close;
    readonly error?: string;
    readonly allowReconnect?: boolean;
}
interface CancelInvocationMessage extends HubInvocationMessage {
    readonly type: MessageType.CancelInvocation;
    readonly invocationId: string;
}
interface AckMessage extends HubMessageBase {
    readonly type: MessageType.Ack;
    readonly sequenceId: number;
}
interface SequenceMessage extends HubMessageBase {
    readonly type: MessageType.Sequence;
    readonly sequenceId: number;
}
interface IHubProtocol {
    readonly name: string;
    readonly version: number;
    readonly transferFormat: TransferFormat;
    parseMessages(input: string | ArrayBuffer, logger: ILogger): HubMessage[];
    writeMessage(message: HubMessage): string | ArrayBuffer;
}

interface HttpRequest {
    method?: string;
    url?: string;
    content?: string | ArrayBuffer;
    headers?: MessageHeaders;
    responseType?: XMLHttpRequestResponseType;
    abortSignal?: AbortSignal;
    timeout?: number;
    withCredentials?: boolean;
}
declare class HttpResponse {
    readonly statusCode: number;
    readonly statusText?: string | undefined;
    readonly content?: string | ArrayBuffer | undefined;
    constructor(statusCode: number);
    constructor(statusCode: number, statusText: string);
    constructor(statusCode: number, statusText: string, content: string);
    constructor(statusCode: number, statusText: string, content: ArrayBuffer);
    constructor(statusCode: number, statusText: string, content: string | ArrayBuffer);
}
declare abstract class HttpClient {
    get(url: string): Promise<HttpResponse>;
    get(url: string, options: HttpRequest): Promise<HttpResponse>;
    post(url: string): Promise<HttpResponse>;
    post(url: string, options: HttpRequest): Promise<HttpResponse>;
    delete(url: string): Promise<HttpResponse>;
    delete(url: string, options: HttpRequest): Promise<HttpResponse>;
    abstract send(request: HttpRequest): Promise<HttpResponse>;
    getCookieString(url: string): string;
}

declare class DefaultHttpClient extends HttpClient {
    private readonly _httpClient;
    constructor(logger: ILogger);
    send(request: HttpRequest): Promise<HttpResponse>;
    getCookieString(url: string): string;
}

type EventSourceConstructor = new (url: string, eventSourceInitDict?: EventSourceInit) => EventSource;
interface WebSocketConstructor {
    new (url: string, protocols?: string | string[], options?: any): WebSocket;
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
}

interface IHttpConnectionOptions {
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

interface IStatefulReconnectOptions {
    bufferSize: number;
}

interface IConnection {
    readonly features: any;
    readonly connectionId?: string;
    baseUrl: string;
    start(transferFormat: TransferFormat): Promise<void>;
    send(data: string | ArrayBuffer): Promise<void>;
    stop(error?: Error | unknown): Promise<void>;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((error?: Error) => void) | null;
}

interface IRetryPolicy {
    nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null;
}
interface RetryContext {
    readonly previousRetryCount: number;
    readonly elapsedMilliseconds: number;
    readonly retryReason: Error;
}

interface IStreamSubscriber<T> {
    closed?: boolean;
    next(value: T): void;
    error(err: any): void;
    complete(): void;
}
interface IStreamResult<T> {
    subscribe(subscriber: IStreamSubscriber<T>): ISubscription<T>;
}
interface ISubscription<T> {
    dispose(): void;
}

declare enum HubConnectionState {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    Disconnecting = "Disconnecting",
    Reconnecting = "Reconnecting"
}
declare class HubConnection {
    private readonly _cachedPingMessage;
    private readonly connection;
    private readonly _logger;
    private readonly _reconnectPolicy?;
    private readonly _statefulReconnectBufferSize;
    private _protocol;
    private _handshakeProtocol;
    private _callbacks;
    private _methods;
    private _invocationId;
    private _messageBuffer?;
    private _closedCallbacks;
    private _reconnectingCallbacks;
    private _reconnectedCallbacks;
    private _receivedHandshakeResponse;
    private _handshakeResolver;
    private _handshakeRejecter;
    private _stopDuringStartError?;
    private _connectionState;
    private _connectionStarted;
    private _startPromise?;
    private _stopPromise?;
    private _nextKeepAlive;
    private _reconnectDelayHandle?;
    private _timeoutHandle?;
    private _pingServerHandle?;
    private _freezeEventListener;
    serverTimeoutInMilliseconds: number;
    keepAliveIntervalInMilliseconds: number;
    static create(connection: IConnection, logger: ILogger, protocol: IHubProtocol, reconnectPolicy?: IRetryPolicy, serverTimeoutInMilliseconds?: number, keepAliveIntervalInMilliseconds?: number, statefulReconnectBufferSize?: number): HubConnection;
    private constructor();
    get state(): HubConnectionState;
    get connectionId(): string | null;
    get baseUrl(): string;
    set baseUrl(url: string);
    start(): Promise<void>;
    private _startWithStateTransitions;
    private _startInternal;
    stop(): Promise<void>;
    private _stopInternal;
    private _sendCloseMessage;
    stream<T = any>(methodName: string, ...args: any[]): IStreamResult<T>;
    private _sendMessage;
    private _sendWithProtocol;
    send(methodName: string, ...args: any[]): Promise<void>;
    invoke<T = any>(methodName: string, ...args: any[]): Promise<T>;
    on(methodName: string, newMethod: (...args: any[]) => any): void;
    off(methodName: string): void;
    off(methodName: string, method: (...args: any[]) => void): void;
    onclose(callback: (error?: Error) => void): void;
    onreconnecting(callback: (error?: Error) => void): void;
    onreconnected(callback: (connectionId?: string) => void): void;
    private _processIncomingData;
    private _processHandshakeResponse;
    private _resetKeepAliveInterval;
    private _resetTimeoutPeriod;
    private serverTimeout;
    private _invokeClientMethod;
    private _connectionClosed;
    private _completeClose;
    private _reconnect;
    private _getNextRetryDelay;
    private _cancelCallbacksWithError;
    private _cleanupPingTimer;
    private _cleanupTimeout;
    private _createInvocation;
    private _launchStreams;
    private _replaceStreamingParams;
    private _isObservable;
    private _createStreamInvocation;
    private _createCancelInvocation;
    private _createStreamItemMessage;
    private _createCompletionMessage;
    private _createCloseMessage;
}

declare class HubConnectionBuilder {
    private _serverTimeoutInMilliseconds?;
    private _keepAliveIntervalInMilliseconds?;
    protocol?: IHubProtocol;
    httpConnectionOptions?: IHttpConnectionOptions;
    url?: string;
    logger?: ILogger;
    reconnectPolicy?: IRetryPolicy;
    private _statefulReconnectBufferSize?;
    configureLogging(logLevel: LogLevel): HubConnectionBuilder;
    configureLogging(logger: ILogger): HubConnectionBuilder;
    configureLogging(logLevel: string): HubConnectionBuilder;
    configureLogging(logging: LogLevel | string | ILogger): HubConnectionBuilder;
    withUrl(url: string): HubConnectionBuilder;
    withUrl(url: string, transportType: HttpTransportType): HubConnectionBuilder;
    withUrl(url: string, options: IHttpConnectionOptions): HubConnectionBuilder;
    withHubProtocol(protocol: IHubProtocol): HubConnectionBuilder;
    withAutomaticReconnect(): HubConnectionBuilder;
    withAutomaticReconnect(retryDelays: number[]): HubConnectionBuilder;
    withAutomaticReconnect(reconnectPolicy: IRetryPolicy): HubConnectionBuilder;
    withServerTimeout(milliseconds: number): HubConnectionBuilder;
    withKeepAliveInterval(milliseconds: number): HubConnectionBuilder;
    withStatefulReconnect(options?: IStatefulReconnectOptions): HubConnectionBuilder;
    build(): HubConnection;
}

declare class NullLogger implements ILogger {
    static instance: ILogger;
    private constructor();
    log(_logLevel: LogLevel, _message: string): void;
}

declare class JsonHubProtocol implements IHubProtocol {
    readonly name: string;
    readonly version: number;
    readonly transferFormat: TransferFormat;
    parseMessages(input: string, logger: ILogger): HubMessage[];
    writeMessage(message: HubMessage): string;
    private _isInvocationMessage;
    private _isStreamItemMessage;
    private _isCompletionMessage;
    private _isAckMessage;
    private _isSequenceMessage;
    private _assertNotEmptyString;
}

declare class Subject<T> implements IStreamResult<T> {
    observers: IStreamSubscriber<T>[];
    cancelCallback?: () => Promise<void>;
    constructor();
    next(item: T): void;
    error(err: any): void;
    complete(): void;
    subscribe(observer: IStreamSubscriber<T>): ISubscription<T>;
}

declare const VERSION: string;

export { AbortError, AbortSignal, AckMessage, CancelInvocationMessage, CloseMessage, CompletionMessage, DefaultHttpClient, HttpClient, HttpError, HttpRequest, HttpResponse, HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, HubInvocationMessage, HubMessage, HubMessageBase, IHttpConnectionOptions, IHubProtocol, ILogger, IRetryPolicy, IStatefulReconnectOptions, IStreamResult, IStreamSubscriber, ISubscription, ITransport, InvocationMessage, JsonHubProtocol, LogLevel, MessageHeaders, MessageType, NullLogger, PingMessage, RetryContext, SequenceMessage, StreamInvocationMessage, StreamItemMessage, Subject, TimeoutError, TransferFormat, VERSION };
//# sourceMappingURL=signalr.d.ts.map
