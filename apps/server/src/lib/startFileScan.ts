import chokidar from "chokidar";
import { relative, resolve } from "path";
import { fromFile as fileTypeOf } from "file-type";
import {
  appDebug,
  appWarning,
  isSupportedMime,
  path2hfile,
} from "@howdypix/utils";
import { SupportedMime } from "@howdypix/shared-types";
import { Events } from "./eventEmitter";
import { UserConfig } from "../config";

export function onAddDir(
  event: Events,
  path: string,
  root: string,
  source: string
): void {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);
  // appDebug("watcher")(`Directory ${path} has been added`);

  event.emit("newDirectory", {
    hfile: path2hfile(source, relativePath),
    root: absoluteRoot,
  });
}

export function onUnlinkDir(
  event: Events,
  path: string,
  root: string,
  source: string
): void {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);

  event.emit("unlinkDirectory", {
    hfile: path2hfile(source, relativePath),
    root: absoluteRoot,
  });
}

export async function onAdd(
  event: Events,
  path: string,
  root: string,
  source: string
): Promise<void> {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);

  const { mime } = (await fileTypeOf(path)) ?? { mime: null };

  if (isSupportedMime(mime as keyof SupportedMime)) {
    appDebug("watcher")(`File ${path} detected.`);
    event.emit("newFile", {
      hfile: path2hfile(source, relativePath),
      root: absoluteRoot,
    });
  } else {
    appWarning("watcher")(`File ${path} has a non supported mime ${mime}.`);
  }
}

export function onRemove(
  event: Events,
  path: string,
  root: string,
  source: string
): void {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);
  appDebug("watcher")(`File ${path} has been removed`);

  event.emit("removeFile", {
    root: absoluteRoot,
    hfile: path2hfile(source, relativePath),
  });
}

export function startFileScan(event: Events, userConfig: UserConfig): void {
  Object.keys(userConfig.photoDirs).forEach((sourceId) => {
    const root = userConfig.photoDirs[sourceId];

    // Initiate the watcher
    const watcher = chokidar.watch(root, { ignored: /.howdypix/ });

    watcher
      .on("addDir", (path) => onAddDir(event, path, root, sourceId))
      .on("unlinkDir", (path) => onUnlinkDir(event, path, root, sourceId))
      .on("add", (path) => onAdd(event, path, root, sourceId))
      .on("unlink", (path) => onRemove(event, path, root, sourceId));
  });
}
