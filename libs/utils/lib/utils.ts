import { Channel, ConsumeMessage, Options, Replies } from "amqplib";
import { join, parse } from "path";
import { HFile, QueueName } from "@howdypix/shared-types";
import debug from "debug";
import { hjoin, thumbnailPath } from "./path";
import { identity, pick, omitBy, isNil } from "lodash";

export async function wait(seconds: number): Promise<void> {
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

  return [200, 600, 1280, 2048].map(size => ({
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

  return [200, 600, 1280, 2048].map(size => ({
    width: size,
    height: null,
    url: `${baseUrl}/static/${hjoin({
      ...hfile,
      file: `${parse(hfile.file as string).name}x${size}.jpg`
    })}`
  }));
}

export function generateFileUrl(baseUrl: string, hfile: HFile): string {
  if (!hfile.file) {
    throw new Error("You need to pass a file path to generate a URL.");
  }

  return `${baseUrl}/static/${hjoin(hfile)}`;
}

export function isHowdypixPath(path = ""): boolean {
  return path.match(/\.howdypix/) !== null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function appDebug(space: string): (...message: any[]) => void {
  return debug(`app:${space}`);
}

export function libDebug(space: string): (message: string) => void {
  return debug(`lib:${space}`);
}

export function assertQueue(
  channel: Channel,
  name: QueueName
): Promise<Replies.AssertQueue> {
  return channel.assertQueue(name);
}

export interface ParsedConsumeMessage<T> extends ConsumeMessage {
  data: T;
}

export function consume<T>(
  channel: Channel,
  name: QueueName,
  onMessage?: (msg: ParsedConsumeMessage<T> | null) => void,
  options?: Options.Consume
): Promise<Replies.Consume> {
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

export function sendToQueue<T>(
  channel: Channel,
  queue: QueueName,
  data: T,
  options?: Options.Publish
): boolean {
  libDebug("rabbit:sendToQueue")(`${queue} ${JSON.stringify(data)}`);

  return channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), options);
}

export function removeEmptyValues(object: {
  [key: string]: any;
}): typeof object {
  return omitBy(object, isNil);
}
