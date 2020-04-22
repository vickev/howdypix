import { connect, Connection } from "amqplib";
import { libInfo, libWarning } from "./utils";

type Options = {
  retry: boolean;
  info?: (message: string) => void;
  warning?: (message: string) => void;
};

export async function connectToRabbitMq(
  url: string,
  { retry, info, warning }: Options = {
    retry: false,
    info: libInfo("rabbitMQ"),
    warning: libWarning("rabbitMQ"),
  }
): Promise<Connection> {
  const retryIntervalInSec = 5;

  const displayInfo = info ?? libInfo("rabbitMQ");
  const displayWarning = warning ?? libWarning("rabbitMQ");

  try {
    displayInfo(`Connection to ${url}...`);
    const connection = await connect(url);
    displayInfo("Connection successful!");
    return connection;
  } catch (e) {
    if (!retry) {
      throw e;
    }

    displayWarning(
      `Impossible to connect. Retrying in ${retryIntervalInSec}s...`
    );
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(connectToRabbitMq(url, { retry, warning, info }));
    }, retryIntervalInSec * 1000);
  });
}
