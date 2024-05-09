import type { EncoderOptions } from "./Encoder";
import type { SplitUndefined } from "./context";
export type EncodeOptions = never;
export declare const defaultEncodeOptions: never;
export declare function encode<ContextType = undefined>(value: unknown, options?: EncoderOptions<SplitUndefined<ContextType>>): Uint8Array;
