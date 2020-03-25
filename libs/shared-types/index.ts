export type HFile = {
  source: string;
  dir?: string;
  file?: string;
  name?: string;
};
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
  aperture?: number;
  shutter?: number;
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
  PROCESSED = "processed",
}

export type TokenInfo = {
  token: string;
  refreshToken: string;
  user: UserInfo;
};

export type UserInfo = {
  name: string;
  email: string;
};

export type AvailableFilters = {
  model?: string[] | string;
  make?: string[] | string;
};
