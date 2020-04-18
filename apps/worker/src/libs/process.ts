import { join } from "path";
import { statSync } from "fs";
import { fromFile as fileTypeOf } from "file-type";
import { ExifData, HFile, ProcessData, StatData } from "@howdypix/shared-types";
import { appDebug, hfile2path } from "@howdypix/utils";
import { getFileProcessor } from "../processor";

export function fetchStat(root: string, path: string): StatData {
  const absolutePath = join(root, path);
  const stat = statSync(absolutePath);
  return {
    inode: stat.ino,
    ctime: stat.ctimeMs,
    mtime: stat.mtimeMs,
    birthtime: stat.birthtimeMs,
    size: stat.size,
  };
}

export async function process(
  thumbnailsDir: string,
  root: string,
  hfile: HFile
): Promise<ProcessData> {
  const path = hfile2path(hfile).toString();
  const absolutePath = join(root, path);
  let stat: StatData;
  let exif: ExifData = {};
  let thumbnails: string[] = [];

  try {
    stat = fetchStat(root, path);
  } catch (e) {
    appDebug(e);
    stat = {
      birthtime: 0,
      ctime: 0,
      inode: 0,
      mtime: 0,
      size: 0,
    };
  }

  // get the mime
  const { mime } = (await fileTypeOf(absolutePath)) ?? { mime: null };

  // get the file processor
  const fileProcessor = getFileProcessor(mime);

  if (!fileProcessor) {
    appDebug(`This file is not supported [${mime}] (${absolutePath}).`);
  } else {
    try {
      exif = await fileProcessor.fetchExif(root, path);
    } catch (e) {
      appDebug(e);
    }

    try {
      thumbnails = await fileProcessor.createThumbnails(
        thumbnailsDir,
        root,
        hfile
      );
    } catch (e) {
      appDebug(e);
    }
  }

  const data = {
    exif,
    stat,
    thumbnails,
    hfile,
    root,
  };

  appDebug("processed")(`${path}: ${JSON.stringify(data)}`);

  return data;
}
