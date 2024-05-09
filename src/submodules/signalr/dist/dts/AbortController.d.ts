export declare class AbortController implements AbortSignal {
    private _isAborted;
    onabort: (() => void) | null;
    abort(): void;
    get signal(): AbortSignal;
    get aborted(): boolean;
}
export interface AbortSignal {
    aborted: boolean;
    onabort: (() => void) | null;
}
