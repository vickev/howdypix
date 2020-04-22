import { Channel } from "amqplib";
import { resolve } from "path";
import { QueueName } from "@howdypix/shared-types";
import {
  appDebug,
  appInfo,
  assertQueue,
  consume,
  hjoin,
  sendToQueue,
  appWarning,
} from "@howdypix/utils";
import { connectToRabbitMq } from "@howdypix/utils/dist/rabbitMq";
import { Events } from "./eventEmitter";
import { AppConfig, UserConfig } from "../config";

const debug = appDebug("rabbit");

export async function fetchPathsInQueue(channel: Channel): Promise<string[]> {
  const pathsInQueue: string[] = [];

  await consume(
    channel,
    QueueName.TO_PROCESS,
    (msg) => {
      if (msg) {
        pathsInQueue.push(hjoin(msg.data.hfile) as string);
      }
    },
    { consumerTag: "server" }
  );

  // Loop until we've emptied all the message stack and retrieve all of it
  await new Promise((resolve) => {
    const recursiveCheck = (): void => {
      channel.assertQueue(QueueName.TO_PROCESS).then((response) => {
        if (response.messageCount === 0) {
          channel
            .cancel("server")
            .then(() => {
              channel.recover();
            })
            .then(resolve);
        } else {
          setTimeout(recursiveCheck, 100);
        }
      });
    };

    recursiveCheck();
  });

  debug(`Paths already in queue: ${pathsInQueue.length} .`);
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
    if (pathsInQueue.filter((p) => p === hpath).length === 0) {
      appDebug("sendToQueue")(hpath);
      sendToQueue(channel, QueueName.TO_PROCESS, {
        thumbnailsDir,
        root,
        hfile,
      });
    }
  });
}

export async function bindChannelEvents(
  event: Events,
  channel: Channel
): Promise<void> {
  await consume(channel, QueueName.PROCESSED, (msg) => {
    if (msg) {
      event.emit("processedFile", msg.data);
      channel.ack(msg);
    }
  });
}

export async function startRabbitMq(
  event: Events,
  userConfig: UserConfig,
  options: AppConfig["rabbitMQ"]
): Promise<Channel | null> {
  if (process.env.MOCK) {
    return null;
  }

  try {
    const connection = await connectToRabbitMq(options.url, {
      retry: options.retry,
      info: appInfo("rabbitMQ"),
      warning: appWarning("rabbitMQ"),
    });
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
