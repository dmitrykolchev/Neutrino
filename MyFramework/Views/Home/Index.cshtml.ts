import { DefaultHttpClient, NullLogger, HttpRequest, HubConnectionBuilder, HubConnection } from "/lib/signalr/signalr.js"


let connection: HubConnection = null;

initialize().then(() => { console.log("initialization successfully completed") });

async function initialize(): Promise<void> {
    const button = document.getElementById("button1");
    button.addEventListener("click", handleClick);
    const builder = new HubConnectionBuilder();
    connection = builder.withUrl("/EventHandlerHub").build();
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
        await connection.send("RaiseEvent", JSON.stringify({ "Controller": "Home", "Action": "Index" }));
    }
    console.timeEnd("RaiseEvent");

    console.time("RaiseEventWithResponse");
    for (let index = 0; index < 1000; ++index) {
        await connection.invoke("RaiseEventWithResponse", JSON.stringify({ "Controller": "Home", "Action": "Index" }));
    }
    console.log(`RaiseEventWithResponse, count: ${count}`)
    console.timeEnd("RaiseEventWithResponse");
}
