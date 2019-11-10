import "reflect-metadata";
import config from "./config";
import { startHttp } from "./lib/startHttp";
import { startApollo } from "./lib/startApollo";
import { loadUserConfig } from "./lib/loadUserConfig";
import { startFileScan } from "./lib/startFileScan";
import EventEmitter from "events";
import { Events } from "./lib/eventEmitter";
import { startRabbitMq } from "./lib/startRabbitMq";
import { startCacheDB } from "./lib/startCacheDB";
import express from "express";

async function main() {
  const event: Events = new EventEmitter();

  const userConfig = loadUserConfig();
  console.log("User Configuration loaded:");
  console.log(userConfig);

  const app = express();

  await startCacheDB(event, userConfig);
  await startHttp(app, config.serverHttp.port);
  await startApollo(app, userConfig, config.serverApollo.port);
  await startRabbitMq(event, userConfig, config.rabbitMq.url);
  await startFileScan(event, userConfig);

  app.listen({ port: config.serverHttp.port }, () => {
    console.log(`Http server stated on port ${config.serverHttp.port}.`);
  });
}

main();
