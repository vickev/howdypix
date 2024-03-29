import { Channel, ConsumeMessage, Options, Replies } from "amqplib";
import { join, parse } from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  HFile,
  QueueData,
  QueueName,
  SupportedMime,
} from "@howdypix/shared-types";
import debug from "debug";
import { isArray, isNil, isObject, omitBy, reduce } from "lodash";
import stringify from "json-stable-stringify";
import { hjoin, thumbnailPath } from "./path";

export async function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => {
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
  if (!hfile.file) {
    throw new Error("You must specify a file.");
  }

  const { dir, name } = parse(thumbnailPath(thumbnailsDir, hfile));

  return [200, 600, 1280, 2048].map((size) => ({
    width: size,
    height: null,
    path: join(dir, `${name}x${size}.jpg`),
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

  return [200, 600, 1280, 2048].map((size) => ({
    width: size,
    height: null,
    url: `${baseUrl.replace(/\/$/, "")}/files/${hjoin({
      ...hfile,
      file: `${parse(hfile.file as string).name}x${size}.jpg`,
    })}`,
  }));
}

export function generateFileUrl(baseUrl: string, hfile: HFile): string {
  if (!hfile.file) {
    throw new Error("You need to pass a file path to generate a URL.");
  }

  return `${baseUrl}/files/${hjoin(hfile)}`;
}

export function isHowdypixPath(path = ""): boolean {
  return path.match(/\.howdypix/) !== null;
}

export function appInfo(space: string): (...message: any[]) => void {
  return debug(`app:info:${space}`);
}

export function appWarning(space: string): (...message: any[]) => void {
  return debug(`app:warn:${space}`);
}

export function appError(space: string): (...message: any[]) => void {
  return debug(`app:error:${space}`);
}

export function appDebug(space: string): (...message: any[]) => void {
  return debug(`lib:debug:${space}`);
}

export function libInfo(space: string): (...message: any[]) => void {
  return debug(`lib:info:${space}`);
}

export function libWarning(space: string): (...message: any[]) => void {
  return debug(`lib:warn:${space}`);
}

export function libError(space: string): (...message: any[]) => void {
  return debug(`lib:error:${space}`);
}

export function libDebug(space: string): (...message: any[]) => void {
  return debug(`lib:debug:${space}`);
}

export function assertQueue(
  channel: Channel,
  name: QueueName
): Promise<Replies.AssertQueue> {
  return channel.assertQueue(name);
}

interface ParsedConsumeMessage<T extends QueueName> extends ConsumeMessage {
  data: QueueData[T];
}

export function consume<T extends QueueName>(
  channel: Channel,
  name: T,
  onMessage?: (msg: ParsedConsumeMessage<T> | null) => void,
  options?: Options.Consume
): Promise<Replies.Consume> {
  return channel.consume(
    name,
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString()) as QueueData[T];

        libDebug("rabbit:consume")(`${name} ${JSON.stringify(data)}`);

        onMessage && (await onMessage({ ...msg, data }));
      } else {
        onMessage && (await onMessage(null));
      }
    },
    options
  );
}

export function sendToQueue<T extends QueueName>(
  channel: Channel,
  queue: T,
  data: QueueData[T],
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

export function sortJson(json: {} | unknown[]): typeof json {
  if (isArray(json)) {
    return (json as Array<string>)
      .map((value) => {
        if (isArray(value) || isObject(value)) {
          return sortJson(value);
        }

        return value;
      })
      .sort();
  }

  if (isObject(json)) {
    return reduce(
      json,
      (result, value, key) => {
        const newResult = result;
        newResult[key] = sortJson(value);

        return newResult;
      },
      {} as { [key: string]: typeof json }
    );
  }

  return json;
}

export function sortJsonStringify(json: {}): string {
  return stringify(sortJson(json));
}

export function parentDir(dir = ""): string {
  return parse(dir).dir ?? "";
}

export function isSupportedMime(mime: keyof SupportedMime): boolean {
  const supportedMime: SupportedMime = {
    "image/jpeg": true,
    "image/png": true,
  };

  return supportedMime[mime] ?? false;
}
