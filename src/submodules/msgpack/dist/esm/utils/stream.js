export function isAsyncIterable(object) {
    return object[Symbol.asyncIterator] != null;
}
function assertNonNull(value) {
    if (value == null) {
        throw new Error("Assertion Failure: value must not be null nor undefined");
    }
}
export async function* asyncIterableFromStream(stream) {
    const reader = stream.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            assertNonNull(value);
            yield value;
        }
    }
    finally {
        reader.releaseLock();
    }
}
export function ensureAsyncIterable(streamLike) {
    if (isAsyncIterable(streamLike)) {
        return streamLike;
    }
    else {
        return asyncIterableFromStream(streamLike);
    }
}
//# sourceMappingURL=stream.js.map