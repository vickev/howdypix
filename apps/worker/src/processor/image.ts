import { HFile } from "@howdypix/shared-types";
import { ExifImage } from "exif";
import { join, parse } from "path";
import {
  generateThumbnailPaths,
  hfile2path,
  thumbnailPath,
} from "@howdypix/utils";
import mkdirp from "mkdirp";
import sharp from "sharp";
import { FileProcessor } from "./types";

export default {
  fetchExif(root, path) {
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
  },
  createThumbnails(
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
  },
} as FileProcessor;
