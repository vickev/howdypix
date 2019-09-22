import { join } from "path";
import * as types from "./schema";
import { makeSchema } from "nexus";
import { ApolloServer } from "apollo-server";
import express from "express";
import http from "http";
import WebSocket from "ws";

const destDir = join(__dirname, "..", "..", "..", "libs", "graphql-schema");

const app = express();

const schema = makeSchema({
  types,
  outputs: {
    schema: join(destDir, "schema.graphql"),
    typegen: join(destDir, "schema.d.ts")
  }
});

//==================================================
// Start the Apollo Server
//==================================================
const apolloServer = new ApolloServer({ schema });

apolloServer.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀  Apollo Server ready at ${url}`);
});

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
wsServer.listen(8999, () => {
  console.log(`🚀  Websocket started on port 8999 :)`);
});
