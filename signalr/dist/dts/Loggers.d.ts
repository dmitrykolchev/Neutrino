import { ILogger, LogLevel } from "./ILogger";
export declare class NullLogger implements ILogger {
    static instance: ILogger;
    private constructor();
    log(_logLevel: LogLevel, _message: string): void;
}
