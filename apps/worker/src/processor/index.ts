import { FileProcessor } from "./types";
import imageProcessor from "./image";

export function getFileProcessor(mime: string | null): FileProcessor | null {
  switch (mime) {
    case "image/jpeg":
    case "image/png":
      return imageProcessor;
      break;

    default:
      return null;
  }
}
