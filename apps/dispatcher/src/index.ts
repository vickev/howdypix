import express from "express";
import http from "http";
import WebSocket from "ws";
import config from "config";

const app = express();
const wsPort: number = config.get("wsPort");
const serverUrl: string = config.get("serverUrl");

//==================================================
// Start the WS server
//==================================================
//initialize a simple http server
const wsServer = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server: wsServer });

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    //log the received message and send it back to the client
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  //send immediatly a feedback to the incoming connection
  ws.send("Hi there, I am a WebSocket server");
});

//start our server
wsServer.listen(wsPort, () => {
  console.log(`🚀  Websocket started on port ${wsPort} :)`);
});

//==================================================
// Connect to the WS server to receive messages
//==================================================
const ws = new WebSocket(serverUrl);

ws.on("open", function open() {
  ws.send("something");
});

ws.on("message", function incoming(data) {
  console.log(data);
});
