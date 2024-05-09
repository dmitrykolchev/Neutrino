export class HttpError extends Error {
    constructor(errorMessage, statusCode) {
        const trueProto = new.target.prototype;
        super(`${errorMessage}: Status code '${statusCode}'`);
        this.statusCode = statusCode;
        this.__proto__ = trueProto;
    }
}
export class TimeoutError extends Error {
    constructor(errorMessage = "A timeout occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        this.__proto__ = trueProto;
    }
}
export class AbortError extends Error {
    constructor(errorMessage = "An abort occurred.") {
        const trueProto = new.target.prototype;
        super(errorMessage);
        this.__proto__ = trueProto;
    }
}
export class UnsupportedTransportError extends Error {
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'UnsupportedTransportError';
        this.__proto__ = trueProto;
    }
}
export class DisabledTransportError extends Error {
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'DisabledTransportError';
        this.__proto__ = trueProto;
    }
}
export class FailedToStartTransportError extends Error {
    constructor(message, transport) {
        const trueProto = new.target.prototype;
        super(message);
        this.transport = transport;
        this.errorType = 'FailedToStartTransportError';
        this.__proto__ = trueProto;
    }
}
export class FailedToNegotiateWithServerError extends Error {
    constructor(message) {
        const trueProto = new.target.prototype;
        super(message);
        this.errorType = 'FailedToNegotiateWithServerError';
        this.__proto__ = trueProto;
    }
}
export class AggregateErrors extends Error {
    constructor(message, innerErrors) {
        const trueProto = new.target.prototype;
        super(message);
        this.innerErrors = innerErrors;
        this.__proto__ = trueProto;
    }
}
//# sourceMappingURL=Errors.js.map