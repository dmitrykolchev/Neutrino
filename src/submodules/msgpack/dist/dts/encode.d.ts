import type { ExtensionCodecType } from "./ExtensionCodec";
import type { ContextOf, SplitUndefined } from "./context";
export type EncodeOptions<ContextType = undefined> = Partial<Readonly<{
    extensionCodec: ExtensionCodecType<ContextType>;
    maxDepth: number;
    initialBufferSize: number;
    sortKeys: boolean;
    forceFloat32: boolean;
    ignoreUndefined: boolean;
    forceIntegerToFloat: boolean;
}>> & ContextOf<ContextType>;
export declare function encode<ContextType = undefined>(value: unknown, options?: EncodeOptions<SplitUndefined<ContextType>>): Uint8Array;
