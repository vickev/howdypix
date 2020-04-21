import { QueueName } from "@howdypix/shared-types";
import {
  appError,
  appDebug,
  assertQueue,
  consume,
  hjoin,
  sendToQueue,
} from "@howdypix/utils";
import { connectToRabbitMq } from "@howdypix/utils/dist/rabbitMq";
import { process } from "./process";
import { AppConfig } from "../config";

export async function startRabbitMq(
  rabbitMQ: AppConfig["rabbitMQ"]
): Promise<void> {
  const connection = await connectToRabbitMq(rabbitMQ.url, {
    retry: rabbitMQ.retry,
  });

  try {
    const channel = await connection.createChannel();
    channel.prefetch(1);

    await assertQueue(channel, QueueName.TO_PROCESS);
    await assertQueue(channel, QueueName.PROCESSED);

    await consume(channel, QueueName.TO_PROCESS, (msg) => {
      if (msg) {
        appDebug("toProcess")(hjoin(msg.data.hfile).toString());

        process(msg.data.thumbnailsDir, msg.data.root, msg.data.hfile)
          .then((data) => {
            sendToQueue(channel, QueueName.PROCESSED, data);
            channel.ack(msg);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      }
    });
  } catch (e) {
    appError(`An error occured: ${e}`);
  }
}
