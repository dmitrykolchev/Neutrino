declare class ExtData {
    readonly type: number;
    readonly data: Uint8Array;
    constructor(type: number, data: Uint8Array);
}

type ExtensionDecoderType<ContextType> = (data: Uint8Array, extensionType: number, context: ContextType) => unknown;
type ExtensionEncoderType<ContextType> = (input: unknown, context: ContextType) => Uint8Array | null;
type ExtensionCodecType<ContextType> = {
    __brand?: ContextType;
    tryToEncode(object: unknown, context: ContextType): ExtData | null;
    decode(data: Uint8Array, extType: number, context: ContextType): unknown;
};
declare class ExtensionCodec<ContextType = undefined> implements ExtensionCodecType<ContextType> {
    static readonly defaultCodec: ExtensionCodecType<undefined>;
    __brand?: ContextType;
    private readonly builtInEncoders;
    private readonly builtInDecoders;
    private readonly encoders;
    private readonly decoders;
    constructor();
    register({ type, encode, decode, }: {
        type: number;
        encode: ExtensionEncoderType<ContextType>;
        decode: ExtensionDecoderType<ContextType>;
    }): void;
    tryToEncode(object: unknown, context: ContextType): ExtData | null;
    decode(data: Uint8Array, type: number, context: ContextType): unknown;
}

type SplitTypes<T, U> = U extends T ? (Exclude<T, U> extends never ? T : Exclude<T, U>) : T;
type SplitUndefined<T> = SplitTypes<T, undefined>;
type ContextOf<ContextType> = ContextType extends undefined ? {} : {
    context: ContextType;
};

type EncodeOptions<ContextType = undefined> = Partial<Readonly<{
    extensionCodec: ExtensionCodecType<ContextType>;
    maxDepth: number;
    initialBufferSize: number;
    sortKeys: boolean;
    forceFloat32: boolean;
    ignoreUndefined: boolean;
    forceIntegerToFloat: boolean;
}>> & ContextOf<ContextType>;
declare function encode<ContextType = undefined>(value: unknown, options?: EncodeOptions<SplitUndefined<ContextType>>): Uint8Array;

type DecodeOptions<ContextType = undefined> = Readonly<Partial<{
    extensionCodec: ExtensionCodecType<ContextType>;
    maxStrLength: number;
    maxBinLength: number;
    maxArrayLength: number;
    maxMapLength: number;
    maxExtLength: number;
}>> & ContextOf<ContextType>;
declare function decode<ContextType = undefined>(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions<SplitUndefined<ContextType>>): unknown;
declare function decodeMulti<ContextType = undefined>(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions<SplitUndefined<ContextType>>): Generator<unknown, void, unknown>;

type ReadableStreamLike<T> = AsyncIterable<T> | ReadableStream<T>;

declare function decodeAsync<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeOptions<SplitUndefined<ContextType>>): Promise<unknown>;
declare function decodeArrayStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;
declare function decodeMultiStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;
declare function decodeStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecodeOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;

interface KeyDecoder {
    canBeCached(byteLength: number): boolean;
    decode(bytes: Uint8Array, inputOffset: number, byteLength: number): string;
}

declare const DataViewIndexOutOfBoundsError: typeof Error;
declare class Decoder<ContextType = undefined> {
    private readonly extensionCodec;
    private readonly context;
    private readonly maxStrLength;
    private readonly maxBinLength;
    private readonly maxArrayLength;
    private readonly maxMapLength;
    private readonly maxExtLength;
    private readonly keyDecoder;
    private totalPos;
    private pos;
    private view;
    private bytes;
    private headByte;
    private readonly stack;
    constructor(extensionCodec?: ExtensionCodecType<ContextType>, context?: ContextType, maxStrLength?: number, maxBinLength?: number, maxArrayLength?: number, maxMapLength?: number, maxExtLength?: number, keyDecoder?: KeyDecoder | null);
    private reinitializeState;
    private setBuffer;
    private appendBuffer;
    private hasRemaining;
    private createExtraByteError;
    decode(buffer: ArrayLike<number> | BufferSource): unknown;
    decodeMulti(buffer: ArrayLike<number> | BufferSource): Generator<unknown, void, unknown>;
    decodeAsync(stream: AsyncIterable<ArrayLike<number> | BufferSource>): Promise<unknown>;
    decodeArrayStream(stream: AsyncIterable<ArrayLike<number> | BufferSource>): AsyncGenerator<unknown, void, unknown>;
    decodeStream(stream: AsyncIterable<ArrayLike<number> | BufferSource>): AsyncGenerator<unknown, void, unknown>;
    private decodeMultiAsync;
    private doDecodeSync;
    private readHeadByte;
    private complete;
    private readArraySize;
    private pushMapState;
    private pushArrayState;
    private decodeUtf8String;
    private stateIsMapKey;
    private decodeBinary;
    private decodeExtension;
    private lookU8;
    private lookU16;
    private lookU32;
    private readU8;
    private readI8;
    private readU16;
    private readI16;
    private readU32;
    private readI32;
    private readU64;
    private readI64;
    private readF32;
    private readF64;
}

declare class DecodeError extends Error {
    constructor(message: string);
}

declare class Encoder<ContextType = undefined> {
    private readonly extensionCodec;
    private readonly context;
    private readonly maxDepth;
    private readonly initialBufferSize;
    private readonly sortKeys;
    private readonly forceFloat32;
    private readonly ignoreUndefined;
    private readonly forceIntegerToFloat;
    private pos;
    private view;
    private bytes;
    constructor(extensionCodec?: ExtensionCodecType<ContextType>, context?: ContextType, maxDepth?: number, initialBufferSize?: number, sortKeys?: boolean, forceFloat32?: boolean, ignoreUndefined?: boolean, forceIntegerToFloat?: boolean);
    private reinitializeState;
    encodeSharedRef(object: unknown): Uint8Array;
    encode(object: unknown): Uint8Array;
    private doEncode;
    private ensureBufferSizeToWrite;
    private resizeBuffer;
    private encodeNil;
    private encodeBoolean;
    private encodeNumber;
    private writeStringHeader;
    private encodeString;
    private encodeObject;
    private encodeBinary;
    private encodeArray;
    private countWithoutUndefined;
    private encodeMap;
    private encodeExtension;
    private writeU8;
    private writeU8a;
    private writeI8;
    private writeU16;
    private writeI16;
    private writeU32;
    private writeI32;
    private writeF32;
    private writeF64;
    private writeU64;
    private writeI64;
}

declare const EXT_TIMESTAMP = -1;
type TimeSpec = {
    sec: number;
    nsec: number;
};
declare function encodeTimeSpecToTimestamp({ sec, nsec }: TimeSpec): Uint8Array;
declare function encodeDateToTimeSpec(date: Date): TimeSpec;
declare function encodeTimestampExtension(object: unknown): Uint8Array | null;
declare function decodeTimestampToTimeSpec(data: Uint8Array): TimeSpec;
declare function decodeTimestampExtension(data: Uint8Array): Date;

export { DataViewIndexOutOfBoundsError, DecodeError, DecodeOptions, Decoder, EXT_TIMESTAMP, EncodeOptions, Encoder, ExtData, ExtensionCodec, ExtensionCodecType, ExtensionDecoderType, ExtensionEncoderType, decode, decodeArrayStream, decodeAsync, decodeMulti, decodeMultiStream, decodeStream, decodeTimestampExtension, decodeTimestampToTimeSpec, encode, encodeDateToTimeSpec, encodeTimeSpecToTimestamp, encodeTimestampExtension };
//# sourceMappingURL=msgpack.d.ts.map
