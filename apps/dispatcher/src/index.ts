import config from "config";
import { client, server } from "@howdypix/websocket";

async function main() {
  const wsPort: number = config.get("wsPort");
  const serverUrl: string = config.get("serverUrl");

  //==================================================
  // Start the WS server
  //==================================================
  const wss = server.startWebsocket({ port: wsPort });

  wss.on("connect", connection => {
    connection.on("message", message => {
      console.log("received: %s", message);
      connection.send(`Hello, you sent -> ${message}`);
    });

    connection.send("Hi there, I am a WebSocket server");
  });

  //==================================================
  // Connect to the WS server to receive messages
  //==================================================
  await client.connect({ url: serverUrl, retrySeconds: 10 });
  /*
  ws.on("open", function open() {
    ws.send("something");
  });

  ws.on("close", () => {
    console.log("closed");
  });
  ws.on("error", () => {
    console.log("closed");
  });

  ws.on("message", function incoming(data) {
    console.log(data);
  });
  ws.on("message", () => console.log("message"));
  ws.on("error", () => console.log("error"));
  ws.on("unexpected-response", () => console.log("unexpected-response"));
  
 */
}

main();
