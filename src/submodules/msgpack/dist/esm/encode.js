import { Encoder } from "./Encoder";
export const defaultEncodeOptions = undefined;
export function encode(value, options) {
    const encoder = new Encoder(options);
    return encoder.encodeSharedRef(value);
}
//# sourceMappingURL=encode.js.map