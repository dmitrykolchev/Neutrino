export var HttpTransportType;
(function (HttpTransportType) {
    HttpTransportType[HttpTransportType["None"] = 0] = "None";
    HttpTransportType[HttpTransportType["WebSockets"] = 1] = "WebSockets";
    HttpTransportType[HttpTransportType["ServerSentEvents"] = 2] = "ServerSentEvents";
    HttpTransportType[HttpTransportType["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (HttpTransportType = {}));
export var TransferFormat;
(function (TransferFormat) {
    TransferFormat[TransferFormat["Text"] = 1] = "Text";
    TransferFormat[TransferFormat["Binary"] = 2] = "Binary";
})(TransferFormat || (TransferFormat = {}));
//# sourceMappingURL=ITransport.js.map