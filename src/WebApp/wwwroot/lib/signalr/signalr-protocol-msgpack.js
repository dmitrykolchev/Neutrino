import { Encoder, Decoder } from '/lib/msgpack/msgpack.js';
import { MessageType, TransferFormat, NullLogger, LogLevel } from '/lib/signalr/signalr.js';

const VERSION = '5.0.0-dev';

class BinaryMessageFormat {
    static write(output) {
        let size = output.byteLength || output.length;
        const lenBuffer = [];
        do {
            let sizePart = size & 0x7f;
            size = size >> 7;
            if (size > 0) {
                sizePart |= 0x80;
            }
            lenBuffer.push(sizePart);
        } while (size > 0);
        size = output.byteLength || output.length;
        const buffer = new Uint8Array(lenBuffer.length + size);
        buffer.set(lenBuffer, 0);
        buffer.set(output, lenBuffer.length);
        return buffer.buffer;
    }
    static parse(input) {
        const result = [];
        const uint8Array = new Uint8Array(input);
        const maxLengthPrefixSize = 5;
        const numBitsToShift = [0, 7, 14, 21, 28];
        for (let offset = 0; offset < input.byteLength;) {
            let numBytes = 0;
            let size = 0;
            let byteRead;
            do {
                byteRead = uint8Array[offset + numBytes];
                size = size | ((byteRead & 0x7f) << (numBitsToShift[numBytes]));
                numBytes++;
            } while (numBytes < Math.min(maxLengthPrefixSize, input.byteLength - offset) && (byteRead & 0x80) !== 0);
            if ((byteRead & 0x80) !== 0 && numBytes < maxLengthPrefixSize) {
                throw new Error("Cannot read message size.");
            }
            if (numBytes === maxLengthPrefixSize && byteRead > 7) {
                throw new Error("Messages bigger than 2GB are not supported.");
            }
            if (uint8Array.byteLength >= (offset + numBytes + size)) {
                result.push(uint8Array.slice
                    ? uint8Array.slice(offset + numBytes, offset + numBytes + size)
                    : uint8Array.subarray(offset + numBytes, offset + numBytes + size));
            }
            else {
                throw new Error("Incomplete message.");
            }
            offset = offset + numBytes + size;
        }
        return result;
    }
}

function isArrayBuffer(val) {
    return val && typeof ArrayBuffer !== "undefined" &&
        (val instanceof ArrayBuffer ||
            (val.constructor && val.constructor.name === "ArrayBuffer"));
}

const SERIALIZED_PING_MESSAGE = new Uint8Array([0x91, MessageType.Ping]);
class MessagePackHubProtocol {
    constructor(messagePackOptions) {
        this.name = "messagepack";
        this.version = 2;
        this.transferFormat = TransferFormat.Binary;
        this._errorResult = 1;
        this._voidResult = 2;
        this._nonVoidResult = 3;
        messagePackOptions = messagePackOptions || {};
        this._encoder = new Encoder(messagePackOptions.extensionCodec, messagePackOptions.context, messagePackOptions.maxDepth, messagePackOptions.initialBufferSize, messagePackOptions.sortKeys, messagePackOptions.forceFloat32, messagePackOptions.ignoreUndefined, messagePackOptions.forceIntegerToFloat);
        this._decoder = new Decoder(messagePackOptions.extensionCodec, messagePackOptions.context, messagePackOptions.maxStrLength, messagePackOptions.maxBinLength, messagePackOptions.maxArrayLength, messagePackOptions.maxMapLength, messagePackOptions.maxExtLength);
    }
    parseMessages(input, logger) {
        if (!(isArrayBuffer(input))) {
            throw new Error("Invalid input for MessagePack hub protocol. Expected an ArrayBuffer.");
        }
        if (logger === null) {
            logger = NullLogger.instance;
        }
        const messages = BinaryMessageFormat.parse(input);
        const hubMessages = [];
        for (const message of messages) {
            const parsedMessage = this._parseMessage(message, logger);
            if (parsedMessage) {
                hubMessages.push(parsedMessage);
            }
        }
        return hubMessages;
    }
    writeMessage(message) {
        switch (message.type) {
            case MessageType.Invocation:
                return this._writeInvocation(message);
            case MessageType.StreamInvocation:
                return this._writeStreamInvocation(message);
            case MessageType.StreamItem:
                return this._writeStreamItem(message);
            case MessageType.Completion:
                return this._writeCompletion(message);
            case MessageType.Ping:
                return BinaryMessageFormat.write(SERIALIZED_PING_MESSAGE);
            case MessageType.CancelInvocation:
                return this._writeCancelInvocation(message);
            case MessageType.Close:
                return this._writeClose();
            case MessageType.Ack:
                return this._writeAck(message);
            case MessageType.Sequence:
                return this._writeSequence(message);
            default:
                throw new Error("Invalid message type.");
        }
    }
    _parseMessage(input, logger) {
        if (input.length === 0) {
            throw new Error("Invalid payload.");
        }
        const properties = this._decoder.decode(input);
        if (properties.length === 0 || !(properties instanceof Array)) {
            throw new Error("Invalid payload.");
        }
        const messageType = properties[0];
        switch (messageType) {
            case MessageType.Invocation:
                return this._createInvocationMessage(this._readHeaders(properties), properties);
            case MessageType.StreamItem:
                return this._createStreamItemMessage(this._readHeaders(properties), properties);
            case MessageType.Completion:
                return this._createCompletionMessage(this._readHeaders(properties), properties);
            case MessageType.Ping:
                return this._createPingMessage(properties);
            case MessageType.Close:
                return this._createCloseMessage(properties);
            case MessageType.Ack:
                return this._createAckMessage(properties);
            case MessageType.Sequence:
                return this._createSequenceMessage(properties);
            default:
                logger.log(LogLevel.Information, "Unknown message type '" + messageType + "' ignored.");
                return null;
        }
    }
    _createCloseMessage(properties) {
        if (properties.length < 2) {
            throw new Error("Invalid payload for Close message.");
        }
        return {
            allowReconnect: properties.length >= 3 ? properties[2] : undefined,
            error: properties[1],
            type: MessageType.Close,
        };
    }
    _createPingMessage(properties) {
        if (properties.length < 1) {
            throw new Error("Invalid payload for Ping message.");
        }
        return {
            type: MessageType.Ping,
        };
    }
    _createInvocationMessage(headers, properties) {
        if (properties.length < 5) {
            throw new Error("Invalid payload for Invocation message.");
        }
        const invocationId = properties[2];
        if (invocationId) {
            return {
                arguments: properties[4],
                headers,
                invocationId,
                streamIds: [],
                target: properties[3],
                type: MessageType.Invocation,
            };
        }
        else {
            return {
                arguments: properties[4],
                headers,
                streamIds: [],
                target: properties[3],
                type: MessageType.Invocation,
            };
        }
    }
    _createStreamItemMessage(headers, properties) {
        if (properties.length < 4) {
            throw new Error("Invalid payload for StreamItem message.");
        }
        return {
            headers,
            invocationId: properties[2],
            item: properties[3],
            type: MessageType.StreamItem,
        };
    }
    _createCompletionMessage(headers, properties) {
        if (properties.length < 4) {
            throw new Error("Invalid payload for Completion message.");
        }
        const resultKind = properties[3];
        if (resultKind !== this._voidResult && properties.length < 5) {
            throw new Error("Invalid payload for Completion message.");
        }
        let error;
        let result;
        switch (resultKind) {
            case this._errorResult:
                error = properties[4];
                break;
            case this._nonVoidResult:
                result = properties[4];
                break;
        }
        const completionMessage = {
            error,
            headers,
            invocationId: properties[2],
            result,
            type: MessageType.Completion,
        };
        return completionMessage;
    }
    _createAckMessage(properties) {
        if (properties.length < 1) {
            throw new Error("Invalid payload for Ack message.");
        }
        return {
            sequenceId: properties[1],
            type: MessageType.Ack,
        };
    }
    _createSequenceMessage(properties) {
        if (properties.length < 1) {
            throw new Error("Invalid payload for Sequence message.");
        }
        return {
            sequenceId: properties[1],
            type: MessageType.Sequence,
        };
    }
    _writeInvocation(invocationMessage) {
        let payload;
        if (invocationMessage.streamIds) {
            payload = this._encoder.encode([MessageType.Invocation, invocationMessage.headers || {}, invocationMessage.invocationId || null,
                invocationMessage.target, invocationMessage.arguments, invocationMessage.streamIds]);
        }
        else {
            payload = this._encoder.encode([MessageType.Invocation, invocationMessage.headers || {}, invocationMessage.invocationId || null,
                invocationMessage.target, invocationMessage.arguments]);
        }
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeStreamInvocation(streamInvocationMessage) {
        let payload;
        if (streamInvocationMessage.streamIds) {
            payload = this._encoder.encode([MessageType.StreamInvocation, streamInvocationMessage.headers || {}, streamInvocationMessage.invocationId,
                streamInvocationMessage.target, streamInvocationMessage.arguments, streamInvocationMessage.streamIds]);
        }
        else {
            payload = this._encoder.encode([MessageType.StreamInvocation, streamInvocationMessage.headers || {}, streamInvocationMessage.invocationId,
                streamInvocationMessage.target, streamInvocationMessage.arguments]);
        }
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeStreamItem(streamItemMessage) {
        const payload = this._encoder.encode([MessageType.StreamItem, streamItemMessage.headers || {}, streamItemMessage.invocationId,
            streamItemMessage.item]);
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeCompletion(completionMessage) {
        const resultKind = completionMessage.error ? this._errorResult :
            (completionMessage.result !== undefined) ? this._nonVoidResult : this._voidResult;
        let payload;
        switch (resultKind) {
            case this._errorResult:
                payload = this._encoder.encode([MessageType.Completion, completionMessage.headers || {}, completionMessage.invocationId, resultKind, completionMessage.error]);
                break;
            case this._voidResult:
                payload = this._encoder.encode([MessageType.Completion, completionMessage.headers || {}, completionMessage.invocationId, resultKind]);
                break;
            case this._nonVoidResult:
                payload = this._encoder.encode([MessageType.Completion, completionMessage.headers || {}, completionMessage.invocationId, resultKind, completionMessage.result]);
                break;
        }
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeCancelInvocation(cancelInvocationMessage) {
        const payload = this._encoder.encode([MessageType.CancelInvocation, cancelInvocationMessage.headers || {}, cancelInvocationMessage.invocationId]);
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeClose() {
        const payload = this._encoder.encode([MessageType.Close, null]);
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeAck(ackMessage) {
        const payload = this._encoder.encode([MessageType.Ack, ackMessage.sequenceId]);
        return BinaryMessageFormat.write(payload.slice());
    }
    _writeSequence(sequenceMessage) {
        const payload = this._encoder.encode([MessageType.Sequence, sequenceMessage.sequenceId]);
        return BinaryMessageFormat.write(payload.slice());
    }
    _readHeaders(properties) {
        const headers = properties[1];
        if (typeof headers !== "object") {
            throw new Error("Invalid headers.");
        }
        return headers;
    }
}

export { MessagePackHubProtocol, VERSION };
//# sourceMappingURL=signalr-protocol-msgpack.js.map
