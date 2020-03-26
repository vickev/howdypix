import { ExifData, HFile } from "@howdypix/shared-types";

export type FetchExif = (root: string, path: string) => Promise<ExifData>;
export type CreateThumbnails = (
  thumbnailsDir: string,
  root: string,
  hfile: HFile
) => Promise<string[]>;

export type FileProcessor = {
  fetchExif: FetchExif;
  createThumbnails: CreateThumbnails;
};
