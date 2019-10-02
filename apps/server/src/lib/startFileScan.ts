import chokidar from "chokidar";
import { relative, resolve } from "path";
import { Events } from "./eventEmitter";
import { appDebug, path2hfile } from "@howdypix/utils";
import { UserConfigState } from "../state";

export function onAdd(
  event: Events,
  path: string,
  root: string,
  source: string
) {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);
  appDebug("watcher")(`File ${path} has been added`);

  event.emit("newFile", {
    hfile: path2hfile(source, relativePath),
    root: absoluteRoot
  });
}

export function onRemove(
  event: Events,
  path: string,
  root: string,
  source: string
) {
  const absoluteRoot = resolve(process.cwd(), root);
  const relativePath = relative(root, path);
  appDebug("watcher")(`File ${path} has been removed`);

  event.emit("removeFile", {
    root: absoluteRoot,
    hfile: path2hfile(source, relativePath)
  });
}

export function startFileScan(event: Events, userConfig: UserConfigState) {
  for (const sourceId in userConfig.photoDirs) {
    const root = userConfig.photoDirs[sourceId];

    // Initiate the watcher
    const watcher = chokidar.watch(root, { ignored: /.howdypix/ });

    watcher
      .on("add", path => onAdd(event, path, root, sourceId))
      .on("unlink", path => onRemove(event, path, root, sourceId));
  }
}
