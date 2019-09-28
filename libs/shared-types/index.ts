export type MessageProcess = {
  thumbnailsDir: string;
  root: string;
  path: string;
  sourceId: string;
};

export type StatData = {
  inode: number;
  mtime: number;
  ctime: number;
  birthtime: number;
  size: number;
};

export type ExifData = {
  ISO?: number;
  make?: string;
  model?: string;
  createDate?: number;
};

export type ProcessData = {
  exif: ExifData;
  stat: StatData;
  root: string;
  path: string;
  sourceId: string;
  thumbnails: string[];
};

export enum QueueName {
  TO_PROCESS = "toProcess",
  PROCESSED = "processed"
}
