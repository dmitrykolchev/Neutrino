import type { DecoderOptions } from "./Decoder";
import type { SplitUndefined } from "./context";
export type DecodeOptions = never;
export declare const defaultDecodeOptions: never;
export declare function decode<ContextType = undefined>(buffer: ArrayLike<number> | BufferSource, options?: DecoderOptions<SplitUndefined<ContextType>>): unknown;
export declare function decodeMulti<ContextType = undefined>(buffer: ArrayLike<number> | BufferSource, options?: DecoderOptions<SplitUndefined<ContextType>>): Generator<unknown, void, unknown>;
