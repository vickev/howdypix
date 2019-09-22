import sharp from "sharp";
import mkdirp from "mkdirp";
import { join, parse, relative } from "path";
import { ExifImage } from "exif";
import { ExifData, ProcessData } from "@howdypix/shared-types";
import { howdypixPathJoin } from "@howdypix/utils";

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
  const relativePath = relative(root, path);
  const { dir, name } = parse(howdypixPathJoin(root, relativePath));

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
