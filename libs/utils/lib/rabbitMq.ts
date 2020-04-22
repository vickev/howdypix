import { connect, Connection } from "amqplib";
import { libInfo, libWarning } from "./utils";

export async function connectToRabbitMq(
  url: string,
  { retry, info, warning } = {
    retry: false,
    info: libInfo("rabbitMQ"),
    warning: libWarning("rabbitMQ"),
  }
): Promise<Connection> {
  const retryIntervalInSec = 5;

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
      resolve(connectToRabbitMq(url, { retry, warning, info }));
    }, retryIntervalInSec * 1000);
  });
}
