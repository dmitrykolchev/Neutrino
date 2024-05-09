import { ILogger } from "./ILogger";
import { TransferFormat } from "./ITransport";
export declare enum MessageType {
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
export interface MessageHeaders {
    [key: string]: string;
}
export type HubMessage = InvocationMessage | StreamInvocationMessage | StreamItemMessage | CompletionMessage | CancelInvocationMessage | PingMessage | CloseMessage | AckMessage | SequenceMessage;
export interface HubMessageBase {
    readonly type: MessageType;
}
export interface HubInvocationMessage extends HubMessageBase {
    readonly headers?: MessageHeaders;
    readonly invocationId?: string;
}
export interface InvocationMessage extends HubInvocationMessage {
    readonly type: MessageType.Invocation;
    readonly target: string;
    readonly arguments: any[];
    readonly streamIds?: string[];
}
export interface StreamInvocationMessage extends HubInvocationMessage {
    readonly type: MessageType.StreamInvocation;
    readonly invocationId: string;
    readonly target: string;
    readonly arguments: any[];
    readonly streamIds?: string[];
}
export interface StreamItemMessage extends HubInvocationMessage {
    readonly type: MessageType.StreamItem;
    readonly invocationId: string;
    readonly item?: any;
}
export interface CompletionMessage extends HubInvocationMessage {
    readonly type: MessageType.Completion;
    readonly invocationId: string;
    readonly error?: string;
    readonly result?: any;
}
export interface PingMessage extends HubMessageBase {
    readonly type: MessageType.Ping;
}
export interface CloseMessage extends HubMessageBase {
    readonly type: MessageType.Close;
    readonly error?: string;
    readonly allowReconnect?: boolean;
}
export interface CancelInvocationMessage extends HubInvocationMessage {
    readonly type: MessageType.CancelInvocation;
    readonly invocationId: string;
}
export interface AckMessage extends HubMessageBase {
    readonly type: MessageType.Ack;
    readonly sequenceId: number;
}
export interface SequenceMessage extends HubMessageBase {
    readonly type: MessageType.Sequence;
    readonly sequenceId: number;
}
export interface IHubProtocol {
    readonly name: string;
    readonly version: number;
    readonly transferFormat: TransferFormat;
    parseMessages(input: string | ArrayBuffer, logger: ILogger): HubMessage[];
    writeMessage(message: HubMessage): string | ArrayBuffer;
}
