import { HubMessage, IHubProtocol } from "./IHubProtocol";
import { ILogger } from "./ILogger";
import { TransferFormat } from "./ITransport";
export declare class JsonHubProtocol implements IHubProtocol {
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
