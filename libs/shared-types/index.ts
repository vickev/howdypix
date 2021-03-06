export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type HFile = {
  source: string;
  dir?: string;
  file?: string;
  name?: string;
};
export interface HPath extends String {}
export interface HPathDir extends HPath {}
export interface HPathFile extends HPath {}

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

export enum QueueName {
  TO_PROCESS = "toProcess",
  PROCESSED = "processed",
}

export type QueueData = {
  [QueueName.TO_PROCESS]: {
    thumbnailsDir: string;
    root: string;
    hfile: HFile;
  };
  [QueueName.PROCESSED]: {
    exif: ExifData;
    stat: StatData;
    root: string;
    thumbnails: string[];
    hfile: HFile;
  };
};

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

export type SupportedMime = { "image/jpeg": any; "image/png": any };
export enum Constants {
  UNDEFINED_PICTURE = "__howdypix__undefined.JPG",
}
