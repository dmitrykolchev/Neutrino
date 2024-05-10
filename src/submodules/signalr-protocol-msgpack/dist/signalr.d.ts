import { IHubProtocol, TransferFormat, ILogger, HubMessage } from '@microsoft/signalr';

declare const VERSION = "5.0.0-dev";

interface MessagePackOptions {
    extensionCodec?: any;
    context?: any;
    maxDepth?: number;
    initialBufferSize?: number;
    sortKeys?: boolean;
    forceFloat32?: boolean;
    forceIntegerToFloat?: boolean;
    ignoreUndefined?: boolean;
    maxStrLength?: number;
    maxBinLength?: number;
    maxArrayLength?: number;
    maxMapLength?: number;
    maxExtLength?: number;
}

declare class MessagePackHubProtocol implements IHubProtocol {
    readonly name: string;
    readonly version: number;
    readonly transferFormat: TransferFormat;
    private readonly _errorResult;
    private readonly _voidResult;
    private readonly _nonVoidResult;
    private readonly _encoder;
    private readonly _decoder;
    constructor(messagePackOptions?: MessagePackOptions);
    parseMessages(input: ArrayBuffer, logger: ILogger): HubMessage[];
    writeMessage(message: HubMessage): ArrayBuffer;
    private _parseMessage;
    private _createCloseMessage;
    private _createPingMessage;
    private _createInvocationMessage;
    private _createStreamItemMessage;
    private _createCompletionMessage;
    private _createAckMessage;
    private _createSequenceMessage;
    private _writeInvocation;
    private _writeStreamInvocation;
    private _writeStreamItem;
    private _writeCompletion;
    private _writeCancelInvocation;
    private _writeClose;
    private _writeAck;
    private _writeSequence;
    private _readHeaders;
}

export { MessagePackHubProtocol, MessagePackOptions, VERSION };
//# sourceMappingURL=signalr.d.ts.map
