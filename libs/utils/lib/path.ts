import path from "path";
import { HFile, HPath } from "@howdypix/shared-types";

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

export function hjoin(howdyfile: HFile): HPath {
  return (
    `@${howdyfile.source}:` +
    path.join(howdyfile.dir ?? "", howdyfile.file ?? "")
  );
}

export function hparse(hpath: HPath): HFile {
  const [source, relativePath] = hpath.split(":");

  if (!source) {
    throw new Error(
      `The howdypath is not correct. Expected: @{source}:{path}/{filename}. Received: ${hpath}.`
    );
  }

  const ret: HFile = { source: source.replace("@", "") };

  // We don't want the "." (when at the root) to be considered as a directory
  if (relativePath && relativePath !== ".") {
    const [file, ...dir] = relativePath.split("/").reverse();
    if (/^[^.]+$/.test(file)) {
      // It's a directory
      ret.dir = file;
    } else {
      ret.dir = path.join(...dir);
      ret.file = file;
    }
  }

  return ret;
}

export function path2hfile(source: string, relativePath: string): HFile {
  const { dir, base } = path.parse(relativePath);
  return { source: source, dir, file: base };
}

export function hfile2path({ dir, file }: HFile): HPath {
  return (file && path.join(dir ?? "", file)) ?? dir ?? "";
}

export function thumbnailPath(root: string, howdyfile: HFile | HPath) {
  const { source, dir, file } = howdyfile.hasOwnProperty("dir")
    ? (howdyfile as HFile)
    : hparse(howdyfile as HPath);

  return path.join(root, ".howdypix", source, dir ?? "", file ?? "");
}

export function hpaths(folder: HFile): HFile[] {
  const paths: HFile[] = [];
  const folders = folder.dir?.split("/");
  paths.push({
    source: folder.source,
    name: folder.source
  });
  folders &&
    folders.map((element, index) => {
      paths.push({
        source: folder.source,
        dir: folders.slice(0, index).join("/"),
        name: element
      });
    });

  return paths;
}
