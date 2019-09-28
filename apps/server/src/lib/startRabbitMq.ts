import { Events } from "./eventEmitter";
import { Channel, connect as connectRabbitMq } from "amqplib";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import { assertQueue, consume, sendToQueue, appDebug } from "@howdypix/utils";
import { UserConfigState } from "../state";

export async function fetchPathsInQueue(channel: Channel): Promise<string[]> {
  const pathsInQueue: string[] = [];

  await consume<MessageProcess>(
    channel,
    QueueName.TO_PROCESS,
    msg => {
      if (msg) {
        pathsInQueue.push(msg.data.path);
      }
    },
    { consumerTag: "server" }
  );

  await channel.cancel("server");
  await channel.recover();

  appDebug("rabbit")(`Paths already in queue: ${pathsInQueue.length}.`);
  appDebug("rabbit")(pathsInQueue);

  return pathsInQueue;
}

export async function bindAppEvents(
  event: Events,
  thumbnailsDir: string,
  channel: Channel
) {
  const pathsInQueue = await fetchPathsInQueue(channel);

  // When there is a new file, send it to the queue
  event.on("processFile", ({ path, root, sourceId }) => {
    if (pathsInQueue.filter(p => p === path).length === 0) {
      appDebug("sendToQueue")(path);
      sendToQueue<MessageProcess>(channel, QueueName.TO_PROCESS, {
        thumbnailsDir,
        root,
        path,
        sourceId
      });
    }
  });
}

export async function bindChannelEvents(event: Events, channel: Channel) {
  await consume<ProcessData>(channel, QueueName.PROCESSED, msg => {
    if (msg) {
      event.emit("processedFile", msg.data);
      channel.ack(msg);
    }
  });
}

export async function startRabbitMq(
  event: Events,
  userConfig: UserConfigState,
  url: string
) {
  const connection = await connectRabbitMq(url);
  const channel = await connection.createChannel();

  await assertQueue(channel, QueueName.TO_PROCESS);
  await assertQueue(channel, QueueName.PROCESSED);

  await bindAppEvents(event, userConfig.thumbnailsDir, channel);
  await bindChannelEvents(event, channel);

  return channel;
}
