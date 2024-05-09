import { IConnection } from "./IConnection";
import { IHubProtocol } from "./IHubProtocol";
import { ILogger } from "./ILogger";
import { IRetryPolicy } from "./IRetryPolicy";
import { IStreamResult } from "./Stream";
export declare enum HubConnectionState {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    Disconnecting = "Disconnecting",
    Reconnecting = "Reconnecting"
}
export declare class HubConnection {
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
