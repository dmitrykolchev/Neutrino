export var MessageType;
(function (MessageType) {
    MessageType[MessageType["Invocation"] = 1] = "Invocation";
    MessageType[MessageType["StreamItem"] = 2] = "StreamItem";
    MessageType[MessageType["Completion"] = 3] = "Completion";
    MessageType[MessageType["StreamInvocation"] = 4] = "StreamInvocation";
    MessageType[MessageType["CancelInvocation"] = 5] = "CancelInvocation";
    MessageType[MessageType["Ping"] = 6] = "Ping";
    MessageType[MessageType["Close"] = 7] = "Close";
    MessageType[MessageType["Ack"] = 8] = "Ack";
    MessageType[MessageType["Sequence"] = 9] = "Sequence";
})(MessageType || (MessageType = {}));
//# sourceMappingURL=IHubProtocol.js.map