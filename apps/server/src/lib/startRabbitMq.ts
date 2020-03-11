import { Channel, connect as connectRabbitMq } from "amqplib";
import { resolve } from "path";
import { MessageProcess, ProcessData, QueueName } from "@howdypix/shared-types";
import {
  appDebug,
  assertQueue,
  consume,
  hjoin,
  sendToQueue
} from "@howdypix/utils";
import { Events } from "./eventEmitter";
import { UserConfig } from "../config";

const debug = appDebug("rabbit");

export async function fetchPathsInQueue(channel: Channel): Promise<string[]> {
  const pathsInQueue: string[] = [];

  await consume<MessageProcess>(
    channel,
    QueueName.TO_PROCESS,
    msg => {
      if (msg) {
        pathsInQueue.push(hjoin(msg.data.hfile) as string);
      }
    },
    { consumerTag: "server" }
  );

  await channel.cancel("server");
  await channel.recover();

  debug(`Paths already in queue: ${pathsInQueue.length}.`);
  debug(pathsInQueue);

  return pathsInQueue;
}

export async function bindAppEvents(
  event: Events,
  thumbnailsDir: string,
  channel: Channel
): Promise<void> {
  const pathsInQueue = await fetchPathsInQueue(channel);

  // When there is a new file, send it to the queue
  event.on("processFile", ({ root, hfile }) => {
    const hpath = hjoin(hfile);
    if (pathsInQueue.filter(p => p === hpath).length === 0) {
      appDebug("sendToQueue")(hpath);
      sendToQueue<MessageProcess>(channel, QueueName.TO_PROCESS, {
        thumbnailsDir,
        root,
        hfile
      });
    }
  });
}

export async function bindChannelEvents(
  event: Events,
  channel: Channel
): Promise<void> {
  await consume<ProcessData>(channel, QueueName.PROCESSED, msg => {
    if (msg) {
      event.emit("processedFile", msg.data);
      channel.ack(msg);
    }
  });
}

export async function startRabbitMq(
  event: Events,
  userConfig: UserConfig,
  url: string
): Promise<Channel | null> {
  try {
    const connection = await connectRabbitMq(url);
    const channel = await connection.createChannel();

    await assertQueue(channel, QueueName.TO_PROCESS);
    await assertQueue(channel, QueueName.PROCESSED);

    await bindAppEvents(
      event,
      resolve(process.cwd(), userConfig.thumbnailsDir),
      channel
    );
    await bindChannelEvents(event, channel);

    return channel;
  } catch (e) {
    if (process.env.MOCK) {
      debug(
        "Connecting to RabbitMQ failed, but it's probably normal because you're testing."
      );
    } else {
      throw e;
    }
  }

  return null;
}
