import { Encoder } from "./Encoder";
const defaultEncodeOptions = {};
export function encode(value, options = defaultEncodeOptions) {
    const encoder = new Encoder(options.extensionCodec, options.context, options.maxDepth, options.initialBufferSize, options.sortKeys, options.forceFloat32, options.ignoreUndefined, options.forceIntegerToFloat);
    return encoder.encodeSharedRef(value);
}
//# sourceMappingURL=encode.js.map