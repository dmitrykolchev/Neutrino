import { Decoder } from "./Decoder";
export const defaultDecodeOptions = undefined;
export function decode(buffer, options) {
    const decoder = new Decoder(options);
    return decoder.decode(buffer);
}
export function decodeMulti(buffer, options) {
    const decoder = new Decoder(options);
    return decoder.decodeMulti(buffer);
}
//# sourceMappingURL=decode.js.map