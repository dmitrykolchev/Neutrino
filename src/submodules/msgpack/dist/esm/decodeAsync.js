import { Decoder } from "./Decoder";
import { ensureAsyncIterable } from "./utils/stream";
import { defaultDecodeOptions } from "./decode";
export async function decodeAsync(streamLike, options = defaultDecodeOptions) {
    const stream = ensureAsyncIterable(streamLike);
    const decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeAsync(stream);
}
export function decodeArrayStream(streamLike, options = defaultDecodeOptions) {
    const stream = ensureAsyncIterable(streamLike);
    const decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeArrayStream(stream);
}
export function decodeMultiStream(streamLike, options = defaultDecodeOptions) {
    const stream = ensureAsyncIterable(streamLike);
    const decoder = new Decoder(options.extensionCodec, options.context, options.maxStrLength, options.maxBinLength, options.maxArrayLength, options.maxMapLength, options.maxExtLength);
    return decoder.decodeStream(stream);
}
export function decodeStream(streamLike, options = defaultDecodeOptions) {
    return decodeMultiStream(streamLike, options);
}
//# sourceMappingURL=decodeAsync.js.map