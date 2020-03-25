import { connect, Connection } from "amqplib";
import { appInfo, appWarning } from "./utils";

export async function connectToRabbitMq(url: string): Promise<Connection> {
  const info = appInfo("rabbitMQ");
  const warning = appWarning("rabbitMQ");
  const retryIntervalInSec = 5;

  try {
    info(`Connection to ${url}...`);
    const connection = await connect(url);
    info("Connection successful!");
    return connection;
  } catch (e) {
    warning(`Impossible to connect. Retrying in ${retryIntervalInSec}s...`);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(connectToRabbitMq(url));
    }, retryIntervalInSec * 1000);
  });
}
