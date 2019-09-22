import { connect as connectRabbitMq } from "amqplib";

const queueName = "toProcess";

export async function startRabbitMq(url: string) {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName);

  await channel.consume(queueName, msg => {
    if (msg) {
      console.log(msg.content.toString());
      channel.ack(msg);
    }
  });

  return channel;
}
