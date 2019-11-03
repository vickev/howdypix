import config from "./config";
import { startRabbitMq } from "./libs/startRabbitMq";

async function main() {
  await startRabbitMq(config.rabbitMq.url);
}

main();
