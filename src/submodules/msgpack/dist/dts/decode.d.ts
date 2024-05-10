import type { ExtensionCodecType } from "./ExtensionCodec";
import type { ContextOf, SplitUndefined } from "./context";
export type DecodeOptions<ContextType = undefined> = Readonly<Partial<{
    extensionCodec: ExtensionCodecType<ContextType>;
    maxStrLength: number;
    maxBinLength: number;
    maxArrayLength: number;
    maxMapLength: number;
    maxExtLength: number;
}>> & ContextOf<ContextType>;
export declare const defaultDecodeOptions: DecodeOptions;
export declare function decode<ContextType = undefined>(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions<SplitUndefined<ContextType>>): unknown;
export declare function decodeMulti<ContextType = undefined>(buffer: ArrayLike<number> | BufferSource, options?: DecodeOptions<SplitUndefined<ContextType>>): Generator<unknown, void, unknown>;
