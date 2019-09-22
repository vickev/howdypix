import config from "config";
import sharp from "sharp";
import mkdirp from "mkdirp";
import { join, parse, relative } from "path";
import { ExifImage } from "exif";
import { ExifData } from "@howdypix/shared-types";

export async function fetchExif(path: string): Promise<ExifData> {
  return new Promise(resolve => {
    // eslint-disable-next-line no-new
    new ExifImage(path, (error, data) => {
      if (!error) {
        resolve({
          ISO: data.exif.ISO,
          createDate: data.exif.CreateDate,
          make: data.image.Make,
          model: data.image.Model
        });
      }
    });
  });
}

export async function createThumbnails(
  root: string,
  path: string
): Promise<string[]> {
  const distThumbnails: string = config.get("distThumbnails");
  const relativePath = relative(root, path);
  const thumbnailPath = join(distThumbnails, relativePath);
  const { dir, name } = parse(thumbnailPath);

  mkdirp.sync(dir);

  return Promise.all(
    [200, 600].map(async size => {
      const fileName = join(dir, `${name}x${size}.jpg`);
      await sharp(path)
        .resize(size)
        .toFile(fileName);
      return fileName;
    })
  );
}

type ProcessData = {
  exif: ExifData;
  thumbnails: string[];
};

export async function process(
  root: string,
  path: string
): Promise<ProcessData> {
  const exif = await fetchExif(path);
  const thumbnails = await createThumbnails(root, path);

  return {
    exif,
    thumbnails
  };
}
