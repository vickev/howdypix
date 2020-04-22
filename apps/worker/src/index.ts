import { appInfo } from "@howdypix/utils";
import { appConfig } from "./config";
import { startRabbitMq } from "./libs/startRabbitMq";

async function main(): Promise<void> {
  appInfo("main")("Starting the worker.");
  await startRabbitMq(appConfig.rabbitMQ);
}

main();
