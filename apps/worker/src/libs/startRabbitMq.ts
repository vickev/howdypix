import { connect as connectRabbitMq } from "amqplib";
import { process } from "./process";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import { assertQueue, consume, sendToQueue } from "@howdypix/utils";

export async function startRabbitMq(url: string) {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await assertQueue(channel, QueueName.TO_PROCESS);
  await assertQueue(channel, QueueName.PROCESSED);

  await consume<MessageProcess>(channel, QueueName.TO_PROCESS, async msg => {
    if (msg) {
      const data = await process(msg.data.root, msg.data.path);
      channel.ack(msg);
      await sendToQueue<ProcessData>(channel, QueueName.PROCESSED, data);
    }
  });

  return channel;
}
