import { Channel, ConsumeMessage, Options } from "amqplib";
import { join, parse } from "path";
import { HFile, MessageProcess, QueueName } from "@howdypix/shared-types";
import debug from "debug";
import { hjoin, thumbnailPath } from "./path";

export async function wait(seconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export function generateThumbnailPaths(
  thumbnailsDir: string,
  hfile: HFile
): Array<{
  width: number | null;
  height: number | null;
  path: string;
}> {
  const { dir, name } = parse(thumbnailPath(thumbnailsDir, hfile));

  return [200, 600].map(size => ({
    width: size,
    height: null,
    path: join(dir, `${name}x${size}.jpg`)
  }));
}

export function generateThumbnailUrls(
  baseUrl: string,
  hfile: HFile
): Array<{
  width: number | null;
  height: number | null;
  url: string;
}> {
  if (!hfile.file) {
    throw new Error("You need to pass a file path to generate a URL.");
  }

  return [200, 600].map(size => ({
    width: size,
    height: null,
    url:
      baseUrl +
      "/static/" +
      hjoin({ ...hfile, file: `${parse(hfile.file!).name}x${size}.jpg` })
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
