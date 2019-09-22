import chokidar from "chokidar";
import { forEach } from "lodash";
import fs from "fs";
import { resolve, join } from "path";
import EventEmitter from "events";
import { Events } from "./eventEmitter";

export function loadFile(event: Events, path: string) {
  event.emit("newFile", path);
}

export function loadFolder(event: Events, path: string) {
  console.log(`Parsing ${path}.`);
  const files = fs.readdirSync(path);

  forEach(files, file => {
    const absolutePath = join(path, file);
    const stat = fs.statSync(absolutePath);

    if (stat.isDirectory()) {
      loadFolder(event, absolutePath);
    } else if (stat.isFile()) {
      loadFile(event, absolutePath);
    }
  });
}

export function startFileScan(event: Events, folders: string[]) {
  forEach(folders, folder => loadFolder(event, resolve(process.cwd(), folder)));
}
