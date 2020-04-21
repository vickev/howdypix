import { connect, Connection } from "amqplib";
import { appInfo, appWarning } from "./utils";

export async function connectToRabbitMq(
  url: string,
  { retry } = { retry: false }
): Promise<Connection> {
  const retryIntervalInSec = 5;

  // TODO: change to lib
  const info = appInfo("rabbitMQ");
  const warning = appWarning("rabbitMQ");

  try {
    info(`Connection to ${url}...`);
    const connection = await connect(url);
    info("Connection successful!");
    return connection;
  } catch (e) {
    if (!retry) {
      throw e;
    }

    warning(`Impossible to connect. Retrying in ${retryIntervalInSec}s...`);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(connectToRabbitMq(url, { retry }));
    }, retryIntervalInSec * 1000);
  });
}
