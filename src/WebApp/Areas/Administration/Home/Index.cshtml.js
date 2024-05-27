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
    const button2 = document.getElementById("button2");
    button2.addEventListener("click", loadPartial);
    connection = new HubConnectionBuilder()
        .withUrl("/EventHandlerHub")
        .withHubProtocol(new MessagePackHubProtocol())
        .build();
    connection.on("NotifyCurrentTime", notifyCurrentTime);
    await connection.start();
}
function notifyCurrentTime(currentTime) {
    try {
        const currentTimeElement = document.getElementById("currentTime");
        currentTimeElement.innerHTML = currentTime.CurrentTime.toISOString();
    }
    catch (ex) {
        console.log(ex);
    }
}
async function loadPartial() {
    const client = new DefaultHttpClient(NullLogger.instance);
    const response = await client.get("/Administration/Home/Partial");
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.content, "text/html");
    const contentElement = document.getElementById("partialView");
    const root = doc.querySelector("#root");
    //contentElement.insertAdjacentElement("afterbegin", root);
    contentElement.appendChild(root);
    const scripts = doc.querySelectorAll("script");
    for (let i = 0; i < scripts.length; ++i) {
        const { default: initialize, sayHello } = await import(scripts[i].src);
        initialize(root);
    }
}
async function handleClick() {
    const client = new DefaultHttpClient(NullLogger.instance);
    const request = {
        content: "Hello World",
        timeout: 30000
    };
    const response = await client.post("/Administration/Home/Index/RaiseEvent", request);
    console.debug(response);
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
    console.timeEnd("RaiseEventWithResponse");
}
//# sourceMappingURL=Index.cshtml.js.map