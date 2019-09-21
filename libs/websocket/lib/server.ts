import http from "http";
import {
  connection,
  request,
  IMessage,
  server as WebsockerServer
} from "websocket";
import express from "express";

type Origins = string[];

export function isValidOrigin(allowOrigins: Origins, host: string) {
  return allowOrigins.map(origin => origin === host).filter(f => f).length > 0;
}

export function onConnection(connection: connection) {
  console.log(`${connection.remoteAddress} connected.`);
}

export function onClose() {
  console.log("Connection closed.");
}

export function onRequest(
  allowOrigins: Origins,
  port: number,
  request: request
) {
  if (isValidOrigin(allowOrigins, request.host.split(":")[0])) {
    request.accept();
  } else {
    request.reject();
  }
}

export function startWebsocket(options: {
  port: number;
  allowOrigins?: Origins;
}): WebsockerServer {
  const { port, allowOrigins } = options;
  const app = express();
  const wsServer = http.createServer(app);
  const wss = new WebsockerServer({
    httpServer: wsServer,
    autoAcceptConnections: false
  });

  wss.on("request", request => onRequest(allowOrigins || [], port, request));
  wss.on("connect", onConnection);
  wss.on("close", onClose);

  wsServer.listen(port, () => {
    console.log(`🚀  Websocket started on port ${port}`);
  });

  return wss;
}
