import { server } from "@howdypix/websocket";
import config from "config";
import { state } from "../state";
import { connection } from "websocket";

const waitMessage = "⌛ Waiting for the Dipatcher to connect...";

export function onClose() {
  state.dispatcher.connected = false;
  console.log("❌ Dispatcher disconnected!");
  console.log(waitMessage);
}

export function onConnect(connection: connection) {
  state.dispatcher.connected = true;
  console.log("✔️  Dispatcher connected!");
  connection.on("close", onClose);
}

export function startWebsocket(port: number) {
  const ws = server.startWebsocket({
    port,
    allowOrigins: config.get("serverWs.allowOrigins")
  });

  ws.on("connect", onConnect);

  setTimeout(() => console.log(waitMessage), 0);

  return ws;
}
