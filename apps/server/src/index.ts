import config from "config";
import { startApollo } from "./lib/startApollo";
import { startWebsocket } from "./lib/startWebsocket";
import { loadUserConfig } from "./lib/loadUserConfig";
import { startFileScan } from "./lib/startFileScan";
import EventEmitter from "events";
import { Events } from "./lib/eventEmitter";
import { state } from "./state";

function main() {
  const event: Events = new EventEmitter();

  const userConfig = loadUserConfig();
  console.log("User Configuration loaded:");
  console.log(userConfig);

  event.on("newFile", name => {
    console.log(name);
    state.fileQueue.push(name);
    event.emit("queue:newFile", name);
  });

  startFileScan(event, userConfig.photoDirs);
  startApollo(config.get("serverApollo.port"));

  const ws = startWebsocket(config.get("serverWs.port"));

  ws.on("connect", connection => {
    connection.send(state.fileQueue);

    event.on("queue:newFile", name => {
      connection.send(name);
    });
  });
}

main();
