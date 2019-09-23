import { Channel, ConsumeMessage, Options } from "amqplib";
import { join } from "path";
import { MessageProcess, QueueName } from "@howdypix/shared-types";

export async function wait(seconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function howdypixPathJoin(root: string, path: string = "") {
  return join(root, ".howdypix", path);
}

export function isHowdypixPath(path: string = ""): boolean {
  return path.match(/\.howdypix/) !== null;
}

export async function assertQueue(channel: Channel, name: QueueName) {
  return channel.assertQueue(name);
}

export interface ParsedConsumeMessage<T> extends ConsumeMessage {
  data: T;
}

export async function consume<T>(
  channel: Channel,
  name: QueueName,
  onMessage?: (msg: ParsedConsumeMessage<T> | null) => any,
  options?: Options.Consume
) {
  return channel.consume(name, msg => {
    if (msg) {
      const data: T = JSON.parse(msg.content.toString());
      onMessage && onMessage({ ...msg, data });
    } else {
      onMessage && onMessage(null);
    }
  });
}

export async function sendToQueue<T>(
  channel: Channel,
  queue: QueueName,
  data: T,
  options?: Options.Publish
) {
  return channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), options);
}
