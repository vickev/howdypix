import { Channel, ConsumeMessage, Options } from "amqplib";
import { join, parse } from "path";
import { MessageProcess, QueueName } from "@howdypix/shared-types";
import debug from "debug";

export async function wait(seconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function howdypixPathJoin(
  root: string,
  sourceId: string,
  path: string = ""
) {
  return join(root, ".howdypix", sourceId, path);
}

export function generateThumbnailPaths(
  thumbnailsDir: string,
  sourceId: string,
  path: string = ""
): Array<{
  width: number | null;
  height: number | null;
  path: string;
}> {
  const { dir, name } = parse(howdypixPathJoin(thumbnailsDir, sourceId, path));

  return [200, 600].map(size => ({
    width: size,
    height: null,
    path: join(dir, `${name}x${size}.jpg`)
  }));
}

export function generateThumbnailUrls(
  baseUrl: string,
  sourceId: string,
  path: string = ""
): Array<{
  width: number | null;
  height: number | null;
  url: string;
}> {
  const { name } = parse(path);

  return [200, 600].map(size => ({
    width: size,
    height: null,
    url: baseUrl + "/static/" + join(sourceId, `${name}x${size}.jpg`)
  }));
}

export function isHowdypixPath(path: string = ""): boolean {
  return path.match(/\.howdypix/) !== null;
}

export function appDebug(space: string) {
  return debug(`app:${space}`);
}

export function libDebug(space: string) {
  return debug(`lib:${space}`);
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
  return channel.consume(
    name,
    msg => {
      if (msg) {
        const data: T = JSON.parse(msg.content.toString());

        libDebug("rabbit:consume")(`${name} ${JSON.stringify(data)}`);

        onMessage && onMessage({ ...msg, data });
      } else {
        onMessage && onMessage(null);
      }
    },
    options
  );
}

export async function sendToQueue<T>(
  channel: Channel,
  queue: QueueName,
  data: T,
  options?: Options.Publish
) {
  libDebug("rabbit:sendToQueue")(`${queue} ${JSON.stringify(data)}`);

  return channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), options);
}
