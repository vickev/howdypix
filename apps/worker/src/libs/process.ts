import sharp from "sharp";
import mkdirp from "mkdirp";
import { join, parse } from "path";
import { statSync } from "fs";
import { ExifImage } from "exif";
import { fromFile as fileTypeOf } from "file-type";
import { ExifData, HFile, ProcessData, StatData } from "@howdypix/shared-types";
import {
  appDebug,
  generateThumbnailPaths,
  thumbnailPath,
  hfile2path,
} from "@howdypix/utils";
import { getFileProcessor } from "../processor";

export async function fetchExif(root: string, path: string): Promise<ExifData> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-new
    new ExifImage(join(root, path), (error, data) => {
      if (!error) {
        resolve({
          ISO: data.exif.ISO,
          aperture: data.exif.ApertureValue,
          shutter: data.exif.ExposureTime,
          createDate: data.exif.CreateDate
            ? new Date(data.exif.CreateDate).getMilliseconds()
            : undefined,
          make: data.image.Make,
          model: data.image.Model,
        });
      } else {
        reject(error);
      }
    });
  });
}

export async function fetchStat(root: string, path: string): Promise<StatData> {
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

export async function createThumbnails(
  thumbnailsDir: string,
  root: string,
  hfile: HFile
): Promise<string[]> {
  const { dir } = parse(thumbnailPath(thumbnailsDir, hfile));

  mkdirp.sync(dir);

  return Promise.all(
    generateThumbnailPaths(thumbnailsDir, hfile).map(async (data) => {
      await sharp(join(root, hfile2path(hfile).toString()))
        .resize(data.width)
        .toFile(data.path);
      return data.path;
    })
  );
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
    stat = await fetchStat(root, path);
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
