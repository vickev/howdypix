import { appInfo } from "@howdypix/utils";
import config from "./config";
import { startRabbitMq } from "./libs/startRabbitMq";

async function main() {
  appInfo("main")("Starting the worker.");
  await startRabbitMq(config.rabbitMq.url);
}

main();
