import { IStreamResult, IStreamSubscriber, ISubscription } from "./Stream";
export declare class Subject<T> implements IStreamResult<T> {
    observers: IStreamSubscriber<T>[];
    cancelCallback?: () => Promise<void>;
    constructor();
    next(item: T): void;
    error(err: any): void;
    complete(): void;
    subscribe(observer: IStreamSubscriber<T>): ISubscription<T>;
}
