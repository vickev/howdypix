import { Events } from "./eventEmitter";
import { connect as connectRabbitMq } from "amqplib";
import { MessageProcess, QueueName } from "@howdypix/shared-types";
import { sendToQueue } from "@howdypix/utils";

const queueName = "toProcess";

export async function startRabbitMq(event: Events, url: string) {
  const pathInQueue: string[] = [];
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName);

  // Retrieve the pictures that are already in the queue.
  channel.consume(
    queueName,
    msg => {
      if (msg) {
        const data: MessageProcess = JSON.parse(msg.content.toString());
        pathInQueue.push(data.path);
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

  return channel;
}
