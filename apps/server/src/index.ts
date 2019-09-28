import "reflect-metadata";
import config from "config";
import { startApollo } from "./lib/startApollo";
import { loadUserConfig } from "./lib/loadUserConfig";
import { startFileScan } from "./lib/startFileScan";
import EventEmitter from "events";
import { Events } from "./lib/eventEmitter";
import { startRabbitMq } from "./lib/startRabbitMq";
import { startCacheDB } from "./lib/startCacheDB";

async function main() {
  const event: Events = new EventEmitter();

  const userConfig = loadUserConfig();
  console.log("User Configuration loaded:");
  console.log(userConfig);

  await startCacheDB(event, userConfig);
  await startApollo(config.get("serverApollo.port"));
  await startRabbitMq(event, userConfig, config.get("rabbitMq.url"));
  await startFileScan(event, userConfig);
}

main();
