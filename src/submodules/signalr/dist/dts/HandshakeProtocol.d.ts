export interface HandshakeRequestMessage {
    readonly protocol: string;
    readonly version: number;
}
export interface HandshakeResponseMessage {
    readonly error: string;
    readonly minorVersion: number;
}
export declare class HandshakeProtocol {
    writeHandshakeRequest(handshakeRequest: HandshakeRequestMessage): string;
    parseHandshakeResponse(data: any): [any, HandshakeResponseMessage];
}
