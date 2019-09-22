import { connect as connectRabbitMq } from "amqplib";
import { process } from "./process";
import { MessageProcess } from "@howdypix/shared-types";

const queueName = "toProcess";

export async function startRabbitMq(url: string) {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName);

  await channel.consume(queueName, async msg => {
    if (msg) {
      const data: MessageProcess = JSON.parse(msg.content.toString());
      console.log(await process(data.root, data.path));
      channel.ack(msg);
    }
  });

  return channel;
}
