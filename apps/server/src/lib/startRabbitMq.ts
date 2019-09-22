import { Events } from "./eventEmitter";
import { connect as connectRabbitMq } from "amqplib";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import { assertQueue, consume, sendToQueue } from "@howdypix/utils";

export async function startRabbitMq(event: Events, url: string) {
  const pathInQueue: string[] = [];
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await assertQueue(channel, QueueName.TO_PROCESS);
  await assertQueue(channel, QueueName.PROCESSED);

  // Retrieve the pictures that are already in the queue.
  consume<MessageProcess>(
    channel,
    QueueName.TO_PROCESS,
    msg => {
      if (msg) {
        pathInQueue.push(msg.data.path);
      }
    },
    { consumerTag: "server" }
  );

  await channel.cancel("server");
  await channel.recover();

  event.on("newFile", ({ path, root }) => {
    if (pathInQueue.filter(p => p === path).length === 0) {
      sendToQueue<MessageProcess>(channel, QueueName.TO_PROCESS, {
        root,
        path
      });
    }
  });

  await consume<ProcessData>(channel, QueueName.PROCESSED, async msg => {
    if (msg) {
      console.log(msg.data);
    }
  });

  return channel;
}
