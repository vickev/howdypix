import { startApollo } from "./lib/startApollo";
import { startWebsocket } from "./lib/startWebsocket";
import config from "config";

function main() {
  startApollo(config.get("serverApollo.port"));
  startWebsocket(config.get("serverWs.port"));
}

main();
