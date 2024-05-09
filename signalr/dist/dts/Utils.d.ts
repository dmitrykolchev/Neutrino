import { HttpClient } from "./HttpClient";
import { ILogger, LogLevel } from "./ILogger";
import { IStreamSubscriber, ISubscription } from "./Stream";
import { Subject } from "./Subject";
import { IHttpConnectionOptions } from "./IHttpConnectionOptions";
export declare const VERSION: string;
export declare class Arg {
    static isRequired(val: any, name: string): void;
    static isNotEmpty(val: string, name: string): void;
    static isIn(val: any, values: any, name: string): void;
}
export declare class Platform {
    static get isBrowser(): boolean;
    static get isWebWorker(): boolean;
    static get isReactNative(): boolean;
    static get isNode(): boolean;
}
export declare function getDataDetail(data: any, includeContent: boolean): string;
export declare function formatArrayBuffer(data: ArrayBuffer): string;
export declare function isArrayBuffer(val: any): val is ArrayBuffer;
export declare function sendMessage(logger: ILogger, transportName: string, httpClient: HttpClient, url: string, content: string | ArrayBuffer, options: IHttpConnectionOptions): Promise<void>;
export declare function createLogger(logger?: ILogger | LogLevel): ILogger;
export declare class SubjectSubscription<T> implements ISubscription<T> {
    private _subject;
    private _observer;
    constructor(subject: Subject<T>, observer: IStreamSubscriber<T>);
    dispose(): void;
}
export declare class ConsoleLogger implements ILogger {
    private readonly _minLevel;
    out: {
        error(message: any): void;
        warn(message: any): void;
        info(message: any): void;
        log(message: any): void;
    };
    constructor(minimumLogLevel: LogLevel);
    log(logLevel: LogLevel, message: string): void;
}
export declare function getUserAgentHeader(): [string, string];
export declare function constructUserAgent(version: string, os: string, runtime: string, runtimeVersion: string | undefined): string;
export declare function getErrorString(e: any): string;
export declare function getGlobalThis(): unknown;
