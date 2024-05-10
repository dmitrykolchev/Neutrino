import { DefaultHttpClient, NullLogger, HubConnectionBuilder } from "/lib/signalr/signalr.js";
import { MessagePackHubProtocol } from '/lib/signalr/signalr-protocol-msgpack.js';
import { Encoder, Decoder } from "/lib/msgpack/msgpack.js";
let connection = null;
const encoder = new Encoder();
const decoder = new Decoder();
const encoded = encoder.encode({ Id: 1, Name: "Dmitry Kolchev", Active: true, Created: new Date() });
const decoded = decoder.decode(encoded);
const message = {
    Id: 1,
    Name: "Dmitry Kolchev",
    Active: true,
    CreatedDate: new Date()
};
initialize().then(() => { console.log("initialization successfully completed"); });
async function initialize() {
    const button = document.getElementById("button1");
    button.addEventListener("click", handleClick);
    connection = new HubConnectionBuilder()
        .withUrl("/EventHandlerHub")
        .withHubProtocol(new MessagePackHubProtocol())
        .build();
    connection.on("RaiseEventCompleted", raiseEventCompleted);
    await connection.start();
}
let count = 0;
function raiseEventCompleted(response) {
    count++;
}
async function handleClick() {
    const client = new DefaultHttpClient(NullLogger.instance);
    const request = {
        content: "Hello World",
        timeout: 30000
    };
    const response = await client.post("/Home/Index/RaiseEvent", request);
    console.debug(response);
    count = 0;
    console.time("RaiseEvent");
    for (let index = 0; index < 1000; ++index) {
        await connection.send("RaiseEvent", message);
    }
    console.timeEnd("RaiseEvent");
    console.time("RaiseEventWithResponse");
    let messageResponse;
    for (let index = 0; index < 1000; ++index) {
        messageResponse = await connection.invoke("RaiseEventWithResponse", message);
    }
    console.debug(messageResponse);
    console.log(`RaiseEventWithResponse, count: ${count}`);
    console.timeEnd("RaiseEventWithResponse");
}
//# sourceMappingURL=Index.cshtml.js.map