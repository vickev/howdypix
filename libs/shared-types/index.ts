export type HFile = { source: string; dir: string; file: string };
export interface HPath extends String {}
export interface HPathDir extends HPath {}
export interface HPathFile extends HPath {}

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

export enum MessageId {
  AUTH_EMAIL_OK = "AUTH_EMAIL_OK",
  AUTH_EMAIL_ERR = "AUTH_EMAIL_ERR"
}
