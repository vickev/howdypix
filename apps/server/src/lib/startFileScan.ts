import chokidar from "chokidar";
import { resolve, relative } from "path";
import { Events } from "./eventEmitter";
import { appDebug } from "@howdypix/utils";
import { arg } from "nexus";
import { UserConfigState } from "../state";

export function onAdd(
  event: Events,
  path: string,
  root: string,
  sourceId: string
) {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);
  appDebug("watcher")(`File ${path} has been added`);
  event.emit("newFile", { path: relativePath, root: absoluteRoot, sourceId });
}

export function onRemove(
  event: Events,
  path: string,
  root: string,
  sourceId: string
) {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);
  appDebug("watcher")(`File ${path} has been removed`);
  event.emit("removeFile", {
    path: relativePath,
    root: absoluteRoot,
    sourceId
  });
}

export function startFileScan(event: Events, userConfig: UserConfigState) {
  for (const sourceId in userConfig.photoDirs) {
    const folder = userConfig.photoDirs[sourceId];

    // Initiate the watcher
    const watcher = chokidar.watch(folder, { ignored: /.howdypix/ });

    watcher
      .on("add", path => onAdd(event, path, folder, sourceId))
      .on("unlink", path => onRemove(event, path, folder, sourceId));
  }
}
