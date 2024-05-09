export declare enum HttpTransportType {
    None = 0,
    WebSockets = 1,
    ServerSentEvents = 2,
    LongPolling = 4
}
export declare enum TransferFormat {
    Text = 1,
    Binary = 2
}
export interface ITransport {
    connect(url: string, transferFormat: TransferFormat): Promise<void>;
    send(data: any): Promise<void>;
    stop(): Promise<void>;
    onreceive: ((data: string | ArrayBuffer) => void) | null;
    onclose: ((error?: Error) => void) | null;
}
