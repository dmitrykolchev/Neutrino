/*! *****************************************************************************
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
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

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
    // Check for attributes and map any factories.
    const attrFactoryIds = HydrationMarkup.parseAttributeBinding(node);
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
        return value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
            ? false
            : true;
    },
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
     * @param value - The value to set the attribute/property to.
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

const defaultShadowOptions = { mode: "open" };
const defaultElementOptions = {};
const fastElementBaseTypes = new Set();
const fastElementRegistry = FAST.getById(KernelServiceId.elementRegistry, () => createTypeRegistry());
/**
 * Defines metadata for a FASTElement.
 * @public
 */
class FASTElementDefinition {
    constructor(type, nameOrConfig = type.definition) {
        var _a;
        this.platformDefined = false;
        if (isString(nameOrConfig)) {
            nameOrConfig = { name: nameOrConfig };
        }
        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;
        this.registry = (_a = nameOrConfig.registry) !== null && _a !== void 0 ? _a : customElements;
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
}
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
        const shadowOptions = definition.shadowOptions;
        if (shadowOptions !== void 0) {
            let shadowRoot = element.shadowRoot;
            if (shadowRoot) {
                this.hasExistingShadowRoot = true;
            }
            else {
                shadowRoot = element.attachShadow(shadowOptions);
                if (shadowOptions.mode === "closed") {
                    shadowRoots.set(element, shadowRoot);
                }
            }
        }
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
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element) {
        const controller = element.$fastController;
        if (controller !== void 0) {
            return controller;
        }
        const definition = FASTElementDefinition.getForInstance(element);
        if (definition === void 0) {
            throw FAST.error(1401 /* Message.missingElementDefinition */);
        }
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
});

const template = html `<span>Hello ${x => x.name}!</span>`;
const styles = css `
    :host {
      border: 1px solid blue;
    }

    span {
      color: red;
    }
`;
class HelloWorld extends FASTElement {
}
__decorate([
    attr,
    __metadata("design:type", String)
], HelloWorld.prototype, "name", void 0);
HelloWorld.define({
    name: "hello-world",
    template,
    styles,
});
//# sourceMappingURL=neu-element.js.map
