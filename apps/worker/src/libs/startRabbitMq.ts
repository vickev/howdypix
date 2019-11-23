import { connect as connectRabbitMq, Channel } from "amqplib";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import {
  appDebug,
  assertQueue,
  consume,
  hjoin,
  sendToQueue
} from "@howdypix/utils";
import { process } from "./process";

export async function startRabbitMq(url: string): Promise<Channel> {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await assertQueue(channel, QueueName.TO_PROCESS);
  await assertQueue(channel, QueueName.PROCESSED);

  await consume<MessageProcess>(channel, QueueName.TO_PROCESS, async msg => {
    if (msg) {
      appDebug("toProcess")(hjoin(msg.data.hfile));
      channel.ack(msg);

      try {
        const data = await process(
          msg.data.thumbnailsDir,
          msg.data.root,
          msg.data.hfile
        );

        await sendToQueue<ProcessData>(channel, QueueName.PROCESSED, data);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  });

  return channel;
}
