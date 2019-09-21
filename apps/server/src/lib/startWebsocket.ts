import { server } from "@howdypix/websocket";
import config from "config";

export function startWebsocket(port: number) {
  return server.startWebsocket({
    port,
    allowOrigins: config.get("serverWs.allowOrigins")
  });
}
