import chokidar from "chokidar";
import { forEach } from "lodash";
import fs from "fs";
import { resolve, join } from "path";
import EventEmitter from "events";
import { Events } from "./eventEmitter";
import { appDebug, isHowdypixPath } from "@howdypix/utils";

export function loadFile(
  event: Events,
  watcher: chokidar.FSWatcher,
  path: string,
  root: string
) {
  appDebug("found")(path);
  //watcher.add(path);
  event.emit("newFile", { path, root });
}

export function startFileScan(event: Events, folders: string[]) {
  // Initiate the watcher
  const watcher = chokidar.watch(folders, { ignored: /.howdypix/ });

  watcher
    .on("add", path => {
      // TODO to remove
      const root = resolve(process.cwd(), folders[0]);
      appDebug("watcher")(`File ${path} has been added`);
      loadFile(event, watcher, path, root);
    })
    .on("change", path => appDebug("watcher")(`File ${path} has been changed`))
    .on("unlink", path => appDebug("watcher")(`File ${path} has been removed`));
}
