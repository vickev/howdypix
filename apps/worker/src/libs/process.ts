import sharp from "sharp";
import mkdirp from "mkdirp";
import { join, parse, relative } from "path";
import { statSync } from "fs";
import { ExifImage } from "exif";
import { ExifData, ProcessData, StatData } from "@howdypix/shared-types";
import {
  appDebug,
  howdypixPathJoin,
  generateThumbnailPaths
} from "@howdypix/utils";

export async function fetchExif(root: string, path: string): Promise<ExifData> {
  return new Promise(resolve => {
    // eslint-disable-next-line no-new
    new ExifImage(join(root, path), (error, data) => {
      if (!error) {
        resolve({
          ISO: data.exif.ISO,
          createDate: data.exif.CreateDate
            ? new Date(data.exif.CreateDate).getMilliseconds()
            : undefined,
          make: data.image.Make,
          model: data.image.Model
        });
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
    size: stat.size
  };
}

export async function createThumbnails(
  thumbnailsDir: string,
  root: string,
  path: string,
  sourceId: string
): Promise<string[]> {
  const { dir, name } = parse(howdypixPathJoin(thumbnailsDir, sourceId, path));

  mkdirp.sync(dir);

  return Promise.all(
    generateThumbnailPaths(thumbnailsDir, sourceId, path).map(async data => {
      await sharp(join(root, path))
        .resize(data.width)
        .toFile(data.path);
      return data.path;
    })
  );
}

export async function process(
  thumbnailsDir: string,
  root: string,
  path: string,
  sourceId: string
): Promise<ProcessData> {
  const stat = await fetchStat(root, path);
  const exif = await fetchExif(root, path);
  const thumbnails = await createThumbnails(
    thumbnailsDir,
    root,
    path,
    sourceId
  );

  const data = {
    exif,
    stat,
    thumbnails,
    sourceId,
    path,
    root
  };

  appDebug("processed")(`${path}: ${JSON.stringify(data)}`);

  return data;
}
