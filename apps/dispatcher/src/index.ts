import express from "express";
import http from "http";
import WebSocket from "ws";
import config from "config";
import { connect } from "@howdypix/utils";

async function main() {
  const app = express();
  const wsPort: number = config.get("wsPort");
  const serverUrl: string = config.get("serverUrl");

  //==================================================
  // Start the WS server
  //==================================================
  const wsServer = http.createServer(app);
  const wss = new WebSocket.Server({ server: wsServer });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: string) => {
      console.log("received: %s", message);
      ws.send(`Hello, you sent -> ${message}`);
    });

    ws.send("Hi there, I am a WebSocket server");
  });

  //start our server
  wsServer.listen(wsPort, () => {
    console.log(`🚀  Websocket started on port ${wsPort} :)`);
  });

  //==================================================
  // Connect to the WS server to receive messages
  //==================================================
  const ws = await connect({ url: serverUrl, retrySeconds: 10 });

  ws.on("open", function open() {
    ws.send("something");
  });

  ws.on("message", function incoming(data) {
    console.log(data);
  });
}

main();
