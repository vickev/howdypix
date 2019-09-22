export type MessageProcess = {
  root: string;
  path: string;
};

export type ExifData = {
  ISO?: number;
  make?: string;
  model?: string;
  createDate?: string;
};

export type ProcessData = {
  exif: ExifData;
  thumbnails: string[];
};

export enum QueueName {
  TO_PROCESS = "toProcess",
  PROCESSED = "processed"
}
