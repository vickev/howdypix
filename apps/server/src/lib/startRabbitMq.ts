import { Events } from "./eventEmitter";
import { Channel, connect as connectRabbitMq } from "amqplib";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import { assertQueue, consume, sendToQueue } from "@howdypix/utils";

export async function fetchPathsInQueue(channel: Channel): Promise<string[]> {
  return new Promise(resolve => {
    const pathsInQueue: string[] = [];

    consume<MessageProcess>(
      channel,
      QueueName.TO_PROCESS,
      msg => {
        if (msg) {
          pathsInQueue.push(msg.data.path);
        }
      },
      { consumerTag: "server" }
    );

    channel.cancel("server");
    channel.recover();

    resolve(pathsInQueue);
  });
}

export async function bindAppEvents(event: Events, channel: Channel) {
  const pathsInQueue = await fetchPathsInQueue(channel);

  // When there is a new file, send it to the queue
  event.on("newFile", ({ path, root }) => {
    if (pathsInQueue.filter(p => p === path).length === 0) {
      sendToQueue<MessageProcess>(channel, QueueName.TO_PROCESS, {
        root,
        path
      });
    }
  });
}

export async function bindChannelEvents(event: Events, channel: Channel) {
  await consume<ProcessData>(channel, QueueName.PROCESSED, msg => {
    if (msg) {
      event.emit("processedFile", msg.data);
    }
  });
}

export async function startRabbitMq(event: Events, url: string) {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await assertQueue(channel, QueueName.TO_PROCESS);
  await assertQueue(channel, QueueName.PROCESSED);

  await bindAppEvents(event, channel);
  await bindChannelEvents(event, channel);

  return channel;
}
