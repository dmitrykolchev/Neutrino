export class NullLogger {
    constructor() { }
    log(_logLevel, _message) {
    }
}
NullLogger.instance = new NullLogger();
//# sourceMappingURL=Loggers.js.map