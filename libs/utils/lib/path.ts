import path from "path";
import { HFile } from "@howdypix/shared-types";

/**
 * In Howdypix, we identify the files as such:
 *
 *    - source: The source name as defined in the user configuration
 *    - dir: The directory relative to the source folder
 *    - file: The filename
 *
 * For example: @main:landscapes/2019/test.jpg will have this information:
 *
 *    - source: main
 *    - dir: landscapes/2019
 *    - file: test.jpg
 *
 */

export function hjoin(howdyfile: HFile) {
  return `@${howdyfile.source}:` + path.join(howdyfile.dir, howdyfile.file);
}

export function hparse(hpath: string): HFile {
  const [source, relativePath] = hpath.split(":");

  if (!source || !relativePath) {
    throw new Error(
      `The howdypath is not correct. Expected: @{source}:{path}/{filename}. Received: ${hpath}.`
    );
  }

  const { dir, base } = path.parse(relativePath);

  return { source: source.replace("@", ""), dir, file: base };
}

export function path2hfile(source: string, relativePath: string): HFile {
  const { dir, base } = path.parse(relativePath);
  return { source: source, dir, file: base };
}

export function hfile2path({ dir, file }: HFile): string {
  return path.join(dir, file);
}

export function thumbnailPath(root: string, howdyfile: HFile | string) {
  const { source, dir, file } =
    typeof howdyfile === "string" ? hparse(howdyfile) : howdyfile;

  return path.join(root, ".howdypix", source, dir, file);
}
