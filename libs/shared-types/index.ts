export type HowdyFile = { source: string; dir: string; file: string };
export type HFile = HowdyFile;

export type MessageProcess = {
  thumbnailsDir: string;
  root: string;
  hfile: HFile;
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
  thumbnails: string[];
  hfile: HFile;
};

export enum QueueName {
  TO_PROCESS = "toProcess",
  PROCESSED = "processed"
}
