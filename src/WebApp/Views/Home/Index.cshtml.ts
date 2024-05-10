import { DefaultHttpClient, NullLogger, HttpRequest, HubConnectionBuilder, HubConnection } from "/lib/signalr/signalr.js";
import { MessagePackHubProtocol } from '/lib/signalr/signalr-protocol-msgpack.js';
import { Encoder, Decoder, encode } from "/lib/msgpack/msgpack.js";


let connection: HubConnection = null;

const encoder: Encoder<undefined> = new Encoder<undefined>();
const decoder: Decoder<undefined> = new Decoder<undefined>();

const encoded = encoder.encode({ Id: 1, Name: "Dmitry Kolchev", Active: true, Created: new Date() });
const decoded = decoder.decode(encoded);

interface EventMessage {
    Id: number;
    Name: string;
    Active: boolean;
    CreatedDate: Date;
}

const message: EventMessage = {
    Id: 1,
    Name: "Dmitry Kolchev",
    Active: true,
    CreatedDate: new Date()
}

initialize().then(() => { console.log("initialization successfully completed") });

async function initialize(): Promise<void> {
    const button = document.getElementById("button1");
    button.addEventListener("click", handleClick);
    connection = new HubConnectionBuilder()
        .withUrl("/EventHandlerHub")
        .withHubProtocol(new MessagePackHubProtocol())
        .build();
    connection.on("RaiseEventCompleted", raiseEventCompleted)
    await connection.start();
}

let count = 0;
function raiseEventCompleted(response: string) {
    count++;
}

async function handleClick() {
    const client = new DefaultHttpClient(NullLogger.instance);
    const request: HttpRequest = {
        content: "Hello World",
        timeout: 30000
    }
    const response = await client.post("/Home/Index/RaiseEvent", request);
    console.debug(response);

    count = 0;

    console.time("RaiseEvent");
    for (let index = 0; index < 1000; ++index) {
        await connection.send("RaiseEvent", message);
    }
    console.timeEnd("RaiseEvent");

    console.time("RaiseEventWithResponse");

    let messageResponse: EventMessage;

    for (let index = 0; index < 1000; ++index) {
        messageResponse = await connection.invoke("RaiseEventWithResponse", message);
    }
    console.debug(messageResponse);
    console.log(`RaiseEventWithResponse, count: ${count}`)
    console.timeEnd("RaiseEventWithResponse");
}
