import { Events } from "./eventEmitter";
import { connect as connectRabbitMq } from "amqplib";

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
        pathInQueue.push(msg.content.toString());
      }
    },
    { consumerTag: "server" }
  );

  await channel.cancel("server");
  await channel.recover();

  event.on("newFile", path => {
    if (pathInQueue.filter(p => p === path).length === 0) {
      channel.sendToQueue(queueName, Buffer.from(path));
    }
  });

  return channel;
}
