export interface IRetryPolicy {
    nextRetryDelayInMilliseconds(retryContext: RetryContext): number | null;
}
export interface RetryContext {
    readonly previousRetryCount: number;
    readonly elapsedMilliseconds: number;
    readonly retryReason: Error;
}
