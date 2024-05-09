import { HttpTransportType } from "./ITransport";
export declare class HttpError extends Error {
    private __proto__;
    statusCode: number;
    constructor(errorMessage: string, statusCode: number);
}
export declare class TimeoutError extends Error {
    private __proto__;
    constructor(errorMessage?: string);
}
export declare class AbortError extends Error {
    private __proto__;
    constructor(errorMessage?: string);
}
export declare class UnsupportedTransportError extends Error {
    private __proto__;
    transport: HttpTransportType;
    errorType: string;
    constructor(message: string, transport: HttpTransportType);
}
export declare class DisabledTransportError extends Error {
    private __proto__;
    transport: HttpTransportType;
    errorType: string;
    constructor(message: string, transport: HttpTransportType);
}
export declare class FailedToStartTransportError extends Error {
    private __proto__;
    transport: HttpTransportType;
    errorType: string;
    constructor(message: string, transport: HttpTransportType);
}
export declare class FailedToNegotiateWithServerError extends Error {
    private __proto__;
    errorType: string;
    constructor(message: string);
}
export declare class AggregateErrors extends Error {
    private __proto__;
    innerErrors: Error[];
    constructor(message: string, innerErrors: Error[]);
}
