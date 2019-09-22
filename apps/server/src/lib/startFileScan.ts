import chokidar from "chokidar";
import { forEach } from "lodash";
import fs from "fs";
import { resolve, join } from "path";
import EventEmitter from "events";
import { Events } from "./eventEmitter";
import { isHowdypixPath } from "@howdypix/utils";

export function loadFile(event: Events, path: string, root: string) {
  event.emit("newFile", { path, root });
}

export function loadFolder(event: Events, path: string, root: string) {
  if (isHowdypixPath(path)) {
    return;
  }

  console.log(`Parsing ${path}.`);
  const files = fs.readdirSync(path);

  forEach(files, file => {
    const absolutePath = join(path, file);
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      loadFolder(event, absolutePath, root);
    } else if (stat.isFile()) {
      loadFile(event, absolutePath, root);
    }
  });
}

export function startFileScan(event: Events, folders: string[]) {
  forEach(folders, folder => {
    const root = resolve(process.cwd(), folder);
    loadFolder(event, root, root);
  });
}
