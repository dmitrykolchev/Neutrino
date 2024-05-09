import type { DecoderOptions } from "./Decoder";
import type { ReadableStreamLike } from "./utils/stream";
import type { SplitUndefined } from "./context";
export declare function decodeAsync<ContextType = undefined>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecoderOptions<SplitUndefined<ContextType>>): Promise<unknown>;
export declare function decodeArrayStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecoderOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;
export declare function decodeMultiStream<ContextType>(streamLike: ReadableStreamLike<ArrayLike<number> | BufferSource>, options?: DecoderOptions<SplitUndefined<ContextType>>): AsyncGenerator<unknown, void, unknown>;
export declare const decodeStream: never;
