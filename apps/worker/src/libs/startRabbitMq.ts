import { connect as connectRabbitMq } from "amqplib";
import { process } from "./process";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import { appDebug, assertQueue, consume, sendToQueue } from "@howdypix/utils";

export async function startRabbitMq(url: string) {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await assertQueue(channel, QueueName.TO_PROCESS);
  await assertQueue(channel, QueueName.PROCESSED);

  await consume<MessageProcess>(channel, QueueName.TO_PROCESS, async msg => {
    if (msg) {
      appDebug("toProcess")(msg.data.path);
      channel.ack(msg);

      try {
        const data = await process(
          msg.data.thumbnailsDir,
          msg.data.root,
          msg.data.path,
          msg.data.sourceId
        );

        await sendToQueue<ProcessData>(channel, QueueName.PROCESSED, data);
      } catch (e) {
        console.error(e);
      }
    }
  });

  return channel;
}
