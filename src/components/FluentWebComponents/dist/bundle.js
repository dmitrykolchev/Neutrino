/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

let kernelMode;
const kernelAttr = "fast-kernel";
try {
    if (document.currentScript) {
        kernelMode = document.currentScript.getAttribute(kernelAttr);
    }
    else {
        const scripts = document.getElementsByTagName("script");
        const currentScript = scripts[scripts.length - 1];
        kernelMode = currentScript.getAttribute(kernelAttr);
    }
}
catch (e) {
    kernelMode = "isolate";
}
let KernelServiceId;
switch (kernelMode) {
    case "share": // share the kernel across major versions
        KernelServiceId = Object.freeze({
            updateQueue: 1,
            observable: 2,
            contextEvent: 3,
            elementRegistry: 4,
        });
        break;
    case "share-v2": // only share the kernel with other v2 instances
        KernelServiceId = Object.freeze({
            updateQueue: 1.2,
            observable: 2.2,
            contextEvent: 3.2,
            elementRegistry: 4.2,
        });
        break;
    default:
        // fully isolate the kernel from all other FAST instances
        const postfix = `-${Math.random().toString(36).substring(2, 8)}`;
        KernelServiceId = Object.freeze({
            updateQueue: `1.2${postfix}`,
            observable: `2.2${postfix}`,
            contextEvent: `3.2${postfix}`,
            elementRegistry: `4.2${postfix}`,
        });
        break;
}
/**
 * Determines whether or not an object is a function.
 * @public
 */
const isFunction = (object) => typeof object === "function";
/**
 * Determines whether or not an object is a string.
 * @public
 */
const isString = (object) => typeof object === "string";
/**
 * A function which does nothing.
 * @public
 */
const noop = () => void 0;

/* eslint-disable @typescript-eslint/ban-ts-comment */
(function ensureGlobalThis() {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return;
    }
    // @ts-ignore
    if (typeof global !== "undefined") {
        // We're running in NodeJS
        // @ts-ignore
        global.globalThis = global;
    }
    else if (typeof self !== "undefined") {
        self.globalThis = self;
    }
    else if (typeof window !== "undefined") {
        // We're running in the browser's main thread.
        window.globalThis = window;
    }
    else {
        // Hopefully we never get here...
        // Not all environments allow eval and Function. Use only as a last resort:
        // eslint-disable-next-line no-new-func
        const result = new Function("return this")();
        result.globalThis = result;
    }
})();

// ensure FAST global - duplicated debug.ts
const propConfig = {
    configurable: false,
    enumerable: false,
    writable: false,
};
if (globalThis.FAST === void 0) {
    Reflect.defineProperty(globalThis, "FAST", Object.assign({ value: Object.create(null) }, propConfig));
}
/**
 * The FAST global.
 * @public
 */
const FAST = globalThis.FAST;
if (FAST.getById === void 0) {
    const storage = Object.create(null);
    Reflect.defineProperty(FAST, "getById", Object.assign({ value(id, initialize) {
            let found = storage[id];
            if (found === void 0) {
                found = initialize ? (storage[id] = initialize()) : null;
            }
            return found;
        } }, propConfig));
}
if (FAST.error === void 0) {
    Object.assign(FAST, {
        warn() { },
        error(code) {
            return new Error(`Error ${code}`);
        },
        addMessages() { },
    });
}
/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @public
 */
const emptyArray = Object.freeze([]);
/**
 * Do not change. Part of shared kernel contract.
 * @internal
 */
function createTypeRegistry() {
    const typeToDefinition = new Map();
    return Object.freeze({
        register(definition) {
            if (typeToDefinition.has(definition.type)) {
                return false;
            }
            typeToDefinition.set(definition.type, definition);
            return true;
        },
        getByType(key) {
            return typeToDefinition.get(key);
        },
        getForInstance(object) {
            if (object === null || object === void 0) {
                return void 0;
            }
            return typeToDefinition.get(object.constructor);
        },
    });
}
/**
 * Creates a function capable of locating metadata associated with a type.
 * @returns A metadata locator function.
 * @internal
 */
function createMetadataLocator() {
    const metadataLookup = new WeakMap();
    return function (target) {
        let metadata = metadataLookup.get(target);
        if (metadata === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);
            while (metadata === void 0 && currentTarget !== null) {
                metadata = metadataLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }
            metadata = metadata === void 0 ? [] : metadata.slice(0);
            metadataLookup.set(target, metadata);
        }
        return metadata;
    };
}
/**
 * Makes a type noop for JSON serialization.
 * @param type - The type to make noop for JSON serialization.
 * @internal
 */
function makeSerializationNoop(type) {
    type.prototype.toJSON = noop;
}

/**
 * The type of HTML aspect to target.
 * @public
 */
const DOMAspect = Object.freeze({
    /**
     * Not aspected.
     */
    none: 0,
    /**
     * An attribute.
     */
    attribute: 1,
    /**
     * A boolean attribute.
     */
    booleanAttribute: 2,
    /**
     * A property.
     */
    property: 3,
    /**
     * Content
     */
    content: 4,
    /**
     * A token list.
     */
    tokenList: 5,
    /**
     * An event.
     */
    event: 6,
});
const createHTML$1 = html => html;
const fastTrustedType = globalThis.trustedTypes
    ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML: createHTML$1 })
    : { createHTML: createHTML$1 };
let defaultPolicy = Object.freeze({
    createHTML(value) {
        return fastTrustedType.createHTML(value);
    },
    protect(tagName, aspect, aspectName, sink) {
        return sink;
    },
});
const fastPolicy = defaultPolicy;
/**
 * Common DOM APIs.
 * @public
 */
const DOM = Object.freeze({
    /**
     * Gets the dom policy used by the templating system.
     */
    get policy() {
        return defaultPolicy;
    },
    /**
     * Sets the dom policy used by the templating system.
     * @param policy - The policy to set.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setPolicy(value) {
        if (defaultPolicy !== fastPolicy) {
            throw FAST.error(1201 /* Message.onlySetDOMPolicyOnce */);
        }
        defaultPolicy = value;
    },
    /**
     * Sets an attribute value on an element.
     * @param element - The element to set the attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is `null` or `undefined`, the attribute is removed, otherwise
     * it is set to the provided value using the standard `setAttribute` API.
     */
    setAttribute(element, attributeName, value) {
        value === null || value === undefined
            ? element.removeAttribute(attributeName)
            : element.setAttribute(attributeName, value);
    },
    /**
     * Sets a boolean attribute value.
     * @param element - The element to set the boolean attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is true, the attribute is added; otherwise it is removed.
     */
    setBooleanAttribute(element, attributeName, value) {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
});

/**
 * The default UpdateQueue.
 * @public
 */
const Updates = FAST.getById(KernelServiceId.updateQueue, () => {
    const tasks = [];
    const pendingErrors = [];
    const rAF = globalThis.requestAnimationFrame;
    let updateAsync = true;
    function throwFirstError() {
        if (pendingErrors.length) {
            throw pendingErrors.shift();
        }
    }
    function tryRunTask(task) {
        try {
            task.call();
        }
        catch (error) {
            if (updateAsync) {
                pendingErrors.push(error);
                setTimeout(throwFirstError, 0);
            }
            else {
                tasks.length = 0;
                throw error;
            }
        }
    }
    function process() {
        const capacity = 1024;
        let index = 0;
        while (index < tasks.length) {
            tryRunTask(tasks[index]);
            index++;
            // Prevent leaking memory for long chains of recursive calls to `enqueue`.
            // If we call `enqueue` within a task scheduled by `enqueue`, the queue will
            // grow, but to avoid an O(n) walk for every task we execute, we don't
            // shift tasks off the queue after they have been executed.
            // Instead, we periodically shift 1024 tasks off the queue.
            if (index > capacity) {
                // Manually shift all values starting at the index back to the
                // beginning of the queue.
                for (let scan = 0, newLength = tasks.length - index; scan < newLength; scan++) {
                    tasks[scan] = tasks[scan + index];
                }
                tasks.length -= index;
                index = 0;
            }
        }
        tasks.length = 0;
    }
    function enqueue(callable) {
        tasks.push(callable);
        if (tasks.length < 2) {
            updateAsync ? rAF(process) : process();
        }
    }
    return Object.freeze({
        enqueue,
        next: () => new Promise(enqueue),
        process,
        setMode: (isAsync) => (updateAsync = isAsync),
    });
});

/**
 * An implementation of {@link Notifier} that efficiently keeps track of
 * subscribers interested in a specific change notification on an
 * observable subject.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 * @public
 */
class SubscriberSet {
    /**
     * Creates an instance of SubscriberSet for the specified subject.
     * @param subject - The subject that subscribers will receive notifications from.
     * @param initialSubscriber - An initial subscriber to changes.
     */
    constructor(subject, initialSubscriber) {
        this.sub1 = void 0;
        this.sub2 = void 0;
        this.spillover = void 0;
        this.subject = subject;
        this.sub1 = initialSubscriber;
    }
    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber - The subscriber to test for inclusion in this set.
     */
    has(subscriber) {
        return this.spillover === void 0
            ? this.sub1 === subscriber || this.sub2 === subscriber
            : this.spillover.indexOf(subscriber) !== -1;
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
    subscribe(subscriber) {
        const spillover = this.spillover;
        if (spillover === void 0) {
            if (this.has(subscriber)) {
                return;
            }
            if (this.sub1 === void 0) {
                this.sub1 = subscriber;
                return;
            }
            if (this.sub2 === void 0) {
                this.sub2 = subscriber;
                return;
            }
            this.spillover = [this.sub1, this.sub2, subscriber];
            this.sub1 = void 0;
            this.sub2 = void 0;
        }
        else {
            const index = spillover.indexOf(subscriber);
            if (index === -1) {
                spillover.push(subscriber);
            }
        }
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     */
    unsubscribe(subscriber) {
        const spillover = this.spillover;
        if (spillover === void 0) {
            if (this.sub1 === subscriber) {
                this.sub1 = void 0;
            }
            else if (this.sub2 === subscriber) {
                this.sub2 = void 0;
            }
        }
        else {
            const index = spillover.indexOf(subscriber);
            if (index !== -1) {
                spillover.splice(index, 1);
            }
        }
    }
    /**
     * Notifies all subscribers.
     * @param args - Data passed along to subscribers during notification.
     */
    notify(args) {
        const spillover = this.spillover;
        const subject = this.subject;
        if (spillover === void 0) {
            const sub1 = this.sub1;
            const sub2 = this.sub2;
            if (sub1 !== void 0) {
                sub1.handleChange(subject, args);
            }
            if (sub2 !== void 0) {
                sub2.handleChange(subject, args);
            }
        }
        else {
            for (let i = 0, ii = spillover.length; i < ii; ++i) {
                spillover[i].handleChange(subject, args);
            }
        }
    }
}
/**
 * An implementation of Notifier that allows subscribers to be notified
 * of individual property changes on an object.
 * @public
 */
class PropertyChangeNotifier {
    /**
     * Creates an instance of PropertyChangeNotifier for the specified subject.
     * @param subject - The object that subscribers will receive notifications for.
     */
    constructor(subject) {
        this.subscribers = {};
        this.subjectSubscribers = null;
        this.subject = subject;
    }
    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName - The property name, passed along to subscribers during notification.
     */
    notify(propertyName) {
        var _a, _b;
        (_a = this.subscribers[propertyName]) === null || _a === void 0 ? void 0 : _a.notify(propertyName);
        (_b = this.subjectSubscribers) === null || _b === void 0 ? void 0 : _b.notify(propertyName);
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     */
    subscribe(subscriber, propertyToWatch) {
        var _a, _b;
        let subscribers;
        if (propertyToWatch) {
            subscribers =
                (_a = this.subscribers[propertyToWatch]) !== null && _a !== void 0 ? _a : (this.subscribers[propertyToWatch] = new SubscriberSet(this.subject));
        }
        else {
            subscribers =
                (_b = this.subjectSubscribers) !== null && _b !== void 0 ? _b : (this.subjectSubscribers = new SubscriberSet(this.subject));
        }
        subscribers.subscribe(subscriber);
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     */
    unsubscribe(subscriber, propertyToUnwatch) {
        var _a, _b;
        if (propertyToUnwatch) {
            (_a = this.subscribers[propertyToUnwatch]) === null || _a === void 0 ? void 0 : _a.unsubscribe(subscriber);
        }
        else {
            (_b = this.subjectSubscribers) === null || _b === void 0 ? void 0 : _b.unsubscribe(subscriber);
        }
    }
}

/**
 * Describes how the source's lifetime relates to its controller's lifetime.
 * @public
 */
const SourceLifetime = Object.freeze({
    /**
     * The source to controller lifetime relationship is unknown.
     */
    unknown: void 0,
    /**
     * The source and controller lifetimes are coupled to one another.
     * They can/will be GC'd together.
     */
    coupled: 1,
});
/**
 * Common Observable APIs.
 * @public
 */
const Observable = FAST.getById(KernelServiceId.observable, () => {
    const queueUpdate = Updates.enqueue;
    const volatileRegex = /(:|&&|\|\||if|\?\.)/;
    const notifierLookup = new WeakMap();
    let watcher = void 0;
    let createArrayObserver = (array) => {
        throw FAST.error(1101 /* Message.needsArrayObservation */);
    };
    function getNotifier(source) {
        var _a;
        let found = (_a = source.$fastController) !== null && _a !== void 0 ? _a : notifierLookup.get(source);
        if (found === void 0) {
            Array.isArray(source)
                ? (found = createArrayObserver(source))
                : notifierLookup.set(source, (found = new PropertyChangeNotifier(source)));
        }
        return found;
    }
    const getAccessors = createMetadataLocator();
    class DefaultObservableAccessor {
        constructor(name) {
            this.name = name;
            this.field = `_${name}`;
            this.callback = `${name}Changed`;
        }
        getValue(source) {
            if (watcher !== void 0) {
                watcher.watch(source, this.name);
            }
            return source[this.field];
        }
        setValue(source, newValue) {
            const field = this.field;
            const oldValue = source[field];
            if (oldValue !== newValue) {
                source[field] = newValue;
                const callback = source[this.callback];
                if (isFunction(callback)) {
                    callback.call(source, oldValue, newValue);
                }
                getNotifier(source).notify(this.name);
            }
        }
    }
    class ExpressionNotifierImplementation extends SubscriberSet {
        constructor(expression, initialSubscriber, isVolatileBinding = false) {
            super(expression, initialSubscriber);
            this.expression = expression;
            this.isVolatileBinding = isVolatileBinding;
            this.needsRefresh = true;
            this.needsQueue = true;
            this.isAsync = true;
            this.first = this;
            this.last = null;
            this.propertySource = void 0;
            this.propertyName = void 0;
            this.notifier = void 0;
            this.next = void 0;
        }
        setMode(isAsync) {
            this.isAsync = this.needsQueue = isAsync;
        }
        bind(controller) {
            this.controller = controller;
            const value = this.observe(controller.source, controller.context);
            if (!controller.isBound && this.requiresUnbind(controller)) {
                controller.onUnbind(this);
            }
            return value;
        }
        requiresUnbind(controller) {
            return (controller.sourceLifetime !== SourceLifetime.coupled ||
                this.first !== this.last ||
                this.first.propertySource !== controller.source);
        }
        unbind(controller) {
            this.dispose();
        }
        observe(source, context) {
            if (this.needsRefresh && this.last !== null) {
                this.dispose();
            }
            const previousWatcher = watcher;
            watcher = this.needsRefresh ? this : void 0;
            this.needsRefresh = this.isVolatileBinding;
            let result;
            try {
                result = this.expression(source, context);
            }
            finally {
                watcher = previousWatcher;
            }
            return result;
        }
        // backwards compat with v1 kernel
        disconnect() {
            this.dispose();
        }
        dispose() {
            if (this.last !== null) {
                let current = this.first;
                while (current !== void 0) {
                    current.notifier.unsubscribe(this, current.propertyName);
                    current = current.next;
                }
                this.last = null;
                this.needsRefresh = this.needsQueue = this.isAsync;
            }
        }
        watch(propertySource, propertyName) {
            const prev = this.last;
            const notifier = getNotifier(propertySource);
            const current = prev === null ? this.first : {};
            current.propertySource = propertySource;
            current.propertyName = propertyName;
            current.notifier = notifier;
            notifier.subscribe(this, propertyName);
            if (prev !== null) {
                if (!this.needsRefresh) {
                    // Declaring the variable prior to assignment below circumvents
                    // a bug in Angular's optimization process causing infinite recursion
                    // of this watch() method. Details https://github.com/microsoft/fast/issues/4969
                    let prevValue;
                    watcher = void 0;
                    /* eslint-disable-next-line */
                    prevValue = prev.propertySource[prev.propertyName];
                    /* eslint-disable-next-line */
                    watcher = this;
                    if (propertySource === prevValue) {
                        this.needsRefresh = true;
                    }
                }
                prev.next = current;
            }
            this.last = current;
        }
        handleChange() {
            if (this.needsQueue) {
                this.needsQueue = false;
                queueUpdate(this);
            }
            else if (!this.isAsync) {
                this.call();
            }
        }
        call() {
            if (this.last !== null) {
                this.needsQueue = this.isAsync;
                this.notify(this);
            }
        }
        *records() {
            let next = this.first;
            while (next !== void 0) {
                yield next;
                next = next.next;
            }
        }
    }
    makeSerializationNoop(ExpressionNotifierImplementation);
    return Object.freeze({
        /**
         * @internal
         * @param factory - The factory used to create array observers.
         */
        setArrayObserverFactory(factory) {
            createArrayObserver = factory;
        },
        /**
         * Gets a notifier for an object or Array.
         * @param source - The object or Array to get the notifier for.
         */
        getNotifier,
        /**
         * Records a property change for a source object.
         * @param source - The object to record the change against.
         * @param propertyName - The property to track as changed.
         */
        track(source, propertyName) {
            watcher && watcher.watch(source, propertyName);
        },
        /**
         * Notifies watchers that the currently executing property getter or function is volatile
         * with respect to its observable dependencies.
         */
        trackVolatile() {
            watcher && (watcher.needsRefresh = true);
        },
        /**
         * Notifies subscribers of a source object of changes.
         * @param source - the object to notify of changes.
         * @param args - The change args to pass to subscribers.
         */
        notify(source, args) {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            getNotifier(source).notify(args);
        },
        /**
         * Defines an observable property on an object or prototype.
         * @param target - The target object to define the observable on.
         * @param nameOrAccessor - The name of the property to define as observable;
         * or a custom accessor that specifies the property name and accessor implementation.
         */
        defineProperty(target, nameOrAccessor) {
            if (isString(nameOrAccessor)) {
                nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
            }
            getAccessors(target).push(nameOrAccessor);
            Reflect.defineProperty(target, nameOrAccessor.name, {
                enumerable: true,
                get() {
                    return nameOrAccessor.getValue(this);
                },
                set(newValue) {
                    nameOrAccessor.setValue(this, newValue);
                },
            });
        },
        /**
         * Finds all the observable accessors defined on the target,
         * including its prototype chain.
         * @param target - The target object to search for accessor on.
         */
        getAccessors,
        /**
         * Creates a {@link ExpressionNotifier} that can watch the
         * provided {@link Expression} for changes.
         * @param expression - The binding to observe.
         * @param initialSubscriber - An initial subscriber to changes in the binding value.
         * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
         */
        binding(expression, initialSubscriber, isVolatileBinding = this.isVolatileBinding(expression)) {
            return new ExpressionNotifierImplementation(expression, initialSubscriber, isVolatileBinding);
        },
        /**
         * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
         * on every evaluation of the value.
         * @param expression - The binding to inspect.
         */
        isVolatileBinding(expression) {
            return volatileRegex.test(expression.toString());
        },
    });
});
/**
 * Decorator: Defines an observable property on the target.
 * @param target - The target to define the observable on.
 * @param nameOrAccessor - The property name or accessor to define the observable as.
 * @public
 */
function observable(target, nameOrAccessor) {
    Observable.defineProperty(target, nameOrAccessor);
}
const contextEvent = FAST.getById(KernelServiceId.contextEvent, () => {
    let current = null;
    return {
        get() {
            return current;
        },
        set(event) {
            current = event;
        },
    };
});
/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
const ExecutionContext = Object.freeze({
    /**
     * A default execution context.
     */
    default: {
        index: 0,
        length: 0,
        get event() {
            return ExecutionContext.getEvent();
        },
        eventDetail() {
            return this.event.detail;
        },
        eventTarget() {
            return this.event.target;
        },
    },
    /**
     * Gets the current event.
     * @returns An event object.
     */
    getEvent() {
        return contextEvent.get();
    },
    /**
     * Sets the current event.
     * @param event - An event object.
     */
    setEvent(event) {
        contextEvent.set(event);
    },
});

/**
 * Captures a binding expression along with related information and capabilities.
 *
 * @public
 */
class Binding {
    /**
     * Creates a binding.
     * @param evaluate - Evaluates the binding.
     * @param policy - The security policy to associate with this binding.
     * @param isVolatile - Indicates whether the binding is volatile.
     */
    constructor(evaluate, policy, isVolatile = false) {
        this.evaluate = evaluate;
        this.policy = policy;
        this.isVolatile = isVolatile;
    }
}

class OneWayBinding extends Binding {
    createObserver(subscriber) {
        return Observable.binding(this.evaluate, subscriber, this.isVolatile);
    }
}
/**
 * Creates an standard binding.
 * @param expression - The binding to refresh when changed.
 * @param policy - The security policy to associate with th binding.
 * @param isVolatile - Indicates whether the binding is volatile or not.
 * @returns A binding configuration.
 * @public
 */
function oneWay(expression, policy, isVolatile = Observable.isVolatileBinding(expression)) {
    return new OneWayBinding(expression, policy, isVolatile);
}

class OneTimeBinding extends Binding {
    createObserver() {
        return this;
    }
    bind(controller) {
        return this.evaluate(controller.source, controller.context);
    }
}
makeSerializationNoop(OneTimeBinding);
/**
 * Creates a one time binding
 * @param expression - The binding to refresh when signaled.
 * @param policy - The security policy to associate with th binding.
 * @returns A binding configuration.
 * @public
 */
function oneTime(expression, policy) {
    return new OneTimeBinding(expression, policy);
}

let DefaultStyleStrategy;
function reduceStyles(styles) {
    return styles
        .map((x) => x instanceof ElementStyles ? reduceStyles(x.styles) : [x])
        .reduce((prev, curr) => prev.concat(curr), []);
}
/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
class ElementStyles {
    /**
     * Creates an instance of ElementStyles.
     * @param styles - The styles that will be associated with elements.
     */
    constructor(styles) {
        this.styles = styles;
        this.targets = new WeakSet();
        this._strategy = null;
        this.behaviors = styles
            .map((x) => x instanceof ElementStyles ? x.behaviors : null)
            .reduce((prev, curr) => (curr === null ? prev : prev === null ? curr : prev.concat(curr)), null);
    }
    /**
     * Gets the StyleStrategy associated with these element styles.
     */
    get strategy() {
        if (this._strategy === null) {
            this.withStrategy(DefaultStyleStrategy);
        }
        return this._strategy;
    }
    /** @internal */
    addStylesTo(target) {
        this.strategy.addStylesTo(target);
        this.targets.add(target);
    }
    /** @internal */
    removeStylesFrom(target) {
        this.strategy.removeStylesFrom(target);
        this.targets.delete(target);
    }
    /** @internal */
    isAttachedTo(target) {
        return this.targets.has(target);
    }
    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    withBehaviors(...behaviors) {
        this.behaviors =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);
        return this;
    }
    /**
     * Sets the strategy that handles adding/removing these styles for an element.
     * @param strategy - The strategy to use.
     */
    withStrategy(Strategy) {
        this._strategy = new Strategy(reduceStyles(this.styles));
        return this;
    }
    /**
     * Sets the default strategy type to use when creating style strategies.
     * @param Strategy - The strategy type to construct.
     */
    static setDefaultStrategy(Strategy) {
        DefaultStyleStrategy = Strategy;
    }
    /**
     * Normalizes a set of composable style options.
     * @param styles - The style options to normalize.
     * @returns A singular ElementStyles instance or undefined.
     */
    static normalize(styles) {
        return styles === void 0
            ? void 0
            : Array.isArray(styles)
                ? new ElementStyles(styles)
                : styles instanceof ElementStyles
                    ? styles
                    : new ElementStyles([styles]);
    }
}
/**
 * Indicates whether the DOM supports the adoptedStyleSheets feature.
 */
ElementStyles.supportsAdoptedStyleSheets = Array.isArray(document.adoptedStyleSheets) &&
    "replace" in CSSStyleSheet.prototype;

const registry$1 = createTypeRegistry();
/**
 * Instructs the css engine to provide dynamic styles or
 * associate behaviors with styles.
 * @public
 */
const CSSDirective = Object.freeze({
    /**
     * Gets the directive definition associated with the instance.
     * @param instance - The directive instance to retrieve the definition for.
     */
    getForInstance: registry$1.getForInstance,
    /**
     * Gets the directive definition associated with the specified type.
     * @param type - The directive type to retrieve the definition for.
     */
    getByType: registry$1.getByType,
    /**
     * Defines a CSSDirective.
     * @param type - The type to define as a directive.
     */
    define(type) {
        registry$1.register({ type });
        return type;
    },
});

function handleChange(directive, controller, observer) {
    controller.source.style.setProperty(directive.targetAspect, observer.bind(controller));
}
/**
 * Enables bindings in CSS.
 *
 * @public
 */
class CSSBindingDirective {
    /**
     * Creates an instance of CSSBindingDirective.
     * @param dataBinding - The binding to use in CSS.
     * @param targetAspect - The CSS property to target.
     */
    constructor(dataBinding, targetAspect) {
        this.dataBinding = dataBinding;
        this.targetAspect = targetAspect;
    }
    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     * @returns - the string to interpolate into CSS
     */
    createCSS(add) {
        add(this);
        return `var(${this.targetAspect})`;
    }
    /**
     * Executed when this behavior is attached to a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    addedCallback(controller) {
        var _a;
        const element = controller.source;
        if (!element.$cssBindings) {
            element.$cssBindings = new Map();
            const setAttribute = element.setAttribute;
            element.setAttribute = (attr, value) => {
                setAttribute.call(element, attr, value);
                if (attr === "style") {
                    element.$cssBindings.forEach((v, k) => handleChange(k, v.controller, v.observer));
                }
            };
        }
        const observer = (_a = controller[this.targetAspect]) !== null && _a !== void 0 ? _a : (controller[this.targetAspect] = this.dataBinding.createObserver(this, this));
        observer.controller = controller;
        controller.source.$cssBindings.set(this, { controller, observer });
    }
    /**
     * Executed when this behavior's host is connected.
     * @param controller - Controls the behavior lifecycle.
     */
    connectedCallback(controller) {
        handleChange(this, controller, controller[this.targetAspect]);
    }
    /**
     * Executed when this behavior is detached from a controller.
     * @param controller - Controls the behavior lifecycle.
     */
    removedCallback(controller) {
        if (controller.source.$cssBindings) {
            controller.source.$cssBindings.delete(this);
        }
    }
    /**
     * Called when a subject this instance has subscribed to changes.
     * @param subject - The subject of the change.
     * @param args - The event args detailing the change that occurred.
     *
     * @internal
     */
    handleChange(_, observer) {
        handleChange(this, observer.controller, observer);
    }
}
CSSDirective.define(CSSBindingDirective);

const marker$1 = `${Math.random().toString(36).substring(2, 8)}`;
let varId = 0;
const nextCSSVariable = () => `--v${marker$1}${++varId}`;
function collectStyles(strings, values) {
    const styles = [];
    let cssString = "";
    const behaviors = [];
    const add = (behavior) => {
        behaviors.push(behavior);
    };
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        let value = values[i];
        if (isFunction(value)) {
            value = new CSSBindingDirective(oneWay(value), nextCSSVariable()).createCSS(add);
        }
        else if (value instanceof Binding) {
            value = new CSSBindingDirective(value, nextCSSVariable()).createCSS(add);
        }
        else if (CSSDirective.getForInstance(value) !== void 0) {
            value = value.createCSS(add);
        }
        if (value instanceof ElementStyles || value instanceof CSSStyleSheet) {
            if (cssString.trim() !== "") {
                styles.push(cssString);
                cssString = "";
            }
            styles.push(value);
        }
        else {
            cssString += value;
        }
    }
    cssString += strings[strings.length - 1];
    if (cssString.trim() !== "") {
        styles.push(cssString);
    }
    return {
        styles,
        behaviors,
    };
}
/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
const css = ((strings, ...values) => {
    const { styles, behaviors } = collectStyles(strings, values);
    const elementStyles = new ElementStyles(styles);
    return behaviors.length ? elementStyles.withBehaviors(...behaviors) : elementStyles;
});
class CSSPartial {
    constructor(styles, behaviors) {
        this.behaviors = behaviors;
        this.css = "";
        const stylesheets = styles.reduce((accumulated, current) => {
            if (isString(current)) {
                this.css += current;
            }
            else {
                accumulated.push(current);
            }
            return accumulated;
        }, []);
        if (stylesheets.length) {
            this.styles = new ElementStyles(stylesheets);
        }
    }
    createCSS(add) {
        this.behaviors.forEach(add);
        if (this.styles) {
            add(this);
        }
        return this.css;
    }
    addedCallback(controller) {
        controller.addStyles(this.styles);
    }
    removedCallback(controller) {
        controller.removeStyles(this.styles);
    }
}
CSSDirective.define(CSSPartial);
css.partial = (strings, ...values) => {
    const { styles, behaviors } = collectStyles(strings, values);
    return new CSSPartial(styles, behaviors);
};

const bindingStartMarker = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/;
const bindingEndMarker = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/;
const repeatViewStartMarker = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/;
const repeatViewEndMarker = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/;
const elementBoundaryStartMarker = /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/;
const elementBoundaryEndMarker = /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;
function isComment$1(node) {
    return node && node.nodeType === Node.COMMENT_NODE;
}
/**
 * Markup utilities to aid in template hydration.
 * @internal
 */
const HydrationMarkup = Object.freeze({
    attributeMarkerName: "data-fe-b",
    attributeBindingSeparator: " ",
    contentBindingStartMarker(index, uniqueId) {
        return `fe-b$$start$$${index}$$${uniqueId}$$fe-b`;
    },
    contentBindingEndMarker(index, uniqueId) {
        return `fe-b$$end$$${index}$$${uniqueId}$$fe-b`;
    },
    repeatStartMarker(index) {
        return `fe-repeat$$start$$${index}$$fe-repeat`;
    },
    repeatEndMarker(index) {
        return `fe-repeat$$end$$${index}$$fe-repeat`;
    },
    isContentBindingStartMarker(content) {
        return bindingStartMarker.test(content);
    },
    isContentBindingEndMarker(content) {
        return bindingEndMarker.test(content);
    },
    isRepeatViewStartMarker(content) {
        return repeatViewStartMarker.test(content);
    },
    isRepeatViewEndMarker(content) {
        return repeatViewEndMarker.test(content);
    },
    isElementBoundaryStartMarker(node) {
        return isComment$1(node) && elementBoundaryStartMarker.test(node.data.trim());
    },
    isElementBoundaryEndMarker(node) {
        return isComment$1(node) && elementBoundaryEndMarker.test(node.data);
    },
    /**
     * Returns the indexes of the ViewBehaviorFactories affecting
     * attributes for the element, or null if no factories were found.
     */
    parseAttributeBinding(node) {
        const attr = node.getAttribute(this.attributeMarkerName);
        return attr === null
            ? attr
            : attr.split(this.attributeBindingSeparator).map(i => parseInt(i));
    },
    /**
     * Returns the indexes of the ViewBehaviorFactories affecting
     * attributes for the element, or null if no factories were found.
     *
     * Uses the alternative syntax of data-fe-b-<number>
     */
    parseEnumeratedAttributeBinding(node) {
        const attrs = [];
        const prefixLength = this.attributeMarkerName.length + 1;
        const prefix = `${this.attributeMarkerName}-`;
        for (const attr of node.getAttributeNames()) {
            if (attr.startsWith(prefix)) {
                const count = Number(attr.slice(prefixLength));
                if (!Number.isNaN(count)) {
                    attrs.push(count);
                }
                else {
                    throw new Error(`Invalid attribute marker name: ${attr}. Expected format is ${prefix}<number>.`);
                }
            }
        }
        return attrs.length === 0 ? null : attrs;
    },
    /**
     * Parses the ViewBehaviorFactory index from string data. Returns
     * the binding index or null if the index cannot be retrieved.
     */
    parseContentBindingStartMarker(content) {
        return parseIndexAndIdMarker(bindingStartMarker, content);
    },
    parseContentBindingEndMarker(content) {
        return parseIndexAndIdMarker(bindingEndMarker, content);
    },
    /**
     * Parses the index of a repeat directive from a content string.
     */
    parseRepeatStartMarker(content) {
        return parseIntMarker(repeatViewStartMarker, content);
    },
    parseRepeatEndMarker(content) {
        return parseIntMarker(repeatViewEndMarker, content);
    },
    /**
     * Parses element Id from element boundary markers
     */
    parseElementBoundaryStartMarker(content) {
        return parseStringMarker(elementBoundaryStartMarker, content.trim());
    },
    parseElementBoundaryEndMarker(content) {
        return parseStringMarker(elementBoundaryEndMarker, content);
    },
});
function parseIntMarker(regex, content) {
    const match = regex.exec(content);
    return match === null ? match : parseInt(match[1]);
}
function parseStringMarker(regex, content) {
    const match = regex.exec(content);
    return match === null ? match : match[1];
}
function parseIndexAndIdMarker(regex, content) {
    const match = regex.exec(content);
    return match === null ? match : [parseInt(match[1]), match[2]];
}
/**
 * @internal
 */
const Hydratable = Symbol.for("fe-hydration");
function isHydratable(value) {
    return value[Hydratable] === Hydratable;
}

const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;
const interpolationStart = `${marker}{`;
const interpolationEnd = `}${marker}`;
const interpolationEndLength = interpolationEnd.length;
let id$1 = 0;
/** @internal */
const nextId = () => `${marker}-${++id$1}`;
/**
 * Common APIs related to markup generation.
 * @public
 */
const Markup = Object.freeze({
    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    interpolation: (id) => `${interpolationStart}${id}${interpolationEnd}`,
    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    attribute: (id) => `${nextId()}="${interpolationStart}${id}${interpolationEnd}"`,
    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    comment: (id) => `<!--${interpolationStart}${id}${interpolationEnd}-->`,
});
/**
 * Common APIs related to content parsing.
 * @public
 */
const Parser = Object.freeze({
    /**
     * Parses text content or HTML attribute content, separating out the static strings
     * from the directives.
     * @param value - The content or attribute string to parse.
     * @param factories - A list of directives to search for in the string.
     * @returns A heterogeneous array of static strings interspersed with
     * directives or null if no directives are found in the string.
     */
    parse(value, factories) {
        const parts = value.split(interpolationStart);
        if (parts.length === 1) {
            return null;
        }
        const result = [];
        for (let i = 0, ii = parts.length; i < ii; ++i) {
            const current = parts[i];
            const index = current.indexOf(interpolationEnd);
            let literal;
            if (index === -1) {
                literal = current;
            }
            else {
                const factoryId = current.substring(0, index);
                result.push(factories[factoryId]);
                literal = current.substring(index + interpolationEndLength);
            }
            if (literal !== "") {
                result.push(literal);
            }
        }
        return result;
    },
});

const registry = createTypeRegistry();
/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
const HTMLDirective = Object.freeze({
    /**
     * Gets the directive definition associated with the instance.
     * @param instance - The directive instance to retrieve the definition for.
     */
    getForInstance: registry.getForInstance,
    /**
     * Gets the directive definition associated with the specified type.
     * @param type - The directive type to retrieve the definition for.
     */
    getByType: registry.getByType,
    /**
     * Defines an HTMLDirective based on the options.
     * @param type - The type to define as a directive.
     * @param options - Options that specify the directive's application.
     */
    define(type, options) {
        options = options || {};
        options.type = type;
        registry.register(options);
        return type;
    },
    /**
     *
     * @param directive - The directive to assign the aspect to.
     * @param value - The value to base the aspect determination on.
     * @remarks
     * If a falsy value is provided, then the content aspect will be assigned.
     */
    assignAspect(directive, value) {
        if (!value) {
            directive.aspectType = DOMAspect.content;
            return;
        }
        directive.sourceAspect = value;
        switch (value[0]) {
            case ":":
                directive.targetAspect = value.substring(1);
                directive.aspectType =
                    directive.targetAspect === "classList"
                        ? DOMAspect.tokenList
                        : DOMAspect.property;
                break;
            case "?":
                directive.targetAspect = value.substring(1);
                directive.aspectType = DOMAspect.booleanAttribute;
                break;
            case "@":
                directive.targetAspect = value.substring(1);
                directive.aspectType = DOMAspect.event;
                break;
            default:
                directive.targetAspect = value;
                directive.aspectType = DOMAspect.attribute;
                break;
        }
    },
});
/**
 * A base class used for attribute directives that don't need internal state.
 * @public
 */
class StatelessAttachedAttributeDirective {
    /**
     * Creates an instance of RefDirective.
     * @param options - The options to use in configuring the directive.
     */
    constructor(options) {
        this.options = options;
    }
    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     * @remarks
     * Creates a custom attribute placeholder.
     */
    createHTML(add) {
        return Markup.attribute(add(this));
    }
    /**
     * Creates a behavior.
     * @param targets - The targets available for behaviors to be attached to.
     */
    createBehavior() {
        return this;
    }
}
makeSerializationNoop(StatelessAttachedAttributeDirective);

class HydrationTargetElementError extends Error {
    constructor(
    /**
     * The error message
     */
    message, 
    /**
     * The Compiled View Behavior Factories that belong to the view.
     */
    factories, 
    /**
     * The node to target factory.
     */
    node) {
        super(message);
        this.factories = factories;
        this.node = node;
    }
}
function isComment(node) {
    return node.nodeType === Node.COMMENT_NODE;
}
function isText(node) {
    return node.nodeType === Node.TEXT_NODE;
}
/**
 * Returns a range object inclusive of all nodes including and between the
 * provided first and last node.
 * @param first - The first node
 * @param last - This last node
 * @returns
 */
function createRangeForNodes(first, last) {
    const range = document.createRange();
    range.setStart(first, 0);
    // The lastIndex should be inclusive of the end of the lastChild. Obtain offset based
    // on usageNotes:  https://developer.mozilla.org/en-US/docs/Web/API/Range/setEnd#usage_notes
    range.setEnd(last, isComment(last) || isText(last) ? last.data.length : last.childNodes.length);
    return range;
}
function isShadowRoot(node) {
    return node instanceof DocumentFragment && "mode" in node;
}
/**
 * Maps {@link CompiledViewBehaviorFactory} ids to the corresponding node targets for the view.
 * @param firstNode - The first node of the view.
 * @param lastNode -  The last node of the view.
 * @param factories - The Compiled View Behavior Factories that belong to the view.
 * @returns - A {@link ViewBehaviorTargets } object for the factories in the view.
 */
function buildViewBindingTargets(firstNode, lastNode, factories) {
    const range = createRangeForNodes(firstNode, lastNode);
    const treeRoot = range.commonAncestorContainer;
    const walker = document.createTreeWalker(treeRoot, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return range.comparePoint(node, 0) === 0
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
        },
    });
    const targets = {};
    const boundaries = {};
    let node = (walker.currentNode = firstNode);
    while (node !== null) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE: {
                targetElement(node, factories, targets);
                break;
            }
            case Node.COMMENT_NODE: {
                targetComment(node, walker, factories, targets, boundaries);
                break;
            }
        }
        node = walker.nextNode();
    }
    range.detach();
    return { targets, boundaries };
}
function targetElement(node, factories, targets) {
    var _a;
    // Check for attributes and map any factories.
    const attrFactoryIds = (_a = HydrationMarkup.parseAttributeBinding(node)) !== null && _a !== void 0 ? _a : HydrationMarkup.parseEnumeratedAttributeBinding(node);
    if (attrFactoryIds !== null) {
        for (const id of attrFactoryIds) {
            if (!factories[id]) {
                throw new HydrationTargetElementError(`HydrationView was unable to successfully target factory on ${node.nodeName} inside ${node.getRootNode().host.nodeName}. This likely indicates a template mismatch between SSR rendering and hydration.`, factories, node);
            }
            targetFactory(factories[id], node, targets);
        }
        node.removeAttribute(HydrationMarkup.attributeMarkerName);
    }
}
function targetComment(node, walker, factories, targets, boundaries) {
    if (HydrationMarkup.isElementBoundaryStartMarker(node)) {
        skipToElementBoundaryEndMarker(node, walker);
        return;
    }
    if (HydrationMarkup.isContentBindingStartMarker(node.data)) {
        const parsed = HydrationMarkup.parseContentBindingStartMarker(node.data);
        if (parsed === null) {
            return;
        }
        const [index, id] = parsed;
        const factory = factories[index];
        const nodes = [];
        let current = walker.nextSibling();
        node.data = "";
        const first = current;
        // Search for the binding end marker that closes the binding.
        while (current !== null) {
            if (isComment(current)) {
                const parsed = HydrationMarkup.parseContentBindingEndMarker(current.data);
                if (parsed && parsed[1] === id) {
                    break;
                }
            }
            nodes.push(current);
            current = walker.nextSibling();
        }
        if (current === null) {
            const root = node.getRootNode();
            throw new Error(`Error hydrating Comment node inside "${isShadowRoot(root) ? root.host.nodeName : root.nodeName}".`);
        }
        current.data = "";
        if (nodes.length === 1 && isText(nodes[0])) {
            targetFactory(factory, nodes[0], targets);
        }
        else {
            // If current === first, it means there is no content in
            // the view. This happens when a `when` directive evaluates false,
            // or whenever a content binding returns null or undefined.
            // In that case, there will never be any content
            // to hydrate and Binding can simply create a HTMLView
            // whenever it needs to.
            if (current !== first && current.previousSibling !== null) {
                boundaries[factory.targetNodeId] = {
                    first,
                    last: current.previousSibling,
                };
            }
            // Binding evaluates to null / undefined or a template.
            // If binding revaluates to string, it will replace content in target
            // So we always insert a text node to ensure that
            // text content binding will be written to this text node instead of comment
            const dummyTextNode = current.parentNode.insertBefore(document.createTextNode(""), current);
            targetFactory(factory, dummyTextNode, targets);
        }
    }
}
/**
 * Moves TreeWalker to element boundary end marker
 * @param node - element boundary start marker node
 * @param walker - tree walker
 */
function skipToElementBoundaryEndMarker(node, walker) {
    const id = HydrationMarkup.parseElementBoundaryStartMarker(node.data);
    let current = walker.nextSibling();
    while (current !== null) {
        if (isComment(current)) {
            const parsed = HydrationMarkup.parseElementBoundaryEndMarker(current.data);
            if (parsed && parsed === id) {
                break;
            }
        }
        current = walker.nextSibling();
    }
}
function targetFactory(factory, node, targets) {
    if (factory.targetNodeId === undefined) {
        // Dev error, this shouldn't ever be thrown
        throw new Error("Factory could not be target to the node");
    }
    targets[factory.targetNodeId] = node;
}

var _a;
function removeNodeSequence(firstNode, lastNode) {
    const parent = firstNode.parentNode;
    let current = firstNode;
    let next;
    while (current !== lastNode) {
        next = current.nextSibling;
        if (!next) {
            throw new Error(`Unmatched first/last child inside "${lastNode.getRootNode().host.nodeName}".`);
        }
        parent.removeChild(current);
        current = next;
    }
    parent.removeChild(lastNode);
}
class DefaultExecutionContext {
    constructor() {
        /**
         * The index of the current item within a repeat context.
         */
        this.index = 0;
        /**
         * The length of the current collection within a repeat context.
         */
        this.length = 0;
    }
    /**
     * The current event within an event handler.
     */
    get event() {
        return ExecutionContext.getEvent();
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    get isEven() {
        return this.index % 2 === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    get isOdd() {
        return this.index % 2 !== 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    get isFirst() {
        return this.index === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    get isInMiddle() {
        return !this.isFirst && !this.isLast;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    get isLast() {
        return this.index === this.length - 1;
    }
    /**
     * Returns the typed event detail of a custom event.
     */
    eventDetail() {
        return this.event.detail;
    }
    /**
     * Returns the typed event target of the event.
     */
    eventTarget() {
        return this.event.target;
    }
}
/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
class HTMLView extends DefaultExecutionContext {
    /**
     * Constructs an instance of HTMLView.
     * @param fragment - The html fragment that contains the nodes for this view.
     * @param behaviors - The behaviors to be applied to this view.
     */
    constructor(fragment, factories, targets) {
        super();
        this.fragment = fragment;
        this.factories = factories;
        this.targets = targets;
        this.behaviors = null;
        this.unbindables = [];
        /**
         * The data that the view is bound to.
         */
        this.source = null;
        /**
         * Indicates whether the controller is bound.
         */
        this.isBound = false;
        /**
         * Indicates how the source's lifetime relates to the controller's lifetime.
         */
        this.sourceLifetime = SourceLifetime.unknown;
        /**
         * The execution context the view is running within.
         */
        this.context = this;
        this.firstChild = fragment.firstChild;
        this.lastChild = fragment.lastChild;
    }
    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    appendTo(node) {
        node.appendChild(this.fragment);
    }
    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    insertBefore(node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode.insertBefore(this.fragment, node);
        }
        else {
            const end = this.lastChild;
            if (node.previousSibling === end)
                return;
            const parentNode = node.parentNode;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next;
            }
            parentNode.insertBefore(end, node);
        }
    }
    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    remove() {
        const fragment = this.fragment;
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            fragment.appendChild(current);
            current = next;
        }
        fragment.appendChild(end);
    }
    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose() {
        removeNodeSequence(this.firstChild, this.lastChild);
        this.unbind();
    }
    onUnbind(behavior) {
        this.unbindables.push(behavior);
    }
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    bind(source, context = this) {
        if (this.source === source) {
            return;
        }
        let behaviors = this.behaviors;
        if (behaviors === null) {
            this.source = source;
            this.context = context;
            this.behaviors = behaviors = new Array(this.factories.length);
            const factories = this.factories;
            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const behavior = factories[i].createBehavior();
                behavior.bind(this);
                behaviors[i] = behavior;
            }
        }
        else {
            if (this.source !== null) {
                this.evaluateUnbindables();
            }
            this.isBound = false;
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }
        this.isBound = true;
    }
    /**
     * Unbinds a view's behaviors from its binding source.
     */
    unbind() {
        if (!this.isBound || this.source === null) {
            return;
        }
        this.evaluateUnbindables();
        this.source = null;
        this.context = this;
        this.isBound = false;
    }
    evaluateUnbindables() {
        const unbindables = this.unbindables;
        for (let i = 0, ii = unbindables.length; i < ii; ++i) {
            unbindables[i].unbind(this);
        }
        unbindables.length = 0;
    }
    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views - A contiguous range of views to be disposed.
     */
    static disposeContiguousBatch(views) {
        if (views.length === 0) {
            return;
        }
        removeNodeSequence(views[0].firstChild, views[views.length - 1].lastChild);
        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}
makeSerializationNoop(HTMLView);
Observable.defineProperty(HTMLView.prototype, "index");
Observable.defineProperty(HTMLView.prototype, "length");
const HydrationStage = {
    unhydrated: "unhydrated",
    hydrating: "hydrating",
    hydrated: "hydrated",
};
/** @public */
class HydrationBindingError extends Error {
    constructor(
    /**
     * The error message
     */
    message, 
    /**
     * The factory that was unable to be bound
     */
    factory, 
    /**
     * A DocumentFragment containing a clone of the
     * view's Nodes.
     */
    fragment, 
    /**
     * String representation of the HTML in the template that
     * threw the binding error.
     */
    templateString) {
        super(message);
        this.factory = factory;
        this.fragment = fragment;
        this.templateString = templateString;
    }
}
class HydrationView extends DefaultExecutionContext {
    constructor(firstChild, lastChild, sourceTemplate, hostBindingTarget) {
        super();
        this.firstChild = firstChild;
        this.lastChild = lastChild;
        this.sourceTemplate = sourceTemplate;
        this.hostBindingTarget = hostBindingTarget;
        this[_a] = Hydratable;
        this.context = this;
        this.source = null;
        this.isBound = false;
        this.sourceLifetime = SourceLifetime.unknown;
        this.unbindables = [];
        this.fragment = null;
        this.behaviors = null;
        this._hydrationStage = HydrationStage.unhydrated;
        this._bindingViewBoundaries = {};
        this._targets = {};
        this.factories = sourceTemplate.compile().factories;
    }
    get hydrationStage() {
        return this._hydrationStage;
    }
    get targets() {
        return this._targets;
    }
    get bindingViewBoundaries() {
        return this._bindingViewBoundaries;
    }
    /**
     * no-op. Hydrated views are don't need to be moved from a documentFragment
     * to the target node.
     */
    insertBefore(node) {
        // No-op in cases where this is called before the view is removed,
        // because the nodes will already be in the document and just need hydrating.
        if (this.fragment === null) {
            return;
        }
        if (this.fragment.hasChildNodes()) {
            node.parentNode.insertBefore(this.fragment, node);
        }
        else {
            const end = this.lastChild;
            if (node.previousSibling === end)
                return;
            const parentNode = node.parentNode;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next;
            }
            parentNode.insertBefore(end, node);
        }
    }
    /**
     * Appends the view to a node. In cases where this is called before the
     * view has been removed, the method will no-op.
     * @param node - the node to append the view to.
     */
    appendTo(node) {
        if (this.fragment !== null) {
            node.appendChild(this.fragment);
        }
    }
    remove() {
        const fragment = this.fragment || (this.fragment = document.createDocumentFragment());
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            if (!next) {
                throw new Error(`Unmatched first/last child inside "${end.getRootNode().host.nodeName}".`);
            }
            fragment.appendChild(current);
            current = next;
        }
        fragment.appendChild(end);
    }
    bind(source, context = this) {
        var _b, _c;
        if (this.hydrationStage !== HydrationStage.hydrated) {
            this._hydrationStage = HydrationStage.hydrating;
        }
        if (this.source === source) {
            return;
        }
        let behaviors = this.behaviors;
        if (behaviors === null) {
            this.source = source;
            this.context = context;
            try {
                const { targets, boundaries } = buildViewBindingTargets(this.firstChild, this.lastChild, this.factories);
                this._targets = targets;
                this._bindingViewBoundaries = boundaries;
            }
            catch (error) {
                if (error instanceof HydrationTargetElementError) {
                    let templateString = this.sourceTemplate.html;
                    if (typeof templateString !== "string") {
                        templateString = templateString.innerHTML;
                    }
                    error.templateString = templateString;
                }
                throw error;
            }
            this.behaviors = behaviors = new Array(this.factories.length);
            const factories = this.factories;
            for (let i = 0, ii = factories.length; i < ii; ++i) {
                const factory = factories[i];
                if (factory.targetNodeId === "h" && this.hostBindingTarget) {
                    targetFactory(factory, this.hostBindingTarget, this._targets);
                }
                // If the binding has been targeted or it is a host binding and the view has a hostBindingTarget
                if (factory.targetNodeId in this.targets) {
                    const behavior = factory.createBehavior();
                    behavior.bind(this);
                    behaviors[i] = behavior;
                }
                else {
                    let templateString = this.sourceTemplate.html;
                    if (typeof templateString !== "string") {
                        templateString = templateString.innerHTML;
                    }
                    throw new HydrationBindingError(`HydrationView was unable to successfully target bindings inside "${(_c = ((_b = this.firstChild) === null || _b === void 0 ? void 0 : _b.getRootNode()).host) === null || _c === void 0 ? void 0 : _c.nodeName}".`, factory, createRangeForNodes(this.firstChild, this.lastChild).cloneContents(), templateString);
                }
            }
        }
        else {
            if (this.source !== null) {
                this.evaluateUnbindables();
            }
            this.isBound = false;
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(this);
            }
        }
        this.isBound = true;
        this._hydrationStage = HydrationStage.hydrated;
    }
    unbind() {
        if (!this.isBound || this.source === null) {
            return;
        }
        this.evaluateUnbindables();
        this.source = null;
        this.context = this;
        this.isBound = false;
    }
    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose() {
        removeNodeSequence(this.firstChild, this.lastChild);
        this.unbind();
    }
    onUnbind(behavior) {
        this.unbindables.push(behavior);
    }
    evaluateUnbindables() {
        const unbindables = this.unbindables;
        for (let i = 0, ii = unbindables.length; i < ii; ++i) {
            unbindables[i].unbind(this);
        }
        unbindables.length = 0;
    }
}
_a = Hydratable;
makeSerializationNoop(HydrationView);

function isContentTemplate(value) {
    return value.create !== undefined;
}
function updateContent(target, aspect, value, controller) {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }
    // If the value has a "create" method, then it's a ContentTemplate.
    if (isContentTemplate(value)) {
        target.textContent = "";
        let view = target.$fastView;
        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            if (isHydratable(controller) &&
                isHydratable(value) &&
                controller.bindingViewBoundaries[this.targetNodeId] !== undefined &&
                controller.hydrationStage !== HydrationStage.hydrated) {
                const viewNodes = controller.bindingViewBoundaries[this.targetNodeId];
                view = value.hydrate(viewNodes.first, viewNodes.last);
            }
            else {
                view = value.create();
            }
        }
        else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (target.$fastTemplate !== value) {
                if (view.isComposed) {
                    view.remove();
                    view.unbind();
                }
                view = value.create();
            }
        }
        // It's possible that the value is the same as the previous template
        // and that there's actually no need to compose it.
        if (!view.isComposed) {
            view.isComposed = true;
            view.bind(controller.source, controller.context);
            view.insertBefore(target);
            target.$fastView = view;
            target.$fastTemplate = value;
        }
        else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(controller.source, controller.context);
        }
    }
    else {
        const view = target.$fastView;
        // If there is a view and it's currently composed into
        // the DOM, then we need to remove it.
        if (view !== void 0 && view.isComposed) {
            view.isComposed = false;
            view.remove();
            if (view.needsBindOnly) {
                view.needsBindOnly = false;
            }
            else {
                view.unbind();
            }
        }
        target.textContent = value;
    }
}
function updateTokenList(target, aspect, value) {
    var _a;
    const lookup = `${this.id}-t`;
    const state = (_a = target[lookup]) !== null && _a !== void 0 ? _a : (target[lookup] = { v: 0, cv: Object.create(null) });
    const classVersions = state.cv;
    let version = state.v;
    const tokenList = target[aspect];
    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);
        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];
            if (currentName === "") {
                continue;
            }
            classVersions[currentName] = version;
            tokenList.add(currentName);
        }
    }
    state.v = version + 1;
    // If this is the first call to add classes, there's no need to remove old ones.
    if (version === 0) {
        return;
    }
    // Remove classes from the previous version.
    version -= 1;
    for (const name in classVersions) {
        if (classVersions[name] === version) {
            tokenList.remove(name);
        }
    }
}
const sinkLookup = {
    [DOMAspect.attribute]: DOM.setAttribute,
    [DOMAspect.booleanAttribute]: DOM.setBooleanAttribute,
    [DOMAspect.property]: (t, a, v) => (t[a] = v),
    [DOMAspect.content]: updateContent,
    [DOMAspect.tokenList]: updateTokenList,
    [DOMAspect.event]: () => void 0,
};
/**
 * A directive that applies bindings.
 * @public
 */
class HTMLBindingDirective {
    /**
     * Creates an instance of HTMLBindingDirective.
     * @param dataBinding - The binding configuration to apply.
     */
    constructor(dataBinding) {
        this.dataBinding = dataBinding;
        this.updateTarget = null;
        /**
         * The type of aspect to target.
         */
        this.aspectType = DOMAspect.content;
    }
    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add) {
        return Markup.interpolation(add(this));
    }
    /**
     * Creates a behavior.
     */
    createBehavior() {
        var _a;
        if (this.updateTarget === null) {
            const sink = sinkLookup[this.aspectType];
            const policy = (_a = this.dataBinding.policy) !== null && _a !== void 0 ? _a : this.policy;
            if (!sink) {
                throw FAST.error(1205 /* Message.unsupportedBindingBehavior */);
            }
            this.data = `${this.id}-d`;
            this.updateTarget = policy.protect(this.targetTagName, this.aspectType, this.targetAspect, sink);
        }
        return this;
    }
    /** @internal */
    bind(controller) {
        var _a;
        const target = controller.targets[this.targetNodeId];
        const isHydrating = isHydratable(controller) &&
            controller.hydrationStage &&
            controller.hydrationStage !== HydrationStage.hydrated;
        switch (this.aspectType) {
            case DOMAspect.event:
                target[this.data] = controller;
                target.addEventListener(this.targetAspect, this, this.dataBinding.options);
                break;
            case DOMAspect.content:
                controller.onUnbind(this);
            // intentional fall through
            default:
                const observer = (_a = target[this.data]) !== null && _a !== void 0 ? _a : (target[this.data] = this.dataBinding.createObserver(this, this));
                observer.target = target;
                observer.controller = controller;
                if (isHydrating &&
                    (this.aspectType === DOMAspect.attribute ||
                        this.aspectType === DOMAspect.booleanAttribute)) {
                    observer.bind(controller);
                    // Skip updating target during bind for attributes
                    break;
                }
                this.updateTarget(target, this.targetAspect, observer.bind(controller), controller);
                break;
        }
    }
    /** @internal */
    unbind(controller) {
        const target = controller.targets[this.targetNodeId];
        const view = target.$fastView;
        if (view !== void 0 && view.isComposed) {
            view.unbind();
            view.needsBindOnly = true;
        }
    }
    /** @internal */
    handleEvent(event) {
        const controller = event.currentTarget[this.data];
        if (controller.isBound) {
            ExecutionContext.setEvent(event);
            const result = this.dataBinding.evaluate(controller.source, controller.context);
            ExecutionContext.setEvent(null);
            if (result !== true) {
                event.preventDefault();
            }
        }
    }
    /** @internal */
    handleChange(binding, observer) {
        const target = observer.target;
        const controller = observer.controller;
        this.updateTarget(target, this.targetAspect, observer.bind(controller), controller);
    }
}
HTMLDirective.define(HTMLBindingDirective, { aspected: true });

const targetIdFrom = (parentId, nodeIndex) => `${parentId}.${nodeIndex}`;
const descriptorCache = {};
// used to prevent creating lots of objects just to track node and index while compiling
const next = {
    index: 0,
    node: null,
};
function tryWarn(name) {
    if (!name.startsWith("fast-")) {
        FAST.warn(1204 /* Message.hostBindingWithoutHost */, { name });
    }
}
const warningHost = new Proxy(document.createElement("div"), {
    get(target, property) {
        tryWarn(property);
        const value = Reflect.get(target, property);
        return isFunction(value) ? value.bind(target) : value;
    },
    set(target, property, value) {
        tryWarn(property);
        return Reflect.set(target, property, value);
    },
});
class CompilationContext {
    constructor(fragment, directives, policy) {
        this.fragment = fragment;
        this.directives = directives;
        this.policy = policy;
        this.proto = null;
        this.nodeIds = new Set();
        this.descriptors = {};
        this.factories = [];
    }
    addFactory(factory, parentId, nodeId, targetIndex, tagName) {
        var _a, _b;
        if (!this.nodeIds.has(nodeId)) {
            this.nodeIds.add(nodeId);
            this.addTargetDescriptor(parentId, nodeId, targetIndex);
        }
        factory.id = (_a = factory.id) !== null && _a !== void 0 ? _a : nextId();
        factory.targetNodeId = nodeId;
        factory.targetTagName = tagName;
        factory.policy = (_b = factory.policy) !== null && _b !== void 0 ? _b : this.policy;
        this.factories.push(factory);
    }
    freeze() {
        this.proto = Object.create(null, this.descriptors);
        return this;
    }
    addTargetDescriptor(parentId, targetId, targetIndex) {
        const descriptors = this.descriptors;
        if (targetId === "r" || // root
            targetId === "h" || // host
            descriptors[targetId]) {
            return;
        }
        if (!descriptors[parentId]) {
            const index = parentId.lastIndexOf(".");
            const grandparentId = parentId.substring(0, index);
            const childIndex = parseInt(parentId.substring(index + 1));
            this.addTargetDescriptor(grandparentId, parentId, childIndex);
        }
        let descriptor = descriptorCache[targetId];
        if (!descriptor) {
            const field = `_${targetId}`;
            descriptorCache[targetId] = descriptor = {
                get() {
                    var _a;
                    return ((_a = this[field]) !== null && _a !== void 0 ? _a : (this[field] = this[parentId].childNodes[targetIndex]));
                },
            };
        }
        descriptors[targetId] = descriptor;
    }
    createView(hostBindingTarget) {
        const fragment = this.fragment.cloneNode(true);
        const targets = Object.create(this.proto);
        targets.r = fragment;
        targets.h = hostBindingTarget !== null && hostBindingTarget !== void 0 ? hostBindingTarget : warningHost;
        for (const id of this.nodeIds) {
            targets[id]; // trigger locator
        }
        return new HTMLView(fragment, this.factories, targets);
    }
}
function compileAttributes(context, parentId, node, nodeId, nodeIndex, includeBasicValues = false) {
    const attributes = node.attributes;
    const directives = context.directives;
    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = Parser.parse(attrValue, directives);
        let result = null;
        if (parseResult === null) {
            if (includeBasicValues) {
                result = new HTMLBindingDirective(oneTime(() => attrValue, context.policy));
                HTMLDirective.assignAspect(result, attr.name);
            }
        }
        else {
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            result = Compiler.aggregate(parseResult, context.policy);
        }
        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(result, parentId, nodeId, nodeIndex, node.tagName);
        }
    }
}
function compileContent(context, node, parentId, nodeId, nodeIndex) {
    const parseResult = Parser.parse(node.textContent, context.directives);
    if (parseResult === null) {
        next.node = node.nextSibling;
        next.index = nodeIndex + 1;
        return next;
    }
    let currentNode;
    let lastNode = (currentNode = node);
    for (let i = 0, ii = parseResult.length; i < ii; ++i) {
        const currentPart = parseResult[i];
        if (i !== 0) {
            nodeIndex++;
            nodeId = targetIdFrom(parentId, nodeIndex);
            currentNode = lastNode.parentNode.insertBefore(document.createTextNode(""), lastNode.nextSibling);
        }
        if (isString(currentPart)) {
            currentNode.textContent = currentPart;
        }
        else {
            currentNode.textContent = " ";
            HTMLDirective.assignAspect(currentPart);
            context.addFactory(currentPart, parentId, nodeId, nodeIndex, null);
        }
        lastNode = currentNode;
    }
    next.index = nodeIndex + 1;
    next.node = lastNode.nextSibling;
    return next;
}
function compileChildren(context, parent, parentId) {
    let nodeIndex = 0;
    let childNode = parent.firstChild;
    while (childNode) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        const result = compileNode(context, parentId, childNode, nodeIndex);
        childNode = result.node;
        nodeIndex = result.index;
    }
}
function compileNode(context, parentId, node, nodeIndex) {
    const nodeId = targetIdFrom(parentId, nodeIndex);
    switch (node.nodeType) {
        case 1: // element node
            compileAttributes(context, parentId, node, nodeId, nodeIndex);
            compileChildren(context, node, nodeId);
            break;
        case 3: // text node
            return compileContent(context, node, parentId, nodeId, nodeIndex);
        case 8: // comment
            const parts = Parser.parse(node.data, context.directives);
            if (parts !== null) {
                context.addFactory(
                /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
                Compiler.aggregate(parts), parentId, nodeId, nodeIndex, null);
            }
            break;
    }
    next.index = nodeIndex + 1;
    next.node = node.nextSibling;
    return next;
}
function isMarker(node, directives) {
    return (node &&
        node.nodeType == 8 &&
        Parser.parse(node.data, directives) !== null);
}
const templateTag = "TEMPLATE";
/**
 * Common APIs related to compilation.
 * @public
 */
const Compiler = {
    /**
     * Compiles a template and associated directives into a compilation
     * result which can be used to create views.
     * @param html - The html string or template element to compile.
     * @param factories - The behavior factories referenced by the template.
     * @param policy - The security policy to compile the html with.
     * @remarks
     * The template that is provided for compilation is altered in-place
     * and cannot be compiled again. If the original template must be preserved,
     * it is recommended that you clone the original and pass the clone to this API.
     * @public
     */
    compile(html, factories, policy = DOM.policy) {
        let template;
        if (isString(html)) {
            template = document.createElement(templateTag);
            template.innerHTML = policy.createHTML(html);
            const fec = template.content.firstElementChild;
            if (fec !== null && fec.tagName === templateTag) {
                template = fec;
            }
        }
        else {
            template = html;
        }
        if (!template.content.firstChild && !template.content.lastChild) {
            template.content.appendChild(document.createComment(""));
        }
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
        const fragment = document.adoptNode(template.content);
        const context = new CompilationContext(fragment, factories, policy);
        compileAttributes(context, "", template, /* host */ "h", 0, true);
        if (
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        isMarker(fragment.firstChild, factories) ||
            // Or if there is only one node and a directive, it means the template's content
            // is *only* the directive. In that case, HTMLView.dispose() misses any nodes inserted by
            // the directive. Inserting a new node ensures proper disposal of nodes added by the directive.
            (fragment.childNodes.length === 1 && Object.keys(factories).length > 0)) {
            fragment.insertBefore(document.createComment(""), fragment.firstChild);
        }
        compileChildren(context, fragment, /* root */ "r");
        next.node = null; // prevent leaks
        return context.freeze();
    },
    /**
     * Sets the default compilation strategy that will be used by the ViewTemplate whenever
     * it needs to compile a view preprocessed with the html template function.
     * @param strategy - The compilation strategy to use when compiling templates.
     */
    setDefaultStrategy(strategy) {
        this.compile = strategy;
    },
    /**
     * Aggregates an array of strings and directives into a single directive.
     * @param parts - A heterogeneous array of static strings interspersed with
     * directives.
     * @param policy - The security policy to use with the aggregated bindings.
     * @returns A single inline directive that aggregates the behavior of all the parts.
     */
    aggregate(parts, policy = DOM.policy) {
        if (parts.length === 1) {
            return parts[0];
        }
        let sourceAspect;
        let isVolatile = false;
        let bindingPolicy = void 0;
        const partCount = parts.length;
        const finalParts = parts.map((x) => {
            if (isString(x)) {
                return () => x;
            }
            sourceAspect = x.sourceAspect || sourceAspect;
            isVolatile = isVolatile || x.dataBinding.isVolatile;
            bindingPolicy = bindingPolicy || x.dataBinding.policy;
            return x.dataBinding.evaluate;
        });
        const expression = (scope, context) => {
            let output = "";
            for (let i = 0; i < partCount; ++i) {
                output += finalParts[i](scope, context);
            }
            return output;
        };
        const directive = new HTMLBindingDirective(oneWay(expression, bindingPolicy !== null && bindingPolicy !== void 0 ? bindingPolicy : policy, isVolatile));
        HTMLDirective.assignAspect(directive, sourceAspect);
        return directive;
    },
};

// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex = 
/* eslint-disable-next-line no-control-regex, max-len */
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
const noFactories = Object.create(null);
/**
 * Inlines a template into another template.
 * @public
 */
class InlineTemplateDirective {
    /**
     * Creates an instance of InlineTemplateDirective.
     * @param template - The template to inline.
     */
    constructor(html, factories = noFactories) {
        this.html = html;
        this.factories = factories;
    }
    /**
     * Creates HTML to be used within a template.
     * @param add - Can be used to add  behavior factories to a template.
     */
    createHTML(add) {
        const factories = this.factories;
        for (const key in factories) {
            add(factories[key]);
        }
        return this.html;
    }
}
/**
 * An empty template partial.
 */
InlineTemplateDirective.empty = new InlineTemplateDirective("");
HTMLDirective.define(InlineTemplateDirective);
function createHTML(value, prevString, add, definition = HTMLDirective.getForInstance(value)) {
    if (definition.aspected) {
        const match = lastAttributeNameRegex.exec(prevString);
        if (match !== null) {
            HTMLDirective.assignAspect(value, match[2]);
        }
    }
    return value.createHTML(add);
}
/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
class ViewTemplate {
    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param factories - The directives that will be connected to placeholders in the html.
     * @param policy - The security policy to use when compiling this template.
     */
    constructor(html, factories = {}, policy) {
        this.policy = policy;
        this.result = null;
        this.html = html;
        this.factories = factories;
    }
    /**
     * @internal
     */
    compile() {
        if (this.result === null) {
            this.result = Compiler.compile(this.html, this.factories, this.policy);
        }
        return this.result;
    }
    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget) {
        return this.compile().createView(hostBindingTarget);
    }
    /**
     * Returns a directive that can inline the template.
     */
    inline() {
        return new InlineTemplateDirective(isString(this.html) ? this.html : this.html.innerHTML, this.factories);
    }
    /**
     * Sets the DOMPolicy for this template.
     * @param policy - The policy to associated with this template.
     * @returns The modified template instance.
     * @remarks
     * The DOMPolicy can only be set once for a template and cannot be
     * set after the template is compiled.
     */
    withPolicy(policy) {
        if (this.result) {
            throw FAST.error(1208 /* Message.cannotSetTemplatePolicyAfterCompilation */);
        }
        if (this.policy) {
            throw FAST.error(1207 /* Message.onlySetTemplatePolicyOnce */);
        }
        this.policy = policy;
        return this;
    }
    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(source, host, hostBindingTarget) {
        const view = this.create(hostBindingTarget);
        view.bind(source);
        view.appendTo(host);
        return view;
    }
    /**
     * Creates a template based on a set of static strings and dynamic values.
     * @param strings - The static strings to create the template with.
     * @param values - The dynamic values to create the template with.
     * @param policy - The DOMPolicy to associated with the template.
     * @returns A ViewTemplate.
     * @remarks
     * This API should not be used directly under normal circumstances because constructing
     * a template in this way, if not done properly, can open up the application to XSS
     * attacks. When using this API, provide a strong DOMPolicy that can properly sanitize
     * and also be sure to manually sanitize all static strings particularly if they can
     * come from user input.
     */
    static create(strings, values, policy) {
        let html = "";
        const factories = Object.create(null);
        const add = (factory) => {
            var _a;
            const id = (_a = factory.id) !== null && _a !== void 0 ? _a : (factory.id = nextId());
            factories[id] = factory;
            return id;
        };
        for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
            const currentString = strings[i];
            let currentValue = values[i];
            let definition;
            html += currentString;
            if (isFunction(currentValue)) {
                currentValue = new HTMLBindingDirective(oneWay(currentValue));
            }
            else if (currentValue instanceof Binding) {
                currentValue = new HTMLBindingDirective(currentValue);
            }
            else if (!(definition = HTMLDirective.getForInstance(currentValue))) {
                const staticValue = currentValue;
                currentValue = new HTMLBindingDirective(oneTime(() => staticValue));
            }
            html += createHTML(currentValue, currentString, add, definition);
        }
        return new ViewTemplate(html + strings[strings.length - 1], factories, policy);
    }
}
makeSerializationNoop(ViewTemplate);
/**
 * Transforms a template literal string into a ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
const html = ((strings, ...values) => {
    if (Array.isArray(strings) && Array.isArray(strings.raw)) {
        return ViewTemplate.create(strings, values);
    }
    throw FAST.error(1206 /* Message.directCallToHTMLTagNotAllowed */);
});
html.partial = (html) => {
    return new InlineTemplateDirective(html);
};

/**
 * The runtime behavior for template references.
 * @public
 */
class RefDirective extends StatelessAttachedAttributeDirective {
    /**
     * Bind this behavior.
     * @param controller - The view controller that manages the lifecycle of this behavior.
     */
    bind(controller) {
        controller.source[this.options] = controller.targets[this.targetNodeId];
    }
}
HTMLDirective.define(RefDirective);
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
const ref = (propertyName) => new RefDirective(propertyName);

const selectElements = (value) => value.nodeType === 1;
/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
const elements = (selector) => selector
    ? value => value.nodeType === 1 && value.matches(selector)
    : selectElements;
/**
 * A base class for node observation.
 * @public
 * @remarks
 * Internally used by the SlottedDirective and the ChildrenDirective.
 */
class NodeObservationDirective extends StatelessAttachedAttributeDirective {
    /**
     * The unique id of the factory.
     */
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
        this._controllerProperty = `${value}-c`;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    bind(controller) {
        const target = controller.targets[this.targetNodeId];
        target[this._controllerProperty] = controller;
        this.updateTarget(controller.source, this.computeNodes(target));
        this.observe(target);
        controller.onUnbind(this);
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     * @param context - The execution context that the binding is operating within.
     * @param targets - The targets that behaviors in a view can attach to.
     */
    unbind(controller) {
        const target = controller.targets[this.targetNodeId];
        this.updateTarget(controller.source, emptyArray);
        this.disconnect(target);
        target[this._controllerProperty] = null;
    }
    /**
     * Gets the data source for the target.
     * @param target - The target to get the source for.
     * @returns The source.
     */
    getSource(target) {
        return target[this._controllerProperty].source;
    }
    /**
     * Updates the source property with the computed nodes.
     * @param source - The source object to assign the nodes property to.
     * @param value - The nodes to assign to the source object property.
     */
    updateTarget(source, value) {
        source[this.options.property] = value;
    }
    /**
     * Computes the set of nodes that should be assigned to the source property.
     * @param target - The target to compute the nodes for.
     * @returns The computed nodes.
     * @remarks
     * Applies filters if provided.
     */
    computeNodes(target) {
        let nodes = this.getNodes(target);
        if ("filter" in this.options) {
            nodes = nodes.filter(this.options.filter);
        }
        return nodes;
    }
}

const slotEvent = "slotchange";
/**
 * The runtime behavior for slotted node observation.
 * @public
 */
class SlottedDirective extends NodeObservationDirective {
    /**
     * Begins observation of the nodes.
     * @param target - The target to observe.
     */
    observe(target) {
        target.addEventListener(slotEvent, this);
    }
    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target) {
        target.removeEventListener(slotEvent, this);
    }
    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    getNodes(target) {
        return target.assignedNodes(this.options);
    }
    /** @internal */
    handleEvent(event) {
        const target = event.currentTarget;
        this.updateTarget(this.getSource(target), this.computeNodes(target));
    }
}
HTMLDirective.define(SlottedDirective);
/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
function slotted(propertyOrOptions) {
    if (isString(propertyOrOptions)) {
        propertyOrOptions = { property: propertyOrOptions };
    }
    return new SlottedDirective(propertyOrOptions);
}

/**
 * The runtime behavior for child node observation.
 * @public
 */
class ChildrenDirective extends NodeObservationDirective {
    /**
     * Creates an instance of ChildrenDirective.
     * @param options - The options to use in configuring the child observation behavior.
     */
    constructor(options) {
        super(options);
        this.observerProperty = Symbol();
        this.handleEvent = (mutations, observer) => {
            const target = observer.target;
            this.updateTarget(this.getSource(target), this.computeNodes(target));
        };
        options.childList = true;
    }
    /**
     * Begins observation of the nodes.
     * @param target - The target to observe.
     */
    observe(target) {
        let observer = target[this.observerProperty];
        if (!observer) {
            observer = new MutationObserver(this.handleEvent);
            observer.toJSON = noop;
            target[this.observerProperty] = observer;
        }
        observer.target = target;
        observer.observe(target, this.options);
    }
    /**
     * Disconnects observation of the nodes.
     * @param target - The target to unobserve.
     */
    disconnect(target) {
        const observer = target[this.observerProperty];
        observer.target = null;
        observer.disconnect();
    }
    /**
     * Retrieves the raw nodes that should be assigned to the source property.
     * @param target - The target to get the node to.
     */
    getNodes(target) {
        if ("selector" in this.options) {
            return Array.from(target.querySelectorAll(this.options.selector));
        }
        return Array.from(target.childNodes);
    }
}
HTMLDirective.define(ChildrenDirective);
/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
function children(propertyOrOptions) {
    if (isString(propertyOrOptions)) {
        propertyOrOptions = {
            property: propertyOrOptions,
        };
    }
    return new ChildrenDirective(propertyOrOptions);
}

const booleanMode = "boolean";
const reflectMode = "reflect";
/**
 * Metadata used to configure a custom attribute's behavior.
 * @public
 */
const AttributeConfiguration = Object.freeze({
    /**
     * Locates all attribute configurations associated with a type.
     */
    locate: createMetadataLocator(),
});
/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
const booleanConverter = {
    toView(value) {
        return value ? "true" : "false";
    },
    fromView(value) {
        return !(value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0);
    },
};
function toNumber(value) {
    if (value === null || value === undefined) {
        return null;
    }
    const number = value * 1;
    return isNaN(number) ? null : number;
}
/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
const nullableNumberConverter = {
    toView(value) {
        const output = toNumber(value);
        return output ? output.toString() : output;
    },
    fromView: toNumber,
};
/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
class AttributeDefinition {
    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    constructor(Owner, name, attribute = name.toLowerCase(), mode = reflectMode, converter) {
        this.guards = new Set();
        this.Owner = Owner;
        this.name = name;
        this.attribute = attribute;
        this.mode = mode;
        this.converter = converter;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;
        if (mode === booleanMode && converter === void 0) {
            this.converter = booleanConverter;
        }
    }
    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param newValue - The value to set the attribute/property to.
     */
    setValue(source, newValue) {
        const oldValue = source[this.fieldName];
        const converter = this.converter;
        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }
        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;
            this.tryReflectToAttribute(source);
            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }
            source.$fastController.notify(this.name);
        }
    }
    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    getValue(source) {
        Observable.track(source, this.name);
        return source[this.fieldName];
    }
    /** @internal */
    onAttributeChangedCallback(element, value) {
        if (this.guards.has(element)) {
            return;
        }
        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }
    tryReflectToAttribute(element) {
        const mode = this.mode;
        const guards = this.guards;
        if (guards.has(element) || mode === "fromView") {
            return;
        }
        Updates.enqueue(() => {
            guards.add(element);
            const latestValue = element[this.fieldName];
            switch (mode) {
                case reflectMode:
                    const converter = this.converter;
                    DOM.setAttribute(element, this.attribute, converter !== void 0 ? converter.toView(latestValue) : latestValue);
                    break;
                case booleanMode:
                    DOM.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }
            guards.delete(element);
        });
    }
    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    static collect(Owner, ...attributeLists) {
        const attributes = [];
        attributeLists.push(AttributeConfiguration.locate(Owner));
        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];
            if (list === void 0) {
                continue;
            }
            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];
                if (isString(config)) {
                    attributes.push(new AttributeDefinition(Owner, config));
                }
                else {
                    attributes.push(new AttributeDefinition(Owner, config.property, config.attribute, config.mode, config.converter));
                }
            }
        }
        return attributes;
    }
}
function attr(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }
        AttributeConfiguration.locate($target.constructor).push(config);
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const defaultShadowOptions = { mode: "open" };
const defaultElementOptions = {};
const fastElementBaseTypes = new Set();
/**
 * The FAST custom element registry
 * @internal
 */
const fastElementRegistry = FAST.getById(KernelServiceId.elementRegistry, () => createTypeRegistry());
/**
 * Defines metadata for a FASTElement.
 * @public
 */
class FASTElementDefinition {
    constructor(type, nameOrConfig = type.definition) {
        var _b;
        this.platformDefined = false;
        if (isString(nameOrConfig)) {
            nameOrConfig = { name: nameOrConfig };
        }
        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;
        this.templateOptions = nameOrConfig.templateOptions;
        this.registry = (_b = nameOrConfig.registry) !== null && _b !== void 0 ? _b : customElements;
        const proto = type.prototype;
        const attributes = AttributeDefinition.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};
        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
            Observable.defineProperty(proto, current);
        }
        Reflect.defineProperty(type, "observedAttributes", {
            value: observedAttributes,
            enumerable: true,
        });
        this.attributes = attributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;
        this.shadowOptions =
            nameOrConfig.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrConfig.shadowOptions === null
                    ? void 0
                    : Object.assign(Object.assign({}, defaultShadowOptions), nameOrConfig.shadowOptions);
        this.elementOptions =
            nameOrConfig.elementOptions === void 0
                ? defaultElementOptions
                : Object.assign(Object.assign({}, defaultElementOptions), nameOrConfig.elementOptions);
        this.styles = ElementStyles.normalize(nameOrConfig.styles);
        fastElementRegistry.register(this);
        Observable.defineProperty(FASTElementDefinition.isRegistered, this.name);
        FASTElementDefinition.isRegistered[this.name] = this.type;
    }
    /**
     * Indicates if this element has been defined in at least one registry.
     */
    get isDefined() {
        return this.platformDefined;
    }
    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     * @remarks
     * This operation is idempotent per registry.
     */
    define(registry = this.registry) {
        const type = this.type;
        if (!registry.get(this.name)) {
            this.platformDefined = true;
            registry.define(this.name, type, this.elementOptions);
        }
        return this;
    }
    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrDef - The name of the element to define or a config object
     * that describes the element to define.
     */
    static compose(type, nameOrDef) {
        if (fastElementBaseTypes.has(type) || fastElementRegistry.getByType(type)) {
            return new FASTElementDefinition(class extends type {
            }, nameOrDef);
        }
        return new FASTElementDefinition(type, nameOrDef);
    }
    /**
     * Registers a FASTElement base type.
     * @param type - The type to register as a base type.
     * @internal
     */
    static registerBaseType(type) {
        fastElementBaseTypes.add(type);
    }
    /**
     * Creates an instance of FASTElementDefinition asynchronously. This option assumes
     * that a template and shadowOptions will be provided and completes when those requirements
     * are met.
     * @param type - The type this definition is being created for.
     * @param nameOrDef - The name of the element to define or a config object
     * that describes the element to define.
     * @alpha
     */
    static composeAsync(type, nameOrDef) {
        return new Promise(resolve => {
            if (fastElementBaseTypes.has(type) || fastElementRegistry.getByType(type)) {
                resolve(new FASTElementDefinition(class extends type {
                }, nameOrDef));
            }
            const definition = new FASTElementDefinition(type, nameOrDef);
            Promise.all([
                new Promise(resolve => {
                    Observable.getNotifier(definition).subscribe({
                        handleChange: () => resolve(),
                    }, "template");
                }),
                new Promise(resolve => {
                    Observable.getNotifier(definition).subscribe({
                        handleChange: () => resolve(),
                    }, "shadowOptions");
                }),
            ]).then(() => {
                resolve(definition);
            });
        });
    }
}
/**
 * The definition has been registered to the FAST element registry.
 */
FASTElementDefinition.isRegistered = {};
/**
 * Gets the element definition associated with the specified type.
 * @param type - The custom element type to retrieve the definition for.
 */
FASTElementDefinition.getByType = fastElementRegistry.getByType;
/**
 * Gets the element definition associated with the instance.
 * @param instance - The custom element instance to retrieve the definition for.
 */
FASTElementDefinition.getForInstance = fastElementRegistry.getForInstance;
/**
 * Indicates when a custom elements definition has been registered with the fastElementRegistry.
 * @param name - The name of the defined custom element.
 * @alpha
 */
FASTElementDefinition.registerAsync = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => {
        if (FASTElementDefinition.isRegistered[name]) {
            resolve(FASTElementDefinition.isRegistered[name]);
        }
        Observable.getNotifier(FASTElementDefinition.isRegistered).subscribe({
            handleChange: () => resolve(FASTElementDefinition.isRegistered[name]),
        }, name);
    });
});
Observable.defineProperty(FASTElementDefinition.prototype, "template");
Observable.defineProperty(FASTElementDefinition.prototype, "shadowOptions");

/**
 * An extension of MutationObserver that supports unobserving nodes.
 * @internal
 */
class UnobservableMutationObserver extends MutationObserver {
    /**
     * Creates an instance of UnobservableMutationObserver.
     * @param callback - The callback to invoke when observed nodes are changed.
     */
    constructor(callback) {
        function handler(mutations) {
            this.callback.call(null, mutations.filter(record => this.observedNodes.has(record.target)));
        }
        super(handler);
        this.callback = callback;
        this.observedNodes = new Set();
    }
    observe(target, options) {
        this.observedNodes.add(target);
        super.observe(target, options);
    }
    unobserve(target) {
        this.observedNodes.delete(target);
        if (this.observedNodes.size < 1) {
            this.disconnect();
        }
    }
}

const defaultEventOptions = {
    bubbles: true,
    composed: true,
    cancelable: true,
};
const isConnectedPropertyName = "isConnected";
const shadowRoots = new WeakMap();
function getShadowRoot(element) {
    var _a, _b;
    return (_b = (_a = element.shadowRoot) !== null && _a !== void 0 ? _a : shadowRoots.get(element)) !== null && _b !== void 0 ? _b : null;
}
let elementControllerStrategy;
/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
class ElementController extends PropertyChangeNotifier {
    /**
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    constructor(element, definition) {
        super(element);
        this.boundObservables = null;
        this.needsInitialization = true;
        this.hasExistingShadowRoot = false;
        this._template = null;
        this.stage = 3 /* Stages.disconnected */;
        /**
         * A guard against connecting behaviors multiple times
         * during connect in scenarios where a behavior adds
         * another behavior during it's connectedCallback
         */
        this.guardBehaviorConnection = false;
        this.behaviors = null;
        /**
         * Tracks whether behaviors are connected so that
         * behaviors cant be connected multiple times
         */
        this.behaviorsConnected = false;
        this._mainStyles = null;
        /**
         * This allows Observable.getNotifier(...) to return the Controller
         * when the notifier for the Controller itself is being requested. The
         * result is that the Observable system does not need to create a separate
         * instance of Notifier for observables on the Controller. The component and
         * the controller will now share the same notifier, removing one-object construct
         * per web component instance.
         */
        this.$fastController = this;
        /**
         * The view associated with the custom element.
         * @remarks
         * If `null` then the element is managing its own rendering.
         */
        this.view = null;
        this.source = element;
        this.definition = definition;
        this.shadowOptions = definition.shadowOptions;
        // Capture any observable values that were set by the binding engine before
        // the browser upgraded the element. Then delete the property since it will
        // shadow the getter/setter that is required to make the observable operate.
        // Later, in the connect callback, we'll re-apply the values.
        const accessors = Observable.getAccessors(element);
        if (accessors.length > 0) {
            const boundObservables = (this.boundObservables = Object.create(null));
            for (let i = 0, ii = accessors.length; i < ii; ++i) {
                const propertyName = accessors[i].name;
                const value = element[propertyName];
                if (value !== void 0) {
                    delete element[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }
    /**
     * Indicates whether or not the custom element has been
     * connected to the document.
     */
    get isConnected() {
        Observable.track(this, isConnectedPropertyName);
        return this.stage === 1 /* Stages.connected */;
    }
    /**
     * The context the expression is evaluated against.
     */
    get context() {
        var _a, _b;
        return (_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.context) !== null && _b !== void 0 ? _b : ExecutionContext.default;
    }
    /**
     * Indicates whether the controller is bound.
     */
    get isBound() {
        var _a, _b;
        return (_b = (_a = this.view) === null || _a === void 0 ? void 0 : _a.isBound) !== null && _b !== void 0 ? _b : false;
    }
    /**
     * Indicates how the source's lifetime relates to the controller's lifetime.
     */
    get sourceLifetime() {
        var _a;
        return (_a = this.view) === null || _a === void 0 ? void 0 : _a.sourceLifetime;
    }
    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get template() {
        var _a;
        // 1. Template overrides take top precedence.
        if (this._template === null) {
            const definition = this.definition;
            if (this.source.resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = this.source.resolveTemplate();
            }
            else if (definition.template) {
                // 3. Default to the static definition.
                this._template = (_a = definition.template) !== null && _a !== void 0 ? _a : null;
            }
        }
        return this._template;
    }
    set template(value) {
        if (this._template === value) {
            return;
        }
        this._template = value;
        if (!this.needsInitialization) {
            this.renderTemplate(value);
        }
    }
    get shadowOptions() {
        return this._shadowRootOptions;
    }
    set shadowOptions(value) {
        // options on the shadowRoot can only be set once
        if (this._shadowRootOptions === void 0 && value !== void 0) {
            this._shadowRootOptions = value;
            let shadowRoot = this.source.shadowRoot;
            if (shadowRoot) {
                this.hasExistingShadowRoot = true;
            }
            else {
                shadowRoot = this.source.attachShadow(value);
                if (value.mode === "closed") {
                    shadowRoots.set(this.source, shadowRoot);
                }
            }
        }
    }
    /**
     * The main set of styles used for the component, independent
     * of any dynamically added styles.
     */
    get mainStyles() {
        var _a;
        // 1. Styles overrides take top precedence.
        if (this._mainStyles === null) {
            const definition = this.definition;
            if (this.source.resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._mainStyles = this.source.resolveStyles();
            }
            else if (definition.styles) {
                // 3. Default to the static definition.
                this._mainStyles = (_a = definition.styles) !== null && _a !== void 0 ? _a : null;
            }
        }
        return this._mainStyles;
    }
    set mainStyles(value) {
        if (this._mainStyles === value) {
            return;
        }
        if (this._mainStyles !== null) {
            this.removeStyles(this._mainStyles);
        }
        this._mainStyles = value;
        if (!this.needsInitialization) {
            this.addStyles(value);
        }
    }
    /**
     * Registers an unbind handler with the controller.
     * @param behavior - An object to call when the controller unbinds.
     */
    onUnbind(behavior) {
        var _a;
        (_a = this.view) === null || _a === void 0 ? void 0 : _a.onUnbind(behavior);
    }
    /**
     * Adds the behavior to the component.
     * @param behavior - The behavior to add.
     */
    addBehavior(behavior) {
        var _a, _b;
        const targetBehaviors = (_a = this.behaviors) !== null && _a !== void 0 ? _a : (this.behaviors = new Map());
        const count = (_b = targetBehaviors.get(behavior)) !== null && _b !== void 0 ? _b : 0;
        if (count === 0) {
            targetBehaviors.set(behavior, 1);
            behavior.addedCallback && behavior.addedCallback(this);
            if (behavior.connectedCallback &&
                !this.guardBehaviorConnection &&
                (this.stage === 1 /* Stages.connected */ || this.stage === 0 /* Stages.connecting */)) {
                behavior.connectedCallback(this);
            }
        }
        else {
            targetBehaviors.set(behavior, count + 1);
        }
    }
    /**
     * Removes the behavior from the component.
     * @param behavior - The behavior to remove.
     * @param force - Forces removal even if this behavior was added more than once.
     */
    removeBehavior(behavior, force = false) {
        const targetBehaviors = this.behaviors;
        if (targetBehaviors === null) {
            return;
        }
        const count = targetBehaviors.get(behavior);
        if (count === void 0) {
            return;
        }
        if (count === 1 || force) {
            targetBehaviors.delete(behavior);
            if (behavior.disconnectedCallback && this.stage !== 3 /* Stages.disconnected */) {
                behavior.disconnectedCallback(this);
            }
            behavior.removedCallback && behavior.removedCallback(this);
        }
        else {
            targetBehaviors.set(behavior, count - 1);
        }
    }
    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles) {
        var _a;
        if (!styles) {
            return;
        }
        const source = this.source;
        if (styles instanceof HTMLElement) {
            const target = (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : this.source;
            target.append(styles);
        }
        else if (!styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(source);
            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.addBehavior(sourceBehaviors[i]);
                }
            }
        }
    }
    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    removeStyles(styles) {
        var _a;
        if (!styles) {
            return;
        }
        const source = this.source;
        if (styles instanceof HTMLElement) {
            const target = (_a = getShadowRoot(source)) !== null && _a !== void 0 ? _a : source;
            target.removeChild(styles);
        }
        else if (styles.isAttachedTo(source)) {
            const sourceBehaviors = styles.behaviors;
            styles.removeStylesFrom(source);
            if (sourceBehaviors !== null) {
                for (let i = 0, ii = sourceBehaviors.length; i < ii; ++i) {
                    this.removeBehavior(sourceBehaviors[i]);
                }
            }
        }
    }
    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    connect() {
        if (this.stage !== 3 /* Stages.disconnected */) {
            return;
        }
        this.stage = 0 /* Stages.connecting */;
        this.bindObservables();
        this.connectBehaviors();
        if (this.needsInitialization) {
            this.renderTemplate(this.template);
            this.addStyles(this.mainStyles);
            this.needsInitialization = false;
        }
        else if (this.view !== null) {
            this.view.bind(this.source);
        }
        this.stage = 1 /* Stages.connected */;
        Observable.notify(this, isConnectedPropertyName);
    }
    bindObservables() {
        if (this.boundObservables !== null) {
            const element = this.source;
            const boundObservables = this.boundObservables;
            const propertyNames = Object.keys(boundObservables);
            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                element[propertyName] = boundObservables[propertyName];
            }
            this.boundObservables = null;
        }
    }
    connectBehaviors() {
        if (this.behaviorsConnected === false) {
            const behaviors = this.behaviors;
            if (behaviors !== null) {
                this.guardBehaviorConnection = true;
                for (const key of behaviors.keys()) {
                    key.connectedCallback && key.connectedCallback(this);
                }
                this.guardBehaviorConnection = false;
            }
            this.behaviorsConnected = true;
        }
    }
    disconnectBehaviors() {
        if (this.behaviorsConnected === true) {
            const behaviors = this.behaviors;
            if (behaviors !== null) {
                for (const key of behaviors.keys()) {
                    key.disconnectedCallback && key.disconnectedCallback(this);
                }
            }
            this.behaviorsConnected = false;
        }
    }
    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    disconnect() {
        if (this.stage !== 1 /* Stages.connected */) {
            return;
        }
        this.stage = 2 /* Stages.disconnecting */;
        Observable.notify(this, isConnectedPropertyName);
        if (this.view !== null) {
            this.view.unbind();
        }
        this.disconnectBehaviors();
        this.stage = 3 /* Stages.disconnected */;
    }
    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    onAttributeChangedCallback(name, oldValue, newValue) {
        const attrDef = this.definition.attributeLookup[name];
        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.source, newValue);
        }
    }
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if connected.
     */
    emit(type, detail, options) {
        if (this.stage === 1 /* Stages.connected */) {
            return this.source.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
        }
        return false;
    }
    renderTemplate(template) {
        var _a;
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
        const element = this.source;
        const host = (_a = getShadowRoot(element)) !== null && _a !== void 0 ? _a : element;
        if (this.view !== null) {
            // If there's already a view, we need to unbind and remove through dispose.
            this.view.dispose();
            this.view = null;
        }
        else if (!this.needsInitialization || this.hasExistingShadowRoot) {
            this.hasExistingShadowRoot = false;
            // If there was previous custom rendering, we need to clear out the host.
            for (let child = host.firstChild; child !== null; child = host.firstChild) {
                host.removeChild(child);
            }
        }
        if (template) {
            // If a new template was provided, render it.
            this.view = template.render(element, host, element);
            this.view.sourceLifetime =
                SourceLifetime.coupled;
        }
    }
    /**
     * Locates or creates a controller for the specified element.
     * @param element - The element to return the controller for.
     * @param override - Reset the controller even if one has been defined.
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element, override = false) {
        const controller = element.$fastController;
        if (controller !== void 0 && !override) {
            return controller;
        }
        const definition = FASTElementDefinition.getForInstance(element);
        if (definition === void 0) {
            throw FAST.error(1401 /* Message.missingElementDefinition */);
        }
        Observable.getNotifier(definition).subscribe({
            handleChange: () => {
                ElementController.forCustomElement(element, true);
                element.$fastController.connect();
            },
        }, "template");
        Observable.getNotifier(definition).subscribe({
            handleChange: () => {
                ElementController.forCustomElement(element, true);
                element.$fastController.connect();
            },
        }, "shadowOptions");
        return (element.$fastController = new elementControllerStrategy(element, definition));
    }
    /**
     * Sets the strategy that ElementController.forCustomElement uses to construct
     * ElementController instances for an element.
     * @param strategy - The strategy to use.
     */
    static setStrategy(strategy) {
        elementControllerStrategy = strategy;
    }
}
makeSerializationNoop(ElementController);
// Set default strategy for ElementController
ElementController.setStrategy(ElementController);
/**
 * Converts a styleTarget into the operative target. When the provided target is an Element
 * that is a FASTElement, the function will return the ShadowRoot for that element. Otherwise,
 * it will return the root node for the element.
 * @param target
 * @returns
 */
function normalizeStyleTarget(target) {
    var _a;
    if ("adoptedStyleSheets" in target) {
        return target;
    }
    else {
        return ((_a = getShadowRoot(target)) !== null && _a !== void 0 ? _a : target.getRootNode());
    }
}
// Default StyleStrategy implementations are defined in this module because they
// require access to element shadowRoots, and we don't want to leak shadowRoot
// objects out of this module.
/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
class AdoptedStyleSheetsStrategy {
    constructor(styles) {
        const styleSheetCache = AdoptedStyleSheetsStrategy.styleSheetCache;
        this.sheets = styles.map((x) => {
            if (x instanceof CSSStyleSheet) {
                return x;
            }
            let sheet = styleSheetCache.get(x);
            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                sheet.replaceSync(x);
                styleSheetCache.set(x, sheet);
            }
            return sheet;
        });
    }
    addStylesTo(target) {
        addAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
    }
    removeStylesFrom(target) {
        removeAdoptedStyleSheets(normalizeStyleTarget(target), this.sheets);
    }
}
AdoptedStyleSheetsStrategy.styleSheetCache = new Map();
let id = 0;
const nextStyleId = () => `fast-${++id}`;
function usableStyleTarget(target) {
    return target === document ? document.body : target;
}
/**
 * @internal
 */
class StyleElementStrategy {
    constructor(styles) {
        this.styles = styles;
        this.styleClass = nextStyleId();
    }
    addStylesTo(target) {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles = this.styles;
        const styleClass = this.styleClass;
        for (let i = 0; i < styles.length; i++) {
            const element = document.createElement("style");
            element.innerHTML = styles[i];
            element.className = styleClass;
            target.append(element);
        }
    }
    removeStylesFrom(target) {
        target = usableStyleTarget(normalizeStyleTarget(target));
        const styles = target.querySelectorAll(`.${this.styleClass}`);
        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}
let addAdoptedStyleSheets = (target, sheets) => {
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, ...sheets];
};
let removeAdoptedStyleSheets = (target, sheets) => {
    target.adoptedStyleSheets = target.adoptedStyleSheets.filter((x) => sheets.indexOf(x) === -1);
};
if (ElementStyles.supportsAdoptedStyleSheets) {
    try {
        // Test if browser implementation uses FrozenArray.
        // If not, use push / splice to alter the stylesheets
        // in place. This circumvents a bug in Safari 16.4 where
        // periodically, assigning the array would previously
        // cause sheets to be removed.
        document.adoptedStyleSheets.push();
        document.adoptedStyleSheets.splice();
        addAdoptedStyleSheets = (target, sheets) => {
            target.adoptedStyleSheets.push(...sheets);
        };
        removeAdoptedStyleSheets = (target, sheets) => {
            for (const sheet of sheets) {
                const index = target.adoptedStyleSheets.indexOf(sheet);
                if (index !== -1) {
                    target.adoptedStyleSheets.splice(index, 1);
                }
            }
        };
    }
    catch (e) {
        // Do nothing if an error is thrown, the default
        // case handles FrozenArray.
    }
    ElementStyles.setDefaultStrategy(AdoptedStyleSheetsStrategy);
}
else {
    ElementStyles.setDefaultStrategy(StyleElementStrategy);
}
const deferHydrationAttribute = "defer-hydration";
const needsHydrationAttribute = "needs-hydration";
/**
 * An ElementController capable of hydrating FAST elements from
 * Declarative Shadow DOM.
 *
 * @beta
 */
class HydratableElementController extends ElementController {
    static hydrationObserverHandler(records) {
        for (const record of records) {
            HydratableElementController.hydrationObserver.unobserve(record.target);
            record.target.$fastController.connect();
        }
    }
    static forCustomElement(element, override) {
        const definition = FASTElementDefinition.getForInstance(element);
        if (definition !== undefined &&
            definition.templateOptions === "defer-and-hydrate" &&
            !definition.template) {
            element.setAttribute(deferHydrationAttribute, "");
            element.setAttribute(needsHydrationAttribute, "");
        }
        return super.forCustomElement(element, override);
    }
    connect() {
        var _a, _b;
        // Initialize needsHydration on first connect
        if (this.needsHydration === undefined) {
            this.needsHydration =
                this.source.getAttribute(needsHydrationAttribute) !== null;
        }
        // If the `defer-hydration` attribute exists on the source,
        // wait for it to be removed before continuing connection behavior.
        if (this.source.hasAttribute(deferHydrationAttribute)) {
            HydratableElementController.hydrationObserver.observe(this.source, {
                attributeFilter: [deferHydrationAttribute],
            });
            return;
        }
        // If the controller does not need to be hydrated, defer connection behavior
        // to the base-class. This case handles element re-connection and initial connection
        // of elements that did not get declarative shadow-dom emitted, as well as if an extending
        // class
        if (!this.needsHydration) {
            super.connect();
            return;
        }
        if (this.stage !== 3 /* Stages.disconnected */) {
            return;
        }
        this.stage = 0 /* Stages.connecting */;
        this.bindObservables();
        this.connectBehaviors();
        const element = this.source;
        const host = (_a = getShadowRoot(element)) !== null && _a !== void 0 ? _a : element;
        if (this.template) {
            if (isHydratable(this.template)) {
                let firstChild = host.firstChild;
                let lastChild = host.lastChild;
                if (element.shadowRoot === null) {
                    // handle element boundary markers when shadowRoot is not present
                    if (HydrationMarkup.isElementBoundaryStartMarker(firstChild)) {
                        firstChild.data = "";
                        firstChild = firstChild.nextSibling;
                    }
                    if (HydrationMarkup.isElementBoundaryEndMarker(lastChild)) {
                        lastChild.data = "";
                        lastChild = lastChild.previousSibling;
                    }
                }
                this.view = this.template.hydrate(firstChild, lastChild, element);
                (_b = this.view) === null || _b === void 0 ? void 0 : _b.bind(this.source);
            }
            else {
                this.renderTemplate(this.template);
            }
        }
        this.addStyles(this.mainStyles);
        this.stage = 1 /* Stages.connected */;
        this.source.removeAttribute(needsHydrationAttribute);
        this.needsInitialization = this.needsHydration = false;
        Observable.notify(this, isConnectedPropertyName);
    }
    disconnect() {
        super.disconnect();
        HydratableElementController.hydrationObserver.unobserve(this.source);
    }
    static install() {
        ElementController.setStrategy(HydratableElementController);
    }
}
HydratableElementController.hydrationObserver = new UnobservableMutationObserver(HydratableElementController.hydrationObserverHandler);

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement(BaseType) {
    const type = class extends BaseType {
        constructor() {
            /* eslint-disable-next-line */
            super();
            ElementController.forCustomElement(this);
        }
        $emit(type, detail, options) {
            return this.$fastController.emit(type, detail, options);
        }
        connectedCallback() {
            this.$fastController.connect();
        }
        disconnectedCallback() {
            this.$fastController.disconnect();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
    FASTElementDefinition.registerBaseType(type);
    return type;
}
function compose(type, nameOrDef) {
    if (isFunction(type)) {
        return FASTElementDefinition.compose(type, nameOrDef);
    }
    return FASTElementDefinition.compose(this, type);
}
function defineAsync(type, nameOrDef) {
    if (isFunction(type)) {
        return new Promise(resolve => {
            FASTElementDefinition.composeAsync(type, nameOrDef).then(value => {
                resolve(value);
            });
        }).then(value => {
            return value.define().type;
        });
    }
    return new Promise(resolve => {
        FASTElementDefinition.composeAsync(this, type).then(value => {
            resolve(value);
        });
    }).then(value => {
        return value.define().type;
    });
}
function define(type, nameOrDef) {
    if (isFunction(type)) {
        return FASTElementDefinition.compose(type, nameOrDef).define().type;
    }
    return FASTElementDefinition.compose(this, type).define().type;
}
function from(BaseType) {
    return createFASTElement(BaseType);
}
/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from,
    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define,
    /**
     * Defines metadata for a FASTElement which can be used to later define the element.
     * @public
     */
    compose,
    /**
     * Defines metadata for a FASTElement which can be used after it has been resolved to define the element.
     * @alpha
     */
    defineAsync,
});

/**
 * Standard orientation values
 */
const Orientation = {
    horizontal: "horizontal",
    vertical: "vertical",
};

/**
 * Returns the index of the last element in the array where predicate is true, and -1 otherwise.
 *
 * @param array - the array to test
 * @param predicate - find calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findIndex returns -1.
 */
function findLastIndex(array, predicate) {
    let k = array.length;
    while (k--) {
        if (predicate(array[k], k, array)) {
            return k;
        }
    }
    return -1;
}

/**
 * A test that ensures that all arguments are HTML Elements
 */
function isHTMLElement(...args) {
    return args.every((arg) => arg instanceof HTMLElement);
}

/**
 * String values for use with KeyboardEvent.key
 */
const keyArrowDown = "ArrowDown";
const keyArrowLeft = "ArrowLeft";
const keyArrowRight = "ArrowRight";
const keyArrowUp = "ArrowUp";
const keyEnd = "End";
const keyEnter = "Enter";
const keyEscape = "Escape";
const keyHome = "Home";
const keySpace = " ";
const keyTab = "Tab";

/**
 * Expose ltr and rtl strings
 */
var Direction;
(function (Direction) {
    Direction["ltr"] = "ltr";
    Direction["rtl"] = "rtl";
})(Direction || (Direction = {}));

/**
 * This method keeps a given value within the bounds of a min and max value. If the value
 * is larger than the max, the minimum value will be returned. If the value is smaller than the minimum,
 * the maximum will be returned. Otherwise, the value is returned un-changed.
 */
/**
 * Ensures that a value is between a min and max value. If value is lower than min, min will be returned.
 * If value is greater than max, max will be returned.
 */
function limit(min, max, value) {
    return Math.min(Math.max(value, min), max);
}

let uniqueIdCounter = 0;
/**
 * Generates a unique ID based on incrementing a counter.
 */
function uniqueId(prefix = "") {
    return `${prefix}${uniqueIdCounter++}`;
}

/**
 *
 * @slot start - Content positioned before heading in the collapsed state
 * @slot heading - Content which serves as the accordion item heading and text of the expand button
 * @slot - The default slot for accordion item content
 * @slot marker-expanded - The expanded icon
 * @slot marker-collapsed - The collapsed icon
 * @csspart heading - Wraps the button
 * @csspart button - The button which serves to invoke the item
 * @csspart content - The wrapper for the accordion item content
 *
 * @public
 */
class BaseAccordionItem extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * Configures the {@link https://www.w3.org/TR/wai-aria-1.1/#aria-level | level} of the
         * heading element.
         *
         * @public
         * @remarks
         * HTML attribute: heading-level
         */
        this.headinglevel = 2;
        /**
         * Expands or collapses the item.
         *
         * @public
         * @remarks
         * HTML attribute: expanded
         */
        this.expanded = false;
        /**
         * Disables an accordion item
         *
         * @public
         * @remarks
         * HTML attribute: disabled
         */
        this.disabled = false;
        /**
         * The item ID
         *
         * @public
         * @remarks
         * HTML Attribute: id
         */
        this.id = uniqueId('accordion-');
    }
}
__decorate([
    attr({
        attribute: 'heading-level',
        mode: 'fromView',
        converter: nullableNumberConverter,
    })
], BaseAccordionItem.prototype, "headinglevel", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseAccordionItem.prototype, "expanded", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseAccordionItem.prototype, "disabled", void 0);
__decorate([
    attr
], BaseAccordionItem.prototype, "id", void 0);

/**
 * A {@link ValueConverter} that makes sure the attribute and property values
 * are a string representation of a number, e.g. `'10'` instead of `10`.
 *
 * @remarks
 * This converter allows any data type, but if the data is evaluated as `NaN`
 * by `Number.isNaN()`, it’d be converted to an empty string. Otherwise, the
 * converted value is a string of number.
 *
 * It is useful for somm  custom element’s attributes and properties, e.g.
 * `min`, `max`, `step` on an `<input type=range>`-like element, to align with
 * the built-in HTML element behavior, those property values should be strings.
 *
 * @public
 */
const numberLikeStringConverter = {
    fromView(value) {
        const valueAsNumber = parseFloat(value);
        return Number.isNaN(valueAsNumber) ? '' : valueAsNumber.toString();
    },
    toView(value) {
        const valueAsNumber = parseFloat(value);
        return Number.isNaN(valueAsNumber) ? undefined : valueAsNumber.toString();
    },
};

//Copied from @microsoft/fast-foundation
/**
 * Determines the current localization direction of an element.
 *
 * @param rootNode - the HTMLElement to begin the query from, usually "this" when used in a component controller
 * @returns the localization direction of the element
 *
 * @public
 */
const getDirection = (rootNode) => {
    return rootNode.closest('[dir]')?.dir === 'rtl' ? Direction.rtl : Direction.ltr;
};

//Copied from @microsoft/fast-foundation
/**
 * A function to compose template options.
 * @public
 */
function staticallyCompose(item) {
    if (!item) {
        return InlineTemplateDirective.empty;
    }
    if (typeof item === 'string') {
        return new InlineTemplateDirective(item);
    }
    if ('inline' in item) {
        return item.inline();
    }
    return item;
}

//Copied from @microsoft/fast-foundation
/**
 * filters out any whitespace-only nodes, to be used inside a template.
 *
 * @param value - The Node that is being inspected
 * @param index - The index of the node within the array
 * @param array - The Node array that is being filtered
 * @returns true if the node is not a whitespace-only node, false otherwise
 *
 * @public
 */
const whitespaceFilter = value => value.nodeType !== Node.TEXT_NODE || !!value.nodeValue?.trim().length;

/**
 * A CSS fragment to set `display: none;` when the host is hidden using the [hidden] attribute.
 * @public
 */
const hidden = `:host([hidden]){display:none}`;
/**
 * Applies a CSS display property.
 * Also adds CSS rules to not display the element when the [hidden] attribute is applied to the element.
 * @param display - The CSS display property value
 * @public
 */
function display(displayValue) {
    return `${hidden}:host{display:${displayValue}}`;
}

/**
 * An abstract behavior to react to media queries. Implementations should implement
 * the `constructListener` method to perform some action based on media query changes.
 *
 * @public
 */
class MatchMediaBehavior {
    /**
     *
     * @param query - The media query to operate from.
     */
    constructor(query) {
        /**
         * The behavior needs to operate on element instances but elements might share a behavior instance.
         * To ensure proper attachment / detachment per instance, we construct a listener for
         * each bind invocation and cache the listeners by element reference.
         */
        this.listenerCache = new WeakMap();
        this.query = query;
    }
    /**
     * Binds the behavior to the element.
     * @param controller - The host controller orchestrating this behavior.
     */
    connectedCallback(controller) {
        const { query } = this;
        let listener = this.listenerCache.get(controller);
        if (!listener) {
            listener = this.constructListener(controller);
            this.listenerCache.set(controller, listener);
        }
        // Invoke immediately to add if the query currently matches
        listener.bind(query)();
        query.addEventListener('change', listener);
    }
    /**
     * Unbinds the behavior from the element.
     * @param controller - The host controller orchestrating this behavior.
     */
    disconnectedCallback(controller) {
        const listener = this.listenerCache.get(controller);
        if (listener) {
            this.query.removeEventListener('change', listener);
        }
    }
}
/**
 * A behavior to add or remove a stylesheet from an element based on a media query. The behavior ensures that
 * styles are applied while the a query matches the environment and that styles are not applied if the query does
 * not match the environment.
 *
 * @public
 */
class MatchMediaStyleSheetBehavior extends MatchMediaBehavior {
    /**
     * Constructs a {@link MatchMediaStyleSheetBehavior} instance.
     * @param query - The media query to operate from.
     * @param styles - The styles to coordinate with the query.
     */
    constructor(query, styles) {
        super(query);
        this.styles = styles;
    }
    /**
     * Defines a function to construct {@link MatchMediaStyleSheetBehavior | MatchMediaStyleSheetBehaviors} for
     * a provided query.
     * @param query - The media query to operate from.
     *
     * @public
     * @example
     *
     * ```ts
     * import { css } from "@microsoft/fast-element";
     * import { MatchMediaStyleSheetBehavior } from "@fluentui/web-components";
     *
     * const landscapeBehavior = MatchMediaStyleSheetBehavior.with(
     *   window.matchMedia("(orientation: landscape)")
     * );
     *
     * const styles = css`
     *   :host {
     *     width: 200px;
     *     height: 400px;
     *   }
     * `
     * .withBehaviors(landscapeBehavior(css`
     *   :host {
     *     width: 400px;
     *     height: 200px;
     *   }
     * `))
     * ```
     */
    static with(query) {
        return (styles) => {
            return new MatchMediaStyleSheetBehavior(query, styles);
        };
    }
    /**
     * Constructs a match-media listener for a provided element.
     * @param source - the element for which to attach or detach styles.
     */
    constructListener(controller) {
        let attached = false;
        const styles = this.styles;
        return function listener() {
            const { matches } = this;
            if (matches && !attached) {
                controller.addStyles(styles);
                attached = matches;
            }
            else if (!matches && attached) {
                controller.removeStyles(styles);
                attached = matches;
            }
        };
    }
    /**
     * Unbinds the behavior from the element.
     * @param controller - The host controller orchestrating this behavior.
     * @internal
     */
    removedCallback(controller) {
        controller.removeStyles(this.styles);
    }
}
/**
 * This can be used to construct a behavior to apply a forced-colors only stylesheet.
 * @public
 */
const forcedColorsStylesheetBehavior = MatchMediaStyleSheetBehavior.with(window.matchMedia('(forced-colors)'));
/**
 * This can be used to construct a behavior to apply a prefers color scheme: dark only stylesheet.
 * @public
 */
MatchMediaStyleSheetBehavior.with(window.matchMedia('(prefers-color-scheme: dark)'));
/**
 * This can be used to construct a behavior to apply a prefers color scheme: light only stylesheet.
 * @public
 */
MatchMediaStyleSheetBehavior.with(window.matchMedia('(prefers-color-scheme: light)'));

/**
 * Check if the browser supports CSS Anchor Positioning.
 * @public
 */
CSS.supports('anchor-name: --a');
/**
 * Check if the browser supports Custom States.
 * @public
 */
const CustomStatesSetSupported = CSS.supports('selector(:state(g))');

//Copied from @microsoft/fast-foundation
/**
 * A mixin class implementing start and end slots.
 * These are generally used to decorate text elements with icons or other visual indicators.
 * @public
 */
class StartEnd {
}
/**
 * The template for the end slot.
 * For use with {@link StartEnd}
 *
 * @public
 */
function endSlotTemplate(options) {
    return html ` <slot name="end" ${ref('end')}>${staticallyCompose(options.end)}</slot> `.inline();
}
/**
 * The template for the start slots.
 * For use with {@link StartEnd}
 *
 * @public
 */
function startSlotTemplate(options) {
    return html ` <slot name="start" ${ref('start')}>${staticallyCompose(options.start)}</slot> `.inline();
}

/**
 * Apply mixins to a constructor.
 * Sourced from {@link https://www.typescriptlang.org/docs/handbook/mixins.html | TypeScript Documentation }.
 *
 * TODO: Remove with https://github.com/microsoft/fast/pull/6797
 * This was used for Badge where start/end was not yet implemented.
 * The method itself was deprecated as it was largely intended to be "internals" for Fast Foundation.
 * Adding here to avoid breaking of the existing API.
 * @internal
 */
function applyMixins(derivedCtor, ...baseCtors) {
    const derivedAttributes = AttributeConfiguration.locate(derivedCtor);
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                Object.defineProperty(derivedCtor.prototype, name, 
                /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name));
            }
        });
        const baseAttributes = AttributeConfiguration.locate(baseCtor);
        baseAttributes.forEach(x => derivedAttributes.push(x));
    });
}

/**
 * An Accordion Item Custom HTML Element.
 * Based on BaseAccordionItem and includes style and layout specific attributes
 *
 * @public
 */
class AccordionItem extends BaseAccordionItem {
    constructor() {
        super(...arguments);
        /**
         * Sets the width of the focus state.
         *
         * @public
         * @remarks
         * HTML Attribute: block
         */
        this.block = false;
    }
}
__decorate([
    attr
], AccordionItem.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'marker-position' })
], AccordionItem.prototype, "markerPosition", void 0);
__decorate([
    attr({ mode: 'boolean' })
], AccordionItem.prototype, "block", void 0);
applyMixins(AccordionItem, StartEnd);

// THIS FILE IS GENERATED AS PART OF THE BUILD PROCESS. DO NOT MANUALLY MODIFY THIS FILE
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1 | `colorNeutralForeground1`} design token.
 * @public
 */
const colorNeutralForeground1 = 'var(--colorNeutralForeground1)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1Hover | `colorNeutralForeground1Hover`} design token.
 * @public
 */
const colorNeutralForeground1Hover = 'var(--colorNeutralForeground1Hover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground1Pressed | `colorNeutralForeground1Pressed`} design token.
 * @public
 */
const colorNeutralForeground1Pressed = 'var(--colorNeutralForeground1Pressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2 | `colorNeutralForeground2`} design token.
 * @public
 */
const colorNeutralForeground2 = 'var(--colorNeutralForeground2)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2Hover | `colorNeutralForeground2Hover`} design token.
 * @public
 */
const colorNeutralForeground2Hover = 'var(--colorNeutralForeground2Hover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2Pressed | `colorNeutralForeground2Pressed`} design token.
 * @public
 */
const colorNeutralForeground2Pressed = 'var(--colorNeutralForeground2Pressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2BrandHover | `colorNeutralForeground2BrandHover`} design token.
 * @public
 */
const colorNeutralForeground2BrandHover = 'var(--colorNeutralForeground2BrandHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground2BrandPressed | `colorNeutralForeground2BrandPressed`} design token.
 * @public
 */
const colorNeutralForeground2BrandPressed = 'var(--colorNeutralForeground2BrandPressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground3 | `colorNeutralForeground3`} design token.
 * @public
 */
const colorNeutralForeground3 = 'var(--colorNeutralForeground3)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForeground4 | `colorNeutralForeground4`} design token.
 * @public
 */
const colorNeutralForeground4 = 'var(--colorNeutralForeground4)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundDisabled | `colorNeutralForegroundDisabled`} design token.
 * @public
 */
const colorNeutralForegroundDisabled = 'var(--colorNeutralForegroundDisabled)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandForeground1Pressed | `colorCompoundBrandForeground1Pressed`} design token.
 * @public
 */
const colorCompoundBrandForeground1Pressed = 'var(--colorCompoundBrandForeground1Pressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundOnBrand | `colorNeutralForegroundOnBrand`} design token.
 * @public
 */
const colorNeutralForegroundOnBrand = 'var(--colorNeutralForegroundOnBrand)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralForegroundInverted | `colorNeutralForegroundInverted`} design token.
 * @public
 */
const colorNeutralForegroundInverted = 'var(--colorNeutralForegroundInverted)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1 | `colorNeutralBackground1`} design token.
 * @public
 */
const colorNeutralBackground1 = 'var(--colorNeutralBackground1)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1Hover | `colorNeutralBackground1Hover`} design token.
 * @public
 */
const colorNeutralBackground1Hover = 'var(--colorNeutralBackground1Hover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1Pressed | `colorNeutralBackground1Pressed`} design token.
 * @public
 */
const colorNeutralBackground1Pressed = 'var(--colorNeutralBackground1Pressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground1Selected | `colorNeutralBackground1Selected`} design token.
 * @public
 */
const colorNeutralBackground1Selected = 'var(--colorNeutralBackground1Selected)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackground3 | `colorNeutralBackground3`} design token.
 * @public
 */
const colorNeutralBackground3 = 'var(--colorNeutralBackground3)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundInverted | `colorNeutralBackgroundInverted`} design token.
 * @public
 */
const colorNeutralBackgroundInverted = 'var(--colorNeutralBackgroundInverted)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackground | `colorSubtleBackground`} design token.
 * @public
 */
const colorSubtleBackground = 'var(--colorSubtleBackground)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundHover | `colorSubtleBackgroundHover`} design token.
 * @public
 */
const colorSubtleBackgroundHover = 'var(--colorSubtleBackgroundHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorSubtleBackgroundPressed | `colorSubtleBackgroundPressed`} design token.
 * @public
 */
const colorSubtleBackgroundPressed = 'var(--colorSubtleBackgroundPressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackground | `colorTransparentBackground`} design token.
 * @public
 */
const colorTransparentBackground = 'var(--colorTransparentBackground)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackgroundHover | `colorTransparentBackgroundHover`} design token.
 * @public
 */
const colorTransparentBackgroundHover = 'var(--colorTransparentBackgroundHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentBackgroundPressed | `colorTransparentBackgroundPressed`} design token.
 * @public
 */
const colorTransparentBackgroundPressed = 'var(--colorTransparentBackgroundPressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralBackgroundDisabled | `colorNeutralBackgroundDisabled`} design token.
 * @public
 */
const colorNeutralBackgroundDisabled = 'var(--colorNeutralBackgroundDisabled)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackground | `colorBrandBackground`} design token.
 * @public
 */
const colorBrandBackground = 'var(--colorBrandBackground)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundHover | `colorBrandBackgroundHover`} design token.
 * @public
 */
const colorBrandBackgroundHover = 'var(--colorBrandBackgroundHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandBackgroundPressed | `colorBrandBackgroundPressed`} design token.
 * @public
 */
const colorBrandBackgroundPressed = 'var(--colorBrandBackgroundPressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandBackground | `colorCompoundBrandBackground`} design token.
 * @public
 */
const colorCompoundBrandBackground = 'var(--colorCompoundBrandBackground)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandBackgroundHover | `colorCompoundBrandBackgroundHover`} design token.
 * @public
 */
const colorCompoundBrandBackgroundHover = 'var(--colorCompoundBrandBackgroundHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandBackgroundPressed | `colorCompoundBrandBackgroundPressed`} design token.
 * @public
 */
const colorCompoundBrandBackgroundPressed = 'var(--colorCompoundBrandBackgroundPressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessible | `colorNeutralStrokeAccessible`} design token.
 * @public
 */
const colorNeutralStrokeAccessible = 'var(--colorNeutralStrokeAccessible)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessibleHover | `colorNeutralStrokeAccessibleHover`} design token.
 * @public
 */
const colorNeutralStrokeAccessibleHover = 'var(--colorNeutralStrokeAccessibleHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeAccessiblePressed | `colorNeutralStrokeAccessiblePressed`} design token.
 * @public
 */
const colorNeutralStrokeAccessiblePressed = 'var(--colorNeutralStrokeAccessiblePressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1 | `colorNeutralStroke1`} design token.
 * @public
 */
const colorNeutralStroke1 = 'var(--colorNeutralStroke1)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1Hover | `colorNeutralStroke1Hover`} design token.
 * @public
 */
const colorNeutralStroke1Hover = 'var(--colorNeutralStroke1Hover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStroke1Pressed | `colorNeutralStroke1Pressed`} design token.
 * @public
 */
const colorNeutralStroke1Pressed = 'var(--colorNeutralStroke1Pressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeOnBrand2 | `colorNeutralStrokeOnBrand2`} design token.
 * @public
 */
const colorNeutralStrokeOnBrand2 = 'var(--colorNeutralStrokeOnBrand2)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke1 | `colorBrandStroke1`} design token.
 * @public
 */
const colorBrandStroke1 = 'var(--colorBrandStroke1)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorBrandStroke2 | `colorBrandStroke2`} design token.
 * @public
 */
const colorBrandStroke2 = 'var(--colorBrandStroke2)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandStroke | `colorCompoundBrandStroke`} design token.
 * @public
 */
const colorCompoundBrandStroke = 'var(--colorCompoundBrandStroke)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandStrokeHover | `colorCompoundBrandStrokeHover`} design token.
 * @public
 */
const colorCompoundBrandStrokeHover = 'var(--colorCompoundBrandStrokeHover)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorCompoundBrandStrokePressed | `colorCompoundBrandStrokePressed`} design token.
 * @public
 */
const colorCompoundBrandStrokePressed = 'var(--colorCompoundBrandStrokePressed)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorNeutralStrokeDisabled | `colorNeutralStrokeDisabled`} design token.
 * @public
 */
const colorNeutralStrokeDisabled = 'var(--colorNeutralStrokeDisabled)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentStroke | `colorTransparentStroke`} design token.
 * @public
 */
const colorTransparentStroke = 'var(--colorTransparentStroke)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorTransparentStrokeInteractive | `colorTransparentStrokeInteractive`} design token.
 * @public
 */
const colorTransparentStrokeInteractive = 'var(--colorTransparentStrokeInteractive)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStrokeFocus1 | `colorStrokeFocus1`} design token.
 * @public
 */
const colorStrokeFocus1 = 'var(--colorStrokeFocus1)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorStrokeFocus2 | `colorStrokeFocus2`} design token.
 * @public
 */
const colorStrokeFocus2 = 'var(--colorStrokeFocus2)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedBorder2 | `colorPaletteRedBorder2`} design token.
 * @public
 */
const colorPaletteRedBorder2 = 'var(--colorPaletteRedBorder2)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#colorPaletteRedForeground1 | `colorPaletteRedForeground1`} design token.
 * @public
 */
const colorPaletteRedForeground1 = 'var(--colorPaletteRedForeground1)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusNone | `borderRadiusNone`} design token.
 * @public
 */
const borderRadiusNone = 'var(--borderRadiusNone)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusSmall | `borderRadiusSmall`} design token.
 * @public
 */
const borderRadiusSmall = 'var(--borderRadiusSmall)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusMedium | `borderRadiusMedium`} design token.
 * @public
 */
const borderRadiusMedium = 'var(--borderRadiusMedium)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusLarge | `borderRadiusLarge`} design token.
 * @public
 */
const borderRadiusLarge = 'var(--borderRadiusLarge)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#borderRadiusCircular | `borderRadiusCircular`} design token.
 * @public
 */
const borderRadiusCircular = 'var(--borderRadiusCircular)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontFamilyBase | `fontFamilyBase`} design token.
 * @public
 */
const fontFamilyBase = 'var(--fontFamilyBase)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase200 | `fontSizeBase200`} design token.
 * @public
 */
const fontSizeBase200 = 'var(--fontSizeBase200)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase300 | `fontSizeBase300`} design token.
 * @public
 */
const fontSizeBase300 = 'var(--fontSizeBase300)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase400 | `fontSizeBase400`} design token.
 * @public
 */
const fontSizeBase400 = 'var(--fontSizeBase400)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase500 | `fontSizeBase500`} design token.
 * @public
 */
const fontSizeBase500 = 'var(--fontSizeBase500)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontSizeBase600 | `fontSizeBase600`} design token.
 * @public
 */
const fontSizeBase600 = 'var(--fontSizeBase600)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontWeightRegular | `fontWeightRegular`} design token.
 * @public
 */
const fontWeightRegular = 'var(--fontWeightRegular)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#fontWeightSemibold | `fontWeightSemibold`} design token.
 * @public
 */
const fontWeightSemibold = 'var(--fontWeightSemibold)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase200 | `lineHeightBase200`} design token.
 * @public
 */
const lineHeightBase200 = 'var(--lineHeightBase200)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase300 | `lineHeightBase300`} design token.
 * @public
 */
const lineHeightBase300 = 'var(--lineHeightBase300)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase400 | `lineHeightBase400`} design token.
 * @public
 */
const lineHeightBase400 = 'var(--lineHeightBase400)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#lineHeightBase500 | `lineHeightBase500`} design token.
 * @public
 */
const lineHeightBase500 = 'var(--lineHeightBase500)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow2 | `shadow2`} design token.
 * @public
 */
const shadow2 = 'var(--shadow2)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow4 | `shadow4`} design token.
 * @public
 */
const shadow4 = 'var(--shadow4)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#shadow16 | `shadow16`} design token.
 * @public
 */
const shadow16 = 'var(--shadow16)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThin | `strokeWidthThin`} design token.
 * @public
 */
const strokeWidthThin = 'var(--strokeWidthThin)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThick | `strokeWidthThick`} design token.
 * @public
 */
const strokeWidthThick = 'var(--strokeWidthThick)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThicker | `strokeWidthThicker`} design token.
 * @public
 */
const strokeWidthThicker = 'var(--strokeWidthThicker)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#strokeWidthThickest | `strokeWidthThickest`} design token.
 * @public
 */
const strokeWidthThickest = 'var(--strokeWidthThickest)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXXS | `spacingHorizontalXXS`} design token.
 * @public
 */
const spacingHorizontalXXS = 'var(--spacingHorizontalXXS)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalXS | `spacingHorizontalXS`} design token.
 * @public
 */
const spacingHorizontalXS = 'var(--spacingHorizontalXS)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalSNudge | `spacingHorizontalSNudge`} design token.
 * @public
 */
const spacingHorizontalSNudge = 'var(--spacingHorizontalSNudge)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalS | `spacingHorizontalS`} design token.
 * @public
 */
const spacingHorizontalS = 'var(--spacingHorizontalS)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalMNudge | `spacingHorizontalMNudge`} design token.
 * @public
 */
const spacingHorizontalMNudge = 'var(--spacingHorizontalMNudge)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalM | `spacingHorizontalM`} design token.
 * @public
 */
const spacingHorizontalM = 'var(--spacingHorizontalM)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingHorizontalL | `spacingHorizontalL`} design token.
 * @public
 */
const spacingHorizontalL = 'var(--spacingHorizontalL)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXXS | `spacingVerticalXXS`} design token.
 * @public
 */
const spacingVerticalXXS = 'var(--spacingVerticalXXS)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalXS | `spacingVerticalXS`} design token.
 * @public
 */
const spacingVerticalXS = 'var(--spacingVerticalXS)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalSNudge | `spacingVerticalSNudge`} design token.
 * @public
 */
const spacingVerticalSNudge = 'var(--spacingVerticalSNudge)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalS | `spacingVerticalS`} design token.
 * @public
 */
const spacingVerticalS = 'var(--spacingVerticalS)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalM | `spacingVerticalM`} design token.
 * @public
 */
const spacingVerticalM = 'var(--spacingVerticalM)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#spacingVerticalL | `spacingVerticalL`} design token.
 * @public
 */
const spacingVerticalL = 'var(--spacingVerticalL)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#durationUltraFast | `durationUltraFast`} design token.
 * @public
 */
const durationUltraFast = 'var(--durationUltraFast)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#durationFaster | `durationFaster`} design token.
 * @public
 */
const durationFaster = 'var(--durationFaster)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#durationNormal | `durationNormal`} design token.
 * @public
 */
const durationNormal = 'var(--durationNormal)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#curveAccelerateMid | `curveAccelerateMid`} design token.
 * @public
 */
const curveAccelerateMid = 'var(--curveAccelerateMid)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#curveDecelerateMid | `curveDecelerateMid`} design token.
 * @public
 */
const curveDecelerateMid = 'var(--curveDecelerateMid)';
/**
 * CSS custom property value for the {@link @fluentui/tokens#curveEasyEase | `curveEasyEase`} design token.
 * @public
 */
const curveEasyEase = 'var(--curveEasyEase)';

const styles$e = css `
  ${display('block')}

  :host {
    max-width: fit-content;
    contain: content;
  }

  .heading {
    height: 44px;
    display: grid;
    position: relative;
    padding-inline: ${spacingHorizontalM} ${spacingHorizontalMNudge};
    border-radius: ${borderRadiusMedium};
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase300};
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase300};
    grid-template-columns: auto auto 1fr auto;
  }

  .button {
    appearance: none;
    background: ${colorTransparentBackground};
    border: none;
    box-sizing: border-box;
    color: ${colorNeutralForeground1};
    cursor: pointer;
    font: inherit;
    grid-column: auto / span 2;
    grid-row: 1;
    height: 44px;
    outline: none;
    padding: 0;
    text-align: start;
  }

  .button::before {
    content: '';
    position: absolute;
    inset: 0px;
    cursor: pointer;
    border-radius: ${borderRadiusSmall};
  }

  :where(.default-marker-collapsed, .default-marker-expanded),
  ::slotted(:is([slot='marker-collapsed'], [slot='marker-expanded'])) {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    position: relative;
    height: 100%;
    padding-inline-end: ${spacingHorizontalS};
    grid-column: 1 / span 1;
    grid-row: 1;
  }

  .content {
    margin: 0 ${spacingHorizontalM};
  }

  ::slotted([slot='start']) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: ${spacingHorizontalS};
    grid-column: 2 / span 1;
    grid-row: 1;
  }

  button:focus-visible::after {
    content: '';
    position: absolute;
    inset: 0px;
    cursor: pointer;
    border-radius: ${borderRadiusSmall};
    outline: none;
    border: 2px solid ${colorStrokeFocus1};
    box-shadow: inset 0 0 0 1px ${colorStrokeFocus2};
  }

  /* --- Disabled attr styles --- */

  :host([disabled]) .button {
    color: ${colorNeutralForegroundDisabled};
  }

  :host([disabled]) svg {
    filter: invert(89%) sepia(0%) saturate(569%) hue-rotate(155deg) brightness(88%) contrast(87%);
  }

  /* --- Expanded attr styles --- */

  :host([expanded]) .content {
    display: block;
  }

  :host([expanded]) .default-marker-collapsed,
  :host([expanded]) ::slotted([slot='marker-collapsed']),
  :host(:not([expanded])) :is(.default-marker-expanded, .content),
  :host(:not([expanded])) ::slotted([slot='marker-expanded']) {
    display: none;
  }

  :host([expanded]) ::slotted([slot='marker-expanded']),
  :host(:not([expanded])) ::slotted([slot='marker-collapsed']) {
    display: flex;
  }

  /* --- Appearance attr styles --- */

  .heading {
    font-size: ${fontSizeBase300};
    line-height: ${lineHeightBase300};
  }

  :host([size='small']) .heading {
    font-size: ${fontSizeBase200};
    line-height: ${lineHeightBase200};
  }

  :host([size='large']) .heading {
    font-size: ${fontSizeBase400};
    line-height: ${lineHeightBase400};
  }

  :host([size='extra-large']) .heading {
    font-size: ${fontSizeBase500};
    line-height: ${lineHeightBase500};
  }

  /* --- marker-position attr styles --- */

  :host([marker-position='end']) ::slotted([slot='start']) {
    grid-column: 1 / span 1;
  }

  :host([marker-position='end']) :is(.default-marker-collapsed, .default-marker-expanded) {
    grid-column: 4 / span 1;
    padding-inline-start: ${spacingHorizontalS};
    padding-inline-end: 0;
  }

  :host([marker-position='end']) .button {
    grid-column: 2 / span 3;
  }

  /* --- Block attr styles --- */

  :host([block]) {
    max-width: 100%;
  }

  :host([marker-position='end']) .heading {
    grid-template-columns: auto auto 28px;
    padding-inline: ${spacingHorizontalM};
  }

  :host([marker-position='end']:has([slot='start'])) .heading {
    padding-inline: ${spacingHorizontalMNudge} ${spacingHorizontalM};
  }

  :host([block][marker-position='end']) .heading {
    grid-template-columns: auto 1fr;
  }

  :host([marker-position='end']) :is(.default-marker-collapsed, .default-marker-expanded) {
    grid-column: 5 / span 1;
  }
`;

const FluentDesignSystem = Object.freeze({
    prefix: 'fluent',
    shadowRootMode: 'open',
    registry: customElements,
});

const chevronRight20Filled = html.partial(`<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="default-marker-collapsed"
  aria-hidden="true"
>
  <path
    d="M7.73271 4.20694C8.03263 3.92125 8.50737 3.93279 8.79306 4.23271L13.7944 9.48318C14.0703 9.77285 14.0703 10.2281 13.7944 10.5178L8.79306 15.7682C8.50737 16.0681 8.03263 16.0797 7.73271 15.794C7.43279 15.5083 7.42125 15.0336 7.70694 14.7336L12.2155 10.0005L7.70694 5.26729C7.42125 4.96737 7.43279 4.49264 7.73271 4.20694Z"
    fill="currentColor"
  />
</svg>`);
const chevronDown20Filled = html.partial(`<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="default-marker-expanded"
  aria-hidden="true"
>
  <path
    d="M15.794 7.73271C16.0797 8.03263 16.0681 8.50737 15.7682 8.79306L10.5178 13.7944C10.2281 14.0703 9.77285 14.0703 9.48318 13.7944L4.23271 8.79306C3.93279 8.50737 3.92125 8.03263 4.20694 7.73271C4.49264 7.43279 4.96737 7.42125 5.26729 7.70694L10.0005 12.2155L14.7336 7.70694C15.0336 7.42125 15.5083 7.43279 15.794 7.73271Z"
    fill="currentColor"
  />
</svg>`);
function accordionItemTemplate(options = {}) {
    return html `
    <div class="heading" part="heading" role="heading" aria-level="${x => x.headinglevel}">
      <button
        class="button"
        part="button"
        ${ref('expandbutton')}
        ?disabled="${x => (x.disabled ? 'true' : void 0)}"
        aria-expanded="${x => x.expanded}"
        aria-controls="${x => x.id}-panel"
        id="${x => x.id}"
      >
        <slot name="heading"></slot>
      </button>
      ${startSlotTemplate(options)}
      <slot name="marker-expanded"> ${staticallyCompose(options.expandedIcon)} </slot>
      <slot name="marker-collapsed"> ${staticallyCompose(options.collapsedIcon)} </slot>
    </div>
    <div class="content" part="content" id="${x => x.id}-panel" role="region" aria-labelledby="${x => x.id}">
      <slot></slot>
    </div>
  `;
}
/**
 * The template for the fluent-accordion component.
 * @public
 */
const template$f = accordionItemTemplate({
    collapsedIcon: chevronRight20Filled,
    expandedIcon: chevronDown20Filled,
});

/**
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-accordion-item\>
 */
const definition$f = AccordionItem.compose({
    name: `${FluentDesignSystem.prefix}-accordion-item`,
    template: template$f,
    styles: styles$e,
});

/**
 * Expand mode for {@link Accordion}
 * @public
 */
const AccordionExpandMode = {
    single: 'single',
    multi: 'multi',
};

/**
 * An Accordion Custom HTML Element
 * Implements {@link https://www.w3.org/TR/wai-aria-practices-1.1/#accordion | ARIA Accordion}.
 *
 * @tag fluent-accordion
 *
 * @slot - The default slot for the accordion items
 * @fires change - Fires a custom 'change' event when the active item changes
 *
 * @public
 */
class Accordion extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Controls the expand mode of the Accordion, either allowing
         * single or multiple item expansion.
         * @public
         *
         * @remarks
         * HTML attribute: expand-mode
         */
        this.expandmode = AccordionExpandMode.multi;
        this.activeItemIndex = 0;
        /**
         * Resets event listeners and sets the `accordionItems` property
         * then rebinds event listeners to each non-disabled item
         * @returns {void}
         */
        this.setItems = () => {
            if (this.slottedAccordionItems.length === 0) {
                return;
            }
            // Get all existing children and remove event listeners
            const children = Array.from(this.children);
            this.removeItemListeners(children);
            // Resubscribe to the `disabled` attribute of all children
            children.forEach((child) => Observable.getNotifier(child).subscribe(this, 'disabled'));
            // Add event listeners to each non-disabled AccordionItem
            this.accordionItems = children.filter(child => !child.hasAttribute('disabled'));
            this.accordionItems.forEach((item, index) => {
                if (item instanceof BaseAccordionItem) {
                    item.addEventListener('click', this.expandedChangedHandler);
                    // Subscribe to the expanded attribute of the item
                    Observable.getNotifier(item).subscribe(this, 'expanded');
                }
            });
            if (this.isSingleExpandMode()) {
                const expandedItem = this.findExpandedItem();
                this.setSingleExpandMode(expandedItem);
            }
        };
        /**
         * Removes event listeners from the previous accordion items
         * @param oldValue An array of the previous accordion items
         */
        this.removeItemListeners = (oldValue) => {
            oldValue.forEach((item, index) => {
                Observable.getNotifier(item).unsubscribe(this, 'disabled');
                Observable.getNotifier(item).unsubscribe(this, 'expanded');
                item.removeEventListener('click', this.expandedChangedHandler);
            });
        };
        /**
         * Changes the expanded state of the accordion item
         * @param evt Click event
         * @returns
         */
        this.expandedChangedHandler = (evt) => {
            const item = evt.target;
            if (item instanceof BaseAccordionItem) {
                if (!this.isSingleExpandMode()) {
                    item.expanded = !item.expanded;
                    // setSingleExpandMode sets activeItemIndex on its own
                    this.activeItemIndex = this.accordionItems.indexOf(item);
                }
                else {
                    this.setSingleExpandMode(item);
                }
                this.$emit('change');
            }
        };
    }
    expandmodeChanged(prev, next) {
        if (!this.$fastController.isConnected) {
            return;
        }
        const expandedItem = this.findExpandedItem();
        if (!expandedItem) {
            return;
        }
        if (next === AccordionExpandMode.single) {
            this.setSingleExpandMode(expandedItem);
            return;
        }
        // Clean up single expand mode behavior
        expandedItem?.expandbutton.removeAttribute('aria-disabled');
    }
    /**
     * @internal
     */
    slottedAccordionItemsChanged(oldValue, newValue) {
        if (this.$fastController.isConnected) {
            this.setItems();
        }
    }
    /**
     * Watch for changes to the slotted accordion items `disabled` and `expanded` attributes
     * @internal
     */
    handleChange(source, propertyName) {
        if (propertyName === 'disabled') {
            this.setItems();
        }
        else if (propertyName === 'expanded') {
            // we only need to manage single expanded instances
            // such as scenarios where a child is programatically expanded
            if (source.expanded && this.isSingleExpandMode()) {
                this.setSingleExpandMode(source);
            }
        }
    }
    /**
     * Find the first expanded item in the accordion
     * @returns {void}
     */
    findExpandedItem() {
        if (this.accordionItems.length === 0) {
            return null;
        }
        return (this.accordionItems.find((item) => item instanceof BaseAccordionItem && item.expanded) ?? this.accordionItems[0]);
    }
    /**
     * Checks if the accordion is in single expand mode
     * @returns {boolean}
     */
    isSingleExpandMode() {
        return this.expandmode === AccordionExpandMode.single;
    }
    /**
     * Controls the behavior of the accordion in single expand mode
     * @param expandedItem The item to expand in single expand mode
     * @returns {void}
     */
    setSingleExpandMode(expandedItem) {
        if (this.accordionItems.length === 0) {
            return;
        }
        const currentItems = Array.from(this.accordionItems);
        this.activeItemIndex = currentItems.indexOf(expandedItem);
        currentItems.forEach((item, index) => {
            if (item instanceof BaseAccordionItem) {
                if (this.activeItemIndex === index) {
                    item.expanded = true;
                    item.expandbutton.setAttribute('aria-disabled', 'true');
                }
                else {
                    item.expanded = false;
                    if (!item.hasAttribute('disabled')) {
                        item.expandbutton.removeAttribute('aria-disabled');
                    }
                }
            }
        });
    }
}
__decorate([
    attr({ attribute: 'expand-mode' })
], Accordion.prototype, "expandmode", void 0);
__decorate([
    observable
], Accordion.prototype, "slottedAccordionItems", void 0);

/**
 * @public
 */
function accordionTemplate() {
    return html `
    <template>
      <slot ${slotted({ property: 'slottedAccordionItems', filter: elements() })}></slot>
    </template>
  `;
}
const template$e = accordionTemplate();

const styles$d = css `
  ${display('flex')}

  :host {
    flex-direction: column;
    width: 100%;
    contain: content;
  }
`;

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-accordion\>
 */
const definition$e = Accordion.compose({
    name: `${FluentDesignSystem.prefix}-accordion`,
    template: template$e,
    styles: styles$d,
});

/**
 * ButtonAppearance constants
 * @public
 */
/**
 * Button type values.
 *
 * @public
 */
const ButtonType = {
    submit: 'submit',
    reset: 'reset'};

/**
 * A Button Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button | `<button>`} element.
 *
 * @slot start - Content which can be provided before the button content
 * @slot end - Content which can be provided after the button content
 * @slot - The default slot for button content
 * @csspart content - The button content container
 *
 * @public
 */
class BaseButton extends FASTElement {
    disabledChanged() {
        if (this.disabled) {
            this.removeAttribute('tabindex');
        }
        else {
            // If author sets tabindex to a non-positive value, the component should
            // respect it, otherwise set it to 0 to avoid the anti-pattern of setting
            // tabindex to a positive number. See details:
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
            this.tabIndex = Number(this.getAttribute('tabindex') ?? 0) < 0 ? -1 : 0;
        }
    }
    /**
     * Sets the element's internal disabled state when the element is focusable while disabled.
     *
     * @param previous - the previous disabledFocusable value
     * @param next - the current disabledFocusable value
     * @internal
     */
    disabledFocusableChanged(previous, next) {
        if (this.$fastController.isConnected) {
            this.elementInternals.ariaDisabled = `${!!next}`;
        }
    }
    /**
     * The associated form element.
     *
     * @public
     */
    get form() {
        return this.elementInternals.form;
    }
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * A reference to all associated label elements.
     *
     * @public
     */
    get labels() {
        return Object.freeze(Array.from(this.elementInternals.labels));
    }
    /**
     * Removes the form submission fallback control when the type changes.
     *
     * @param previous - the previous type value
     * @param next - the new type value
     * @internal
     */
    typeChanged(previous, next) {
        if (next !== ButtonType.submit) {
            this.formSubmissionFallbackControl?.remove();
            this.shadowRoot?.querySelector('slot[name="internal"]')?.remove();
        }
    }
    /**
     * Handles the button click event.
     *
     * @param e - The event object
     * @internal
     */
    clickHandler(e) {
        if (e && this.disabledFocusable) {
            e.stopImmediatePropagation();
            return;
        }
        this.press();
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.elementInternals.ariaDisabled = `${!!this.disabledFocusable}`;
    }
    constructor() {
        super();
        /**
         * Sets the element's disabled state.
         * @see The {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#disabled | `disabled`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `disabled`
         */
        this.disabled = false;
        /**
         * Indicates that the button is focusable while disabled.
         *
         * @public
         * @remarks
         * HTML Attribute: `disabled-focusable`
         */
        this.disabledFocusable = false;
        /**
         * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'button';
    }
    /**
     * This fallback creates a new slot, then creates a submit button to mirror the custom element's
     * properties. The submit button is then appended to the slot and the form is submitted.
     *
     * @internal
     * @privateRemarks
     * This is a workaround until {@link https://github.com/WICG/webcomponents/issues/814 | WICG/webcomponents/issues/814} is resolved.
     */
    createAndInsertFormSubmissionFallbackControl() {
        const internalSlot = this.formSubmissionFallbackControlSlot ?? document.createElement('slot');
        internalSlot.setAttribute('name', 'internal');
        this.shadowRoot?.appendChild(internalSlot);
        this.formSubmissionFallbackControlSlot = internalSlot;
        const fallbackControl = this.formSubmissionFallbackControl ?? document.createElement('button');
        fallbackControl.style.display = 'none';
        fallbackControl.setAttribute('type', 'submit');
        fallbackControl.setAttribute('slot', 'internal');
        if (this.formNoValidate) {
            fallbackControl.toggleAttribute('formnovalidate', true);
        }
        if (this.elementInternals.form?.id) {
            fallbackControl.setAttribute('form', this.elementInternals.form.id);
        }
        if (this.name) {
            fallbackControl.setAttribute('name', this.name);
        }
        if (this.value) {
            fallbackControl.setAttribute('value', this.value);
        }
        if (this.formAction) {
            fallbackControl.setAttribute('formaction', this.formAction ?? '');
        }
        if (this.formEnctype) {
            fallbackControl.setAttribute('formenctype', this.formEnctype ?? '');
        }
        if (this.formMethod) {
            fallbackControl.setAttribute('formmethod', this.formMethod ?? '');
        }
        if (this.formTarget) {
            fallbackControl.setAttribute('formtarget', this.formTarget ?? '');
        }
        this.append(fallbackControl);
        this.formSubmissionFallbackControl = fallbackControl;
    }
    /**
     * Invoked when a connected component's form or fieldset has its disabled state changed.
     *
     * @param disabled - the disabled value of the form / fieldset
     *
     * @internal
     */
    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }
    /**
     * Handles keypress events for the button.
     *
     * @param e - the keyboard event
     * @returns - the return value of the click handler
     * @public
     */
    keypressHandler(e) {
        if (e && this.disabledFocusable) {
            e.stopImmediatePropagation();
            return;
        }
        if (e.key === keyEnter || e.key === keySpace) {
            this.click();
            return;
        }
        return true;
    }
    /**
     * Presses the button.
     *
     * @public
     */
    press() {
        switch (this.type) {
            case ButtonType.reset: {
                this.resetForm();
                break;
            }
            case ButtonType.submit: {
                this.submitForm();
                break;
            }
        }
    }
    /**
     * Resets the associated form.
     *
     * @public
     */
    resetForm() {
        this.elementInternals.form?.reset();
    }
    /**
     * Submits the associated form.
     *
     * @internal
     */
    submitForm() {
        if (!this.elementInternals.form || this.disabled || this.type !== ButtonType.submit) {
            return;
        }
        // workaround: if the button doesn't have any form overrides, the form can be submitted directly.
        if (!this.name &&
            !this.formAction &&
            !this.formEnctype &&
            !this.formAttribute &&
            !this.formMethod &&
            !this.formNoValidate &&
            !this.formTarget) {
            this.elementInternals.form.requestSubmit();
            return;
        }
        try {
            this.elementInternals.setFormValue(this.value ?? '');
            this.elementInternals.form.requestSubmit(this);
        }
        catch (e) {
            // `requestSubmit` throws an error since custom elements may not be able to submit the form.
            // This fallback creates a new slot, then creates a submit button to mirror the custom element's
            // properties. The submit button is then appended to the slot and the form is submitted.
            this.createAndInsertFormSubmissionFallbackControl();
            // workaround: the form value is reset since the fallback control will handle the form submission.
            this.elementInternals.setFormValue(null);
            this.elementInternals.form.requestSubmit(this.formSubmissionFallbackControl);
        }
    }
}
__decorate([
    attr({ mode: 'boolean' })
], BaseButton.prototype, "autofocus", void 0);
__decorate([
    observable
], BaseButton.prototype, "defaultSlottedContent", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseButton.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'disabled-focusable', mode: 'boolean' })
], BaseButton.prototype, "disabledFocusable", void 0);
__decorate([
    attr({ attribute: 'formaction' })
], BaseButton.prototype, "formAction", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseButton.prototype, "formAttribute", void 0);
__decorate([
    attr({ attribute: 'formenctype' })
], BaseButton.prototype, "formEnctype", void 0);
__decorate([
    attr({ attribute: 'formmethod' })
], BaseButton.prototype, "formMethod", void 0);
__decorate([
    attr({ attribute: 'formnovalidate', mode: 'boolean' })
], BaseButton.prototype, "formNoValidate", void 0);
__decorate([
    attr({ attribute: 'formtarget' })
], BaseButton.prototype, "formTarget", void 0);
__decorate([
    attr
], BaseButton.prototype, "name", void 0);
__decorate([
    attr
], BaseButton.prototype, "type", void 0);
__decorate([
    attr
], BaseButton.prototype, "value", void 0);

/**
 * A Button Custom HTML Element.
 * Based on BaseButton and includes style and layout specific attributes
 *
 * @tag fluent-button
 *
 * @public
 */
class Button extends BaseButton {
    constructor() {
        super(...arguments);
        /**
         * Indicates that the button should only display as an icon with no text content.
         *
         * @public
         * @remarks
         * HTML Attribute: `icon-only`
         */
        this.iconOnly = false;
    }
}
__decorate([
    attr
], Button.prototype, "appearance", void 0);
__decorate([
    attr
], Button.prototype, "shape", void 0);
__decorate([
    attr
], Button.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'icon-only', mode: 'boolean' })
], Button.prototype, "iconOnly", void 0);
applyMixins(Button, StartEnd);

/**
 * @internal
 */
const baseButtonStyles = css `
  ${display('inline-flex')}

  :host {
    --icon-spacing: ${spacingHorizontalSNudge};
    position: relative;
    contain: layout style;
    vertical-align: middle;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    text-align: center;
    text-decoration-line: none;
    margin: 0;
    min-height: 32px;
    outline-style: none;
    background-color: ${colorNeutralBackground1};
    color: ${colorNeutralForeground1};
    border: ${strokeWidthThin} solid ${colorNeutralStroke1};
    padding: 0 ${spacingHorizontalM};
    min-width: 96px;
    border-radius: ${borderRadiusMedium};
    font-size: ${fontSizeBase300};
    font-family: ${fontFamilyBase};
    font-weight: ${fontWeightSemibold};
    line-height: ${lineHeightBase300};
    transition-duration: ${durationFaster};
    transition-property: background, border, color;
    transition-timing-function: ${curveEasyEase};
    cursor: pointer;
    user-select: none;
  }

  .content {
    display: inherit;
  }

  :host(:hover) {
    background-color: ${colorNeutralBackground1Hover};
    color: ${colorNeutralForeground1Hover};
    border-color: ${colorNeutralStroke1Hover};
  }

  :host(:hover:active) {
    background-color: ${colorNeutralBackground1Pressed};
    border-color: ${colorNeutralStroke1Pressed};
    color: ${colorNeutralForeground1Pressed};
    outline-style: none;
  }

  :host(:focus-visible) {
    border-color: ${colorTransparentStroke};
    outline: ${strokeWidthThick} solid ${colorTransparentStroke};
    box-shadow: ${shadow4}, 0 0 0 2px ${colorStrokeFocus2};
  }

  @media screen and (prefers-reduced-motion: reduce) {
    :host {
      transition-duration: 0.01ms;
    }
  }

  ::slotted(svg) {
    font-size: 20px;
    height: 20px;
    width: 20px;
    fill: currentColor;
  }

  ::slotted([slot='start']) {
    margin-inline-end: var(--icon-spacing);
  }

  ::slotted([slot='end']),
  [slot='end'] {
    flex-shrink: 0;
    margin-inline-start: var(--icon-spacing);
  }

  :host([icon-only]) {
    min-width: 32px;
    max-width: 32px;
  }

  :host([size='small']) {
    --icon-spacing: ${spacingHorizontalXS};
    min-height: 24px;
    min-width: 64px;
    padding: 0 ${spacingHorizontalS};
    border-radius: ${borderRadiusSmall};
    font-size: ${fontSizeBase200};
    line-height: ${lineHeightBase200};
    font-weight: ${fontWeightRegular};
  }

  :host([size='small'][icon-only]) {
    min-width: 24px;
    max-width: 24px;
  }

  :host([size='large']) {
    min-height: 40px;
    border-radius: ${borderRadiusLarge};
    padding: 0 ${spacingHorizontalL};
    font-size: ${fontSizeBase400};
    line-height: ${lineHeightBase400};
  }

  :host([size='large'][icon-only]) {
    min-width: 40px;
    max-width: 40px;
  }

  :host([size='large']) ::slotted(svg) {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  :host(:is([shape='circular'], [shape='circular']:focus-visible)) {
    border-radius: ${borderRadiusCircular};
  }

  :host(:is([shape='square'], [shape='square']:focus-visible)) {
    border-radius: ${borderRadiusNone};
  }

  :host([appearance='primary']) {
    background-color: ${colorBrandBackground};
    color: ${colorNeutralForegroundOnBrand};
    border-color: transparent;
  }

  :host([appearance='primary']:hover) {
    background-color: ${colorBrandBackgroundHover};
  }

  :host([appearance='primary']:is(:hover, :hover:active):not(:focus-visible)) {
    border-color: transparent;
  }

  :host([appearance='primary']:is(:hover, :hover:active)) {
    color: ${colorNeutralForegroundOnBrand};
  }

  :host([appearance='primary']:hover:active) {
    background-color: ${colorBrandBackgroundPressed};
  }

  :host([appearance='primary']:focus-visible) {
    border-color: ${colorNeutralForegroundOnBrand};
    box-shadow: ${shadow2}, 0 0 0 2px ${colorStrokeFocus2};
  }

  :host([appearance='outline']) {
    background-color: ${colorTransparentBackground};
  }

  :host([appearance='outline']:hover) {
    background-color: ${colorTransparentBackgroundHover};
  }

  :host([appearance='outline']:hover:active) {
    background-color: ${colorTransparentBackgroundPressed};
  }

  :host([appearance='subtle']) {
    background-color: ${colorSubtleBackground};
    color: ${colorNeutralForeground2};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover) {
    background-color: ${colorSubtleBackgroundHover};
    color: ${colorNeutralForeground2Hover};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover:active) {
    background-color: ${colorSubtleBackgroundPressed};
    color: ${colorNeutralForeground2Pressed};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover) ::slotted(svg) {
    fill: ${colorNeutralForeground2BrandHover};
  }

  :host([appearance='subtle']:hover:active) ::slotted(svg) {
    fill: ${colorNeutralForeground2BrandPressed};
  }

  :host([appearance='transparent']) {
    background-color: ${colorTransparentBackground};
    color: ${colorNeutralForeground2};
  }

  :host([appearance='transparent']:hover) {
    background-color: ${colorTransparentBackgroundHover};
    color: ${colorNeutralForeground2BrandHover};
  }

  :host([appearance='transparent']:hover:active) {
    background-color: ${colorTransparentBackgroundPressed};
    color: ${colorNeutralForeground2BrandPressed};
  }

  :host(:is([appearance='transparent'], [appearance='transparent']:is(:hover, :active))) {
    border-color: transparent;
  }
`;
/**
 * The styles for the Button component.
 *
 * @public
 */
const styles$c = css `
  ${baseButtonStyles}

  :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable])),
  :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable]):hover),
  :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable]):hover:active) {
    background-color: ${colorNeutralBackgroundDisabled};
    border-color: ${colorNeutralStrokeDisabled};
    color: ${colorNeutralForegroundDisabled};
    cursor: not-allowed;
  }

  :host([appearance='primary']:is(:disabled, [disabled-focusable])),
  :host([appearance='primary']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    border-color: transparent;
  }

  :host([appearance='outline']:is(:disabled, [disabled-focusable])),
  :host([appearance='outline']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    background-color: ${colorTransparentBackground};
  }

  :host([appearance='subtle']:is(:disabled, [disabled-focusable])),
  :host([appearance='subtle']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    background-color: ${colorTransparentBackground};
    border-color: transparent;
  }

  :host([appearance='transparent']:is(:disabled, [disabled-focusable])),
  :host([appearance='transparent']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    border-color: transparent;
    background-color: ${colorTransparentBackground};
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    :host {
      background-color: ButtonFace;
      color: ButtonText;
    }

    :host(:is(:hover, :focus-visible)) {
      border-color: Highlight !important;
    }

    :host([appearance='primary']:not(:is(:hover, :focus-visible))) {
      background-color: Highlight;
      color: HighlightText;
      forced-color-adjust: none;
    }

    :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable])) {
      background-color: ButtonFace;
      color: GrayText;
      border-color: ButtonText;
    }
  `));

/**
 * Generates a template for the Button component.
 *
 * @public
 */
function buttonTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @keypress="${(x, c) => x.keypressHandler(c.event)}"
    >
      ${startSlotTemplate(options)}
      <span class="content" part="content">
        <slot ${slotted('defaultSlottedContent')}></slot>
      </span>
      ${endSlotTemplate(options)}
    </template>
  `;
}
/**
 * The template for the Button component.
 *
 * @public
 */
const template$d = buttonTemplate();

/**
 * The definition for the Fluent Button component.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-button>`
 */
const definition$d = Button.compose({
    name: `${FluentDesignSystem.prefix}-button`,
    template: template$d,
    styles: styles$c,
});

/**
 * Map to store the state values.
 * @internal
 */
const statesMap = new Map();
/**
 * Returns a string that represents a CSS custom state selector.
 *
 * @param state - the state value.
 * @returns a string that represents a CSS state selector, or a custom attribute selector if the browser does not
 * support Custom States.
 *
 * @public
 */
function stateSelector(state) {
    return (statesMap.get(state) ??
        statesMap
            .set(state, CustomStatesSetSupported ? `:state(${state})` : `[state--${state}]`)
            .get(state));
}
/**
 * This function is used to toggle a state on the control. If the browser supports Custom States, the state is toggled
 * on the `ElementInternals.states` set. If the browser does not support Custom States, the state is toggled on the host
 * element as an attribute with the format `state--{state}`.
 *
 * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet | CustomStateSet} interface
 * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | ElementInternals} interface
 * @see The CSS {@link https://developer.mozilla.org/en-US/docs/Web/CSS/:state | `:state()`} pseudo-class
 *
 * @param elementInternals - the `ElementInternals` instance for the component
 * @param state - the state to toggle
 * @param force - force the state to be toggled on or off
 * @internal
 */
function toggleState(elementInternals, state, force) {
    if (!state || !elementInternals) {
        return;
    }
    if (!CustomStatesSetSupported) {
        elementInternals.shadowRoot.host.toggleAttribute(`state--${state}`, force);
        return;
    }
    // @ts-expect-error - Baseline 2024
    if (force ?? !elementInternals.states.has(state)) {
        // @ts-expect-error - Baseline 2024
        elementInternals.states.add(state);
        return;
    }
    // @ts-expect-error - Baseline 2024
    elementInternals.states.delete(state);
}
/**
 * A weak map to store the valid states for attributes.
 * @internal
 */
const matchingStateMap = new WeakMap();
/**
 * Check if a given attribute value is a valid state. Attribute values are often kebab-cased, so this function converts
 * the kebab-cased `state` to camelCase and checks if it exists in as a key in the `States` object.
 *
 * @param States  - the object containing valid states for the attribute
 * @param state - the state to check
 * @returns true if the state is in the States object
 * @internal
 */
function hasMatchingState(States, state) {
    if (!States || !state) {
        return false;
    }
    if (matchingStateMap.has(States)) {
        return matchingStateMap.get(States).has(state);
    }
    const stateSet = new Set(Object.values(States));
    matchingStateMap.set(States, stateSet);
    return stateSet.has(state);
}
/**
 * Swap an old state for a new state.
 *
 * @param elementInternals - the `ElementInternals` instance for the component
 * @param prev - the previous state to remove
 * @param next - the new state to add
 * @param States - the object containing valid states for the attribute
 * @param prefix - an optional prefix to add to the state
 *
 * @internal
 */
function swapStates(elementInternals, prev = '', next = '', States, prefix = '') {
    toggleState(elementInternals, `${prefix}${prev}`, false);
    if (!States || hasMatchingState(States, next)) {
        toggleState(elementInternals, `${prefix}${next}`, true);
    }
}

/**
 * The base class for a component with a toggleable checked state.
 *
 * @public
 */
class BaseCheckbox extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The initial value of the input.
         *
         * @public
         * @remarks
         * HTML Attribute: `value`
         */
        this.initialValue = 'on';
        /**
         * Tracks whether the space key was pressed down while the checkbox was focused.
         * This is used to prevent inadvertently checking a required, unchecked checkbox when the space key is pressed on a
         * submit button and field validation is triggered.
         *
         * @internal
         */
        this._keydownPressed = false;
        /**
         * Indicates that the checked state has been changed by the user.
         *
         * @internal
         */
        this.dirtyChecked = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The fallback validation message, taken from a native checkbox `<input>` element.
         *
         * @internal
         */
        this._validationFallbackMessage = '';
        /**
         * The internal value of the input.
         *
         * @internal
         */
        this._value = this.initialValue;
    }
    /**
     * The element's current checked state.
     *
     * @public
     */
    get checked() {
        Observable.track(this, 'checked');
        return !!this._checked;
    }
    set checked(next) {
        this._checked = next;
        this.setFormValue(next ? this.value : null);
        this.setValidity();
        this.setAriaChecked();
        toggleState(this.elementInternals, 'checked', next);
        Observable.notify(this, 'checked');
    }
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @internal
     */
    disabledChanged(prev, next) {
        if (this.disabled) {
            this.removeAttribute('tabindex');
        }
        else {
            // If author sets tabindex to a non-positive value, the component should
            // respect it, otherwise set it to 0 to avoid the anti-pattern of setting
            // tabindex to a positive number. See details:
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex
            this.tabIndex = Number(this.getAttribute('tabindex') ?? 0) < 0 ? -1 : 0;
        }
        this.elementInternals.ariaDisabled = this.disabled ? 'true' : 'false';
        toggleState(this.elementInternals, 'disabled', this.disabled);
    }
    /**
     * Sets the disabled state when the `disabled` attribute changes.
     *
     * @param prev - the previous value
     * @param next - the current value
     * @internal
     */
    disabledAttributeChanged(prev, next) {
        this.disabled = !!next;
    }
    /**
     * Updates the checked state when the `checked` attribute is changed, unless the checked state has been changed by the user.
     *
     * @param prev - The previous initial checked state
     * @param next - The current initial checked state
     * @internal
     */
    initialCheckedChanged(prev, next) {
        if (!this.dirtyChecked) {
            this.checked = !!next;
        }
    }
    /**
     * Sets the value of the input when the `value` attribute changes.
     *
     * @param prev - The previous initial value
     * @param next - The current initial value
     * @internal
     */
    initialValueChanged(prev, next) {
        this._value = next;
    }
    /**
     * Sets the validity of the control when the required state changes.
     *
     * @param prev - The previous required state
     * @param next - The current required state
     * @internal
     */
    requiredChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.setValidity();
            this.elementInternals.ariaRequired = this.required ? 'true' : 'false';
        }
    }
    /**
     * The associated `<form>` element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form() {
        return this.elementInternals.form;
    }
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * A reference to all associated `<label>` elements.
     *
     * @public
     */
    get labels() {
        return Object.freeze(Array.from(this.elementInternals.labels));
    }
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage() {
        if (this.elementInternals.validationMessage) {
            return this.elementInternals.validationMessage;
        }
        if (!this._validationFallbackMessage) {
            const validationMessageFallbackControl = document.createElement('input');
            validationMessageFallbackControl.type = 'checkbox';
            validationMessageFallbackControl.required = true;
            validationMessageFallbackControl.checked = false;
            this._validationFallbackMessage = validationMessageFallbackControl.validationMessage;
        }
        return this._validationFallbackMessage;
    }
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity() {
        return this.elementInternals.validity;
    }
    /**
     * The current value of the input.
     *
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this.$fastController.isConnected) {
            this.setFormValue(value);
            this.setValidity();
            Observable.notify(this, 'value');
        }
    }
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate() {
        return this.elementInternals.willValidate;
    }
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Toggles the checked state when the user clicks the element.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e) {
        if (this.disabled) {
            return;
        }
        this.dirtyChecked = true;
        const previousChecked = this.checked;
        this.toggleChecked();
        if (previousChecked !== this.checked) {
            this.$emit('change');
            this.$emit('input');
        }
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.disabled = !!this.disabledAttribute;
        this.setAriaChecked();
        this.setValidity();
    }
    /**
     * Updates the form value when a user changes the `checked` state.
     *
     * @param e - the event object
     * @internal
     */
    inputHandler(e) {
        this.setFormValue(this.value);
        this.setValidity();
        return true;
    }
    /**
     * Prevents scrolling when the user presses the space key, and sets a flag to indicate that the space key was pressed
     * down while the checkbox was focused.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e) {
        if (e.key !== ' ') {
            return true;
        }
        this._keydownPressed = true;
    }
    /**
     * Toggles the checked state when the user releases the space key.
     *
     * @param e - the event object
     * @internal
     */
    keyupHandler(e) {
        if (!this._keydownPressed || e.key !== ' ') {
            return true;
        }
        this._keydownPressed = false;
        this.click();
    }
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.checked = this.initialChecked ?? false;
        this.dirtyChecked = false;
        this.setValidity();
    }
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Sets the ARIA checked state.
     *
     * @param value - The checked state
     * @internal
     */
    setAriaChecked(value = this.checked) {
        this.elementInternals.ariaChecked = value ? 'true' : 'false';
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    /**
     * Sets a custom validity message.
     *
     * @param message - The message to set
     * @public
     */
    setCustomValidity(message) {
        this.elementInternals.setValidity({ customError: true }, message);
        this.setValidity();
    }
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected) {
            if (this.disabled || !this.required) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity({ valueMissing: !!this.required && !this.checked, ...flags }, message ?? this.validationMessage, anchor);
        }
    }
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force = !this.checked) {
        this.checked = force;
    }
}
__decorate([
    attr({ mode: 'boolean' })
], BaseCheckbox.prototype, "autofocus", void 0);
__decorate([
    observable
], BaseCheckbox.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'disabled', mode: 'boolean' })
], BaseCheckbox.prototype, "disabledAttribute", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseCheckbox.prototype, "formAttribute", void 0);
__decorate([
    attr({ attribute: 'checked', mode: 'boolean' })
], BaseCheckbox.prototype, "initialChecked", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], BaseCheckbox.prototype, "initialValue", void 0);
__decorate([
    attr
], BaseCheckbox.prototype, "name", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseCheckbox.prototype, "required", void 0);

/**
 * A Checkbox Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#checkbox | ARIA checkbox }.
 *
 * @tag fluent-checkbox
 *
 * @slot checked-indicator - The checked indicator
 * @slot indeterminate-indicator - The indeterminate indicator
 * @fires change - Emits a custom change event when the checked state changes
 * @fires input - Emits a custom input event when the checked state changes
 *
 * @public
 */
class Checkbox extends BaseCheckbox {
    /**
     * Updates the indeterminate state when the `indeterminate` property changes.
     *
     * @param prev - the indeterminate state
     * @param next - the current indeterminate state
     * @internal
     */
    indeterminateChanged(prev, next) {
        this.setAriaChecked();
        toggleState(this.elementInternals, 'indeterminate', next);
    }
    constructor() {
        super();
        this.elementInternals.role = 'checkbox';
    }
    /**
     * Sets the ARIA checked state. If the `indeterminate` flag is true, the value will be 'mixed'.
     *
     * @internal
     * @override
     */
    setAriaChecked(value = this.checked) {
        if (this.indeterminate) {
            this.elementInternals.ariaChecked = 'mixed';
            return;
        }
        super.setAriaChecked(value);
    }
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     */
    toggleChecked(force = !this.checked) {
        this.indeterminate = false;
        super.toggleChecked(force);
    }
}
__decorate([
    observable
], Checkbox.prototype, "indeterminate", void 0);
__decorate([
    attr
], Checkbox.prototype, "shape", void 0);
__decorate([
    attr
], Checkbox.prototype, "size", void 0);

/**
 * Selector for the `active` state.
 * @public
 */
stateSelector('active');
/**
 * Selector for the `bad-input` state.
 * @public
 */
const badInputState = stateSelector('bad-input');
/**
 * Selector for the `checked` state.
 * @public
 */
const checkedState = stateSelector('checked');
/**
 * Selector for the `custom-error` state.
 * @public
 */
const customErrorState = stateSelector('custom-error');
/**
 * Selector for the `description` state.
 */
stateSelector('description');
/**
 * Selector for the `disabled` state.
 * @public
 */
const disabledState = stateSelector('disabled');
/**
 * Selector for the `error` state.
 * @public
 */
stateSelector('error');
/**
 * Selector for the `flip-block` state.
 * @public
 */
stateSelector('flip-block');
/**
 * Selector for the `focus-visible` state.
 * @public
 */
const focusVisibleState = stateSelector('focus-visible');
/**
 * Selector for the `has-message` state.
 * @public
 */
stateSelector('has-message');
/**
 * Selector for the `indeterminate` state.
 * @public
 */
const indeterminateState = stateSelector('indeterminate');
/**
 * Selector for the `multiselect` state.
 * @public
 */
stateSelector('multiple');
/**
 * Selector for the `open` state.
 * @public
 */
stateSelector('open');
/**
 * Selector for the `pattern-mismatch` state.
 * @public
 */
const patternMismatchState = stateSelector('pattern-mismatch');
/**
 * Selector for the `placeholder-shown` state.
 * @public
 */
stateSelector('placeholder-shown');
/**
 * Selector for the `pressed` state.
 * @public
 */
stateSelector('pressed');
/**
 * Selector for the `range-overflow` state.
 * @public
 */
const rangeOverflowState = stateSelector('range-overflow');
/**
 * Selector for the `range-underflow` state.
 * @public
 */
const rangeUnderflowState = stateSelector('range-underflow');
/**
 * Selector for the `required` state.
 * @public
 */
const requiredState = stateSelector('required');
/**
 * Selector for the `selected` state.
 * @public
 */
stateSelector('selected');
/**
 * Selector for the `step-mismatch` state.
 * @public
 */
const stepMismatchState = stateSelector('step-mismatch');
/**
 * Selector for the `submenu` state.
 * @public
 */
const submenuState = stateSelector('submenu');
/**
 * Selector for the `too-long` state.
 * @public
 */
const tooLongState = stateSelector('too-long');
/**
 * Selector for the `too-short` state.
 * @public
 */
const tooShortState = stateSelector('too-short');
/**
 * Selector for the `type-mismatch` state.
 * @public
 */
const typeMismatchState = stateSelector('type-mismatch');
/**
 * Selector for the `user-invalid` state.
 * @public
 */
const userInvalidState = stateSelector('user-invalid');
/**
 * Selector for the `valid` state.
 * @public
 */
const validState = stateSelector('valid');
/**
 * Selector for the `value-missing` state.
 * @public
 */
const valueMissingState = stateSelector('value-missing');

/** Checkbox styles
 *
 * @public
 */
const styles$b = css `
  ${display('inline-flex')}

  :host {
    --size: 16px;
    background-color: ${colorNeutralBackground1};
    border-radius: ${borderRadiusSmall};
    border: ${strokeWidthThin} solid ${colorNeutralStrokeAccessible};
    box-sizing: border-box;
    cursor: pointer;
    position: relative;
    width: var(--size);
  }

  :host,
  .indeterminate-indicator,
  .checked-indicator {
    aspect-ratio: 1;
  }

  :host(:hover) {
    border-color: ${colorNeutralStrokeAccessibleHover};
  }

  :host(:active) {
    border-color: ${colorNeutralStrokeAccessiblePressed};
  }

  :host(${checkedState}:hover) {
    background-color: ${colorCompoundBrandBackgroundHover};
    border-color: ${colorCompoundBrandStrokeHover};
  }

  :host(${checkedState}:active) {
    background-color: ${colorCompoundBrandBackgroundPressed};
    border-color: ${colorCompoundBrandStrokePressed};
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:not([slot='input']))::after {
    content: '';
    position: absolute;
    inset: -8px;
    box-sizing: border-box;
    outline: none;
    border: ${strokeWidthThick} solid ${colorTransparentStroke};
    border-radius: ${borderRadiusMedium};
  }

  :host(:not([slot='input']):focus-visible)::after {
    border-color: ${colorStrokeFocus2};
  }

  .indeterminate-indicator,
  .checked-indicator {
    color: ${colorNeutralForegroundInverted};
    inset: 0;
    margin: auto;
    position: absolute;
  }

  ::slotted([slot='checked-indicator']),
  .checked-indicator {
    fill: currentColor;
    display: inline-flex;
    flex: 1 0 auto;
    width: 12px;
  }

  :host(:not(${checkedState})) *:is(::slotted([slot='checked-indicator']), .checked-indicator) {
    display: none;
  }

  :host(${checkedState}),
  :host(${indeterminateState}) {
    border-color: ${colorCompoundBrandStroke};
  }

  :host(${checkedState}),
  :host(${indeterminateState}) .indeterminate-indicator {
    background-color: ${colorCompoundBrandBackground};
  }

  :host(${indeterminateState}) .indeterminate-indicator {
    border-radius: ${borderRadiusSmall};
    position: absolute;
    width: calc(var(--size) / 2);
    inset: 0;
  }

  :host([size='large']) {
    --size: 20px;
  }

  :host([size='large']) ::slotted([slot='checked-indicator']),
  :host([size='large']) .checked-indicator {
    width: 16px;
  }

  :host([shape='circular']),
  :host([shape='circular']) .indeterminate-indicator {
    border-radius: ${borderRadiusCircular};
  }

  :host([disabled]),
  :host([disabled]${checkedState}) {
    background-color: ${colorNeutralBackgroundDisabled};
    border-color: ${colorNeutralStrokeDisabled};
  }

  :host([disabled]) {
    cursor: unset;
  }

  :host([disabled]${indeterminateState}) .indeterminate-indicator {
    background-color: ${colorNeutralStrokeDisabled};
  }

  :host([disabled]${checkedState}) .checked-indicator {
    color: ${colorNeutralStrokeDisabled};
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    :host {
      border-color: FieldText;
    }

    :host(:not([slot='input']:focus-visible))::after {
      border-color: Canvas;
    }

    :host(:not([disabled]):hover),
    :host(${checkedState}:not([disabled]):hover),
    :host(:not([slot='input']):focus-visible)::after {
      border-color: Highlight;
    }

    .indeterminate-indicator,
    .checked-indicator {
      color: HighlightText;
    }

    :host(${checkedState}),
    :host(${indeterminateState}) .indeterminate-indicator {
      background-color: FieldText;
    }

    :host(${checkedState}:not([disabled]):hover),
    :host(${indeterminateState}:not([disabled]):hover) .indeterminate-indicator {
      background-color: Highlight;
    }

    :host([disabled]) {
      border-color: GrayText;
    }

    :host([disabled]${indeterminateState}) .indeterminate-indicator {
      background-color: GrayText;
    }

    :host([disabled]),
    :host([disabled]${checkedState}) .checked-indicator {
      color: GrayText;
    }
  `));

const checkedIndicator$1 = html.partial(/* html */ `
    <svg
        fill="currentColor"
        aria-hidden="true"
        class="checked-indicator"
        width="1em"
        height="1em"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg">
            <path d="M9.76 3.2c.3.29.32.76.04 1.06l-4.25 4.5a.75.75 0 0 1-1.08.02L2.22 6.53a.75.75 0 0 1 1.06-1.06l1.7 1.7L8.7 3.24a.75.75 0 0 1 1.06-.04Z" fill="currentColor"></path>
    </svg>
`);
const indeterminateIndicator = html.partial(/* html */ `
    <span class="indeterminate-indicator"></span>
`);
/**
 * Template for the Checkbox component
 * @public
 */
function checkboxTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @input="${(x, c) => x.inputHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
      @keyup="${(x, c) => x.keyupHandler(c.event)}"
    >
      <slot name="checked-indicator">${staticallyCompose(options.checkedIndicator)}</slot>
      <slot name="indeterminate-indicator">${staticallyCompose(options.indeterminateIndicator)}</slot>
    </template>
  `;
}
/**
 * Template for the Checkbox component
 * @public
 */
const template$c = checkboxTemplate({
    checkedIndicator: checkedIndicator$1,
    indeterminateIndicator,
});

/**
 * The Fluent Checkbox Element
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-checkbox\>
 */
const definition$c = Checkbox.compose({
    name: `${FluentDesignSystem.prefix}-checkbox`,
    template: template$c,
    styles: styles$b,
});

/**
 * Label position values
 * @public
 */
const LabelPosition = {
    above: 'above'};
/**
 * Synthetic type for slotted message elements
 * @public
 */
const ValidationFlags = {
    badInput: 'bad-input',
    customError: 'custom-error',
    patternMismatch: 'pattern-mismatch',
    rangeOverflow: 'range-overflow',
    rangeUnderflow: 'range-underflow',
    stepMismatch: 'step-mismatch',
    tooLong: 'too-long',
    tooShort: 'too-short',
    typeMismatch: 'type-mismatch',
    valueMissing: 'value-missing',
    valid: 'valid',
};

/**
 * A Field Custom HTML Element.
 *
 * @public
 */
class BaseField extends FASTElement {
    /**
     * Updates attributes on the slotted label elements.
     *
     * @param prev - the previous list of slotted label elements
     * @param next - the current list of slotted label elements
     */
    labelSlotChanged(prev, next) {
        if (next && this.input) {
            this.setLabelProperties();
            this.setStates();
        }
    }
    /**
     * Adds or removes the `invalid` event listener based on the presence of slotted message elements.
     *
     * @param prev - the previous list of slotted message elements
     * @param next - the current list of slotted message elements
     * @internal
     */
    messageSlotChanged(prev, next) {
        toggleState(this.elementInternals, 'has-message', !!next.length);
    }
    /**
     * Sets the `input` property to the first slotted input.
     *
     * @param prev - The previous collection of inputs.
     * @param next - The current collection of inputs.
     * @internal
     */
    slottedInputsChanged(prev, next) {
        if (next?.length) {
            this.input = next?.[0];
            this.setStates();
        }
    }
    /**
     * Updates the field's states and label properties when the assigned input changes.
     *
     * @param prev - the previous input
     * @param next - the current input
     */
    inputChanged(prev, next) {
        if (next) {
            this.setStates();
            this.setLabelProperties();
        }
    }
    /**
     * Calls the `setStates` method when a `change` event is emitted from the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    changeHandler(e) {
        this.setStates();
        this.setValidationStates();
        return true;
    }
    /**
     * Redirects `click` events to the slotted input.
     *
     * @param e - the event object
     * @internal
     */
    clickHandler(e) {
        if (this === e.target) {
            this.input.click();
        }
        return true;
    }
    constructor() {
        super();
        /**
         * The slotted label elements.
         *
         * @internal
         */
        this.labelSlot = [];
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'presentation';
    }
    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('invalid', this.invalidHandler, { capture: true });
    }
    disconnectedCallback() {
        this.removeEventListener('invalid', this.invalidHandler, { capture: true });
        super.disconnectedCallback();
    }
    /**
     * Applies the `focus-visible` state to the element when the slotted input receives visible focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e) {
        if (this.matches(':focus-within:has(> :focus-visible)')) {
            toggleState(this.elementInternals, 'focus-visible', true);
        }
        return true;
    }
    /**
     * Removes the `focus-visible` state from the field when a slotted input loses focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusoutHandler(e) {
        toggleState(this.elementInternals, 'focus-visible', false);
        return true;
    }
    /**
     * Toggles validity state flags on the element when the slotted input emits an `invalid` event (if slotted validation messages are present).
     *
     * @param e - the event object
     * @internal
     */
    invalidHandler(e) {
        if (this.messageSlot.length) {
            e.preventDefault();
        }
        this.setValidationStates();
    }
    /**
     * Sets ARIA and form-related attributes on slotted label elements.
     *
     * @internal
     */
    setLabelProperties() {
        if (this.$fastController.isConnected) {
            this.input.id = this.input.id || uniqueId('input');
            this.labelSlot?.forEach(label => {
                if (label instanceof HTMLLabelElement) {
                    label.htmlFor = label.htmlFor || this.input.id;
                    label.id = label.id || `${this.input.id}--label`;
                    label.setAttribute('aria-hidden', 'true');
                    this.input.setAttribute('aria-labelledby', label.id);
                }
            });
        }
    }
    /**
     * Toggles the field's states based on the slotted input.
     *
     * @internal
     */
    setStates() {
        if (this.elementInternals && this.input) {
            toggleState(this.elementInternals, 'disabled', !!this.input.disabled);
            toggleState(this.elementInternals, 'readonly', !!this.input.readOnly);
            toggleState(this.elementInternals, 'required', !!this.input.required);
            toggleState(this.elementInternals, 'checked', !!this.input.checked);
        }
    }
    setValidationStates() {
        if (!this.input.validity) {
            return;
        }
        for (const [flag, value] of Object.entries(ValidationFlags)) {
            toggleState(this.elementInternals, value, this.input.validity[flag]);
        }
    }
}
__decorate([
    observable
], BaseField.prototype, "labelSlot", void 0);
__decorate([
    observable
], BaseField.prototype, "messageSlot", void 0);
__decorate([
    observable
], BaseField.prototype, "slottedInputs", void 0);
__decorate([
    observable
], BaseField.prototype, "input", void 0);

/**
 * A Field Custom HTML Element.
 * Based on BaseField and includes style and layout specific attributes
 *
 * @tag fluent-field
 *
 * @public
 */
class Field extends BaseField {
    constructor() {
        super(...arguments);
        /**
         * The position of the label relative to the input.
         *
         * @public
         * @remarks
         * HTML Attribute: `label-position`
         */
        this.labelPosition = LabelPosition.above;
    }
}
__decorate([
    attr({ attribute: 'label-position' })
], Field.prototype, "labelPosition", void 0);

/**
 * The styles for the {@link Field} component.
 *
 * @public
 */
const styles$a = css `
  ${display('inline-grid')}

  :host {
    color: ${colorNeutralForeground1};
    align-items: center;
    gap: 0 ${spacingHorizontalM};
    justify-items: start;
  }

  :has([slot='message']) {
    color: ${colorNeutralForeground1};
    row-gap: ${spacingVerticalS};
  }

  :not(::slotted([slot='label'])) {
    gap: 0;
  }

  :host([label-position='before']) {
    grid-template-areas: 'label input' 'label message';
  }

  :host([label-position='after']) {
    gap: 0;
    grid-template-areas: 'input label' 'message message';
    grid-template-columns: auto 1fr;
  }

  :host([label-position='after']) ::slotted([slot='input']) {
    margin-inline-end: ${spacingHorizontalM};
  }

  :host([label-position='above']) {
    grid-template-areas: 'label' 'input' 'message';
    row-gap: ${spacingVerticalXXS};
  }

  :host([label-position='below']) {
    grid-template-areas: 'input' 'label' 'message';
    justify-items: center;
  }

  :host([label-position='below']) ::slotted([slot='label']) {
    margin-block-start: ${spacingVerticalM};
  }

  :host(${requiredState}) ::slotted([slot='label'])::after {
    content: '*' / '';
    color: ${colorPaletteRedForeground1};
    margin-inline-start: ${spacingHorizontalXS};
  }

  ::slotted([slot='input']) {
    grid-area: input;
  }

  ::slotted([slot='message']) {
    color: ${colorNeutralForeground3};
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase200};
    font-weight: ${fontWeightRegular};
    grid-area: message;
    line-height: ${lineHeightBase200};
    margin-block-start: ${spacingVerticalXXS};
  }

  :host(${focusVisibleState}:focus-within) {
    border-radius: ${borderRadiusMedium};
    outline: ${strokeWidthThick} solid ${colorStrokeFocus2};
  }

  ::slotted(label),
  ::slotted([slot='label']) {
    cursor: inherit;
    display: inline-flex;
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase300};
    font-weight: ${fontWeightRegular};
    grid-area: label;
    line-height: ${lineHeightBase300};
    justify-self: stretch;
    user-select: none;
  }

  :host([size='small']) ::slotted(label) {
    font-size: ${fontSizeBase200};
    line-height: ${lineHeightBase200};
  }

  :host([size='large']) ::slotted(label) {
    font-size: ${fontSizeBase400};
    line-height: ${lineHeightBase400};
  }

  :host([size='large']) ::slotted(label),
  :host([weight='semibold']) ::slotted(label) {
    font-weight: ${fontWeightSemibold};
  }

  :host(${disabledState}) {
    cursor: default;
  }

  ::slotted([flag]) {
    display: none;
  }

  :host(${badInputState}) ::slotted([flag='${ValidationFlags.badInput}']),
  :host(${customErrorState}) ::slotted([flag='${ValidationFlags.customError}']),
  :host(${patternMismatchState}) ::slotted([flag='${ValidationFlags.patternMismatch}']),
  :host(${rangeOverflowState}) ::slotted([flag='${ValidationFlags.rangeOverflow}']),
  :host(${rangeUnderflowState}) ::slotted([flag='${ValidationFlags.rangeUnderflow}']),
  :host(${stepMismatchState}) ::slotted([flag='${ValidationFlags.stepMismatch}']),
  :host(${tooLongState}) ::slotted([flag='${ValidationFlags.tooLong}']),
  :host(${tooShortState}) ::slotted([flag='${ValidationFlags.tooShort}']),
  :host(${typeMismatchState}) ::slotted([flag='${ValidationFlags.typeMismatch}']),
  :host(${valueMissingState}) ::slotted([flag='${ValidationFlags.valueMissing}']),
  :host(${validState}) ::slotted([flag='${ValidationFlags.valid}']) {
    display: block;
  }
`;

/**
 * Template for the Field component
 * @public
 */
const template$b = html `
  <template
    @click="${(x, c) => x.clickHandler(c.event)}"
    @change="${(x, c) => x.changeHandler(c.event)}"
    @focusin="${(x, c) => x.focusinHandler(c.event)}"
    @focusout="${(x, c) => x.focusoutHandler(c.event)}"
    ${children({
    property: 'slottedInputs',
    attributes: true,
    attributeFilter: ['disabled', 'required', 'readonly'],
    subtree: true,
    selector: '[slot="input"]',
    filter: elements(),
})}
  >
    <slot name="label" part="label" ${slotted('labelSlot')}></slot>
    <slot name="input" part="input"></slot>
    <slot name="message" part="message" ${slotted({ property: 'messageSlot', filter: elements('[flag]') })}></slot>
  </template>
`;

/**
 * The Fluent Field Element
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-field>`
 */
const definition$b = Field.compose({
    name: `${FluentDesignSystem.prefix}-field`,
    template: template$b,
    styles: styles$a,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * The base class used for constructing a fluent-label custom element
 *
 * @tag fluent-label
 *
 * @public
 */
class Label extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * 	Specifies styles for label when associated input is disabled
         *
         * @public
         * @remarks
         * HTML Attribute: disabled
         */
        this.disabled = false;
        /**
         * 	Specifies styles for label when associated input is a required field
         *
         * @public
         * @remarks
         * HTML Attribute: required
         */
        this.required = false;
    }
}
__decorate([
    attr
], Label.prototype, "size", void 0);
__decorate([
    attr
], Label.prototype, "weight", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Label.prototype, "disabled", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Label.prototype, "required", void 0);

/** Label styles
 * @public
 */
const styles$9 = css `
  ${display('inline-flex')}

  :host {
    color: ${colorNeutralForeground1};
    cursor: pointer;
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase300};
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase300};
    user-select: none;
  }

  .asterisk {
    color: ${colorPaletteRedForeground1};
    margin-inline-start: ${spacingHorizontalXS};
  }

  :host([size='small']) {
    font-size: ${fontSizeBase200};
    line-height: ${lineHeightBase200};
  }

  :host([size='large']) {
    font-size: ${fontSizeBase400};
    line-height: ${lineHeightBase400};
  }

  :host(:is([size='large'], [weight='semibold'])) {
    font-weight: ${fontWeightSemibold};
  }

  :host([disabled]),
  :host([disabled]) .asterisk {
    color: ${colorNeutralForegroundDisabled};
  }
`;

/**
 * The template for the Fluent label web-component.
 * @public
 */
function labelTemplate() {
    return html `
    <slot></slot>
    <span part="asterisk" class="asterisk" aria-hidden="true" ?hidden="${x => !x.required}">*</span>
  `;
}
const template$a = labelTemplate();

/**
 * The Fluent Label Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-label\>
 */
const definition$a = Label.compose({
    name: `${FluentDesignSystem.prefix}-label`,
    template: template$a,
    styles: styles$9,
});

/**
 * The base class used for constructing a fluent-menu-button custom element
 *
 * @tag fluent-menu-button
 *
 * @public
 */
class MenuButton extends Button {
}

/**
 * The template for the Button component.
 * @public
 */
const template$9 = buttonTemplate({
    end: html.partial(/* html */ `
    <svg slot="end" fill="currentColor" aria-hidden="true" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z" fill="currentColor"></path>
    </svg>
  `),
});

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-button\>
 */
const definition$9 = MenuButton.compose({
    name: `${FluentDesignSystem.prefix}-menu-button`,
    template: template$9,
    styles: styles$c,
});

/**
 * Menu items roles.
 * @public
 */
const MenuItemRole = {
    /**
     * The menu item has a "menuitem" role
     */
    menuitem: 'menuitem',
    /**
     * The menu item has a "menuitemcheckbox" role
     */
    menuitemcheckbox: 'menuitemcheckbox',
    /**
     * The menu item has a "menuitemradio" role
     */
    menuitemradio: 'menuitemradio',
};
/**
 * @internal
 */
({
    [MenuItemRole.menuitem]: 'menuitem',
    [MenuItemRole.menuitemcheckbox]: 'menuitemcheckbox',
    [MenuItemRole.menuitemradio]: 'menuitemradio',
});

/**
 * A Switch Custom HTML Element.
 * Implements {@link https://www.w3.org/TR/wai-aria-1.1/#menuitem | ARIA menuitem }, {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox | ARIA menuitemcheckbox}, or {@link https://www.w3.org/TR/wai-aria-1.1/#menuitemradio | ARIA menuitemradio }.
 *
 * @tag fluent-menu-item
 *
 * @slot indicator - The checkbox or radio indicator
 * @slot start - Content which can be provided before the menu item content
 * @slot - The default slot for menu item content
 * @slot end - Content which can be provided after the menu item content
 * @slot submenu-glyph - The submenu expand/collapse indicator
 * @slot submenu - Used to nest menu's within menu items
 * @csspart content - The element wrapping the menu item content
 * @fires change - Fires a custom 'change' event when a non-submenu item with a role of `menuitemcheckbox`, `menuitemradio`, or `menuitem` is invoked
 *
 * @public
 */
class MenuItem extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The role of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: role
         */
        this.role = MenuItemRole.menuitem;
        /**
         * The checked value of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: checked
         */
        this.checked = false;
        /**
         * @internal
         */
        this.handleMenuItemKeyDown = (e) => {
            if (e.defaultPrevented) {
                return false;
            }
            switch (e.key) {
                case keyEnter:
                case keySpace:
                    this.invoke();
                    return false;
                case keyArrowRight:
                    //open/focus on submenu
                    if (!this.disabled) {
                        this.submenu?.togglePopover(true);
                        this.submenu?.focus();
                    }
                    return false;
                case keyArrowLeft:
                    //close submenu
                    if (this.parentElement?.hasAttribute('popover')) {
                        this.parentElement.togglePopover(false);
                        // focus the menu item containing the submenu
                        this.parentElement.parentElement?.focus();
                    }
                    return false;
            }
            return true;
        };
        /**
         * @internal
         */
        this.handleMenuItemClick = (e) => {
            if (e.defaultPrevented || this.disabled) {
                return false;
            }
            this.invoke();
            return false;
        };
        /**
         * @internal
         */
        this.handleMouseOver = (e) => {
            if (this.disabled) {
                return false;
            }
            this.submenu?.togglePopover(true);
            return false;
        };
        /**
         * @internal
         */
        this.handleMouseOut = (e) => {
            if (this.contains(document.activeElement)) {
                return false;
            }
            this.submenu?.togglePopover(false);
            return false;
        };
        /**
         * Setup required ARIA on open/close
         * @internal
         */
        this.toggleHandler = (e) => {
            if (e instanceof ToggleEvent && e.newState === 'open') {
                this.setAttribute('tabindex', '-1');
                this.elementInternals.ariaExpanded = 'true';
                this.setSubmenuPosition();
            }
            if (e instanceof ToggleEvent && e.newState === 'closed') {
                this.elementInternals.ariaExpanded = 'false';
                this.setAttribute('tabindex', '0');
            }
        };
        /**
         * @internal
         */
        this.invoke = () => {
            if (this.disabled) {
                return;
            }
            switch (this.role) {
                case MenuItemRole.menuitemcheckbox:
                    this.checked = !this.checked;
                    break;
                case MenuItemRole.menuitem:
                    if (!!this.submenu) {
                        this.submenu.togglePopover(true);
                        this.submenu.focus();
                        break;
                    }
                    this.$emit('change');
                    break;
                case MenuItemRole.menuitemradio:
                    if (!this.checked) {
                        this.checked = true;
                    }
                    break;
            }
        };
        /**
         * Set fallback position of menu on open when CSS anchor not supported
         * @internal
         */
        this.setSubmenuPosition = () => {
            if (!CSS.supports('anchor-name', '--anchor') && !!this.submenu) {
                const thisRect = this.getBoundingClientRect();
                const thisSubmenuRect = this.submenu.getBoundingClientRect();
                const inlineEnd = getComputedStyle(this).direction === 'ltr' ? 'right' : 'left';
                // If an open submenu is too wide for the viewport, move it above.
                if (thisRect.width + thisSubmenuRect.width > window.innerWidth * 0.75) {
                    this.submenu.style.translate = '0 -100%';
                    return;
                }
                // If the open submenu is overflows the inline-end of the window (e.g. justify-content: end),
                // move to inline-start of menu item
                if (thisRect[inlineEnd] + thisSubmenuRect.width > window.innerWidth) {
                    this.submenu.style.translate = '-100% 0';
                    return;
                }
                // Default to inline-end of menu item
                this.submenu.style.translate = `${thisRect.width - 8}px 0`;
            }
        };
    }
    /**
     * Handles changes to disabled attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    disabledChanged(prev, next) {
        this.elementInternals.ariaDisabled = !!next ? `${next}` : null;
        toggleState(this.elementInternals, 'disabled', next);
    }
    /**
     * Handles changes to role attribute element internals properties
     * @param prev - the previous state
     * @param next - the next state
     */
    roleChanged(prev, next) {
        this.elementInternals.role = next ?? MenuItemRole.menuitem;
    }
    /**
     * Handles changes to checked attribute custom states and element internals
     * @param prev - the previous state
     * @param next - the next state
     */
    checkedChanged(prev, next) {
        const checkableMenuItem = this.role !== MenuItemRole.menuitem;
        this.elementInternals.ariaChecked = checkableMenuItem ? `${!!next}` : null;
        toggleState(this.elementInternals, 'checked', checkableMenuItem ? next : false);
        if (this.$fastController.isConnected) {
            this.$emit('change', next, { bubbles: true });
        }
    }
    /**
     * Sets the submenu and updates its position.
     *
     * @internal
     */
    slottedSubmenuChanged(prev, next) {
        this.submenu?.removeEventListener('toggle', this.toggleHandler);
        if (next.length) {
            this.submenu = next[0];
            this.submenu.toggleAttribute('popover', true);
            this.submenu.addEventListener('toggle', this.toggleHandler);
            this.elementInternals.ariaHasPopup = 'menu';
            toggleState(this.elementInternals, 'submenu', true);
        }
        else {
            this.elementInternals.ariaHasPopup = null;
            toggleState(this.elementInternals, 'submenu', false);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.elementInternals.role = this.role ?? MenuItemRole.menuitem;
        this.elementInternals.ariaChecked = this.role !== MenuItemRole.menuitem ? `${!!this.checked}` : null;
    }
}
__decorate([
    attr({ mode: 'boolean' })
], MenuItem.prototype, "disabled", void 0);
__decorate([
    attr
], MenuItem.prototype, "role", void 0);
__decorate([
    attr({ mode: 'boolean' })
], MenuItem.prototype, "checked", void 0);
__decorate([
    attr({ mode: 'boolean' })
], MenuItem.prototype, "hidden", void 0);
__decorate([
    observable
], MenuItem.prototype, "slottedSubmenu", void 0);
__decorate([
    observable
], MenuItem.prototype, "submenu", void 0);
applyMixins(MenuItem, StartEnd);

/** MenuItem styles
 * @public
 */
const styles$8 = css `
  ${display('grid')}

  :host {
    --indent: 0;
    align-items: center;
    background: ${colorNeutralBackground1};
    border-radius: ${borderRadiusMedium};
    color: ${colorNeutralForeground2};
    contain: layout;
    cursor: pointer;
    /* Prevent shrinking of MenuItems when max-height is applied to MenuList */
    flex-shrink: 0;
    font: ${fontWeightRegular} ${fontSizeBase300} / ${lineHeightBase300} ${fontFamilyBase};
    grid-gap: 4px;
    grid-template-columns: 20px 20px auto 20px;
    height: 32px;
    overflow: visible;
    padding: 0 10px;
  }

  :host(:hover) {
    background: ${colorNeutralBackground1Hover};
    color: ${colorNeutralForeground2Hover};
  }

  :host(:active) {
    background-color: ${colorNeutralBackground1Selected};
    color: ${colorNeutralForeground2Pressed};
  }

  :host(:active) ::slotted([slot='start']) {
    color: ${colorCompoundBrandForeground1Pressed};
  }

  :host(${disabledState}) {
    background-color: ${colorNeutralBackgroundDisabled};
    color: ${colorNeutralForegroundDisabled};
  }

  :host(${disabledState}) ::slotted([slot='start']),
  :host(${disabledState}) ::slotted([slot='end']) {
    color: ${colorNeutralForegroundDisabled};
  }

  :host(:focus-visible) {
    border-radius: ${borderRadiusMedium};
    outline: 2px solid ${colorStrokeFocus2};
  }

  .content {
    white-space: nowrap;
    flex-grow: 1;
    grid-column: auto / span 2;
    padding: 0 2px;
  }

  :host(:not(${checkedState})) .indicator,
  :host(:not(${checkedState})) ::slotted([slot='indicator']),
  :host(:not(${submenuState})) .submenu-glyph,
  :host(:not(${submenuState})) ::slotted([slot='submenu-glyph']) {
    display: none;
  }

  ::slotted([slot='end']) {
    color: ${colorNeutralForeground3};
    font: ${fontWeightRegular} ${fontSizeBase200} / ${lineHeightBase200} ${fontFamilyBase};
    white-space: nowrap;
  }

  :host([data-indent='1']) {
    --indent: 1;
  }

  :host([data-indent='2']) {
    --indent: 2;
    grid-template-columns: 20px 20px auto auto;
  }

  :host(${submenuState}) {
    grid-template-columns: 20px auto auto 20px;
  }

  :host([data-indent='2']${submenuState}) {
    grid-template-columns: 20px 20px auto auto 20px;
  }

  .indicator,
  ::slotted([slot='indicator']) {
    grid-column: 1 / span 1;
    width: 20px;
  }

  ::slotted([slot='start']) {
    display: inline-flex;
    grid-column: calc(var(--indent)) / span 1;
  }

  .content {
    grid-column: calc(var(--indent) + 1) / span 1;
  }

  ::slotted([slot='end']) {
    grid-column: calc(var(--indent) + 2) / span 1;
    justify-self: end;
  }

  .submenu-glyph,
  ::slotted([slot='submenu-glyph']) {
    grid-column: -2 / span 1;
    justify-self: end;
  }

  @layer popover {
    :host {
      anchor-name: --menu-trigger;
      position: relative;
    }

    ::slotted([popover]) {
      margin: 0;
      max-height: var(--menu-max-height, auto);
      position: absolute;
      position-anchor: --menu-trigger;
      position-area: inline-end span-block-end;
      position-try-fallbacks: flip-inline, block-start, block-end;
      z-index: 1;
    }

    ::slotted([popover]:not(:popover-open)) {
      display: none;
    }

    ::slotted([popover]:popover-open) {
      inset: unset;
    }

    /* Fallback for no anchor-positioning */
    @supports not (anchor-name: --menu-trigger) {
      ::slotted([popover]) {
        align-self: start;
      }
    }
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    :host(${disabledState}),
    :host(${disabledState}) ::slotted([slot='start']),
    :host(${disabledState}) ::slotted([slot='end']) {
      color: GrayText;
    }
  `));

const Checkmark16Filled = html.partial(`<svg class="indicator" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.05 3.49c.28.3.27.77-.04 1.06l-7.93 7.47A.85.85 0 014.9 12L2.22 9.28a.75.75 0 111.06-1.06l2.24 2.27 7.47-7.04a.75.75 0 011.06.04z" fill="currentColor"></path></svg>`);
const chevronRight16Filled = html.partial(`<svg class="submenu-glyph" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.74 3.2a.75.75 0 00-.04 1.06L9.23 8 5.7 11.74a.75.75 0 101.1 1.02l4-4.25a.75.75 0 000-1.02l-4-4.25a.75.75 0 00-1.06-.04z" fill="currentColor"></path></svg>`);
function menuItemTemplate(options = {}) {
    return html `
    <template
      @keydown="${(x, c) => x.handleMenuItemKeyDown(c.event)}"
      @click="${(x, c) => x.handleMenuItemClick(c.event)}"
      @mouseover="${(x, c) => x.handleMouseOver(c.event)}"
      @mouseout="${(x, c) => x.handleMouseOut(c.event)}"
      @toggle="${(x, c) => x.toggleHandler(c.event)}"
    >
      <slot name="indicator"> ${staticallyCompose(options.indicator)} </slot>
      ${startSlotTemplate(options)}
      <div part="content" class="content">
        <slot></slot>
      </div>
      ${endSlotTemplate(options)}
      <slot name="submenu-glyph"> ${staticallyCompose(options.submenuGlyph)} </slot>
      <slot name="submenu" ${slotted({ property: 'slottedSubmenu' })}></slot>
    </template>
  `;
}
const template$8 = menuItemTemplate({
    indicator: Checkmark16Filled,
    submenuGlyph: chevronRight16Filled,
});

/**
 * @public
 * @remarks
 * HTML Element: <fluent-menu-item>
 */
const definition$8 = MenuItem.compose({
    name: `${FluentDesignSystem.prefix}-menu-item`,
    template: template$8,
    styles: styles$8,
});

/**
 * A Menu Custom HTML Element.
 * Implements the {@link https://www.w3.org/TR/wai-aria-1.1/#menu | ARIA menu }.
 *
 * @tag fluent-menu-list
 *
 * @slot - The default slot for the menu items
 *
 * @public
 */
class MenuList extends FASTElement {
    itemsChanged(oldValue, newValue) {
        // only update children after the component is connected and
        // the setItems has run on connectedCallback
        // (menuItems is undefined until then)
        if (this.$fastController.isConnected && this.menuItems !== undefined) {
            this.setItems();
        }
    }
    static { this.focusableElementRoles = MenuItemRole; }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * The index of the focusable element in the items array
         * defaults to -1
         */
        this.focusIndex = -1;
        /**
         * @internal
         */
        this.isNestedMenu = () => {
            return (this.parentElement !== null &&
                isHTMLElement(this.parentElement) &&
                this.parentElement.getAttribute('role') === 'menuitem');
        };
        /**
         * if focus is moving out of the menu, reset to a stable initial state
         * @internal
         */
        this.handleFocusOut = (e) => {
            if (!this.contains(e.relatedTarget) && this.menuItems !== undefined) {
                // find our first focusable element
                const focusIndex = this.menuItems.findIndex(this.isFocusableElement);
                // set the current focus index's tabindex to -1
                this.menuItems[this.focusIndex].setAttribute('tabindex', '-1');
                // set the first focusable element tabindex to 0
                this.menuItems[focusIndex].setAttribute('tabindex', '0');
                // set the focus index
                this.focusIndex = focusIndex;
            }
        };
        this.handleItemFocus = (e) => {
            const targetItem = e.target;
            if (this.menuItems !== undefined && targetItem !== this.menuItems[this.focusIndex]) {
                this.menuItems[this.focusIndex].setAttribute('tabindex', '-1');
                this.focusIndex = this.menuItems.indexOf(targetItem);
                targetItem.setAttribute('tabindex', '0');
            }
        };
        /**
         * Handle change from child MenuItem element and set radio group behavior
         */
        this.changedMenuItemHandler = (e) => {
            if (this.menuItems === undefined) {
                return;
            }
            const changedMenuItem = e.target;
            const changeItemIndex = this.menuItems.indexOf(changedMenuItem);
            if (changeItemIndex === -1) {
                return;
            }
            if (changedMenuItem.role === 'menuitemradio' && changedMenuItem.checked === true) {
                for (let i = changeItemIndex - 1; i >= 0; --i) {
                    const item = this.menuItems[i];
                    const role = item.getAttribute('role');
                    if (role === MenuItemRole.menuitemradio) {
                        item.checked = false;
                    }
                    if (role === 'separator') {
                        break;
                    }
                }
                const maxIndex = this.menuItems.length - 1;
                for (let i = changeItemIndex + 1; i <= maxIndex; ++i) {
                    const item = this.menuItems[i];
                    const role = item.getAttribute('role');
                    if (role === MenuItemRole.menuitemradio) {
                        item.checked = false;
                    }
                    if (role === 'separator') {
                        break;
                    }
                }
            }
        };
        /**
         * check if the item is a menu item
         */
        this.isMenuItemElement = (el) => {
            return (el instanceof MenuItem ||
                (isHTMLElement(el) && el.getAttribute('role') in MenuList.focusableElementRoles));
        };
        /**
         * check if the item is focusable
         */
        this.isFocusableElement = (el) => {
            return this.isMenuItemElement(el);
        };
        this.elementInternals.role = 'menu';
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        Updates.enqueue(() => {
            // wait until children have had a chance to
            // connect before setting/checking their props/attributes
            this.setItems();
        });
        this.addEventListener('change', this.changedMenuItemHandler);
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeItemListeners();
        this.menuItems = undefined;
        this.removeEventListener('change', this.changedMenuItemHandler);
    }
    /**
     * Focuses the first item in the menu.
     *
     * @public
     */
    focus() {
        this.setFocus(0, 1);
    }
    /**
     * @internal
     */
    handleMenuKeyDown(e) {
        if (e.defaultPrevented || this.menuItems === undefined) {
            return;
        }
        switch (e.key) {
            case keyArrowDown:
                // go forward one index
                this.setFocus(this.focusIndex + 1, 1);
                return;
            case keyArrowUp:
                // go back one index
                this.setFocus(this.focusIndex - 1, -1);
                return;
            case keyEnd:
                // set focus on last item
                this.setFocus(this.menuItems.length - 1, -1);
                return;
            case keyHome:
                // set focus on first item
                this.setFocus(0, 1);
                return;
            default:
                // if we are not handling the event, do not prevent default
                return true;
        }
    }
    removeItemListeners(items = this.items) {
        items.forEach(item => {
            item.removeEventListener('focus', this.handleItemFocus);
            Observable.getNotifier(item).unsubscribe(this, 'hidden');
        });
    }
    static elementIndent(el) {
        const role = el.getAttribute('role');
        const startSlot = el.querySelector('[slot=start]');
        if (role && role !== MenuItemRole.menuitem) {
            return startSlot ? 2 : 1;
        }
        return startSlot ? 1 : 0;
    }
    setItems() {
        const children = Array.from(this.children);
        this.removeItemListeners(children);
        children.forEach((child) => Observable.getNotifier(child).subscribe(this, 'hidden'));
        const newItems = children.filter(child => !child.hasAttribute('hidden'));
        this.menuItems = newItems;
        const menuItems = this.menuItems.filter(this.isMenuItemElement);
        // if our focus index is not -1 we have items
        if (menuItems.length) {
            this.focusIndex = 0;
        }
        menuItems.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
            item.addEventListener('focus', this.handleItemFocus);
        });
        /**
         * Set the indent attribute on MenuItem elements based on their
         * position in the MenuList. Each MenuItem element has a data-indent attribute that is
         * used to set the indent of the element's start slot content.
         */
        const filteredMenuListItems = this.menuItems?.filter(this.isMenuItemElement);
        const indent = filteredMenuListItems?.reduce((accum, current) => {
            const elementValue = MenuList.elementIndent(current);
            return Math.max(accum, elementValue);
        }, 0);
        filteredMenuListItems?.forEach((item) => {
            if (item instanceof MenuItem) {
                item.setAttribute('data-indent', `${indent}`);
            }
        });
    }
    /**
     * Method for Observable changes to the hidden attribute of child elements
     */
    handleChange(source, propertyName) {
        if (propertyName === 'hidden') {
            this.setItems();
        }
    }
    setFocus(focusIndex, adjustment) {
        if (this.menuItems === undefined) {
            return;
        }
        while (focusIndex >= 0 && focusIndex < this.menuItems.length) {
            const child = this.menuItems[focusIndex];
            if (this.isFocusableElement(child)) {
                // change the previous index to -1
                if (this.focusIndex > -1 && this.menuItems.length >= this.focusIndex - 1) {
                    this.menuItems[this.focusIndex].setAttribute('tabindex', '-1');
                }
                // update the focus index
                this.focusIndex = focusIndex;
                // update the tabindex of next focusable element
                child.setAttribute('tabindex', '0');
                // focus the element
                child.focus();
                break;
            }
            focusIndex += adjustment;
        }
    }
}
__decorate([
    observable
], MenuList.prototype, "items", void 0);

function menuTemplate$1() {
    return html `
    <template
      slot="${x => (x.slot ? x.slot : x.isNestedMenu() ? 'submenu' : void 0)}"
      @keydown="${(x, c) => x.handleMenuKeyDown(c.event)}"
      @focusout="${(x, c) => x.handleFocusOut(c.event)}"
    >
      <slot ${slotted('items')}></slot>
    </template>
  `;
}
const template$7 = menuTemplate$1();

/** MenuList styles
 * @public
 */
const styles$7 = css `
  ${display('flex')}

  :host {
    flex-direction: column;
    height: fit-content;
    max-width: 300px;
    min-width: 160px;
    width: auto;
    background-color: ${colorNeutralBackground1};
    border: 1px solid ${colorTransparentStroke};
    border-radius: ${borderRadiusMedium};
    box-shadow: ${shadow16};
    padding: 4px;
    row-gap: 2px;
  }
`;

/**
 * @public
 * @remarks
 * HTML Element: <fluent-menu-list>
 */
const definition$7 = MenuList.compose({
    name: `${FluentDesignSystem.prefix}-menu-list`,
    template: template$7,
    styles: styles$7,
});

/**
 * A Menu component that provides a customizable menu element.
 *
 * @tag fluent-menu
 *
 * @class Menu
 * @extends FASTElement
 *
 * @attr open-on-hover - Determines if the menu should open on hover.
 * @attr open-on-context - Determines if the menu should open on right click.
 * @attr close-on-scroll - Determines if the menu should close on scroll.
 * @attr persist-on-item-click - Determines if the menu open state should persist on click of menu item.
 * @attr split - Determines if the menu is in split state.
 *
 * @cssproperty --menu-max-height - The max-height of the menu.
 *
 * @slot primary-action - Slot for the primary action elements. Used when in `split` state.
 * @slot trigger - Slot for the trigger elements.
 * @slot - Default slot for the menu list.
 *
 * @method connectedCallback - Called when the element is connected to the DOM. Sets up the component.
 * @method disconnectedCallback - Called when the element is disconnected from the DOM. Removes event listeners.
 * @method setComponent - Sets the component state.
 * @method toggleMenu - Toggles the open state of the menu.
 * @method closeMenu - Closes the menu.
 * @method openMenu - Opens the menu.
 * @method focusMenuList - Focuses on the menu list.
 * @method focusTrigger - Focuses on the menu trigger.
 * @method openOnHoverChanged - Called whenever the 'openOnHover' property changes.
 * @method persistOnItemClickChanged - Called whenever the 'persistOnItemClick' property changes.
 * @method openOnContextChanged - Called whenever the 'openOnContext' property changes.
 * @method closeOnScrollChanged - Called whenever the 'closeOnScroll' property changes.
 * @method addListeners - Adds event listeners.
 * @method removeListeners - Removes event listeners.
 * @method menuKeydownHandler - Handles keyboard interaction for the menu.
 * @method triggerKeydownHandler - Handles keyboard interaction for the trigger.
 * @method documentClickHandler - Handles document click events to close the menu when a click occurs outside of the menu or the trigger.
 *
 * @summary The Menu component functions as a customizable menu element.
 *
 * @tag fluent-menu
 *
 * @public
 */
class Menu extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Holds the slotted menu list.
         * @public
         */
        this.slottedMenuList = [];
        /**
         * Holds the slotted triggers.
         * @public
         */
        this.slottedTriggers = [];
        /**
         * Defines whether the menu is open or not.
         * @internal
         */
        this._open = false;
        /**
         * Toggles the open state of the menu.
         * @public
         */
        this.toggleMenu = () => {
            this._menuList?.togglePopover(!this._open);
        };
        /**
         * Closes the menu.
         * @public
         */
        this.closeMenu = (event) => {
            // Keep menu open if the event target is a menu item checkbox or radio
            if (event?.target instanceof MenuItem &&
                (event.target.getAttribute('role') === MenuItemRole.menuitemcheckbox ||
                    event.target.getAttribute('role') === MenuItemRole.menuitemradio)) {
                return;
            }
            this._menuList?.togglePopover(false);
            if (this.closeOnScroll) {
                document.removeEventListener('scroll', this.closeMenu);
            }
        };
        /**
         * Opens the menu.
         * @public
         */
        this.openMenu = (e) => {
            this._menuList?.togglePopover(true);
            if (e && this.openOnContext) {
                e.preventDefault();
            }
            if (this.closeOnScroll) {
                document.addEventListener('scroll', this.closeMenu);
            }
        };
        /**
         * Handles the 'toggle' event on the popover.
         * @public
         * @param e - the event
         * @returns void
         */
        this.toggleHandler = (e) => {
            // @ts-expect-error - Baseline 2024
            if (e.type === 'toggle' && e.newState) {
                // @ts-expect-error - Baseline 2024
                const newState = e.newState === 'open';
                this._trigger?.setAttribute('aria-expanded', `${newState}`);
                this._open = newState;
                if (this._open) {
                    this.focusMenuList();
                }
            }
        };
        /**
         * Handles keyboard interaction for the trigger. Toggles the menu when the Space or Enter key is pressed. If the menu
         * is open, focuses on the menu list.
         *
         * @param e - the keyboard event
         * @public
         */
        this.triggerKeydownHandler = (e) => {
            if (e.defaultPrevented) {
                return;
            }
            const key = e.key;
            switch (key) {
                case keySpace:
                case keyEnter:
                    e.preventDefault();
                    this.toggleMenu();
                    break;
                default:
                    return true;
            }
        };
        /**
         * Handles document click events to close a menu opened with contextmenu in popover="manual" mode.
         * @internal
         * @param e - The event triggered on document click.
         */
        this.documentClickHandler = (e) => {
            if (!e.composedPath().some((el) => el === this._trigger || el === this._menuList)) {
                this.closeMenu();
            }
        };
    }
    /**
     * Called when the element is connected to the DOM.
     * Sets up the component.
     * @public
     */
    connectedCallback() {
        super.connectedCallback();
        Updates.enqueue(() => this.setComponent());
    }
    /**
     * Called when the element is disconnected from the DOM.
     * Removes event listeners.
     * @public
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeListeners();
    }
    /**
     * Sets the component.
     * Sets the trigger and menu list elements and adds event listeners.
     * @public
     */
    setComponent() {
        if (this.$fastController.isConnected && this.slottedMenuList.length && this.slottedTriggers.length) {
            this._trigger = this.slottedTriggers[0];
            this._menuList = this.slottedMenuList[0];
            this._trigger.setAttribute('aria-haspopup', 'true');
            this._trigger.setAttribute('aria-expanded', `${this._open}`);
            this._menuList.setAttribute('popover', this.openOnContext ? 'manual' : '');
            this.addListeners();
        }
    }
    /**
     * Focuses on the menu list.
     * @public
     */
    focusMenuList() {
        Updates.enqueue(() => {
            this._menuList.focus();
        });
    }
    /**
     * Focuses on the menu trigger.
     * @public
     */
    focusTrigger() {
        Updates.enqueue(() => {
            this._trigger.focus();
        });
    }
    /**
     * Called whenever the 'openOnHover' property changes.
     * Adds or removes a 'mouseover' event listener to the trigger based on the new value.
     *
     * @param oldValue - The previous value of 'openOnHover'.
     * @param newValue - The new value of 'openOnHover'.
     * @public
     */
    openOnHoverChanged(oldValue, newValue) {
        if (newValue) {
            this._trigger?.addEventListener('mouseover', this.openMenu);
        }
        else {
            this._trigger?.removeEventListener('mouseover', this.openMenu);
        }
    }
    /**
     * Called whenever the 'persistOnItemClick' property changes.
     * Adds or removes a 'click' event listener to the menu list based on the new value.
     * @public
     * @param oldValue - The previous value of 'persistOnItemClick'.
     * @param newValue - The new value of 'persistOnItemClick'.
     */
    persistOnItemClickChanged(oldValue, newValue) {
        if (!newValue) {
            this._menuList?.addEventListener('change', this.closeMenu);
        }
        else {
            this._menuList?.removeEventListener('change', this.closeMenu);
        }
    }
    /**
     * Called whenever the 'openOnContext' property changes.
     * Adds or removes a 'contextmenu' event listener to the trigger based on the new value.
     * @public
     * @param oldValue - The previous value of 'openOnContext'.
     * @param newValue - The new value of 'openOnContext'.
     */
    openOnContextChanged(oldValue, newValue) {
        if (newValue) {
            this._trigger?.addEventListener('contextmenu', this.openMenu);
        }
        else {
            this._trigger?.removeEventListener('contextmenu', this.openMenu);
        }
    }
    /**
     * Called whenever the 'closeOnScroll' property changes.
     * Adds or removes a 'closeOnScroll' event listener to the trigger based on the new value.
     * @public
     * @param oldValue - The previous value of 'closeOnScroll'.
     * @param newValue - The new value of 'closeOnScroll'.
     */
    closeOnScrollChanged(oldValue, newValue) {
        if (newValue) {
            document.addEventListener('scroll', this.closeMenu);
        }
        else {
            document.removeEventListener('scroll', this.closeMenu);
        }
    }
    /**
     * Adds event listeners.
     * Adds click and keydown event listeners to the trigger.
     * Adds a 'toggle' event listener to the menu list.
     * If 'openOnHover' is true, adds a 'mouseover' event listener to the trigger.
     * If 'openOnContext' is true, adds a 'contextmenu' event listener to the trigger and a document 'click' event listener.
     * @internal
     */
    addListeners() {
        this._menuList?.addEventListener('toggle', this.toggleHandler);
        this._trigger?.addEventListener('keydown', this.triggerKeydownHandler);
        if (!this.persistOnItemClick) {
            this._menuList?.addEventListener('change', this.closeMenu);
        }
        if (this.openOnHover) {
            this._trigger?.addEventListener('mouseover', this.openMenu);
        }
        else if (this.openOnContext) {
            this._trigger?.addEventListener('contextmenu', this.openMenu);
            document.addEventListener('click', this.documentClickHandler);
        }
        else {
            this._trigger?.addEventListener('click', this.toggleMenu);
        }
    }
    /**
     * Removes event listeners.
     * Removes click and keydown event listeners from the trigger.
     * Also removes toggle event listener from the menu list.
     * Also removes 'mouseover' event listeners from the trigger.
     * Also removes 'contextmenu' event listeners from the trigger and document 'click' event listeners.
     * @internal
     */
    removeListeners() {
        this._menuList?.removeEventListener('toggle', this.toggleHandler);
        this._trigger?.removeEventListener('keydown', this.triggerKeydownHandler);
        if (!this.persistOnItemClick) {
            this._menuList?.removeEventListener('change', this.closeMenu);
        }
        if (this.openOnHover) {
            this._trigger?.removeEventListener('mouseover', this.openMenu);
        }
        if (this.openOnContext) {
            this._trigger?.removeEventListener('contextmenu', this.openMenu);
            document.removeEventListener('click', this.documentClickHandler);
        }
        else {
            this._trigger?.removeEventListener('click', this.toggleMenu);
        }
    }
    /**
     * Handles keyboard interaction for the menu. Closes the menu and focuses on the trigger when the Escape key is
     * pressed. Closes the menu when the Tab key is pressed.
     *
     * @param e - the keyboard event
     * @public
     */
    menuKeydownHandler(e) {
        if (e.defaultPrevented) {
            return;
        }
        const key = e.key;
        switch (key) {
            case keyEscape:
                e.preventDefault();
                if (this._open) {
                    this.closeMenu();
                    this.focusTrigger();
                }
                break;
            case keyTab:
                if (this._open)
                    this.closeMenu();
                if (e.shiftKey &&
                    e.composedPath()[0] !== this._trigger &&
                    e.composedPath()[0].assignedSlot !== this.primaryAction) {
                    this.focusTrigger();
                }
                else if (e.shiftKey) {
                    return true;
                }
            default:
                return true;
        }
    }
}
__decorate([
    attr({ attribute: 'open-on-hover', mode: 'boolean' })
], Menu.prototype, "openOnHover", void 0);
__decorate([
    attr({ attribute: 'open-on-context', mode: 'boolean' })
], Menu.prototype, "openOnContext", void 0);
__decorate([
    attr({ attribute: 'close-on-scroll', mode: 'boolean' })
], Menu.prototype, "closeOnScroll", void 0);
__decorate([
    attr({ attribute: 'persist-on-item-click', mode: 'boolean' })
], Menu.prototype, "persistOnItemClick", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Menu.prototype, "split", void 0);
__decorate([
    observable
], Menu.prototype, "slottedMenuList", void 0);
__decorate([
    observable
], Menu.prototype, "slottedTriggers", void 0);
__decorate([
    observable
], Menu.prototype, "primaryAction", void 0);

function menuTemplate() {
    return html `
    <template
      ?open-on-hover="${x => x.openOnHover}"
      ?open-on-context="${x => x.openOnContext}"
      ?close-on-scroll="${x => x.closeOnScroll}"
      ?persist-on-item-click="${x => x.persistOnItemClick}"
      @keydown="${(x, c) => x.menuKeydownHandler(c.event)}"
    >
      <slot name="primary-action" ${ref('primaryAction')}></slot>
      <slot name="trigger" ${slotted({ property: 'slottedTriggers', filter: elements() })}></slot>
      <slot ${slotted({ property: 'slottedMenuList', filter: elements() })}></slot>
    </template>
  `;
}
const template$6 = menuTemplate();

/** Menu styles
 * @public
 */
const styles$6 = css `
  ${display('inline-block')}

  ::slotted([slot='trigger']) {
    anchor-name: --menu-trigger;
  }

  ::slotted([popover]) {
    margin: 0;
    max-height: var(--menu-max-height, auto);
    position-anchor: --menu-trigger;
    position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block;
    position: absolute;
    z-index: 1;
  }

  :host([split]) ::slotted([popover]) {
    position-area: block-end span-inline-start;
  }

  ::slotted([popover]:popover-open) {
    inset: unset;
  }

  ::slotted([popover]:not(:popover-open)) {
    display: none;
  }

  :host([split]) {
    display: inline-flex;
  }

  :host([split]) ::slotted([slot='primary-action']) {
    border-inline-end: ${strokeWidthThin} solid ${colorNeutralStroke1};
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  /* Keeps focus visible visuals above trigger slot*/
  :host([split]) ::slotted([slot='primary-action']:focus-visible) {
    z-index: 1;
  }

  :host([split]) ::slotted([slot='primary-action'][appearance='primary']) {
    border-inline-end: ${strokeWidthThin} solid white;
  }

  :host([split]) ::slotted([slot='trigger']) {
    border-inline-start: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
`;

/**
 * The Fluent Menu Element.
 *
 * @public
 * @remarks
 * HTML Element: <fluent-menu>
 */
const definition$6 = Menu.compose({
    name: `${FluentDesignSystem.prefix}-menu`,
    template: template$6,
    styles: styles$6,
});

/**
 * A Radio Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radio | ARIA `radio` role}.
 *
 * @tag fluent-radio
 *
 * @slot checked-indicator - The checked indicator slot
 * @fires change - Emits a custom change event when the checked state changes
 * @fires input - Emits a custom input event when the checked state changes
 *
 * @public
 */
class Radio extends BaseCheckbox {
    constructor() {
        super();
        this.elementInternals.role = 'radio';
    }
    /**
     * Toggles the disabled state when the user changes the `disabled` property.
     *
     * @param prev - the previous value of the `disabled` property
     * @param next - the current value of the `disabled` property
     * @internal
     * @override
     */
    disabledChanged(prev, next) {
        super.disabledChanged(prev, next);
        this.$emit('disabled', next, { bubbles: true });
    }
    /**
     * This method is a no-op for the radio component.
     *
     * @internal
     * @override
     * @remarks
     * To make a group of radio controls required, see {@link RadioGroup.required}.
     */
    requiredChanged() {
        return;
    }
    /**
     * This method is a no-op for the radio component.
     *
     * @internal
     * @override
     * @remarks
     * The radio form value is controlled by the `RadioGroup` component.
     */
    setFormValue() {
        return;
    }
    /**
     * Sets the validity of the control.
     *
     * @internal
     * @override
     * @remarks
     * The radio component does not have a `required` attribute, so this method always sets the validity to `true`.
     */
    setValidity() {
        this.elementInternals.setValidity({});
    }
    /**
     * Toggles the checked state of the control.
     *
     * @param force - Forces the element to be checked or unchecked
     * @public
     * @override
     * @remarks
     * The radio checked state is controlled by the `RadioGroup` component, so the `force` parameter defaults to `true`.
     */
    toggleChecked(force = true) {
        super.toggleChecked(force);
    }
}

// returns the active element in the shadow context of the element in question.
function getRootActiveElement(element) {
    const rootNode = element.getRootNode();
    if (rootNode instanceof ShadowRoot) {
        return rootNode.activeElement;
    }
    return document.activeElement;
}

/**
 * Radio Group orientation
 * @public
 */
const RadioGroupOrientation = Orientation;

/**
 * A Radio Group Custom HTML Element.
 * Implements the {@link https://w3c.github.io/aria/#radiogroup | ARIA `radiogroup` role}.
 *
 * @tag fluent-radio-group
 *
 * @public
 *
 * @slot - The default slot for the radio group
 */
class RadioGroup extends FASTElement {
    /**
     * Sets the checked state of the nearest enabled radio when the `checkedIndex` changes.
     *
     * @param prev - the previous index
     * @param next - the current index
     * @internal
     */
    checkedIndexChanged(prev, next) {
        if (!this.enabledRadios) {
            return;
        }
        this.checkRadio(next);
    }
    /**
     * Sets the `disabled` attribute on all child radios when the `disabled` property changes.
     *
     * @param prev - the previous disabled value
     * @param next - the current disabled value
     * @internal
     */
    disabledChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.checkedIndex = -1;
            this.radios?.forEach(radio => {
                radio.disabled = !!radio.disabledAttribute || !!this.disabled;
            });
            this.restrictFocus();
        }
    }
    /**
     * Sets the matching radio to checked when the value changes. If no radio matches the value, no radio will be checked.
     *
     * @param prev - the previous value
     * @param next - the current value
     */
    initialValueChanged(prev, next) {
        this.value = next ?? '';
    }
    /**
     * Sets the `name` attribute on all child radios when the `name` property changes.
     *
     * @internal
     */
    nameChanged(prev, next) {
        if (this.isConnected && next) {
            this.radios?.forEach(radio => {
                radio.name = this.name;
            });
        }
    }
    /**
     * Sets the ariaOrientation attribute when the orientation changes.
     *
     * @param prev - the previous orientation
     * @param next - the current orientation
     * @internal
     */
    orientationChanged(prev, next) {
        this.elementInternals.ariaOrientation = this.orientation ?? RadioGroupOrientation.horizontal;
    }
    /**
     * Updates the enabled radios collection when properties on the child radios change.
     *
     * @param prev - the previous radios
     * @param next - the current radios
     */
    radiosChanged(prev, next) {
        const setSize = next?.length;
        if (!setSize) {
            return;
        }
        if (!this.name && next.every(x => x.name === next[0].name)) {
            this.name = next[0].name;
        }
        const checkedIndex = findLastIndex(this.enabledRadios, x => x.initialChecked);
        next.forEach((radio, index) => {
            radio.ariaPosInSet = `${index + 1}`;
            radio.ariaSetSize = `${setSize}`;
            if (this.initialValue && !this.dirtyState) {
                radio.checked = radio.value === this.initialValue;
            }
            else {
                radio.checked = index === checkedIndex;
            }
            radio.name = this.name ?? radio.name;
            radio.disabled = !!this.disabled || !!radio.disabledAttribute;
        });
        if (!this.dirtyState && this.initialValue) {
            this.value = this.initialValue;
        }
        if (!this.value ||
            // This logic covers the case when the RadioGroup doesn't have a `value`
            // attribute, but does have a checked child Radio. Without this condition,
            // the checked Radio's value will be assigned to `this.value`, and
            // `checkedIndex` will be the checked Radio's index, but `this.checkedIndex`
            // will remain `undefined`, which would cause the RadioGroup to add
            // `tabindex=-1` to the checked Radio, and effectively makes the whole
            // RadioGroup unfocusable.
            (this.value && typeof this.checkedIndex !== 'number' && checkedIndex >= 0)) {
            // TODO: Switch to standard `Array.findLastIndex` when TypeScript 5 is available
            this.checkedIndex = checkedIndex;
        }
        // prettier-ignore
        const radioIds = next.map(radio => radio.id).join(' ').trim();
        if (radioIds) {
            this.setAttribute('aria-owns', radioIds);
        }
        Updates.enqueue(() => {
            this.restrictFocus();
        });
    }
    /**
     *
     * @param prev - the previous required value
     * @param next - the current required value
     */
    requiredChanged(prev, next) {
        this.elementInternals.ariaRequired = next ? 'true' : null;
        this.setValidity();
    }
    /**
     * A collection of child radios that are not disabled.
     *
     * @internal
     */
    get enabledRadios() {
        if (this.disabled) {
            return [];
        }
        return this.radios?.filter(x => !x.disabled) ?? [];
    }
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * The validation message. Uses the browser's default validation message for native checkboxes if not otherwise
     * specified (e.g., via `setCustomValidity`).
     *
     * @internal
     */
    get validationMessage() {
        if (this.elementInternals.validationMessage) {
            return this.elementInternals.validationMessage;
        }
        if (this.enabledRadios?.[0]?.validationMessage) {
            return this.enabledRadios[0].validationMessage;
        }
        if (!this._validationFallbackMessage) {
            const validationMessageFallbackControl = document.createElement('input');
            validationMessageFallbackControl.type = 'radio';
            validationMessageFallbackControl.required = true;
            validationMessageFallbackControl.checked = false;
            this._validationFallbackMessage = validationMessageFallbackControl.validationMessage;
        }
        return this._validationFallbackMessage;
    }
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity() {
        return this.elementInternals.validity;
    }
    /**
     * The current value of the checked radio.
     *
     * @public
     */
    get value() {
        Observable.notify(this, 'value');
        return this.enabledRadios.find(x => x.checked)?.value ?? null;
    }
    set value(next) {
        const index = this.enabledRadios.findIndex(x => x.value === next);
        this.checkedIndex = index;
        if (this.$fastController.isConnected) {
            this.setFormValue(next);
            this.setValidity();
        }
        Observable.track(this, 'value');
    }
    /**
     * Sets the checked state of all radios when any radio emits a `change` event.
     *
     * @param e - the change event
     */
    changeHandler(e) {
        if (this === e.target) {
            return true;
        }
        this.dirtyState = true;
        const radioIndex = this.enabledRadios.indexOf(e.target);
        this.checkRadio(radioIndex);
        this.radios
            ?.filter(x => x.disabled)
            ?.forEach(item => {
            item.checked = false;
        });
        return true;
    }
    /**
     * Checks the radio at the specified index.
     *
     * @param index - the index of the radio to check
     * @internal
     */
    checkRadio(index = this.checkedIndex, shouldEmit = false) {
        let checkedIndex = this.checkedIndex;
        this.enabledRadios.forEach((item, i) => {
            const shouldCheck = i === index;
            item.checked = shouldCheck;
            if (shouldCheck) {
                checkedIndex = i;
                if (shouldEmit) {
                    item.$emit('change');
                }
            }
        });
        this.checkedIndex = checkedIndex;
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Handles click events for the radio group.
     *
     * @param e - the click event
     * @internal
     */
    clickHandler(e) {
        if (this === e.target) {
            this.enabledRadios[Math.max(0, this.checkedIndex)]?.focus();
        }
        return true;
    }
    constructor() {
        super();
        /**
         * Indicates that the value has been changed by the user.
         */
        this.dirtyState = false;
        /**
         * Disables the radio group and child radios.
         *
         * @public
         * @remarks
         * HTML Attribute: `disabled`
         */
        this.disabled = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'radiogroup';
        this.elementInternals.ariaOrientation = this.orientation ?? RadioGroupOrientation.horizontal;
    }
    /**
     * Focuses the checked radio or the first enabled radio.
     *
     * @internal
     */
    focus() {
        this.enabledRadios[Math.max(0, this.checkedIndex)]?.focus();
    }
    /**
     * Enables tabbing through the radio group when the group receives focus.
     *
     * @param e - the focus event
     * @internal
     */
    focusinHandler(e) {
        if (!this.disabled) {
            this.enabledRadios.forEach(radio => {
                radio.tabIndex = 0;
            });
        }
        return true;
    }
    /**
     * Sets the tabindex of the radios based on the checked state when the radio group loses focus.
     *
     * @param e - the focusout event
     * @internal
     */
    focusoutHandler(e) {
        if (this.radios?.includes(e.relatedTarget) && this.radios?.some(x => x.checked)) {
            this.restrictFocus();
        }
        return true;
    }
    formResetCallback() {
        this.dirtyState = false;
        this.checkedIndex = -1;
        this.setFormValue(this.value);
        this.setValidity();
    }
    getEnabledIndexInBounds(index, upperBound = this.enabledRadios.length) {
        if (upperBound === 0) {
            return -1;
        }
        return (index + upperBound) % upperBound;
    }
    /**
     * Handles keydown events for the radio group.
     *
     * @param e - the keyboard event
     * @internal
     */
    keydownHandler(e) {
        const isRtl = getDirection(this) === 'rtl';
        const checkedIndex = this.enabledRadios.findIndex(x => x === getRootActiveElement(this)) ?? this.checkedIndex;
        let increment = 0;
        switch (e.key) {
            case 'ArrowLeft': {
                increment = isRtl ? 1 : -1;
                break;
            }
            case 'ArrowUp': {
                increment = -1;
                break;
            }
            case 'ArrowRight': {
                increment = isRtl ? -1 : 1;
                break;
            }
            case 'ArrowDown': {
                increment = 1;
                break;
            }
            case 'Tab': {
                this.restrictFocus();
                break;
            }
            case ' ': {
                this.checkRadio();
                break;
            }
        }
        if (!increment) {
            return true;
        }
        const nextIndex = checkedIndex + increment;
        this.checkRadio(this.getEnabledIndexInBounds(nextIndex), true);
        this.enabledRadios[this.checkedIndex]?.focus();
    }
    /**
     *
     * @param e - the disabled event
     */
    disabledRadioHandler(e) {
        if (e.detail === true && e.target.checked) {
            this.checkedIndex = -1;
        }
    }
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Resets the `tabIndex` for all child radios when the radio group loses focus.
     *
     * @internal
     */
    restrictFocus() {
        let activeIndex = Math.max(this.checkedIndex, 0);
        const focusedRadioIndex = this.enabledRadios.indexOf(getRootActiveElement(this));
        if (focusedRadioIndex !== -1) {
            activeIndex = focusedRadioIndex;
        }
        activeIndex = this.getEnabledIndexInBounds(activeIndex);
        this.enabledRadios.forEach((item, index) => {
            item.tabIndex = index === activeIndex ? 0 : -1;
        });
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    /**
     * Sets the validity of the element.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the element's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected) {
            if (this.disabled || !this.required) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity({ valueMissing: this.required && !this.value, ...flags }, message ?? this.validationMessage, anchor ?? this.enabledRadios[0]);
        }
    }
    /**
     * Updates the collection of child radios when the slot changes.
     *
     * @param e - the slot change event
     * @internal
     */
    slotchangeHandler(e) {
        Updates.enqueue(() => {
            this.radios = [...this.querySelectorAll('*')].filter(x => x instanceof Radio);
        });
    }
}
__decorate([
    observable
], RadioGroup.prototype, "checkedIndex", void 0);
__decorate([
    attr({ attribute: 'disabled', mode: 'boolean' })
], RadioGroup.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], RadioGroup.prototype, "initialValue", void 0);
__decorate([
    attr
], RadioGroup.prototype, "name", void 0);
__decorate([
    attr
], RadioGroup.prototype, "orientation", void 0);
__decorate([
    observable
], RadioGroup.prototype, "radios", void 0);
__decorate([
    attr({ mode: 'boolean' })
], RadioGroup.prototype, "required", void 0);

/** RadioGroup styles
 * @public
 */
const styles$5 = css `
  ${display('flex')}

  :host {
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
    gap: ${spacingVerticalL};
  }

  :host([orientation='vertical']) {
    flex-direction: column;
    justify-content: flex-start;
  }

  :host([orientation='horizontal']) {
    flex-direction: row;
  }

  ::slotted(*) {
    color: ${colorNeutralForeground3};
  }

  ::slotted(:hover) {
    color: ${colorNeutralForeground2};
  }

  ::slotted(:active) {
    color: ${colorNeutralForeground1};
  }

  ::slotted(${disabledState}) {
    color: ${colorNeutralForegroundDisabled};
  }

  ::slotted(${checkedState}) {
    color: ${colorNeutralForeground1};
  }

  :host([slot='input']) {
    margin: ${spacingVerticalS} ${spacingHorizontalS};
  }
`;

function radioGroupTemplate() {
    return html `
    <template
      @disabled="${(x, c) => x.disabledRadioHandler(c.event)}"
      @change="${(x, c) => x.changeHandler(c.event)}"
      @click="${(x, c) => x.clickHandler(c.event)}"
      @focusin="${(x, c) => x.focusinHandler(c.event)}"
      @focusout="${(x, c) => x.focusoutHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
      <slot @slotchange="${(x, c) => x.slotchangeHandler(c.event)}"></slot>
    </template>
  `;
}
const template$5 = radioGroupTemplate();

/**
 * The Fluent RadioGroup Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-radio-group\>
 */
const definition$5 = RadioGroup.compose({
    name: `${FluentDesignSystem.prefix}-radio-group`,
    template: template$5,
    styles: styles$5,
});

/**
 * Styles for the Radio component
 *
 * @public
 */
const styles$4 = css `
  ${display('inline-flex')}

  :host {
    --size: 16px;
    aspect-ratio: 1;
    background-color: ${colorNeutralBackground1};
    border: ${strokeWidthThin} solid ${colorNeutralStrokeAccessible};
    border-radius: ${borderRadiusCircular};
    box-sizing: border-box;
    position: relative;
    width: var(--size);
  }

  :host([size='large']) {
    --size: 20px;
  }

  .checked-indicator {
    aspect-ratio: 1;
    border-radius: ${borderRadiusCircular};
    color: ${colorNeutralForegroundInverted};
    inset: 0;
    margin: auto;
    position: absolute;
    width: calc(var(--size) * 0.625);
  }

  :host(:not([slot='input']))::after {
    content: '' / '';
    position: absolute;
    display: block;
    inset: -8px;
    box-sizing: border-box;
    outline: none;
    border: ${strokeWidthThick} solid ${colorTransparentStroke};
    border-radius: ${borderRadiusMedium};
  }

  :host(:not([slot='input']):focus-visible)::after {
    border-color: ${colorStrokeFocus2};
  }

  :host(:hover) {
    border-color: ${colorNeutralStrokeAccessibleHover};
  }

  :host(${checkedState}) {
    border-color: ${colorCompoundBrandStroke};
  }

  :host(${checkedState}) .checked-indicator {
    background-color: ${colorCompoundBrandBackground};
  }

  :host(${checkedState}:hover) .checked-indicator {
    background-color: ${colorCompoundBrandBackgroundHover};
  }

  :host(:active) {
    border-color: ${colorNeutralStrokeAccessiblePressed};
  }

  :host(${checkedState}:active) .checked-indicator {
    background-color: ${colorCompoundBrandBackgroundPressed};
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(${disabledState}) {
    background-color: ${colorNeutralBackgroundDisabled};
    border-color: ${colorNeutralStrokeDisabled};
  }

  :host(${checkedState}${disabledState}) .checked-indicator {
    background-color: ${colorNeutralStrokeDisabled};
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    :host {
      border-color: FieldText;
    }

    :host(:not([slot='input']:focus-visible))::after {
      border-color: Canvas;
    }

    :host(:not(${disabledState}):hover),
    :host(:not([slot='input']):focus-visible)::after {
      border-color: Highlight;
    }

    .checked-indicator {
      color: HighlightText;
    }

    :host(${checkedState}) .checked-indicator {
      background-color: FieldText;
    }

    :host(${checkedState}:not(${disabledState}):hover) .checked-indicator {
      background-color: Highlight;
    }

    :host(${disabledState}) {
      border-color: GrayText;
      color: GrayText;
    }

    :host(${disabledState}${checkedState}) .checked-indicator {
      background-color: GrayText;
    }
  `));

const checkedIndicator = html.partial(/* html */ `
    <span part="checked-indicator" class="checked-indicator" role="presentation"></span>
`);
/**
 * Generates a template for the {@link (Radio:class)} component.
 *
 * @param options - Radio configuration options
 * @public
 */
function radioTemplate(options = {}) {
    return html `
    <template
      @click="${(x, c) => x.clickHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
      @keyup="${(x, c) => x.keyupHandler(c.event)}"
    >
      <slot name="checked-indicator">${staticallyCompose(options.checkedIndicator)}</slot>
    </template>
  `;
}
/**
 * Template for the Radio component
 *
 * @public
 */
const template$4 = radioTemplate({ checkedIndicator });

/**
 * The Fluent Radio Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-radio\>
 */
const definition$4 = Radio.compose({
    name: `${FluentDesignSystem.prefix}-radio`,
    template: template$4,
    styles: styles$4,
});

/**
 * @public
 */
const SliderOrientation = Orientation;
/**
 * @public
 */
const SliderMode = {
    singleValue: 'single-value',
};

/**
 * Converts a pixel coordinate on the track to a percent of the track's range
 */
function convertPixelToPercent(pixelPos, minPosition, maxPosition, direction) {
    let pct = limit(0, 1, (pixelPos - minPosition) / (maxPosition - minPosition));
    if (direction === Direction.rtl) {
        pct = 1 - pct;
    }
    return pct;
}

/**
 * The base class used for constructing a fluent-slider custom element
 *
 * @tag fluent-slider
 *
 * @slot thumb - The slot for a custom thumb element.
 * @csspart thumb-container - The container element of the thumb.
 * @csspart track-container - The container element of the track.
 * @fires change - Fires a custom 'change' event when the value changes.
 *
 * @public
 */
class Slider extends FASTElement {
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * A reference to all associated `<label>` elements.
     *
     * @public
     */
    get labels() {
        return Object.freeze(Array.from(this.elementInternals.labels));
    }
    handleChange(_, propertyName) {
        switch (propertyName) {
            case 'min':
            case 'max':
                this.setSliderPosition();
            case 'step':
                this.handleStepStyles();
                break;
        }
    }
    /**
     * Handles changes to step styling based on the step value
     * NOTE: This function is not a changed callback, stepStyles is not observable
     */
    handleStepStyles() {
        if (this.step) {
            const totalSteps = (100 / Math.floor((this.maxAsNumber - this.minAsNumber) / this.stepAsNumber));
            if (this.stepStyles !== undefined) {
                this.$fastController.removeStyles(this.stepStyles);
            }
            this.stepStyles = css /**css*/ `
        :host {
          --step-rate: ${totalSteps}%;
        }
      `;
            this.$fastController.addStyles(this.stepStyles);
        }
        else if (this.stepStyles !== undefined) {
            this.$fastController.removeStyles(this.stepStyles);
        }
    }
    /**
     * Sets the value of the input when the value attribute changes.
     *
     * @param prev - The previous value
     * @param next - The current value
     * @internal
     */
    initialValueChanged(_, next) {
        if (this.$fastController.isConnected) {
            this.value = next;
        }
        else {
            this._value = next;
        }
    }
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity() {
        return this.elementInternals.validity;
    }
    /**
     * The element's validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/validationMessage | `ElemenentInternals.validationMessage`} property.
     */
    get validationMessage() {
        return this.elementInternals.validationMessage;
    }
    /**
     * Whether the element is a candidate for its owning form's constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/willValidate | `ElemenentInternals.willValidate`} property.
     */
    get willValidate() {
        return this.elementInternals.willValidate;
    }
    /**
     * Checks the element's validity.
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/checkValidity | `ElemenentInternals.checkValidity`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Reports the element's validity.
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals/reportValidity | `ElemenentInternals.reportValidity`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Sets a custom validity message.
     * @public
     */
    setCustomValidity(message) {
        this.setValidity({ customError: !!message }, message);
    }
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags to set.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used.
     * @param anchor - Optional anchor to use for the validation message.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected) {
            if (this.disabled) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity({ customError: !!message, ...flags }, message ?? this.validationMessage, anchor);
        }
    }
    /**
     * The current value of the input.
     *
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this._value?.toString() ?? '';
    }
    set value(value) {
        if (!this.$fastController.isConnected) {
            this._value = value.toString();
            return;
        }
        const nextAsNumber = parseFloat(value);
        const newValue = limit(this.minAsNumber, this.maxAsNumber, this.convertToConstrainedValue(nextAsNumber)).toString();
        if (newValue !== value) {
            this.value = newValue;
            return;
        }
        this._value = value.toString();
        this.elementInternals.ariaValueNow = this._value;
        this.elementInternals.ariaValueText = this.valueTextFormatter(this._value);
        this.setSliderPosition();
        this.$emit('change');
        this.setFormValue(value);
        Observable.notify(this, 'value');
    }
    /**
     * Resets the form value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.value = this.initialValue ?? this.midpoint;
    }
    /**
     * Disabled the component when its associated form is disabled.
     *
     * @internal
     *
     * @privateRemarks
     * DO NOT change the `disabled` property or attribute here, because if the
     * `disabled` attribute is present, reenabling an ancestor `<fieldset>`
     * element will not reenabling this component.
     */
    formDisabledCallback(disabled) {
        this.setDisabledSideEffect(disabled);
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    directionChanged() {
        this.setSliderPosition();
    }
    /**
     * The value property, typed as a number.
     *
     * @public
     */
    get valueAsNumber() {
        return parseFloat(this.value);
    }
    set valueAsNumber(next) {
        this.value = next.toString();
    }
    valueTextFormatterChanged() {
        if (typeof this.valueTextFormatter === 'function') {
            this.elementInternals.ariaValueText = this.valueTextFormatter(this._value);
        }
        else {
            this.elementInternals.ariaValueText = '';
        }
    }
    disabledChanged() {
        this.setDisabledSideEffect(this.disabled);
    }
    minChanged() {
        this.elementInternals.ariaValueMin = `${this.minAsNumber}`;
        if (this.$fastController.isConnected && this.minAsNumber > this.valueAsNumber) {
            this.value = this.min;
        }
    }
    /**
     * Returns the min property or the default value
     *
     * @internal
     */
    get minAsNumber() {
        if (this.min !== undefined) {
            const parsed = parseFloat(this.min);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
        return 0;
    }
    maxChanged() {
        this.elementInternals.ariaValueMax = `${this.maxAsNumber}`;
        if (this.$fastController.isConnected && this.maxAsNumber < this.valueAsNumber) {
            this.value = this.max;
        }
    }
    /**
     * Returns the max property or the default value
     *
     * @internal
     */
    get maxAsNumber() {
        if (this.max !== undefined) {
            const parsed = parseFloat(this.max);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
        return 100;
    }
    stepChanged() {
        this.updateStepMultiplier();
        // Update value to align with the new step if needed.
        if (this.$fastController.isConnected) {
            this.value = this._value;
        }
    }
    /**
     * Returns the step property as a number.
     *
     * @internal
     */
    get stepAsNumber() {
        if (this.step !== undefined) {
            const parsed = parseFloat(this.step);
            if (!Number.isNaN(parsed) && parsed > 0) {
                return parsed;
            }
        }
        return 1;
    }
    orientationChanged(prev, next) {
        this.elementInternals.ariaOrientation = next ?? Orientation.horizontal;
        if (this.$fastController.isConnected) {
            this.setSliderPosition();
        }
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        /**
         * @internal
         */
        this.direction = Direction.ltr;
        /**
         * @internal
         */
        this.isDragging = false;
        /**
         * @internal
         */
        this.trackWidth = 0;
        /**
         * @internal
         */
        this.trackMinWidth = 0;
        /**
         * @internal
         */
        this.trackHeight = 0;
        /**
         * @internal
         */
        this.trackLeft = 0;
        /**
         * @internal
         */
        this.trackMinHeight = 0;
        /**
         * Custom function that generates a string for the component's "ariaValueText" on element internals based on the current value.
         *
         * @public
         */
        this.valueTextFormatter = () => '';
        /**
         * The element's disabled state.
         * @public
         * @remarks
         * HTML Attribute: `disabled`
         */
        this.disabled = false;
        /**
         * The minimum allowed value.
         *
         * @public
         * @remarks
         * HTML Attribute: min
         */
        this.min = '';
        /**
         * The maximum allowed value.
         *
         * @public
         * @remarks
         * HTML Attribute: max
         */
        this.max = '';
        /**
         * Value to increment or decrement via arrow keys, mouse click or drag.
         *
         * @public
         * @remarks
         * HTML Attribute: step
         */
        this.step = '';
        /**
         * The selection mode.
         *
         * @public
         * @remarks
         * HTML Attribute: mode
         */
        this.mode = SliderMode.singleValue;
        this.setupTrackConstraints = () => {
            const clientRect = this.track.getBoundingClientRect();
            this.trackWidth = this.track.clientWidth;
            this.trackMinWidth = this.track.clientLeft;
            this.trackHeight = clientRect.top;
            this.trackMinHeight = clientRect.bottom;
            this.trackLeft = this.getBoundingClientRect().left;
            if (this.trackWidth === 0) {
                this.trackWidth = 1;
            }
        };
        /**
         *  Handle mouse moves during a thumb drag operation
         *  If the event handler is null it removes the events
         */
        this.handleThumbPointerDown = (event) => {
            const windowFn = event !== null ? window.addEventListener : window.removeEventListener;
            windowFn('pointerup', this.handleWindowPointerUp);
            windowFn('pointermove', this.handlePointerMove, { passive: true });
            windowFn('touchmove', this.handlePointerMove, { passive: true });
            windowFn('touchend', this.handleWindowPointerUp);
            this.isDragging = event !== null;
            return true;
        };
        /**
         *  Handle mouse moves during a thumb drag operation
         */
        this.handlePointerMove = (event) => {
            if (this.disabled || event.defaultPrevented) {
                return;
            }
            // update the value based on current position
            const sourceEvent = window.TouchEvent && event instanceof TouchEvent ? event.touches[0] : event;
            const thumbWidth = this.thumb.getBoundingClientRect().width;
            const eventValue = this.orientation === Orientation.vertical
                ? sourceEvent.pageY - document.documentElement.scrollTop
                : sourceEvent.pageX - document.documentElement.scrollLeft - this.trackLeft - thumbWidth / 2;
            this.value = `${this.calculateNewValue(eventValue)}`;
        };
        /**
         * Handle a window mouse up during a drag operation
         */
        this.handleWindowPointerUp = () => {
            this.stopDragging();
        };
        this.stopDragging = () => {
            this.isDragging = false;
            this.handlePointerDown(null);
            this.handleThumbPointerDown(null);
        };
        /**
         *
         * @param event - PointerEvent or null. If there is no event handler it will remove the events
         */
        this.handlePointerDown = (event) => {
            if (event === null || !this.disabled) {
                const windowFn = event !== null ? window.addEventListener : window.removeEventListener;
                const documentFn = event !== null ? document.addEventListener : document.removeEventListener;
                windowFn('pointerup', this.handleWindowPointerUp);
                documentFn('mouseleave', this.handleWindowPointerUp);
                windowFn('pointermove', this.handlePointerMove);
                const thumbWidth = this.thumb.getBoundingClientRect().width;
                if (event) {
                    this.setupTrackConstraints();
                    const controlValue = this.orientation === Orientation.vertical
                        ? event.pageY - document.documentElement.scrollTop
                        : event.pageX - document.documentElement.scrollLeft - this.trackLeft - thumbWidth / 2;
                    this.value = `${this.calculateNewValue(controlValue)}`;
                }
            }
            return true;
        };
        this.elementInternals.role = 'slider';
        this.elementInternals.ariaOrientation = this.orientation ?? SliderOrientation.horizontal;
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.direction = getDirection(this);
        this.setDisabledSideEffect(this.disabled);
        this.updateStepMultiplier();
        this.setupTrackConstraints();
        this.setupDefaultValue();
        this.setSliderPosition();
        Observable.getNotifier(this).subscribe(this, 'max');
        Observable.getNotifier(this).subscribe(this, 'min');
        Observable.getNotifier(this).subscribe(this, 'step');
        this.handleStepStyles();
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        Observable.getNotifier(this).unsubscribe(this, 'max');
        Observable.getNotifier(this).unsubscribe(this, 'min');
        Observable.getNotifier(this).unsubscribe(this, 'step');
    }
    /**
     * Increment the value by the step
     *
     * @public
     */
    increment() {
        const newVal = this.direction !== Direction.rtl
            ? Number(this.value) + this.stepAsNumber
            : Number(this.value) - this.stepAsNumber;
        const incrementedVal = this.convertToConstrainedValue(newVal);
        const incrementedValString = incrementedVal < this.maxAsNumber ? `${incrementedVal}` : `${this.maxAsNumber}`;
        this.value = incrementedValString;
    }
    /**
     * Decrement the value by the step
     *
     * @public
     */
    decrement() {
        const newVal = this.direction !== Direction.rtl
            ? Number(this.value) - Number(this.stepAsNumber)
            : Number(this.value) + Number(this.stepAsNumber);
        const decrementedVal = this.convertToConstrainedValue(newVal);
        const decrementedValString = decrementedVal > this.minAsNumber ? `${decrementedVal}` : `${this.minAsNumber}`;
        this.value = decrementedValString;
    }
    handleKeydown(event) {
        if (this.disabled) {
            return true;
        }
        switch (event.key) {
            case keyHome:
                event.preventDefault();
                this.value =
                    this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                        ? `${this.minAsNumber}`
                        : `${this.maxAsNumber}`;
                break;
            case keyEnd:
                event.preventDefault();
                this.value =
                    this.direction !== Direction.rtl && this.orientation !== Orientation.vertical
                        ? `${this.maxAsNumber}`
                        : `${this.minAsNumber}`;
                break;
            case keyArrowRight:
            case keyArrowUp:
                if (!event.shiftKey) {
                    event.preventDefault();
                    this.increment();
                }
                break;
            case keyArrowLeft:
            case keyArrowDown:
                if (!event.shiftKey) {
                    event.preventDefault();
                    this.decrement();
                }
                break;
        }
        return true;
    }
    /**
     * Places the thumb based on the current value
     */
    setSliderPosition() {
        const newPct = convertPixelToPercent(parseFloat(this.value), this.minAsNumber, this.maxAsNumber, this.orientation === Orientation.vertical ? undefined : this.direction);
        const percentage = newPct * 100;
        this.position = `--slider-thumb: ${percentage}%; --slider-progress: ${percentage}%`;
    }
    /**
     * Update the step multiplier used to ensure rounding errors from steps that
     * are not whole numbers
     */
    updateStepMultiplier() {
        const stepString = this.stepAsNumber + '';
        const decimalPlacesOfStep = !!(this.stepAsNumber % 1) ? stepString.length - stepString.indexOf('.') - 1 : 0;
        this.stepMultiplier = Math.pow(10, decimalPlacesOfStep);
    }
    get midpoint() {
        return `${this.convertToConstrainedValue((this.maxAsNumber + this.minAsNumber) / 2)}`;
    }
    setupDefaultValue() {
        if (!this._value) {
            this.value = this.initialValue ?? this.midpoint;
        }
        if (!Number.isNaN(this.valueAsNumber) &&
            (this.valueAsNumber < this.minAsNumber || this.valueAsNumber > this.maxAsNumber)) {
            this.value = this.midpoint;
        }
        this.elementInternals.ariaValueNow = this.value;
    }
    /**
     * Calculate the new value based on the given raw pixel value.
     *
     * @param rawValue - the value to be converted to a constrained value
     * @returns the constrained value
     *
     * @internal
     */
    calculateNewValue(rawValue) {
        this.setupTrackConstraints();
        // update the value based on current position
        const newPosition = convertPixelToPercent(rawValue, this.orientation === Orientation.vertical ? this.trackMinHeight : this.trackMinWidth, this.orientation === Orientation.vertical ? this.trackHeight : this.trackWidth, this.orientation === Orientation.vertical ? undefined : this.direction);
        const newValue = (this.maxAsNumber - this.minAsNumber) * newPosition + this.minAsNumber;
        return this.convertToConstrainedValue(newValue);
    }
    convertToConstrainedValue(value) {
        if (isNaN(value)) {
            value = this.minAsNumber;
        }
        /**
         * The following logic intends to overcome the issue with math in JavaScript with regards to floating point numbers.
         * This is needed as the `step` may be an integer but could also be a float. To accomplish this the step  is assumed to be a float
         * and is converted to an integer by determining the number of decimal places it represent, multiplying it until it is an
         * integer and then dividing it to get back to the correct number.
         */
        let constrainedValue = value - this.minAsNumber;
        const roundedConstrainedValue = Math.round(constrainedValue / this.stepAsNumber);
        const remainderValue = constrainedValue - (roundedConstrainedValue * (this.stepMultiplier * this.stepAsNumber)) / this.stepMultiplier;
        constrainedValue =
            remainderValue >= Number(this.stepAsNumber) / 2
                ? constrainedValue - remainderValue + Number(this.stepAsNumber)
                : constrainedValue - remainderValue;
        return constrainedValue + this.minAsNumber;
    }
    /**
     * Makes sure the side effects of set up when the disabled state changes.
     */
    setDisabledSideEffect(disabled) {
        if (!this.$fastController.isConnected) {
            return;
        }
        this.elementInternals.ariaDisabled = disabled.toString();
        this.tabIndex = disabled ? -1 : 0;
    }
}
__decorate([
    attr
], Slider.prototype, "size", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], Slider.prototype, "initialValue", void 0);
__decorate([
    observable
], Slider.prototype, "direction", void 0);
__decorate([
    observable
], Slider.prototype, "isDragging", void 0);
__decorate([
    observable
], Slider.prototype, "position", void 0);
__decorate([
    observable
], Slider.prototype, "trackWidth", void 0);
__decorate([
    observable
], Slider.prototype, "trackMinWidth", void 0);
__decorate([
    observable
], Slider.prototype, "trackHeight", void 0);
__decorate([
    observable
], Slider.prototype, "trackLeft", void 0);
__decorate([
    observable
], Slider.prototype, "trackMinHeight", void 0);
__decorate([
    observable
], Slider.prototype, "valueTextFormatter", void 0);
__decorate([
    attr({ mode: 'boolean' })
], Slider.prototype, "disabled", void 0);
__decorate([
    attr({ converter: numberLikeStringConverter })
], Slider.prototype, "min", void 0);
__decorate([
    attr({ converter: numberLikeStringConverter })
], Slider.prototype, "max", void 0);
__decorate([
    attr({ converter: numberLikeStringConverter })
], Slider.prototype, "step", void 0);
__decorate([
    attr
], Slider.prototype, "orientation", void 0);
__decorate([
    attr
], Slider.prototype, "mode", void 0);

/** Text styles
 * @public
 */
const styles$3 = css `
  ${display('inline-grid')}

  :host {
    --thumb-size: 20px;
    --track-margin-inline: calc(var(--thumb-size) / 2);
    --track-size: 4px;
    --track-overhang: calc(var(--track-size) / -2);
    --rail-color: ${colorCompoundBrandBackground};
    --track-color: ${colorNeutralStrokeAccessible};
    --slider-direction: 90deg;
    --border-radius: ${borderRadiusMedium};
    --step-marker-inset: var(--track-overhang) -1px;

    position: relative;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    touch-action: none;
    min-width: 120px;
    min-height: 32px;
    grid-template-rows: 1fr var(--thumb-size) 1fr;
    grid-template-columns: var(--track-margin-inline) 1fr var(--track-margin-inline);
  }

  :host(:hover) {
    --rail-color: ${colorCompoundBrandBackgroundHover};
  }

  :host(:active) {
    --rail-color: ${colorCompoundBrandBackgroundPressed};
  }

  :host(:disabled) {
    --rail-color: ${colorNeutralForegroundDisabled};
    --track-color: ${colorNeutralBackgroundDisabled};
  }

  :host(:not(:disabled)) {
    cursor: pointer;
  }

  :host(:dir(rtl)) {
    --slider-direction: -90deg;
  }

  :host([size='small']) {
    --thumb-size: 16px;
    --track-overhang: -1px;
    --track-size: 2px;
    --border-radius: ${borderRadiusSmall};
  }

  :host([orientation='vertical']) {
    --slider-direction: 0deg;
    --step-marker-inset: -1px var(--track-overhang);
    min-height: 120px;
    grid-template-rows: var(--track-margin-inline) 1fr var(--track-margin-inline);
    grid-template-columns: 1fr var(--thumb-size) 1fr;
    width: unset;
    min-width: 32px;
    justify-items: center;
  }

  :host(:not([slot='input']):focus-visible) {
    box-shadow: 0 0 0 2pt ${colorStrokeFocus2};
    outline: 1px solid ${colorStrokeFocus1};
  }

  :host:after,
  .track {
    height: var(--track-size);
    width: 100%;
  }

  :host:after {
    background-image: linear-gradient(
      var(--slider-direction),
      var(--rail-color) 0%,
      var(--rail-color) 50%,
      var(--track-color) 50.1%,
      var(--track-color) 100%
    );
    border-radius: var(--border-radius);
    content: '';
    grid-row: 1 / -1;
    grid-column: 1 / -1;
  }

  .track {
    position: relative;
    background-color: var(--track-color);
    grid-row: 2 / 2;
    grid-column: 2 / 2;
    forced-color-adjust: none;
    overflow: hidden;
  }

  :host([orientation='vertical'])::after,
  :host([orientation='vertical']) .track {
    height: 100%;
    width: var(--track-size);
  }

  .track::before {
    content: '';
    position: absolute;
    height: 100%;
    border-radius: inherit;
    inset-inline-start: 0;
    width: var(--slider-progress);
  }

  :host(:dir(rtl)) .track::before {
    width: calc(100% - var(--slider-progress));
  }

  :host([orientation='vertical']) .track::before {
    width: 100%;
    bottom: 0;
    height: var(--slider-progress);
  }

  :host([step]) .track::after {
    content: '';
    position: absolute;
    border-radius: inherit;
    inset: var(--step-marker-inset);
    background-image: repeating-linear-gradient(
      var(--slider-direction),
      #0000 0%,
      #0000 calc(var(--step-rate) - 1px),
      ${colorNeutralBackground1} calc(var(--step-rate) - 1px),
      ${colorNeutralBackground1} var(--step-rate)
    );
  }

  .thumb-container {
    position: absolute;
    grid-row: 2 / 2;
    grid-column: 2 / 2;
    transform: translateX(-50%);
    left: var(--slider-thumb);
  }

  :host([orientation='vertical']) .thumb-container {
    transform: translateY(50%);
    left: unset;
    bottom: var(--slider-thumb);
  }

  :host(:not(:active)) :is(.thumb-container, .track::before) {
    transition: all 0.2s ease;
  }

  .thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    border-radius: ${borderRadiusCircular};
    box-shadow: 0 0 0 calc(var(--thumb-size) * 0.2) ${colorNeutralBackground1} inset;
    border: calc(var(--thumb-size) * 0.05) solid ${colorNeutralStroke1};
    box-sizing: border-box;
  }

  .thumb,
  .track::before {
    background-color: var(--rail-color);
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    .track:hover,
    .track:active,
    .track {
      background: WindowText;
    }
    .thumb:hover,
    .thumb:active,
    .thumb {
      background: ButtonText;
    }

    :host(:hover) .track::before,
    :host(:active) .track::before,
    .track::before {
      background: Highlight;
    }
  `));

function sliderTemplate(options = {}) {
    return html `
    <template
      tabindex="${x => (x.disabled ? null : 0)}"
      @pointerdown="${(x, c) => x.handlePointerDown(c.event)}"
      @keydown="${(x, c) => x.handleKeydown(c.event)}"
    >
      <div ${ref('track')} part="track-container" class="track" style="${x => x.position}"></div>
      <div
        ${ref('thumb')}
        part="thumb-container"
        class="thumb-container"
        style="${x => x.position}"
        @pointerdown="${(x, c) => x.handleThumbPointerDown(c.event)}"
      >
        <slot name="thumb">${staticallyCompose(options.thumb)}</slot>
      </div>
    </template>
  `;
}
const template$3 = sliderTemplate({
    thumb: `<div class="thumb"></div>`,
});

/**
 * The Fluent Slider Element.
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fluent-slider\>
 */
const definition$3 = Slider.compose({
    name: `${FluentDesignSystem.prefix}-slider`,
    template: template$3,
    styles: styles$3,
});

/**
 * The base class used for constructing a fluent-spinner custom element
 * @public
 */
class BaseSpinner extends FASTElement {
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.elementInternals.role = 'progressbar';
    }
}

/**
 * A Spinner Custom HTML Element.
 * Based on BaseSpinner and includes style and layout specific attributes
 *
 * @tag fluent-spinner
 *
 * @public
 */
class Spinner extends BaseSpinner {
}
__decorate([
    attr
], Spinner.prototype, "size", void 0);
__decorate([
    attr
], Spinner.prototype, "appearance", void 0);

const template$2 = html `
  <slot name="indicator">
    <div class="background"></div>
    <div class="progress">
      <div class="spinner">
        <div class="start">
          <div class="indicator"></div>
        </div>
        <div class="end">
          <div class="indicator"></div>
        </div>
      </div>
    </div>
  </slot>
`;

const styles$2 = css `
  ${display('inline-flex')}

  :host {
    --duration: 1.5s;
    --indicatorSize: ${strokeWidthThicker};
    --size: 32px;
    height: var(--size);
    width: var(--size);
    contain: strict;
    content-visibility: auto;
  }

  :host([size='tiny']) {
    --indicatorSize: ${strokeWidthThick};
    --size: 20px;
  }
  :host([size='extra-small']) {
    --indicatorSize: ${strokeWidthThick};
    --size: 24px;
  }
  :host([size='small']) {
    --indicatorSize: ${strokeWidthThick};
    --size: 28px;
  }
  :host([size='large']) {
    --indicatorSize: ${strokeWidthThicker};
    --size: 36px;
  }
  :host([size='extra-large']) {
    --indicatorSize: ${strokeWidthThicker};
    --size: 40px;
  }
  :host([size='huge']) {
    --indicatorSize: ${strokeWidthThickest};
    --size: 44px;
  }

  .progress,
  .background,
  .spinner,
  .start,
  .end,
  .indicator {
    position: absolute;
    inset: 0;
  }

  .progress,
  .spinner,
  .indicator {
    animation: none var(--duration) infinite ${curveEasyEase};
  }

  .progress {
    animation-timing-function: linear;
    animation-name: spin-linear;
  }

  .background {
    border: var(--indicatorSize) solid ${colorBrandStroke2};
    border-radius: 50%;
  }

  :host([appearance='inverted']) .background {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .spinner {
    animation-name: spin-swing;
  }

  .start {
    overflow: hidden;
    right: 50%;
  }

  .end {
    overflow: hidden;
    left: 50%;
  }

  .indicator {
    color: ${colorBrandStroke1};
    box-sizing: border-box;
    border-radius: 50%;
    border: var(--indicatorSize) solid transparent;
    border-block-start-color: currentcolor;
    border-right-color: currentcolor;
  }

  :host([appearance='inverted']) .indicator {
    color: ${colorNeutralStrokeOnBrand2};
  }

  .start .indicator {
    rotate: 135deg; /* Starts 9 o'clock */
    inset: 0 -100% 0 0;
    animation-name: spin-start;
  }

  .end .indicator {
    rotate: 135deg; /* Ends at 3 o'clock */
    inset: 0 0 0 -100%;
    animation-name: spin-end;
  }

  @keyframes spin-linear {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-swing {
    0% {
      transform: rotate(-135deg);
    }
    50% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(225deg);
    }
  }

  @keyframes spin-start {
    0%,
    100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-80deg);
    }
  }

  @keyframes spin-end {
    0%,
    100% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(70deg);
    }
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    .background {
      display: none;
    }
    .indicator {
      border-color: Canvas;
      border-block-start-color: Highlight;
      border-right-color: Highlight;
    }
  `));

/**
 * @public
 * @remarks
 * HTML Element: \<fluent-spinner\>
 */
const definition$2 = Spinner.compose({
    name: `${FluentDesignSystem.prefix}-spinner`,
    template: template$2,
    styles: styles$2,
});

/**
 * Values for the `size` attribute on TextArea elements.
 *
 * @public
 */
/**
 * Values for the `appearance` attribute on TextArea elements.
 *
 * @public
 */
const TextAreaAppearance = {
    outline: 'outline'};
/**
 * Values for the `resize` attribute on TextArea elements.
 */
const TextAreaResize = {
    none: 'none',
    both: 'both',
    horizontal: 'horizontal',
    vertical: 'vertical',
};

/**
 * A Text Area Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea | `<textarea>`} element.
 *
 * @slot - The default content/value of the component.
 * @slot label - The content for the `<label>`, it should be a `<fluent-label>` element.
 * @csspart label - The `<label>` element.
 * @csspart root - The container element of the `<textarea>` element.
 * @csspart control - The internal `<textarea>` element.
 * @fires change - Fires after the control loses focus, if the content has changed.
 * @fires select - Fires when the `select()` method is called.
 *
 * @public
 */
class BaseTextArea extends FASTElement {
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    defaultSlottedNodesChanged() {
        const next = this.getContent();
        this.defaultValue = next;
        this.value = next;
    }
    labelSlottedNodesChanged() {
        if (this.labelEl) {
            this.labelEl.hidden = !this.labelSlottedNodes.length;
        }
        this.labelSlottedNodes.forEach(node => {
            node.disabled = this.disabled;
            node.required = this.required;
        });
    }
    autoResizeChanged() {
        this.maybeCreateAutoSizerEl();
        toggleState(this.elementInternals, 'auto-resize', this.autoResize);
    }
    disabledChanged() {
        this.setDisabledSideEffect(this.disabled);
    }
    /**
     * The form element that’s associated to the element, or `null` if no form is associated.
     *
     * @public
     */
    get form() {
        return this.elementInternals.form;
    }
    /**
     * A `NodeList` of `<label>` element associated with the element.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/labels | `labels`} property
     *
     * @public
     */
    get labels() {
        return this.elementInternals.labels;
    }
    readOnlyChanged() {
        this.elementInternals.ariaReadOnly = `${!!this.readOnly}`;
    }
    requiredChanged() {
        this.elementInternals.ariaRequired = `${!!this.required}`;
        if (this.labelSlottedNodes?.length) {
            this.labelSlottedNodes.forEach(node => (node.required = this.required));
        }
    }
    resizeChanged(prev, next) {
        swapStates(this.elementInternals, prev, next, TextAreaResize, 'resize-');
        toggleState(this.elementInternals, 'resize', hasMatchingState(TextAreaResize, next) && next !== TextAreaResize.none);
    }
    /**
     * The length of the current value.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#textLength | 'textLength'} property
     *
     * @public
     */
    get textLength() {
        return this.controlEl.textLength;
    }
    /**
     * The type of the element, which is always "textarea".
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/type | `type`} property
     *
     * @public
     */
    get type() {
        return 'textarea';
    }
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity() {
        return this.elementInternals.validity;
    }
    /**
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage() {
        return this.elementInternals.validationMessage || this.controlEl.validationMessage;
    }
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate() {
        return this.elementInternals.willValidate;
    }
    /**
     * The text content of the element before user interaction.
     * @see The {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement#defaultvalue | `defaultValue`} property
     *
     * @public
     * @remarks
     * In order to set the initial/default value, an author should either add the default value in the HTML as the children
     * of the component, or setting this property in JavaScript. Setting `innerHTML`, `innerText`, or `textContent` on this
     * component will not change the default value or the content displayed inside the component.
     */
    get defaultValue() {
        return this.controlEl?.defaultValue ?? this.preConnectControlEl.defaultValue;
    }
    set defaultValue(next) {
        const controlEl = this.controlEl ?? this.preConnectControlEl;
        controlEl.defaultValue = next;
        if (this.controlEl && !this.userInteracted) {
            this.controlEl.value = next;
        }
    }
    /**
     * The value of the element.
     *
     * @public
     * @remarks
     * Reflects the `value` property.
     */
    get value() {
        return this.controlEl?.value ?? this.preConnectControlEl.value;
    }
    set value(next) {
        const controlEl = this.controlEl ?? this.preConnectControlEl;
        controlEl.value = next;
        this.setFormValue(next);
        this.setValidity();
    }
    constructor() {
        super();
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
        this.userInteracted = false;
        this.preConnectControlEl = document.createElement('textarea');
        /**
         * Indicates whether the element’s block size (height) should be automatically changed based on the content.
         * Note: When this property’s value is set to be `true`, the element should not have a fixed block-size
         * defined in CSS. Instead, use `min-height` or `min-block-size`.
         *
         * @public
         * @remarks
         * HTML Attribute: `auto-resize`
         */
        this.autoResize = false;
        /**
         * Sets the element's disabled state.
         * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/disabled | `disabled`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `disabled`
         */
        this.disabled = false;
        /**
         * Indicates whether the element displays a box shadow. This only has effect when `appearance` is set to be `filled-darker` or `filled-lighter`.
         *
         * @public
         * @remarks
         * HTML Attribute: `display-shadow`
         */
        this.displayShadow = false;
        /**
         * When true, the control will be immutable by user interaction.
         * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Attributes/readonly | `readonly`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `readonly`
         */
        this.readOnly = false;
        /**
         * The element's required attribute.
         *
         * @public
         * @remarks
         * HTML Attribute: `required`
         */
        this.required = false;
        /**
         * Indicates whether the element can be resized by end users.
         *
         * @public
         * @remarks
         * HTML Attribute: `resize`
         */
        this.resize = TextAreaResize.none;
        /**
         * Controls whether or not to enable spell checking for the input field, or if the default spell checking configuration should be used.
         * @see The {@link https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck | `spellcheck`} attribute
         *
         * @public
         * @remarks
         * HTML Attribute: `spellcheck`
         */
        this.spellcheck = false;
        // TODO: Re-enabled this when Reference Target is out.
        // this.elementInternals.role = 'textbox';
        // this.elementInternals.ariaMultiLine = 'true';
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        this.setDefaultValue();
        this.maybeCreateAutoSizerEl();
        this.bindEvents();
        this.observeControlElAttrs();
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        this.autoSizerObserver?.disconnect();
        this.controlElAttrObserver?.disconnect();
    }
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.value = this.defaultValue;
    }
    /**
     * @internal
     */
    formDisabledCallback(disabled) {
        this.setDisabledSideEffect(disabled);
        this.setValidity();
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message) {
        this.elementInternals.setValidity({ customError: !!message }, !!message ? message.toString() : undefined);
        this.reportValidity();
    }
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags. If not provided, the control's `validity` will be used.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
     * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (this.disabled || this.readOnly) {
            this.elementInternals.setValidity({});
        }
        else {
            this.elementInternals.setValidity(flags ?? this.controlEl.validity, message ?? this.controlEl.validationMessage, anchor ?? this.controlEl);
        }
        if (this.userInteracted) {
            this.toggleUserValidityState();
        }
    }
    /**
     * Selects the content in the element.
     *
     * @public
     */
    select() {
        this.controlEl.select();
    }
    setDefaultValue() {
        this.defaultValue = this.innerHTML.trim() || this.preConnectControlEl.defaultValue || '';
        this.value = this.preConnectControlEl.value || this.defaultValue;
        this.setFormValue(this.value);
        this.setValidity();
        this.preConnectControlEl = null;
    }
    bindEvents() {
        this.controlEl.addEventListener('input', () => (this.userInteracted = true), { once: true });
    }
    /**
     * Gets the content inside the light DOM, if any HTML element is present, use its `outerHTML` value.
     */
    getContent() {
        return (this.defaultSlottedNodes
            .map(node => {
            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    return node.outerHTML;
                case Node.TEXT_NODE:
                    return node.textContent.trim();
                default:
                    return '';
            }
        })
            .join('') || '');
    }
    observeControlElAttrs() {
        this.controlElAttrObserver = new MutationObserver(() => {
            this.setValidity();
        });
        this.controlElAttrObserver.observe(this.controlEl, {
            attributes: true,
            attributeFilter: ['disabled', 'required', 'readonly', 'maxlength', 'minlength'],
        });
    }
    setDisabledSideEffect(disabled) {
        this.elementInternals.ariaDisabled = `${disabled}`;
        if (this.controlEl) {
            this.controlEl.disabled = disabled;
        }
        if (this.labelSlottedNodes?.length) {
            this.labelSlottedNodes.forEach(node => (node.disabled = this.disabled));
        }
    }
    toggleUserValidityState() {
        toggleState(this.elementInternals, 'user-invalid', !this.validity.valid);
        toggleState(this.elementInternals, 'user-valid', this.validity.valid);
    }
    // Technique inspired by https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/
    // TODO: This should be removed after `field-sizing: content` is widely supported
    // https://caniuse.com/mdn-css_properties_field-sizing_content
    maybeCreateAutoSizerEl() {
        if (CSS.supports('field-sizing: content')) {
            return;
        }
        if (!this.autoResize) {
            this.autoSizerEl?.remove();
            this.autoSizerObserver?.disconnect();
            return;
        }
        if (!this.autoSizerEl) {
            this.autoSizerEl = document.createElement('div');
            this.autoSizerEl.classList.add('auto-sizer');
            this.autoSizerEl.ariaHidden = 'true';
        }
        this.shadowRoot.prepend(this.autoSizerEl);
        // The `ResizeObserver` is used to observe when the component gains
        // explicit block size, when so, the `autoSizerEl` element should be
        // removed to let the defined blocked size dictate the component’s block size.
        if (!this.autoSizerObserver) {
            this.autoSizerObserver = new ResizeObserver((_, observer) => {
                const blockSizePropName = window.getComputedStyle(this).writingMode.startsWith('horizontal')
                    ? 'height'
                    : 'width';
                if (this.style.getPropertyValue(blockSizePropName) !== '') {
                    this.autoSizerEl?.remove();
                    observer.disconnect();
                }
            });
        }
        this.autoSizerObserver.observe(this);
    }
    /**
     * @internal
     */
    handleControlInput() {
        if (this.autoResize && this.autoSizerEl) {
            this.autoSizerEl.textContent = this.value + ' ';
        }
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * @internal
     */
    handleControlChange() {
        this.toggleUserValidityState();
        this.$emit('change');
    }
    /**
     * @internal
     */
    handleControlSelect() {
        this.$emit('select');
    }
}
__decorate([
    observable
], BaseTextArea.prototype, "defaultSlottedNodes", void 0);
__decorate([
    observable
], BaseTextArea.prototype, "labelSlottedNodes", void 0);
__decorate([
    attr
], BaseTextArea.prototype, "autocomplete", void 0);
__decorate([
    attr({ attribute: 'auto-resize', mode: 'boolean' })
], BaseTextArea.prototype, "autoResize", void 0);
__decorate([
    attr({ attribute: 'dirname' })
], BaseTextArea.prototype, "dirName", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextArea.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'display-shadow', mode: 'boolean' })
], BaseTextArea.prototype, "displayShadow", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseTextArea.prototype, "initialForm", void 0);
__decorate([
    attr({ attribute: 'maxlength', converter: nullableNumberConverter })
], BaseTextArea.prototype, "maxLength", void 0);
__decorate([
    attr({ attribute: 'minlength', converter: nullableNumberConverter })
], BaseTextArea.prototype, "minLength", void 0);
__decorate([
    attr
], BaseTextArea.prototype, "name", void 0);
__decorate([
    attr
], BaseTextArea.prototype, "placeholder", void 0);
__decorate([
    attr({ attribute: 'readonly', mode: 'boolean' })
], BaseTextArea.prototype, "readOnly", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextArea.prototype, "required", void 0);
__decorate([
    attr({ mode: 'fromView' })
], BaseTextArea.prototype, "resize", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextArea.prototype, "spellcheck", void 0);

/**
 * The Fluent TextArea Element.
 *
 * @tag fluent-text-area
 *
 */
class TextArea extends BaseTextArea {
    constructor() {
        super(...arguments);
        /**
         * Indicates the visual appearance of the element.
         *
         * @public
         * @remarks
         * HTML Attribute: `appearance`
         */
        this.appearance = TextAreaAppearance.outline;
        /**
         * Indicates whether the textarea should be a block-level element.
         *
         * @public
         * @remarks
         * HTML Attribute: `block`
         */
        this.block = false;
    }
    labelSlottedNodesChanged() {
        super.labelSlottedNodesChanged();
        this.labelSlottedNodes.forEach(node => {
            node.size = this.size;
        });
    }
    /**
     * @internal
     */
    handleChange(_, propertyName) {
        switch (propertyName) {
            case 'size':
                this.labelSlottedNodes.forEach(node => {
                    node.size = this.size;
                });
                break;
        }
    }
    /**
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        Observable.getNotifier(this).subscribe(this, 'size');
    }
    /**
     * @internal
     */
    disconnectedCallback() {
        super.disconnectedCallback();
        Observable.getNotifier(this).unsubscribe(this, 'size');
    }
}
__decorate([
    attr({ mode: 'fromView' })
], TextArea.prototype, "appearance", void 0);
__decorate([
    attr({ mode: 'boolean' })
], TextArea.prototype, "block", void 0);
__decorate([
    attr
], TextArea.prototype, "size", void 0);

/**
 * Styles for the TextArea component.
 *
 * @public
 */
const styles$1 = css `
  ${display('inline-block')}

  :host {
    /* typography */
    --font-size: ${fontSizeBase300};
    --line-height: ${lineHeightBase300};

    /* layout */
    --padding-inline: ${spacingHorizontalMNudge};
    --padding-block: ${spacingVerticalSNudge};
    --min-block-size: 52px;
    --block-size: var(--min-block-size);
    --inline-size: 18rem;
    --border-width: ${strokeWidthThin};
    --control-padding-inline: ${spacingHorizontalXXS};

    /* colors */
    --color: ${colorNeutralForeground1};
    --background-color: ${colorNeutralBackground1};
    --border-color: ${colorNeutralStroke1};
    --border-block-end-color: ${colorNeutralStrokeAccessible};
    --placeholder-color: ${colorNeutralForeground4};
    --focus-indicator-color: ${colorCompoundBrandStroke};

    /* elevations */
    --box-shadow: none;

    /* others */
    --contain-size: size;
    --resize: none;

    color: var(--color);
    font-family: ${fontFamilyBase};
    font-size: var(--font-size);
    font-weight: ${fontWeightRegular};
    line-height: var(--line-height);
    position: relative;
  }

  :host(:hover) {
    --border-color: ${colorNeutralStroke1Hover};
    --border-block-end-color: ${colorNeutralStrokeAccessibleHover};
  }

  :host(:active) {
    --border-color: ${colorNeutralStroke1Pressed};
    --border-block-end-color: ${colorNeutralStrokeAccessiblePressed};
  }

  :host(:focus-within) {
    outline: none;
  }

  :host([block]:not([hidden])) {
    display: block;
  }

  :host([size='small']) {
    --font-size: ${fontSizeBase200};
    --line-height: ${lineHeightBase200};
    --min-block-size: 40px;
    --padding-block: ${spacingVerticalXS};
    --padding-inline: ${spacingHorizontalSNudge};
    --control-padding-inline: ${spacingHorizontalXXS};
  }

  :host([size='large']) {
    --font-size: ${fontSizeBase400};
    --line-height: ${lineHeightBase400};
    --min-block-size: 64px;
    --padding-block: ${spacingVerticalS};
    --padding-inline: ${spacingHorizontalM};
    --control-padding-inline: ${spacingHorizontalSNudge};
  }

  :host([resize='both']:not(:disabled)) {
    --resize: both;
  }

  :host([resize='horizontal']:not(:disabled)) {
    --resize: horizontal;
  }

  :host([resize='vertical']:not(:disabled)) {
    --resize: vertical;
  }

  :host([auto-resize]) {
    --block-size: auto;
    --contain-size: inline-size;
  }

  :host([appearance='filled-darker']) {
    --background-color: ${colorNeutralBackground3};
    --border-color: var(--background-color);
    --border-block-end-color: var(--border-color);
  }

  :host([appearance='filled-lighter']) {
    --border-color: var(--background-color);
    --border-block-end-color: var(--border-color);
  }

  :host([appearance='filled-darker'][display-shadow]),
  :host([appearance='filled-lighter'][display-shadow]) {
    --box-shadow: ${shadow2};
  }

  :host(${userInvalidState}) {
    --border-color: ${colorPaletteRedBorder2};
    --border-block-end-color: ${colorPaletteRedBorder2};
  }

  :host(:disabled) {
    --color: ${colorNeutralForegroundDisabled};
    --background-color: ${colorTransparentBackground};
    --border-color: ${colorNeutralStrokeDisabled};
    --border-block-end-color: var(--border-color);
    --box-shadow: none;
    --placeholder-color: ${colorNeutralForegroundDisabled};

    cursor: no-drop;
    user-select: none;
  }

  .root {
    background-color: var(--background-color);
    border: var(--border-width) solid var(--border-color);
    border-block-end-color: var(--border-block-end-color);
    border-radius: ${borderRadiusMedium};
    box-sizing: border-box;
    box-shadow: var(--box-shadow);
    contain: paint layout style var(--contain-size);
    display: grid;
    grid-template: 1fr / 1fr;
    inline-size: var(--inline-size);
    min-block-size: var(--min-block-size);
    block-size: var(--block-size);
    overflow: hidden;
    padding: var(--padding-block) var(--padding-inline);
    position: relative;
    resize: var(--resize);
  }

  :host([block]) .root {
    inline-size: auto;
  }

  .root::after {
    border-bottom: 2px solid var(--focus-indicator-color);
    border-radius: 0 0 ${borderRadiusMedium} ${borderRadiusMedium};
    box-sizing: border-box;
    clip-path: inset(calc(100% - 2px) 1px 0px);
    content: '';
    height: max(2px, ${borderRadiusMedium});
    inset: auto -1px 0;
    position: absolute;
    transform: scaleX(0);
    transition-delay: ${curveAccelerateMid};
    transition-duration: ${durationUltraFast};
    transition-property: transform;
  }

  :host(:focus-within) .root::after {
    transform: scaleX(1);
    transition-property: transform;
    transition-duration: ${durationNormal};
    transition-delay: ${curveDecelerateMid};
  }

  :host([readonly]) .root::after,
  :host(:disabled) .root::after {
    content: none;
  }

  label {
    color: var(--color);
    display: flex;
    inline-size: fit-content;
    padding-block-end: ${spacingVerticalXS};
    padding-inline-end: ${spacingHorizontalXS};
  }

  :host(:empty) label,
  label[hidden] {
    display: none;
  }

  .auto-sizer,
  .control {
    box-sizing: border-box;
    font: inherit;
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    letter-space: inherit;
    padding: 0 var(--control-padding-inline);
  }

  .auto-sizer {
    display: none;
    padding-block-end: 2px; /* avoid scroll bar in Firefox */
    pointer-events: none;
    visibility: hidden;
    white-space: pre-wrap;
  }

  :host([auto-resize]) .auto-sizer {
    display: block;
  }

  .control {
    appearance: none;
    background-color: transparent;
    border: 0;
    color: inherit;
    field-sizing: content;
    max-block-size: 100%;
    outline: 0;
    resize: none;
    text-align: inherit;
  }

  .control:disabled {
    cursor: inherit;
  }

  .control::placeholder {
    color: var(--placeholder-color);
  }

  ::selection {
    color: ${colorNeutralForegroundInverted};
    background-color: ${colorNeutralBackgroundInverted};
  }
`.withBehaviors(forcedColorsStylesheetBehavior(css `
    :host {
      --border-color: FieldText;
      --border-block-end-color: FieldText;
      --focus-indicator-color: Highlight;
      --placeholder-color: FieldText;
    }

    :host(:hover),
    :host(:active),
    :host(:focus-within) {
      --border-color: Highlight;
      --border-block-end-color: Highlight;
    }

    :host(:disabled) {
      --color: GrayText;
      --border-color: GrayText;
      --border-block-end-color: GrayText;
      --placeholder-color: GrayText;
    }
  `));

/**
 * Generates a template for the TextArea component.
 *
 * @public
 */
function textAreaTemplate() {
    return html `
    <template>
      <label ${ref('labelEl')} for="control" part="label">
        <slot
          name="label"
          ${slotted({
        property: 'labelSlottedNodes',
        filter: whitespaceFilter,
    })}
        ></slot>
      </label>
      <div class="root" part="root">
        <textarea
          ${ref('controlEl')}
          id="control"
          class="control"
          part="control"
          ?required="${x => x.required}"
          ?disabled="${x => x.disabled}"
          ?readonly="${x => x.readOnly}"
          ?spellcheck="${x => x.spellcheck}"
          autocomplete="${x => x.autocomplete}"
          maxlength="${x => x.maxLength}"
          minlength="${x => x.minLength}"
          placeholder="${x => x.placeholder}"
          @change="${x => x.handleControlChange()}"
          @select="${x => x.handleControlSelect()}"
          @input="${x => x.handleControlInput()}"
        ></textarea>
      </div>
      <div hidden>
        <slot
          ${slotted({
        property: 'defaultSlottedNodes',
        filter: whitespaceFilter,
    })}
        ></slot>
      </div>
    </template>
  `;
}
/**
 * @internal
 */
const template$1 = textAreaTemplate();

/**
 * The Fluent Textarea Element definition.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-textarea>`
 */
const definition$1 = TextArea.compose({
    name: `${FluentDesignSystem.prefix}-textarea`,
    template: template$1,
    styles: styles$1,
    shadowOptions: {
        delegatesFocus: true,
    },
});

/**
 * Values for the `control-size` attribute on TextInput elements.
 *
 * @public
 */
/**
 * Values for the `type` attribute on TextInput elements.
 *
 * @public
 */
const TextInputType = {
    text: 'text'};
/**
 * Input types that block implicit form submission.
 *
 * @public
 */
const ImplicitSubmissionBlockingTypes = [
    'date',
    'datetime-local',
    'email',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'time',
    'url',
    'week',
];

/**
 * A Text Input Custom HTML Element.
 * Based largely on the {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | `<input>`} element.
 *
 * @slot start - Content which can be provided before the input
 * @slot end - Content which can be provided after the input
 * @slot - The default slot for button content
 * @csspart label - The internal `<label>` element
 * @csspart root - the root container for the internal control
 * @csspart control - The internal `<input>` control
 * @public
 */
class BaseTextInput extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * Allows setting a type or mode of text.
         *
         * @public
         * @remarks
         * HTML Attribute: `type`
         */
        this.type = TextInputType.text;
        /**
         * Indicates that the value has been changed by the user.
         *
         * @internal
         */
        this.dirtyValue = false;
        /**
         * The internal {@link https://developer.mozilla.org/docs/Web/API/ElementInternals | `ElementInternals`} instance for the component.
         *
         * @internal
         */
        this.elementInternals = this.attachInternals();
    }
    /**
     * Tracks the current value of the input.
     *
     * @param prev - the previous value
     * @param next - the next value
     *
     * @internal
     */
    currentValueChanged(prev, next) {
        this.value = next;
    }
    /**
     * Updates the control label visibility based on the presence of default slotted content.
     *
     * @internal
     */
    defaultSlottedNodesChanged(prev, next) {
        if (this.$fastController.isConnected) {
            this.controlLabel.hidden = !next?.length;
        }
    }
    /**
     * Sets the value of the element to the initial value.
     *
     * @internal
     */
    initialValueChanged() {
        if (!this.dirtyValue) {
            this.value = this.initialValue;
        }
    }
    /**
     * Syncs the `ElementInternals.ariaReadOnly` property when the `readonly` property changes.
     *
     * @internal
     */
    readOnlyChanged() {
        if (this.$fastController.isConnected) {
            this.elementInternals.ariaReadOnly = `${!!this.readOnly}`;
        }
    }
    /**
     * Syncs the element's internal `aria-required` state with the `required` attribute.
     *
     * @param previous - the previous required state
     * @param next - the current required state
     *
     * @internal
     */
    requiredChanged(previous, next) {
        if (this.$fastController.isConnected) {
            this.elementInternals.ariaRequired = `${!!next}`;
        }
    }
    /**
     * Calls the `setValidity` method when the control reference changes.
     *
     * @param prev - the previous control reference
     * @param next - the current control reference
     *
     * @internal
     */
    controlChanged(prev, next) {
        this.setValidity();
    }
    /**
     * The form-associated flag.
     * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example | Form-associated custom elements}
     *
     * @public
     */
    static { this.formAssociated = true; }
    /**
     * The element's validity state.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validity | `ElementInternals.validity`} property.
     */
    get validity() {
        return this.elementInternals.validity;
    }
    /**
     * The validation message.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/validationMessage | `ElementInternals.validationMessage`} property.
     */
    get validationMessage() {
        return this.elementInternals.validationMessage || this.control.validationMessage;
    }
    /**
     * The current value of the input.
     * @public
     */
    get value() {
        Observable.track(this, 'value');
        return this.currentValue;
    }
    set value(value) {
        this.currentValue = value;
        if (this.$fastController.isConnected) {
            this.control.value = value ?? '';
            this.setFormValue(value);
            this.setValidity();
            Observable.notify(this, 'value');
        }
    }
    /**
     * Determines if the control can be submitted for constraint validation.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/willValidate | `ElementInternals.willValidate`} property.
     */
    get willValidate() {
        return this.elementInternals.willValidate;
    }
    /**
     * The associated form element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/form | `ElementInternals.form`} property.
     */
    get form() {
        return this.elementInternals.form;
    }
    /**
     * Handles the internal control's `keypress` event.
     *
     * @internal
     */
    beforeinputHandler(e) {
        if (e.inputType === 'insertLineBreak') {
            this.implicitSubmit();
        }
        return true;
    }
    /**
     * Change event handler for inner control.
     *
     * @internal
     * @privateRemarks
     * "Change" events are not `composable` so they will not permeate the shadow DOM boundary. This function effectively
     * proxies the change event, emitting a `change` event whenever the internal control emits a `change` event.
     */
    changeHandler(e) {
        this.setValidity();
        this.$emit('change', e, {
            bubbles: true,
            composed: true,
        });
        return true;
    }
    /**
     * Checks the validity of the element and returns the result.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/checkValidity | `HTMLInputElement.checkValidity()`} method.
     */
    checkValidity() {
        return this.elementInternals.checkValidity();
    }
    /**
     * Clicks the inner control when the component is clicked.
     *
     * @param e - the event object
     */
    clickHandler(e) {
        if (e.target === this) {
            this.control?.click();
        }
        return true;
    }
    connectedCallback() {
        super.connectedCallback();
        this.setFormValue(this.value);
        this.setValidity();
    }
    /**
     * Focuses the inner control when the component is focused.
     *
     * @param e - the event object
     * @public
     */
    focusinHandler(e) {
        if (e.target === this) {
            this.control?.focus();
        }
        return true;
    }
    /**
     * Resets the value to its initial value when the form is reset.
     *
     * @internal
     */
    formResetCallback() {
        this.value = this.initialValue;
        this.dirtyValue = false;
    }
    /**
     * Handles implicit form submission when the user presses the "Enter" key.
     *
     * @internal
     */
    implicitSubmit() {
        if (!this.elementInternals.form) {
            return;
        }
        if (this.elementInternals.form.elements.length === 1) {
            this.elementInternals.form.requestSubmit();
            return;
        }
        const formElements = [...this.elementInternals.form.elements];
        // Try submitting with the first submit button, if any
        const submitButton = formElements.find(x => x.getAttribute('type') === 'submit');
        if (submitButton) {
            submitButton.click();
            return;
        }
        // Determine if there is only one implicit submission blocking element
        const filteredElements = formElements.filter(x => ImplicitSubmissionBlockingTypes.includes(x.getAttribute('type') ?? ''));
        if (filteredElements.length > 1) {
            return;
        }
        this.elementInternals.form.requestSubmit();
    }
    /**
     * Handles the internal control's `input` event.
     *
     * @internal
     */
    inputHandler(e) {
        this.dirtyValue = true;
        this.value = this.control.value;
        return true;
    }
    /**
     * Handles the internal control's `keydown` event.
     *
     * @param e - the event object
     * @internal
     */
    keydownHandler(e) {
        if (e.key === 'Enter') {
            this.implicitSubmit();
        }
        return true;
    }
    /**
     * Selects all the text in the text field.
     *
     * @public
     * @privateRemarks
     * The `select` event does not permeate the shadow DOM boundary. This function effectively proxies the event,
     * emitting a `select` event whenever the internal control emits a `select` event
     *
     */
    select() {
        this.control.select();
        this.$emit('select');
    }
    /**
     * Sets the custom validity message.
     * @param message - The message to set
     *
     * @public
     */
    setCustomValidity(message) {
        this.elementInternals.setValidity({ customError: true }, message);
        this.reportValidity();
    }
    /**
     * Reports the validity of the element.
     *
     * @public
     * @remarks
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/reportValidity | `HTMLInputElement.reportValidity()`} method.
     */
    reportValidity() {
        return this.elementInternals.reportValidity();
    }
    /**
     * Reflects the {@link https://developer.mozilla.org/docs/Web/API/ElementInternals/setFormValue | `ElementInternals.setFormValue()`} method.
     *
     * @internal
     */
    setFormValue(value, state) {
        this.elementInternals.setFormValue(value, value ?? state);
    }
    /**
     * Sets the validity of the control.
     *
     * @param flags - Validity flags. If not provided, the control's `validity` will be used.
     * @param message - Optional message to supply. If not provided, the control's `validationMessage` will be used. If the control does not have a `validationMessage`, the message will be empty.
     * @param anchor - Optional anchor to use for the validation message. If not provided, the control will be used.
     *
     * @internal
     */
    setValidity(flags, message, anchor) {
        if (this.$fastController.isConnected && this.control) {
            if (this.disabled) {
                this.elementInternals.setValidity({});
                return;
            }
            this.elementInternals.setValidity(flags ?? this.control.validity, message ?? this.validationMessage, anchor ?? this.control);
        }
    }
}
__decorate([
    attr
], BaseTextInput.prototype, "autocomplete", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "autofocus", void 0);
__decorate([
    attr({ attribute: 'current-value' })
], BaseTextInput.prototype, "currentValue", void 0);
__decorate([
    observable
], BaseTextInput.prototype, "defaultSlottedNodes", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "dirname", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "disabled", void 0);
__decorate([
    attr({ attribute: 'form' })
], BaseTextInput.prototype, "formAttribute", void 0);
__decorate([
    attr({ attribute: 'value', mode: 'fromView' })
], BaseTextInput.prototype, "initialValue", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "list", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "maxlength", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "minlength", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "multiple", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "name", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "pattern", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "placeholder", void 0);
__decorate([
    attr({ attribute: 'readonly', mode: 'boolean' })
], BaseTextInput.prototype, "readOnly", void 0);
__decorate([
    attr({ mode: 'boolean' })
], BaseTextInput.prototype, "required", void 0);
__decorate([
    attr({ converter: nullableNumberConverter })
], BaseTextInput.prototype, "size", void 0);
__decorate([
    attr({
        converter: {
            fromView: value => (typeof value === 'string' ? ['true', ''].includes(value.trim().toLowerCase()) : null),
            toView: value => value.toString(),
        },
    })
], BaseTextInput.prototype, "spellcheck", void 0);
__decorate([
    attr
], BaseTextInput.prototype, "type", void 0);
__decorate([
    observable
], BaseTextInput.prototype, "control", void 0);
__decorate([
    observable
], BaseTextInput.prototype, "controlLabel", void 0);

/**
 * A Text Input Custom HTML Element.
 * Based on BaseTextInput and includes style and layout specific attributes
 *
 * @tag fluent-text-input
 *
 * @public
 */
class TextInput extends BaseTextInput {
}
__decorate([
    attr
], TextInput.prototype, "appearance", void 0);
__decorate([
    attr({ attribute: 'control-size' })
], TextInput.prototype, "controlSize", void 0);
applyMixins(TextInput, StartEnd);

/**
 * Styles for the TextInput component.
 *
 * @public
 */
const styles = css `
  ${display('block')}

  :host {
    font-family: ${fontFamilyBase};
    font-size: ${fontSizeBase300};
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase300};
    max-width: 400px;
  }
  .label {
    display: flex;
    color: ${colorNeutralForeground1};
    padding-bottom: ${spacingVerticalXS};
    flex-shrink: 0;
    padding-inline-end: ${spacingHorizontalXS};
  }

  .label[hidden],
  :host(:empty) .label {
    display: none;
  }

  .root {
    align-items: center;
    background-color: ${colorNeutralBackground1};
    border: ${strokeWidthThin} solid ${colorNeutralStroke1};
    border-bottom-color: ${colorNeutralStrokeAccessible};
    border-radius: ${borderRadiusMedium};
    box-sizing: border-box;
    height: 32px;
    display: inline-flex;
    flex-direction: row;
    gap: ${spacingHorizontalXXS};
    padding: 0 ${spacingHorizontalMNudge};
    position: relative;
    width: 100%;
  }

  :has(.control:user-invalid) {
    border-color: ${colorPaletteRedBorder2};
  }

  .root::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    left: -1px;
    bottom: 0px;
    right: -1px;
    height: max(2px, ${borderRadiusMedium});
    border-radius: 0 0 ${borderRadiusMedium} ${borderRadiusMedium};
    border-bottom: 2px solid ${colorCompoundBrandStroke};
    clip-path: inset(calc(100% - 2px) 1px 0px);
    transform: scaleX(0);
    transition-property: transform;
    transition-duration: ${durationUltraFast};
    transition-delay: ${curveAccelerateMid};
  }
  .control {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: ${colorNeutralForeground1};
    border-radius: ${borderRadiusMedium};
    background: ${colorTransparentBackground};
    font-family: ${fontFamilyBase};
    font-weight: ${fontWeightRegular};
    font-size: ${fontSizeBase300};
    border: none;
    vertical-align: center;
  }
  .control:focus-visible {
    outline: 0;
    border: 0;
  }
  .control::placeholder {
    color: ${colorNeutralForeground4};
  }
  :host ::slotted([slot='start']),
  :host ::slotted([slot='end']) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${colorNeutralForeground3};
    font-size: ${fontSizeBase500};
  }
  :host ::slotted([slot='start']) {
    padding-right: ${spacingHorizontalXXS};
  }
  :host ::slotted([slot='end']) {
    padding-left: ${spacingHorizontalXXS};
    gap: ${spacingHorizontalXS};
  }
  :host(:hover) .root {
    border-color: ${colorNeutralStroke1Hover};
    border-bottom-color: ${colorNeutralStrokeAccessibleHover};
  }
  :host(:active) .root {
    border-color: ${colorNeutralStroke1Pressed};
  }
  :host(:focus-within) .root {
    outline: transparent solid 2px;
    border-bottom: 0;
  }
  :host(:focus-within) .root::after {
    transform: scaleX(1);
    transition-property: transform;
    transition-duration: ${durationNormal};
    transition-delay: ${curveDecelerateMid};
  }
  :host(:focus-within:active) .root:after {
    border-bottom-color: ${colorCompoundBrandStrokePressed};
  }
  :host([appearance='outline']:focus-within) .root {
    border: ${strokeWidthThin} solid ${colorNeutralStroke1};
  }
  :host(:focus-within) .control {
    color: ${colorNeutralForeground1};
  }
  :host([disabled]) .root {
    background: ${colorTransparentBackground};
    border: ${strokeWidthThin} solid ${colorNeutralStrokeDisabled};
  }
  :host([disabled]) .control::placeholder,
  :host([disabled]) ::slotted([slot='start']),
  :host([disabled]) ::slotted([slot='end']) {
    color: ${colorNeutralForegroundDisabled};
  }
  ::selection {
    color: ${colorNeutralForegroundInverted};
    background-color: ${colorNeutralBackgroundInverted};
  }
  :host([control-size='small']) .control {
    font-size: ${fontSizeBase200};
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase200};
  }
  :host([control-size='small']) .root {
    height: 24px;
    gap: ${spacingHorizontalXXS};
    padding: 0 ${spacingHorizontalSNudge};
  }
  :host([control-size='small']) ::slotted([slot='start']),
  :host([control-size='small']) ::slotted([slot='end']) {
    font-size: ${fontSizeBase400};
  }
  :host([control-size='large']) .control {
    font-size: ${fontSizeBase400};
    font-weight: ${fontWeightRegular};
    line-height: ${lineHeightBase400};
  }
  :host([control-size='large']) .root {
    height: 40px;
    gap: ${spacingHorizontalS};
    padding: 0 ${spacingHorizontalM};
  }
  :host([control-size='large']) ::slotted([slot='start']),
  :host([control-size='large']) ::slotted([slot='end']) {
    font-size: ${fontSizeBase600};
  }
  :host([appearance='underline']) .root {
    background: ${colorTransparentBackground};
    border: 0;
    border-radius: 0;
    border-bottom: ${strokeWidthThin} solid ${colorNeutralStrokeAccessible};
  }
  :host([appearance='underline']:hover) .root {
    border-bottom-color: ${colorNeutralStrokeAccessibleHover};
  }
  :host([appearance='underline']:active) .root {
    border-bottom-color: ${colorNeutralStrokeAccessiblePressed};
  }
  :host([appearance='underline']:focus-within) .root {
    border: 0;
    border-bottom-color: ${colorNeutralStrokeAccessiblePressed};
  }
  :host([appearance='underline'][disabled]) .root {
    border-bottom-color: ${colorNeutralStrokeDisabled};
  }
  :host([appearance='filled-lighter']) .root,
  :host([appearance='filled-darker']) .root {
    border: ${strokeWidthThin} solid ${colorTransparentStroke};
    box-shadow: ${shadow2};
  }
  :host([appearance='filled-lighter']) .root {
    background: ${colorNeutralBackground1};
  }
  :host([appearance='filled-darker']) .root {
    background: ${colorNeutralBackground3};
  }
  :host([appearance='filled-lighter']:hover) .root,
  :host([appearance='filled-darker']:hover) .root {
    border-color: ${colorTransparentStrokeInteractive};
  }
  :host([appearance='filled-lighter']:active) .root,
  :host([appearance='filled-darker']:active) .root {
    border-color: ${colorTransparentStrokeInteractive};
    background: ${colorNeutralBackground3};
  }
`;

/**
 * Generates a template for the TextInput component.
 *
 * @public
 */
function textInputTemplate(options = {}) {
    return html `
    <template
      @beforeinput="${(x, c) => x.beforeinputHandler(c.event)}"
      @focusin="${(x, c) => x.focusinHandler(c.event)}"
      @keydown="${(x, c) => x.keydownHandler(c.event)}"
    >
      <label part="label" for="control" class="label" ${ref('controlLabel')}>
        <slot
          ${slotted({
        property: 'defaultSlottedNodes',
        filter: whitespaceFilter,
    })}
        ></slot>
      </label>
      <div class="root" part="root">
        ${startSlotTemplate(options)}
        <input
          class="control"
          part="control"
          id="control"
          @change="${(x, c) => x.changeHandler(c.event)}"
          @input="${(x, c) => x.inputHandler(c.event)}"
          ?autofocus="${x => x.autofocus}"
          autocomplete="${x => x.autocomplete}"
          ?disabled="${x => x.disabled}"
          list="${x => x.list}"
          maxlength="${x => x.maxlength}"
          minlength="${x => x.minlength}"
          ?multiple="${x => x.multiple}"
          name="${x => x.name}"
          pattern="${x => x.pattern}"
          placeholder="${x => x.placeholder}"
          ?readonly="${x => x.readOnly}"
          ?required="${x => x.required}"
          size="${x => x.size}"
          spellcheck="${x => x.spellcheck}"
          type="${x => x.type}"
          value="${x => x.initialValue}"
          ${ref('control')}
        />
        ${endSlotTemplate(options)}
      </div>
    </template>
  `;
}
/**
 * @internal
 */
const template = textInputTemplate();

/**
 * The Fluent TextInput Element definition.
 *
 * @public
 * @remarks
 * HTML Element: `<fluent-text-input>`
 */
const definition = TextInput.compose({
    name: `${FluentDesignSystem.prefix}-text-input`,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});

const SUPPORTS_ADOPTED_STYLE_SHEETS = 'adoptedStyleSheets' in document;
const SUPPORTS_CSS_SCOPE = 'CSSScopeRule' in window;
// A map from a theme to Custom Property declarations for the theme as a string.
// Each value should be a list of CSS Custom Property declarations, and should
// NOT include any selector, `{`, or `}`.
const themeStyleTextMap = new Map();
// A map from a theme to a unique string used to identity a theme. The string
// will be used as the value of the `data-fluent-theme` attribute on a
// differently themed element.
const scopedThemeKeyMap = new Map();
// A map from an element with shadow root to a `CSSStyleSheet` object that
// references its local theme style sheet.
const shadowAdoptedStyleSheetMap = new Map();
// A map from an element to its set theme. This is used only when
// `document.adoptedStyleSheets` or CSS Scope is not supported.
const elementThemeMap = new Map();
const globalThemeStyleSheet = new CSSStyleSheet();
/**
 * Sets the theme tokens as CSS Custom Properties. The Custom Properties are
 * set in a constructed stylesheet on `document.adoptedStyleSheets` if
 * supported, and on `document.documentElement.style` as a fallback.
 *
 * @param theme - Flat object of theme tokens. Each object entry must follow
 *     these rules: the key is the name of the token, usually in camel case, it
 *     must be a valid CSS Custom Property name WITHOUT the starting two dashes
 *     (`--`), the two dashes are added inside the function; the value must be
 *     a valid CSS value, e.g. it cannot contain semicolons (`;`).
 *     Note that this argument is not limited to existing theme objects (from
 *     `@fluentui/tokens`), you can pass in an arbitrary theme object as long
 *     as each entry’s value is either a string or a number.
 * @param node - The node to set the theme on, defaults to `document` for
 *     setting global theme.
 * @internal
 */
function setTheme(theme, node = document) {
    if (!node || !isThemeableNode(node)) {
        return;
    }
    // Fallback to setting token custom properties on `<html>` element’s `style`
    // attribute.
    if (!SUPPORTS_ADOPTED_STYLE_SHEETS || (node instanceof HTMLElement && !node.shadowRoot && !SUPPORTS_CSS_SCOPE)) {
        const target = node === document ? document.documentElement : node;
        setThemePropertiesOnElement(theme, target);
        return;
    }
    if ([document, document.documentElement, document.body].includes(node)) {
        setGlobalTheme(theme);
    }
    else {
        setLocalTheme(theme, node);
    }
}
function getThemeStyleText(theme) {
    if (!themeStyleTextMap.has(theme)) {
        const tokenDeclarations = [];
        for (const [tokenName, tokenValue] of Object.entries(theme)) {
            tokenDeclarations.push(`--${tokenName}:${tokenValue.toString()};`);
        }
        themeStyleTextMap.set(theme, tokenDeclarations.join(''));
    }
    return themeStyleTextMap.get(theme);
}
/**
 * A themeable node should either be one of the following:
 * - `document`
 * - `html`
 * - `body`
 * - Any HTML element inside `body`
 */
function isThemeableNode(node) {
    return [document, document.documentElement].includes(node) || (node instanceof HTMLElement && !!node.closest('body'));
}
function setGlobalTheme(theme) {
    if (theme === null) {
        if (document.adoptedStyleSheets.includes(globalThemeStyleSheet)) {
            globalThemeStyleSheet.replaceSync('');
        }
        return;
    }
    // Update the CSSStyleSheet with the new theme
    globalThemeStyleSheet.replaceSync(`
    html {
      ${getThemeStyleText(theme)}
    }
  `);
    // Adopt the updated CSSStyleSheet if it hasn't been adopted yet
    if (!document.adoptedStyleSheets.includes(globalThemeStyleSheet)) {
        document.adoptedStyleSheets.push(globalThemeStyleSheet);
    }
}
function setLocalTheme(theme, element) {
    if (theme === null) {
        if (element.shadowRoot && shadowAdoptedStyleSheetMap.has(element)) {
            shadowAdoptedStyleSheetMap.get(element).replaceSync('');
        }
        else {
            delete element.dataset.fluentTheme;
            forceRepaint(element);
        }
        return;
    }
    if (element.shadowRoot) {
        getShadowAdoptedStyleSheet(element).replaceSync(`
      :host {
        ${getThemeStyleText(theme)}
      }
    `);
    }
    else {
        element.dataset.fluentTheme = getScopedThemeKey(theme);
        forceRepaint(element);
    }
}
function getShadowAdoptedStyleSheet(element) {
    if (!shadowAdoptedStyleSheetMap.has(element)) {
        const shadowAdoptedStyleSheet = new CSSStyleSheet();
        shadowAdoptedStyleSheetMap.set(element, shadowAdoptedStyleSheet);
        element.shadowRoot?.adoptedStyleSheets.push(shadowAdoptedStyleSheet);
    }
    return shadowAdoptedStyleSheetMap.get(element);
}
function getScopedThemeKey(theme) {
    if (!scopedThemeKeyMap.has(theme)) {
        const themeKey = uniqueId('fluent-theme-');
        const scopedThemeStyleSheet = new CSSStyleSheet();
        scopedThemeKeyMap.set(theme, themeKey);
        scopedThemeStyleSheet.replaceSync(`
      @scope ([data-fluent-theme="${themeKey}"]) {
        :scope {
          ${getThemeStyleText(theme)}
        }
      }
    `);
        document.adoptedStyleSheets.push(scopedThemeStyleSheet);
    }
    return scopedThemeKeyMap.get(theme);
}
function setThemePropertiesOnElement(theme, element) {
    let tokens;
    if (theme === null) {
        if (!elementThemeMap.has(element)) {
            return;
        }
        tokens = elementThemeMap.get(element);
    }
    else {
        elementThemeMap.set(element, theme);
        tokens = theme;
    }
    for (const [tokenName, tokenValue] of Object.entries(tokens)) {
        if (theme === null) {
            element.style.removeProperty(`--${tokenName}`);
        }
        else {
            element.style.setProperty(`--${tokenName}`, tokenValue.toString());
        }
    }
}
/**
 * This function fixes a Safari bug: when an element should no longer be
 * selected by an `@scope` rule, the styles defined in the `:scope` selector
 * persist.
 * @see https://bugs.webkit.org/show_bug.cgi?id=276454
 *
 * UA sniff regular expression is based on
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#rendering_engine | the MDN documentation}.
 */
const { userAgent: UA } = navigator;
const isWebkit = /\bAppleWebKit\/[\d+\.]+\b/.test(UA);
function forceRepaint(element) {
    if (!isWebkit) {
        return;
    }
    const name = 'visibility';
    const tempValue = 'hidden';
    const currentValue = element.style.getPropertyValue(name);
    element.style.setProperty(name, tempValue);
    Updates.process();
    element.style.setProperty(name, currentValue);
}

/* !!! DO NOT EDIT !!! */ /* This file has been generated by the token pipeline */ const grey = {
    '2': '#050505',
    '4': '#0a0a0a',
    '6': '#0f0f0f',
    '8': '#141414',
    '10': '#1a1a1a',
    '12': '#1f1f1f',
    '14': '#242424',
    '16': '#292929',
    '18': '#2e2e2e',
    '20': '#333333',
    '22': '#383838',
    '24': '#3d3d3d',
    '26': '#424242',
    '30': '#4d4d4d',
    '32': '#525252',
    '34': '#575757',
    '36': '#5c5c5c',
    '38': '#616161',
    '40': '#666666',
    '42': '#6b6b6b',
    '44': '#707070',
    '46': '#757575',
    '60': '#999999',
    '68': '#adadad',
    '70': '#b3b3b3',
    '74': '#bdbdbd',
    '78': '#c7c7c7',
    '82': '#d1d1d1',
    '84': '#d6d6d6',
    '86': '#dbdbdb',
    '88': '#e0e0e0',
    '90': '#e6e6e6',
    '92': '#ebebeb',
    '94': '#f0f0f0',
    '96': '#f5f5f5',
    '98': '#fafafa'
};
const whiteAlpha = {
    '5': 'rgba(255, 255, 255, 0.05)',
    '10': 'rgba(255, 255, 255, 0.1)',
    '20': 'rgba(255, 255, 255, 0.2)',
    '40': 'rgba(255, 255, 255, 0.4)',
    '50': 'rgba(255, 255, 255, 0.5)',
    '60': 'rgba(255, 255, 255, 0.6)',
    '70': 'rgba(255, 255, 255, 0.7)',
    '80': 'rgba(255, 255, 255, 0.8)'};
const blackAlpha = {
    '5': 'rgba(0, 0, 0, 0.05)',
    '10': 'rgba(0, 0, 0, 0.1)',
    '20': 'rgba(0, 0, 0, 0.2)',
    '30': 'rgba(0, 0, 0, 0.3)',
    '40': 'rgba(0, 0, 0, 0.4)',
    '50': 'rgba(0, 0, 0, 0.5)'};
const grey10Alpha = {
    '50': 'rgba(26, 26, 26, 0.5)'};
const grey12Alpha = {
    '70': 'rgba(31, 31, 31, 0.7)'};
const grey14Alpha = {
    '50': 'rgba(36, 36, 36, 0.5)',
    '80': 'rgba(36, 36, 36, 0.8)'};
const white = '#ffffff';
const black = '#000000';
const darkRed = {
    shade50: '#130204',
    shade40: '#230308',
    shade30: '#420610',
    shade20: '#590815',
    shade10: '#690a19',
    primary: '#750b1c',
    tint10: '#861b2c',
    tint20: '#962f3f',
    tint30: '#ac4f5e',
    tint40: '#d69ca5',
    tint50: '#e9c7cd',
    tint60: '#f9f0f2'
};
const cranberry = {
    shade50: '#200205',
    shade40: '#3b0509',
    shade30: '#6e0811',
    shade20: '#960b18',
    shade10: '#b10e1c',
    primary: '#c50f1f',
    tint10: '#cc2635',
    tint20: '#d33f4c',
    tint30: '#dc626d',
    tint40: '#eeacb2',
    tint50: '#f6d1d5',
    tint60: '#fdf3f4'
};
const red = {
    shade50: '#210809',
    shade40: '#3f1011',
    shade30: '#751d1f',
    shade20: '#9f282b',
    shade10: '#bc2f32',
    primary: '#d13438',
    tint10: '#d7494c',
    tint20: '#dc5e62',
    tint30: '#e37d80',
    tint40: '#f1bbbc',
    tint50: '#f8dadb',
    tint60: '#fdf6f6'
};
const darkOrange = {
    shade50: '#230900',
    shade40: '#411200',
    shade30: '#7a2101',
    shade20: '#a62d01',
    shade10: '#c43501',
    primary: '#da3b01',
    tint10: '#de501c',
    tint20: '#e36537',
    tint30: '#e9835e',
    tint40: '#f4bfab',
    tint50: '#f9dcd1',
    tint60: '#fdf6f3'
};
const pumpkin = {
    shade50: '#200d03',
    shade40: '#3d1805',
    shade30: '#712d09',
    shade20: '#9a3d0c',
    shade10: '#b6480e',
    primary: '#ca5010',
    tint10: '#d06228',
    tint20: '#d77440',
    tint30: '#df8e64',
    tint40: '#efc4ad',
    tint50: '#f7dfd2',
    tint60: '#fdf7f4'
};
const orange = {
    shade50: '#271002',
    shade40: '#4a1e04',
    shade30: '#8a3707',
    shade20: '#bc4b09',
    shade10: '#de590b',
    primary: '#f7630c',
    tint10: '#f87528',
    tint20: '#f98845',
    tint30: '#faa06b',
    tint40: '#fdcfb4',
    tint50: '#fee5d7',
    tint60: '#fff9f5'
};
const peach = {
    shade50: '#291600',
    shade40: '#4d2a00',
    shade30: '#8f4e00',
    shade20: '#c26a00',
    shade10: '#e67e00',
    primary: '#ff8c00',
    tint10: '#ff9a1f',
    tint20: '#ffa83d',
    tint30: '#ffba66',
    tint40: '#ffddb3',
    tint50: '#ffedd6',
    tint60: '#fffaf5'
};
const marigold = {
    shade50: '#251a00',
    shade40: '#463100',
    shade30: '#835b00',
    shade20: '#b27c00',
    shade10: '#d39300',
    primary: '#eaa300',
    tint10: '#edad1c',
    tint20: '#efb839',
    tint30: '#f2c661',
    tint40: '#f9e2ae',
    tint50: '#fcefd3',
    tint60: '#fefbf4'
};
const yellow = {
    shade50: '#282400',
    shade40: '#4c4400',
    shade30: '#817400',
    shade20: '#c0ad00',
    shade10: '#e4cc00',
    primary: '#fde300',
    tint10: '#fde61e',
    tint20: '#fdea3d',
    tint30: '#feee66',
    tint40: '#fef7b2',
    tint50: '#fffad6',
    tint60: '#fffef5'
};
const gold = {
    shade50: '#1f1900',
    shade40: '#3a2f00',
    shade30: '#6c5700',
    shade20: '#937700',
    shade10: '#ae8c00',
    primary: '#c19c00',
    tint10: '#c8a718',
    tint20: '#d0b232',
    tint30: '#dac157',
    tint40: '#ecdfa5',
    tint50: '#f5eece',
    tint60: '#fdfbf2'
};
const brass = {
    shade50: '#181202',
    shade40: '#2e2103',
    shade30: '#553e06',
    shade20: '#745408',
    shade10: '#89640a',
    primary: '#986f0b',
    tint10: '#a47d1e',
    tint20: '#b18c34',
    tint30: '#c1a256',
    tint40: '#e0cea2',
    tint50: '#efe4cb',
    tint60: '#fbf8f2'
};
const brown = {
    shade50: '#170e07',
    shade40: '#2b1a0e',
    shade30: '#50301a',
    shade20: '#6c4123',
    shade10: '#804d29',
    primary: '#8e562e',
    tint10: '#9c663f',
    tint20: '#a97652',
    tint30: '#bb8f6f',
    tint40: '#ddc3b0',
    tint50: '#edded3',
    tint60: '#faf7f4'
};
const forest = {
    shade50: '#0c1501',
    shade40: '#162702',
    shade30: '#294903',
    shade20: '#376304',
    shade10: '#427505',
    primary: '#498205',
    tint10: '#599116',
    tint20: '#6ba02b',
    tint30: '#85b44c',
    tint40: '#bdd99b',
    tint50: '#dbebc7',
    tint60: '#f6faf0'
};
const seafoam = {
    shade50: '#002111',
    shade40: '#003d20',
    shade30: '#00723b',
    shade20: '#009b51',
    shade10: '#00b85f',
    primary: '#00cc6a',
    tint10: '#19d279',
    tint20: '#34d889',
    tint30: '#5ae0a0',
    tint40: '#a8f0cd',
    tint50: '#cff7e4',
    tint60: '#f3fdf8'
};
const lightGreen = {
    shade50: '#031a02',
    shade40: '#063004',
    shade30: '#0b5a08',
    shade20: '#0e7a0b',
    shade10: '#11910d',
    primary: '#13a10e',
    tint10: '#27ac22',
    tint20: '#3db838',
    tint30: '#5ec75a',
    tint40: '#a7e3a5',
    tint50: '#cef0cd',
    tint60: '#f2fbf2'
};
const green = {
    shade50: '#031403',
    shade40: '#052505',
    shade30: '#094509',
    shade20: '#0c5e0c',
    shade10: '#0e700e',
    primary: '#107c10',
    tint10: '#218c21',
    tint20: '#359b35',
    tint30: '#54b054',
    tint40: '#9fd89f',
    tint50: '#c9eac9',
    tint60: '#f1faf1'
};
const darkGreen = {
    shade50: '#021102',
    shade40: '#032003',
    shade30: '#063b06',
    shade20: '#085108',
    shade10: '#0a5f0a',
    primary: '#0b6a0b',
    tint10: '#1a7c1a',
    tint20: '#2d8e2d',
    tint30: '#4da64d',
    tint40: '#9ad29a',
    tint50: '#c6e7c6',
    tint60: '#f0f9f0'
};
const lightTeal = {
    shade50: '#001d1f',
    shade40: '#00373a',
    shade30: '#00666d',
    shade20: '#008b94',
    shade10: '#00a5af',
    primary: '#00b7c3',
    tint10: '#18bfca',
    tint20: '#32c8d1',
    tint30: '#58d3db',
    tint40: '#a6e9ed',
    tint50: '#cef3f5',
    tint60: '#f2fcfd'
};
const teal = {
    shade50: '#001516',
    shade40: '#012728',
    shade30: '#02494c',
    shade20: '#026467',
    shade10: '#037679',
    primary: '#038387',
    tint10: '#159195',
    tint20: '#2aa0a4',
    tint30: '#4cb4b7',
    tint40: '#9bd9db',
    tint50: '#c7ebec',
    tint60: '#f0fafa'
};
const steel = {
    shade50: '#000f12',
    shade40: '#001b22',
    shade30: '#00333f',
    shade20: '#004555',
    shade10: '#005265',
    primary: '#005b70',
    tint10: '#0f6c81',
    tint20: '#237d92',
    tint30: '#4496a9',
    tint40: '#94c8d4',
    tint50: '#c3e1e8',
    tint60: '#eff7f9'
};
const blue = {
    shade50: '#001322',
    shade40: '#002440',
    shade30: '#004377',
    shade20: '#005ba1',
    shade10: '#006cbf',
    primary: '#0078d4',
    tint10: '#1a86d9',
    tint20: '#3595de',
    tint30: '#5caae5',
    tint40: '#a9d3f2',
    tint50: '#d0e7f8',
    tint60: '#f3f9fd'
};
const royalBlue = {
    shade50: '#000c16',
    shade40: '#00172a',
    shade30: '#002c4e',
    shade20: '#003b6a',
    shade10: '#00467e',
    primary: '#004e8c',
    tint10: '#125e9a',
    tint20: '#286fa8',
    tint30: '#4a89ba',
    tint40: '#9abfdc',
    tint50: '#c7dced',
    tint60: '#f0f6fa'
};
const cornflower = {
    shade50: '#0d1126',
    shade40: '#182047',
    shade30: '#2c3c85',
    shade20: '#3c51b4',
    shade10: '#4760d5',
    primary: '#4f6bed',
    tint10: '#637cef',
    tint20: '#778df1',
    tint30: '#93a4f4',
    tint40: '#c8d1fa',
    tint50: '#e1e6fc',
    tint60: '#f7f9fe'
};
const navy = {
    shade50: '#00061d',
    shade40: '#000c36',
    shade30: '#001665',
    shade20: '#001e89',
    shade10: '#0023a2',
    primary: '#0027b4',
    tint10: '#173bbd',
    tint20: '#3050c6',
    tint30: '#546fd2',
    tint40: '#a3b2e8',
    tint50: '#ccd5f3',
    tint60: '#f2f4fc'
};
const lavender = {
    shade50: '#120f25',
    shade40: '#221d46',
    shade30: '#3f3682',
    shade20: '#5649b0',
    shade10: '#6656d1',
    primary: '#7160e8',
    tint10: '#8172eb',
    tint20: '#9184ee',
    tint30: '#a79cf1',
    tint40: '#d2ccf8',
    tint50: '#e7e4fb',
    tint60: '#f9f8fe'
};
const purple = {
    shade50: '#0f0717',
    shade40: '#1c0e2b',
    shade30: '#341a51',
    shade20: '#46236e',
    shade10: '#532982',
    primary: '#5c2e91',
    tint10: '#6b3f9e',
    tint20: '#7c52ab',
    tint30: '#9470bd',
    tint40: '#c6b1de',
    tint50: '#e0d3ed',
    tint60: '#f7f4fb'
};
const grape = {
    shade50: '#160418',
    shade40: '#29072e',
    shade30: '#4c0d55',
    shade20: '#671174',
    shade10: '#7a1589',
    primary: '#881798',
    tint10: '#952aa4',
    tint20: '#a33fb1',
    tint30: '#b55fc1',
    tint40: '#d9a7e0',
    tint50: '#eaceef',
    tint60: '#faf2fb'
};
const berry = {
    shade50: '#1f091d',
    shade40: '#3a1136',
    shade30: '#6d2064',
    shade20: '#932b88',
    shade10: '#af33a1',
    primary: '#c239b3',
    tint10: '#c94cbc',
    tint20: '#d161c4',
    tint30: '#da7ed0',
    tint40: '#edbbe7',
    tint50: '#f5daf2',
    tint60: '#fdf5fc'
};
const lilac = {
    shade50: '#1c0b1f',
    shade40: '#35153a',
    shade30: '#63276d',
    shade20: '#863593',
    shade10: '#9f3faf',
    primary: '#b146c2',
    tint10: '#ba58c9',
    tint20: '#c36bd1',
    tint30: '#cf87da',
    tint40: '#e6bfed',
    tint50: '#f2dcf5',
    tint60: '#fcf6fd'
};
const pink = {
    shade50: '#24091b',
    shade40: '#441232',
    shade30: '#80215d',
    shade20: '#ad2d7e',
    shade10: '#cd3595',
    primary: '#e43ba6',
    tint10: '#e750b0',
    tint20: '#ea66ba',
    tint30: '#ef85c8',
    tint40: '#f7c0e3',
    tint50: '#fbddf0',
    tint60: '#fef6fb'
};
const magenta = {
    shade50: '#1f0013',
    shade40: '#390024',
    shade30: '#6b0043',
    shade20: '#91005a',
    shade10: '#ac006b',
    primary: '#bf0077',
    tint10: '#c71885',
    tint20: '#ce3293',
    tint30: '#d957a8',
    tint40: '#eca5d1',
    tint50: '#f5cee6',
    tint60: '#fcf2f9'
};
const plum = {
    shade50: '#13000c',
    shade40: '#240017',
    shade30: '#43002b',
    shade20: '#5a003b',
    shade10: '#6b0045',
    primary: '#77004d',
    tint10: '#87105d',
    tint20: '#98246f',
    tint30: '#ad4589',
    tint40: '#d696c0',
    tint50: '#e9c4dc',
    tint60: '#faf0f6'
};
const beige = {
    shade50: '#141313',
    shade40: '#252323',
    shade30: '#444241',
    shade20: '#5d5958',
    shade10: '#6e6968',
    primary: '#7a7574',
    tint10: '#8a8584',
    tint20: '#9a9594',
    tint30: '#afabaa',
    tint40: '#d7d4d4',
    tint50: '#eae8e8',
    tint60: '#faf9f9'
};
const mink = {
    shade50: '#0f0e0e',
    shade40: '#1c1b1a',
    shade30: '#343231',
    shade20: '#474443',
    shade10: '#54514f',
    primary: '#5d5a58',
    tint10: '#706d6b',
    tint20: '#84817e',
    tint30: '#9e9b99',
    tint40: '#cecccb',
    tint50: '#e5e4e3',
    tint60: '#f8f8f8'
};
const platinum = {
    shade50: '#111314',
    shade40: '#1f2426',
    shade30: '#3b4447',
    shade20: '#505c60',
    shade10: '#5f6d71',
    primary: '#69797e',
    tint10: '#79898d',
    tint20: '#89989d',
    tint30: '#a0adb2',
    tint40: '#cdd6d8',
    tint50: '#e4e9ea',
    tint60: '#f8f9fa'
};
const anchor = {
    shade50: '#090a0b',
    shade40: '#111315',
    shade30: '#202427',
    shade20: '#2b3135',
    shade10: '#333a3f',
    primary: '#394146',
    tint10: '#4d565c',
    tint20: '#626c72',
    tint30: '#808a90',
    tint40: '#bcc3c7',
    tint50: '#dbdfe1',
    tint60: '#f6f7f8'
};

const statusSharedColors = {
    red,
    green,
    darkOrange,
    yellow,
    berry,
    lightGreen,
    marigold
};
const personaSharedColors = {
    darkRed,
    cranberry,
    pumpkin,
    peach,
    gold,
    brass,
    brown,
    forest,
    seafoam,
    darkGreen,
    lightTeal,
    teal,
    steel,
    blue,
    royalBlue,
    cornflower,
    navy,
    lavender,
    purple,
    grape,
    lilac,
    pink,
    magenta,
    plum,
    beige,
    mink,
    platinum,
    anchor
};
const mappedStatusColors = {
    cranberry,
    green,
    orange
};

/* Names of colors used in shared color palette alias tokens for status. */ const statusSharedColorNames = [
    'red',
    'green',
    'darkOrange',
    'yellow',
    'berry',
    'lightGreen',
    'marigold'
];
/* Names of colors used in shared color palette alias tokens for persona. */ const personaSharedColorNames = [
    'darkRed',
    'cranberry',
    'pumpkin',
    'peach',
    'gold',
    'brass',
    'brown',
    'forest',
    'seafoam',
    'darkGreen',
    'lightTeal',
    'teal',
    'steel',
    'blue',
    'royalBlue',
    'cornflower',
    'navy',
    'lavender',
    'purple',
    'grape',
    'lilac',
    'pink',
    'magenta',
    'plum',
    'beige',
    'mink',
    'platinum',
    'anchor'
];

const statusColorMapping = {
    success: 'green',
    warning: 'orange',
    danger: 'cranberry'
};

const statusColorPaletteTokens$1 = statusSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background1`]: statusSharedColors[sharedColor].tint60,
        [`colorPalette${color}Background2`]: statusSharedColors[sharedColor].tint40,
        [`colorPalette${color}Background3`]: statusSharedColors[sharedColor].primary,
        [`colorPalette${color}Foreground1`]: statusSharedColors[sharedColor].shade10,
        [`colorPalette${color}Foreground2`]: statusSharedColors[sharedColor].shade30,
        [`colorPalette${color}Foreground3`]: statusSharedColors[sharedColor].primary,
        [`colorPalette${color}BorderActive`]: statusSharedColors[sharedColor].primary,
        [`colorPalette${color}Border1`]: statusSharedColors[sharedColor].tint40,
        [`colorPalette${color}Border2`]: statusSharedColors[sharedColor].primary
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
// one-off patch for yellow
statusColorPaletteTokens$1.colorPaletteYellowForeground1 = statusSharedColors.yellow.shade30;
statusColorPaletteTokens$1.colorPaletteRedForegroundInverted = statusSharedColors.red.tint20;
statusColorPaletteTokens$1.colorPaletteGreenForegroundInverted = statusSharedColors.green.tint20;
statusColorPaletteTokens$1.colorPaletteYellowForegroundInverted = statusSharedColors.yellow.tint40;
const personaColorPaletteTokens$1 = personaSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background2`]: personaSharedColors[sharedColor].tint40,
        [`colorPalette${color}Foreground2`]: personaSharedColors[sharedColor].shade30,
        [`colorPalette${color}BorderActive`]: personaSharedColors[sharedColor].primary
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
const colorPaletteTokens$1 = {
    ...statusColorPaletteTokens$1,
    ...personaColorPaletteTokens$1
};
const colorStatusTokens$1 = Object.entries(statusColorMapping).reduce((acc, [statusColor, sharedColor])=>{
    const color = statusColor.slice(0, 1).toUpperCase() + statusColor.slice(1);
    // TODO: double check the mapping with design
    const statusColorTokens = {
        [`colorStatus${color}Background1`]: mappedStatusColors[sharedColor].tint60,
        [`colorStatus${color}Background2`]: mappedStatusColors[sharedColor].tint40,
        [`colorStatus${color}Background3`]: mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}Foreground1`]: mappedStatusColors[sharedColor].shade10,
        [`colorStatus${color}Foreground2`]: mappedStatusColors[sharedColor].shade30,
        [`colorStatus${color}Foreground3`]: mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}ForegroundInverted`]: mappedStatusColors[sharedColor].tint30,
        [`colorStatus${color}BorderActive`]: mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}Border1`]: mappedStatusColors[sharedColor].tint40,
        [`colorStatus${color}Border2`]: mappedStatusColors[sharedColor].primary
    };
    return Object.assign(acc, statusColorTokens);
}, {});
// one-off overrides for colorStatus tokens
colorStatusTokens$1.colorStatusDangerBackground3Hover = mappedStatusColors[statusColorMapping.danger].shade10;
colorStatusTokens$1.colorStatusDangerBackground3Pressed = mappedStatusColors[statusColorMapping.danger].shade20;
colorStatusTokens$1.colorStatusWarningForeground1 = mappedStatusColors[statusColorMapping.warning].shade20;
colorStatusTokens$1.colorStatusWarningForeground3 = mappedStatusColors[statusColorMapping.warning].shade20;
colorStatusTokens$1.colorStatusWarningBorder2 = mappedStatusColors[statusColorMapping.warning].shade20;

const generateColorTokens$1 = (brand)=>({
        colorNeutralForeground1: grey[14],
        colorNeutralForeground1Hover: grey[14],
        colorNeutralForeground1Pressed: grey[14],
        colorNeutralForeground1Selected: grey[14],
        colorNeutralForeground2: grey[26],
        colorNeutralForeground2Hover: grey[14],
        colorNeutralForeground2Pressed: grey[14],
        colorNeutralForeground2Selected: grey[14],
        colorNeutralForeground2BrandHover: brand[80],
        colorNeutralForeground2BrandPressed: brand[70],
        colorNeutralForeground2BrandSelected: brand[80],
        colorNeutralForeground3: grey[38],
        colorNeutralForeground3Hover: grey[26],
        colorNeutralForeground3Pressed: grey[26],
        colorNeutralForeground3Selected: grey[26],
        colorNeutralForeground3BrandHover: brand[80],
        colorNeutralForeground3BrandPressed: brand[70],
        colorNeutralForeground3BrandSelected: brand[80],
        colorNeutralForeground4: grey[44],
        colorNeutralForegroundDisabled: grey[74],
        colorNeutralForegroundInvertedDisabled: whiteAlpha[40],
        colorBrandForegroundLink: brand[70],
        colorBrandForegroundLinkHover: brand[60],
        colorBrandForegroundLinkPressed: brand[40],
        colorBrandForegroundLinkSelected: brand[70],
        colorNeutralForeground2Link: grey[26],
        colorNeutralForeground2LinkHover: grey[14],
        colorNeutralForeground2LinkPressed: grey[14],
        colorNeutralForeground2LinkSelected: grey[14],
        colorCompoundBrandForeground1: brand[80],
        colorCompoundBrandForeground1Hover: brand[70],
        colorCompoundBrandForeground1Pressed: brand[60],
        colorBrandForeground1: brand[80],
        colorBrandForeground2: brand[70],
        colorBrandForeground2Hover: brand[60],
        colorBrandForeground2Pressed: brand[30],
        colorNeutralForeground1Static: grey[14],
        colorNeutralForegroundStaticInverted: white,
        colorNeutralForegroundInverted: white,
        colorNeutralForegroundInvertedHover: white,
        colorNeutralForegroundInvertedPressed: white,
        colorNeutralForegroundInvertedSelected: white,
        colorNeutralForegroundInverted2: white,
        colorNeutralForegroundOnBrand: white,
        colorNeutralForegroundInvertedLink: white,
        colorNeutralForegroundInvertedLinkHover: white,
        colorNeutralForegroundInvertedLinkPressed: white,
        colorNeutralForegroundInvertedLinkSelected: white,
        colorBrandForegroundInverted: brand[100],
        colorBrandForegroundInvertedHover: brand[110],
        colorBrandForegroundInvertedPressed: brand[100],
        colorBrandForegroundOnLight: brand[80],
        colorBrandForegroundOnLightHover: brand[70],
        colorBrandForegroundOnLightPressed: brand[50],
        colorBrandForegroundOnLightSelected: brand[60],
        colorNeutralBackground1: white,
        colorNeutralBackground1Hover: grey[96],
        colorNeutralBackground1Pressed: grey[88],
        colorNeutralBackground1Selected: grey[92],
        colorNeutralBackground2: grey[98],
        colorNeutralBackground2Hover: grey[94],
        colorNeutralBackground2Pressed: grey[86],
        colorNeutralBackground2Selected: grey[90],
        colorNeutralBackground3: grey[96],
        colorNeutralBackground3Hover: grey[92],
        colorNeutralBackground3Pressed: grey[84],
        colorNeutralBackground3Selected: grey[88],
        colorNeutralBackground4: grey[94],
        colorNeutralBackground4Hover: grey[98],
        colorNeutralBackground4Pressed: grey[96],
        colorNeutralBackground4Selected: white,
        colorNeutralBackground5: grey[92],
        colorNeutralBackground5Hover: grey[96],
        colorNeutralBackground5Pressed: grey[94],
        colorNeutralBackground5Selected: grey[98],
        colorNeutralBackground6: grey[90],
        colorNeutralBackgroundInverted: grey[16],
        colorNeutralBackgroundStatic: grey[20],
        colorNeutralBackgroundAlpha: whiteAlpha[50],
        colorNeutralBackgroundAlpha2: whiteAlpha[80],
        colorSubtleBackground: 'transparent',
        colorSubtleBackgroundHover: grey[96],
        colorSubtleBackgroundPressed: grey[88],
        colorSubtleBackgroundSelected: grey[92],
        colorSubtleBackgroundLightAlphaHover: whiteAlpha[70],
        colorSubtleBackgroundLightAlphaPressed: whiteAlpha[50],
        colorSubtleBackgroundLightAlphaSelected: 'transparent',
        colorSubtleBackgroundInverted: 'transparent',
        colorSubtleBackgroundInvertedHover: blackAlpha[10],
        colorSubtleBackgroundInvertedPressed: blackAlpha[30],
        colorSubtleBackgroundInvertedSelected: blackAlpha[20],
        colorTransparentBackground: 'transparent',
        colorTransparentBackgroundHover: 'transparent',
        colorTransparentBackgroundPressed: 'transparent',
        colorTransparentBackgroundSelected: 'transparent',
        colorNeutralBackgroundDisabled: grey[94],
        colorNeutralBackgroundInvertedDisabled: whiteAlpha[10],
        colorNeutralStencil1: grey[90],
        colorNeutralStencil2: grey[98],
        colorNeutralStencil1Alpha: blackAlpha[10],
        colorNeutralStencil2Alpha: blackAlpha[5],
        colorBackgroundOverlay: blackAlpha[40],
        colorScrollbarOverlay: blackAlpha[50],
        colorBrandBackground: brand[80],
        colorBrandBackgroundHover: brand[70],
        colorBrandBackgroundPressed: brand[40],
        colorBrandBackgroundSelected: brand[60],
        colorCompoundBrandBackground: brand[80],
        colorCompoundBrandBackgroundHover: brand[70],
        colorCompoundBrandBackgroundPressed: brand[60],
        colorBrandBackgroundStatic: brand[80],
        colorBrandBackground2: brand[160],
        colorBrandBackground2Hover: brand[150],
        colorBrandBackground2Pressed: brand[130],
        colorBrandBackground3Static: brand[60],
        colorBrandBackground4Static: brand[40],
        colorBrandBackgroundInverted: white,
        colorBrandBackgroundInvertedHover: brand[160],
        colorBrandBackgroundInvertedPressed: brand[140],
        colorBrandBackgroundInvertedSelected: brand[150],
        colorNeutralCardBackground: grey[98],
        colorNeutralCardBackgroundHover: white,
        colorNeutralCardBackgroundPressed: grey[96],
        colorNeutralCardBackgroundSelected: grey[92],
        colorNeutralCardBackgroundDisabled: grey[94],
        colorNeutralStrokeAccessible: grey[38],
        colorNeutralStrokeAccessibleHover: grey[34],
        colorNeutralStrokeAccessiblePressed: grey[30],
        colorNeutralStrokeAccessibleSelected: brand[80],
        colorNeutralStroke1: grey[82],
        colorNeutralStroke1Hover: grey[78],
        colorNeutralStroke1Pressed: grey[70],
        colorNeutralStroke1Selected: grey[74],
        colorNeutralStroke2: grey[88],
        colorNeutralStroke3: grey[94],
        colorNeutralStrokeSubtle: grey[88],
        colorNeutralStrokeOnBrand: white,
        colorNeutralStrokeOnBrand2: white,
        colorNeutralStrokeOnBrand2Hover: white,
        colorNeutralStrokeOnBrand2Pressed: white,
        colorNeutralStrokeOnBrand2Selected: white,
        colorBrandStroke1: brand[80],
        colorBrandStroke2: brand[140],
        colorBrandStroke2Hover: brand[120],
        colorBrandStroke2Pressed: brand[80],
        colorBrandStroke2Contrast: brand[140],
        colorCompoundBrandStroke: brand[80],
        colorCompoundBrandStrokeHover: brand[70],
        colorCompoundBrandStrokePressed: brand[60],
        colorNeutralStrokeDisabled: grey[88],
        colorNeutralStrokeInvertedDisabled: whiteAlpha[40],
        colorTransparentStroke: 'transparent',
        colorTransparentStrokeInteractive: 'transparent',
        colorTransparentStrokeDisabled: 'transparent',
        colorNeutralStrokeAlpha: blackAlpha[5],
        colorNeutralStrokeAlpha2: whiteAlpha[20],
        colorStrokeFocus1: white,
        colorStrokeFocus2: black,
        colorNeutralShadowAmbient: 'rgba(0,0,0,0.12)',
        colorNeutralShadowKey: 'rgba(0,0,0,0.14)',
        colorNeutralShadowAmbientLighter: 'rgba(0,0,0,0.06)',
        colorNeutralShadowKeyLighter: 'rgba(0,0,0,0.07)',
        colorNeutralShadowAmbientDarker: 'rgba(0,0,0,0.20)',
        colorNeutralShadowKeyDarker: 'rgba(0,0,0,0.24)',
        colorBrandShadowAmbient: 'rgba(0,0,0,0.30)',
        colorBrandShadowKey: 'rgba(0,0,0,0.25)'
    });

const borderRadius = {
    borderRadiusNone: '0',
    borderRadiusSmall: '2px',
    borderRadiusMedium: '4px',
    borderRadiusLarge: '6px',
    borderRadiusXLarge: '8px',
    borderRadiusCircular: '10000px'
};

const curves = {
    curveAccelerateMax: 'cubic-bezier(0.9,0.1,1,0.2)',
    curveAccelerateMid: 'cubic-bezier(1,0,1,1)',
    curveAccelerateMin: 'cubic-bezier(0.8,0,0.78,1)',
    curveDecelerateMax: 'cubic-bezier(0.1,0.9,0.2,1)',
    curveDecelerateMid: 'cubic-bezier(0,0,0,1)',
    curveDecelerateMin: 'cubic-bezier(0.33,0,0.1,1)',
    curveEasyEaseMax: 'cubic-bezier(0.8,0,0.2,1)',
    curveEasyEase: 'cubic-bezier(0.33,0,0.67,1)',
    curveLinear: 'cubic-bezier(0,0,1,1)'
};

const durations = {
    durationUltraFast: '50ms',
    durationFaster: '100ms',
    durationFast: '150ms',
    durationNormal: '200ms',
    durationGentle: '250ms',
    durationSlow: '300ms',
    durationSlower: '400ms',
    durationUltraSlow: '500ms'
};

const fontSizes = {
    fontSizeBase100: '10px',
    fontSizeBase200: '12px',
    fontSizeBase300: '14px',
    fontSizeBase400: '16px',
    fontSizeBase500: '20px',
    fontSizeBase600: '24px',
    fontSizeHero700: '28px',
    fontSizeHero800: '32px',
    fontSizeHero900: '40px',
    fontSizeHero1000: '68px'
};
const lineHeights = {
    lineHeightBase100: '14px',
    lineHeightBase200: '16px',
    lineHeightBase300: '20px',
    lineHeightBase400: '22px',
    lineHeightBase500: '28px',
    lineHeightBase600: '32px',
    lineHeightHero700: '36px',
    lineHeightHero800: '40px',
    lineHeightHero900: '52px',
    lineHeightHero1000: '92px'
};
const fontWeights = {
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700
};
const fontFamilies = {
    fontFamilyBase: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
    fontFamilyMonospace: "Consolas, 'Courier New', Courier, monospace",
    fontFamilyNumeric: "Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"
};

// Intentionally not exported! Use horizontalSpacings and verticalSpacings instead.
const spacings = {
    none: '0',
    xxs: '2px',
    xs: '4px',
    sNudge: '6px',
    s: '8px',
    mNudge: '10px',
    m: '12px',
    l: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px'
};
const horizontalSpacings = {
    spacingHorizontalNone: spacings.none,
    spacingHorizontalXXS: spacings.xxs,
    spacingHorizontalXS: spacings.xs,
    spacingHorizontalSNudge: spacings.sNudge,
    spacingHorizontalS: spacings.s,
    spacingHorizontalMNudge: spacings.mNudge,
    spacingHorizontalM: spacings.m,
    spacingHorizontalL: spacings.l,
    spacingHorizontalXL: spacings.xl,
    spacingHorizontalXXL: spacings.xxl,
    spacingHorizontalXXXL: spacings.xxxl
};
const verticalSpacings = {
    spacingVerticalNone: spacings.none,
    spacingVerticalXXS: spacings.xxs,
    spacingVerticalXS: spacings.xs,
    spacingVerticalSNudge: spacings.sNudge,
    spacingVerticalS: spacings.s,
    spacingVerticalMNudge: spacings.mNudge,
    spacingVerticalM: spacings.m,
    spacingVerticalL: spacings.l,
    spacingVerticalXL: spacings.xl,
    spacingVerticalXXL: spacings.xxl,
    spacingVerticalXXXL: spacings.xxxl
};

const strokeWidths = {
    strokeWidthThin: '1px',
    strokeWidthThick: '2px',
    strokeWidthThicker: '3px',
    strokeWidthThickest: '4px'
};

function createShadowTokens(ambientColor, keyColor, tokenSuffix = '') {
    return {
        [`shadow2${tokenSuffix}`]: `0 0 2px ${ambientColor}, 0 1px 2px ${keyColor}`,
        [`shadow4${tokenSuffix}`]: `0 0 2px ${ambientColor}, 0 2px 4px ${keyColor}`,
        [`shadow8${tokenSuffix}`]: `0 0 2px ${ambientColor}, 0 4px 8px ${keyColor}`,
        [`shadow16${tokenSuffix}`]: `0 0 2px ${ambientColor}, 0 8px 16px ${keyColor}`,
        [`shadow28${tokenSuffix}`]: `0 0 8px ${ambientColor}, 0 14px 28px ${keyColor}`,
        [`shadow64${tokenSuffix}`]: `0 0 8px ${ambientColor}, 0 32px 64px ${keyColor}`
    };
}

const createLightTheme = (brand)=>{
    const colorTokens = generateColorTokens$1(brand);
    return {
        ...borderRadius,
        ...fontSizes,
        ...lineHeights,
        ...fontFamilies,
        ...fontWeights,
        ...strokeWidths,
        ...horizontalSpacings,
        ...verticalSpacings,
        ...durations,
        ...curves,
        ...colorTokens,
        ...colorPaletteTokens$1,
        ...colorStatusTokens$1,
        ...createShadowTokens(colorTokens.colorNeutralShadowAmbient, colorTokens.colorNeutralShadowKey),
        ...createShadowTokens(colorTokens.colorBrandShadowAmbient, colorTokens.colorBrandShadowKey, 'Brand')
    };
};

const brandWeb = {
    10: `#061724`,
    20: `#082338`,
    30: `#0a2e4a`,
    40: `#0c3b5e`,
    50: `#0e4775`,
    60: `#0f548c`,
    70: `#115ea3`,
    80: `#0f6cbd`,
    90: `#2886de`,
    100: `#479ef5`,
    110: `#62abf5`,
    120: `#77b7f7`,
    130: `#96c6fa`,
    140: `#b4d6fa`,
    150: `#cfe4fa`,
    160: `#ebf3fc`
};

const statusColorPaletteTokens = statusSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background1`]: statusSharedColors[sharedColor].shade40,
        [`colorPalette${color}Background2`]: statusSharedColors[sharedColor].shade30,
        [`colorPalette${color}Background3`]: statusSharedColors[sharedColor].primary,
        [`colorPalette${color}Foreground1`]: statusSharedColors[sharedColor].tint30,
        [`colorPalette${color}Foreground2`]: statusSharedColors[sharedColor].tint40,
        [`colorPalette${color}Foreground3`]: statusSharedColors[sharedColor].tint20,
        [`colorPalette${color}BorderActive`]: statusSharedColors[sharedColor].tint30,
        [`colorPalette${color}Border1`]: statusSharedColors[sharedColor].primary,
        [`colorPalette${color}Border2`]: statusSharedColors[sharedColor].tint20
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
// one-off patches
statusColorPaletteTokens.colorPaletteRedForeground3 = statusSharedColors.red.tint30;
statusColorPaletteTokens.colorPaletteRedBorder2 = statusSharedColors.red.tint30;
statusColorPaletteTokens.colorPaletteGreenForeground3 = statusSharedColors.green.tint40;
statusColorPaletteTokens.colorPaletteGreenBorder2 = statusSharedColors.green.tint40;
statusColorPaletteTokens.colorPaletteDarkOrangeForeground3 = statusSharedColors.darkOrange.tint30;
statusColorPaletteTokens.colorPaletteDarkOrangeBorder2 = statusSharedColors.darkOrange.tint30;
statusColorPaletteTokens.colorPaletteRedForegroundInverted = statusSharedColors.red.primary;
statusColorPaletteTokens.colorPaletteGreenForegroundInverted = statusSharedColors.green.primary;
statusColorPaletteTokens.colorPaletteYellowForegroundInverted = statusSharedColors.yellow.shade30;
const personaColorPaletteTokens = personaSharedColorNames.reduce((acc, sharedColor)=>{
    const color = sharedColor.slice(0, 1).toUpperCase() + sharedColor.slice(1);
    const sharedColorTokens = {
        [`colorPalette${color}Background2`]: personaSharedColors[sharedColor].shade30,
        [`colorPalette${color}Foreground2`]: personaSharedColors[sharedColor].tint40,
        [`colorPalette${color}BorderActive`]: personaSharedColors[sharedColor].tint30
    };
    return Object.assign(acc, sharedColorTokens);
}, {});
// one-off patches
personaColorPaletteTokens.colorPaletteDarkRedBackground2 = personaSharedColors.darkRed.shade20;
personaColorPaletteTokens.colorPalettePlumBackground2 = personaSharedColors.plum.shade20;
const colorPaletteTokens = {
    ...statusColorPaletteTokens,
    ...personaColorPaletteTokens
};
const colorStatusTokens = Object.entries(statusColorMapping).reduce((acc, [statusColor, sharedColor])=>{
    const color = statusColor.slice(0, 1).toUpperCase() + statusColor.slice(1);
    // TODO: double check the mapping with design - see the one-off patches above
    const statusColorTokens = {
        [`colorStatus${color}Background1`]: mappedStatusColors[sharedColor].shade40,
        [`colorStatus${color}Background2`]: mappedStatusColors[sharedColor].shade30,
        [`colorStatus${color}Background3`]: mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}Foreground1`]: mappedStatusColors[sharedColor].tint30,
        [`colorStatus${color}Foreground2`]: mappedStatusColors[sharedColor].tint40,
        [`colorStatus${color}Foreground3`]: mappedStatusColors[sharedColor].tint20,
        [`colorStatus${color}BorderActive`]: mappedStatusColors[sharedColor].tint30,
        [`colorStatus${color}ForegroundInverted`]: mappedStatusColors[sharedColor].shade10,
        [`colorStatus${color}Border1`]: mappedStatusColors[sharedColor].primary,
        [`colorStatus${color}Border2`]: mappedStatusColors[sharedColor].tint20
    };
    return Object.assign(acc, statusColorTokens);
}, {});
// one-off overrides for colorStatus tokens
colorStatusTokens.colorStatusDangerBackground3Hover = mappedStatusColors[statusColorMapping.danger].shade10;
colorStatusTokens.colorStatusDangerBackground3Pressed = mappedStatusColors[statusColorMapping.danger].shade20;
colorStatusTokens.colorStatusDangerForeground3 = mappedStatusColors[statusColorMapping.danger].tint40;
colorStatusTokens.colorStatusDangerBorder2 = mappedStatusColors[statusColorMapping.danger].tint30;
colorStatusTokens.colorStatusSuccessForeground3 = mappedStatusColors[statusColorMapping.success].tint40;
colorStatusTokens.colorStatusSuccessBorder2 = mappedStatusColors[statusColorMapping.success].tint40;
colorStatusTokens.colorStatusWarningForegroundInverted = mappedStatusColors[statusColorMapping.warning].shade20;

const webLightTheme = createLightTheme(brandWeb);

const generateColorTokens = (brand)=>({
        colorNeutralForeground1: white,
        colorNeutralForeground1Hover: white,
        colorNeutralForeground1Pressed: white,
        colorNeutralForeground1Selected: white,
        colorNeutralForeground2: grey[84],
        colorNeutralForeground2Hover: white,
        colorNeutralForeground2Pressed: white,
        colorNeutralForeground2Selected: white,
        colorNeutralForeground2BrandHover: brand[100],
        colorNeutralForeground2BrandPressed: brand[90],
        colorNeutralForeground2BrandSelected: brand[100],
        colorNeutralForeground3: grey[68],
        colorNeutralForeground3Hover: grey[84],
        colorNeutralForeground3Pressed: grey[84],
        colorNeutralForeground3Selected: grey[84],
        colorNeutralForeground3BrandHover: brand[100],
        colorNeutralForeground3BrandPressed: brand[90],
        colorNeutralForeground3BrandSelected: brand[100],
        colorNeutralForeground4: grey[60],
        colorNeutralForegroundDisabled: grey[36],
        colorNeutralForegroundInvertedDisabled: whiteAlpha[40],
        colorBrandForegroundLink: brand[100],
        colorBrandForegroundLinkHover: brand[110],
        colorBrandForegroundLinkPressed: brand[90],
        colorBrandForegroundLinkSelected: brand[100],
        colorNeutralForeground2Link: grey[84],
        colorNeutralForeground2LinkHover: white,
        colorNeutralForeground2LinkPressed: white,
        colorNeutralForeground2LinkSelected: white,
        colorCompoundBrandForeground1: brand[100],
        colorCompoundBrandForeground1Hover: brand[110],
        colorCompoundBrandForeground1Pressed: brand[90],
        colorBrandForeground1: brand[100],
        colorBrandForeground2: brand[110],
        colorBrandForeground2Hover: brand[130],
        colorBrandForeground2Pressed: brand[160],
        colorNeutralForeground1Static: grey[14],
        colorNeutralForegroundStaticInverted: white,
        colorNeutralForegroundInverted: grey[14],
        colorNeutralForegroundInvertedHover: grey[14],
        colorNeutralForegroundInvertedPressed: grey[14],
        colorNeutralForegroundInvertedSelected: grey[14],
        colorNeutralForegroundInverted2: grey[14],
        colorNeutralForegroundOnBrand: white,
        colorNeutralForegroundInvertedLink: white,
        colorNeutralForegroundInvertedLinkHover: white,
        colorNeutralForegroundInvertedLinkPressed: white,
        colorNeutralForegroundInvertedLinkSelected: white,
        colorBrandForegroundInverted: brand[80],
        colorBrandForegroundInvertedHover: brand[70],
        colorBrandForegroundInvertedPressed: brand[60],
        colorBrandForegroundOnLight: brand[80],
        colorBrandForegroundOnLightHover: brand[70],
        colorBrandForegroundOnLightPressed: brand[50],
        colorBrandForegroundOnLightSelected: brand[60],
        colorNeutralBackground1: grey[16],
        colorNeutralBackground1Hover: grey[24],
        colorNeutralBackground1Pressed: grey[12],
        colorNeutralBackground1Selected: grey[22],
        colorNeutralBackground2: grey[12],
        colorNeutralBackground2Hover: grey[20],
        colorNeutralBackground2Pressed: grey[8],
        colorNeutralBackground2Selected: grey[18],
        colorNeutralBackground3: grey[8],
        colorNeutralBackground3Hover: grey[16],
        colorNeutralBackground3Pressed: grey[4],
        colorNeutralBackground3Selected: grey[14],
        colorNeutralBackground4: grey[4],
        colorNeutralBackground4Hover: grey[12],
        colorNeutralBackground4Pressed: black,
        colorNeutralBackground4Selected: grey[10],
        colorNeutralBackground5: black,
        colorNeutralBackground5Hover: grey[8],
        colorNeutralBackground5Pressed: grey[2],
        colorNeutralBackground5Selected: grey[6],
        colorNeutralBackground6: grey[20],
        colorNeutralBackgroundInverted: white,
        colorNeutralBackgroundStatic: grey[24],
        colorNeutralBackgroundAlpha: grey10Alpha[50],
        colorNeutralBackgroundAlpha2: grey12Alpha[70],
        colorSubtleBackground: 'transparent',
        colorSubtleBackgroundHover: grey[22],
        colorSubtleBackgroundPressed: grey[18],
        colorSubtleBackgroundSelected: grey[20],
        colorSubtleBackgroundLightAlphaHover: grey14Alpha[80],
        colorSubtleBackgroundLightAlphaPressed: grey14Alpha[50],
        colorSubtleBackgroundLightAlphaSelected: 'transparent',
        colorSubtleBackgroundInverted: 'transparent',
        colorSubtleBackgroundInvertedHover: blackAlpha[10],
        colorSubtleBackgroundInvertedPressed: blackAlpha[30],
        colorSubtleBackgroundInvertedSelected: blackAlpha[20],
        colorTransparentBackground: 'transparent',
        colorTransparentBackgroundHover: 'transparent',
        colorTransparentBackgroundPressed: 'transparent',
        colorTransparentBackgroundSelected: 'transparent',
        colorNeutralBackgroundDisabled: grey[8],
        colorNeutralBackgroundInvertedDisabled: whiteAlpha[10],
        colorNeutralStencil1: grey[34],
        colorNeutralStencil2: grey[20],
        colorNeutralStencil1Alpha: whiteAlpha[10],
        colorNeutralStencil2Alpha: whiteAlpha[5],
        colorBackgroundOverlay: blackAlpha[50],
        colorScrollbarOverlay: whiteAlpha[60],
        colorBrandBackground: brand[70],
        colorBrandBackgroundHover: brand[80],
        colorBrandBackgroundPressed: brand[40],
        colorBrandBackgroundSelected: brand[60],
        colorCompoundBrandBackground: brand[100],
        colorCompoundBrandBackgroundHover: brand[110],
        colorCompoundBrandBackgroundPressed: brand[90],
        colorBrandBackgroundStatic: brand[80],
        colorBrandBackground2: brand[20],
        colorBrandBackground2Hover: brand[40],
        colorBrandBackground2Pressed: brand[10],
        colorBrandBackground3Static: brand[60],
        colorBrandBackground4Static: brand[40],
        colorBrandBackgroundInverted: white,
        colorBrandBackgroundInvertedHover: brand[160],
        colorBrandBackgroundInvertedPressed: brand[140],
        colorBrandBackgroundInvertedSelected: brand[150],
        colorNeutralCardBackground: grey[20],
        colorNeutralCardBackgroundHover: grey[24],
        colorNeutralCardBackgroundPressed: grey[18],
        colorNeutralCardBackgroundSelected: grey[22],
        colorNeutralCardBackgroundDisabled: grey[8],
        colorNeutralStrokeAccessible: grey[68],
        colorNeutralStrokeAccessibleHover: grey[74],
        colorNeutralStrokeAccessiblePressed: grey[70],
        colorNeutralStrokeAccessibleSelected: brand[100],
        colorNeutralStroke1: grey[40],
        colorNeutralStroke1Hover: grey[46],
        colorNeutralStroke1Pressed: grey[42],
        colorNeutralStroke1Selected: grey[44],
        colorNeutralStroke2: grey[32],
        colorNeutralStroke3: grey[24],
        colorNeutralStrokeSubtle: grey[4],
        colorNeutralStrokeOnBrand: grey[16],
        colorNeutralStrokeOnBrand2: white,
        colorNeutralStrokeOnBrand2Hover: white,
        colorNeutralStrokeOnBrand2Pressed: white,
        colorNeutralStrokeOnBrand2Selected: white,
        colorBrandStroke1: brand[100],
        colorBrandStroke2: brand[50],
        colorBrandStroke2Hover: brand[50],
        colorBrandStroke2Pressed: brand[30],
        colorBrandStroke2Contrast: brand[50],
        colorCompoundBrandStroke: brand[100],
        colorCompoundBrandStrokeHover: brand[110],
        colorCompoundBrandStrokePressed: brand[90],
        colorNeutralStrokeDisabled: grey[26],
        colorNeutralStrokeInvertedDisabled: whiteAlpha[40],
        colorTransparentStroke: 'transparent',
        colorTransparentStrokeInteractive: 'transparent',
        colorTransparentStrokeDisabled: 'transparent',
        colorNeutralStrokeAlpha: whiteAlpha[10],
        colorNeutralStrokeAlpha2: whiteAlpha[20],
        colorStrokeFocus1: black,
        colorStrokeFocus2: white,
        colorNeutralShadowAmbient: 'rgba(0,0,0,0.24)',
        colorNeutralShadowKey: 'rgba(0,0,0,0.28)',
        colorNeutralShadowAmbientLighter: 'rgba(0,0,0,0.12)',
        colorNeutralShadowKeyLighter: 'rgba(0,0,0,0.14)',
        colorNeutralShadowAmbientDarker: 'rgba(0,0,0,0.40)',
        colorNeutralShadowKeyDarker: 'rgba(0,0,0,0.48)',
        colorBrandShadowAmbient: 'rgba(0,0,0,0.30)',
        colorBrandShadowKey: 'rgba(0,0,0,0.25)'
    });

const createDarkTheme = (brand)=>{
    const colorTokens = generateColorTokens(brand);
    return {
        ...borderRadius,
        ...fontSizes,
        ...lineHeights,
        ...fontFamilies,
        ...fontWeights,
        ...strokeWidths,
        ...horizontalSpacings,
        ...verticalSpacings,
        ...durations,
        ...curves,
        ...colorTokens,
        ...colorPaletteTokens,
        ...colorStatusTokens,
        ...createShadowTokens(colorTokens.colorNeutralShadowAmbient, colorTokens.colorNeutralShadowKey),
        ...createShadowTokens(colorTokens.colorBrandShadowAmbient, colorTokens.colorBrandShadowKey, 'Brand')
    };
};

const webDarkTheme = createDarkTheme(brandWeb);

const themes = {
    "dark": webDarkTheme,
    "light": webLightTheme
};
function setFluentTheme(theme) {
    setTheme(themes[theme]);
}
definition$d.define(FluentDesignSystem.registry);
definition$e.define(FluentDesignSystem.registry);
definition$f.define(FluentDesignSystem.registry);
definition$2.define(FluentDesignSystem.registry);
definition$3.define(FluentDesignSystem.registry);
definition$6.define(FluentDesignSystem.registry);
definition$7.define(FluentDesignSystem.registry);
definition$9.define(FluentDesignSystem.registry);
definition$8.define(FluentDesignSystem.registry);
definition.define(FluentDesignSystem.registry);
definition$1.define(FluentDesignSystem.registry);
definition$a.define(FluentDesignSystem.registry);
definition$b.define(FluentDesignSystem.registry);
definition$5.define(FluentDesignSystem.registry);
definition$4.define(FluentDesignSystem.registry);
definition$c.define(FluentDesignSystem.registry);
setFluentTheme("dark");

export { setFluentTheme };
//# sourceMappingURL=bundle.js.map
