import { Events } from "./eventEmitter";
import { connect as connectRabbitMq } from "amqplib";
import { MessageProcess } from "@howdypix/shared-types";

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
      const data: MessageProcess = {
        root,
        path
      };
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }
  });

  return channel;
}
