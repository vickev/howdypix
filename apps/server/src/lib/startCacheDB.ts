import { Connection } from "typeorm";
import { appDebug, generateThumbnailPaths, hjoin } from "@howdypix/utils";
import { existsSync, statSync, unlinkSync } from "fs";
import { join, parse } from "path";
import { UserConfig } from "../config";
import { Photo } from "../entity/Photo";
import { Events, EventTypes } from "./eventEmitter";

export async function onNewFile(
  { root, hfile }: EventTypes["newFile"],
  event: Events,
  connection: Connection,
  userConfig: UserConfig
): Promise<void> {
  const absolutePath = join(root, hfile.dir ?? "", hfile.file ?? "");
  const stat = statSync(absolutePath);

  // Check if it exists in the database
  const photoRepository = connection.getRepository(Photo);
  const photo = await photoRepository.find({ where: { inode: stat.ino } });

  // Check the updated_date
  if (photo && photo[0] && photo[0].mtime === stat.mtimeMs) {
    const thumbnailsExist: boolean = generateThumbnailPaths(
      userConfig.thumbnailsDir,
      hfile
    ).reduce(
      (accumulator: boolean, tn) => accumulator && existsSync(tn.path),
      true
    );

    if (thumbnailsExist) {
      return;
    }
  }

  // Act
  event.emit("processFile", { root, hfile });
}

export async function onRemoveFile(
  { hfile }: EventTypes["newFile"],
  event: Events,
  connection: Connection,
  userConfig: UserConfig
): Promise<void> {
  const photoRepository = connection.getRepository(Photo);

  // Remove from database
  await photoRepository.delete(hfile);

  // Remove thumbnails
  generateThumbnailPaths(userConfig.thumbnailsDir, hfile).forEach(tn => {
    unlinkSync(tn.path);
  });
}

export async function onProcessedFile(
  file: EventTypes["processedFile"],
  event: Events,
  connection: Connection
): Promise<void> {
  const photo = new Photo();
  photo.make = file.exif.make ?? "";
  photo.model = file.exif.model ?? "";
  photo.ISO = file.exif.ISO ?? 0;
  photo.shutter = file.exif.shutter ?? 0;
  photo.processedShutter = file.exif.shutter
    ? Math.round((1 / file.exif.shutter) * 10) / 10
    : 0;
  photo.aperture = file.exif.aperture ?? 0;
  photo.processedAperture = file.exif.aperture
    ? Math.round(file.exif.aperture * 10) / 10
    : 0;
  photo.createDate = file.exif.createDate ?? 0;
  photo.inode = file.stat.inode;
  photo.mtime = file.stat.mtime;
  photo.ctime = file.stat.ctime;
  photo.birthtime = file.stat.birthtime;
  photo.size = file.stat.size;
  photo.source = file.hfile.source;
  photo.parentDir = parse(file.hfile.dir ?? "").dir ?? "";
  photo.dir = file.hfile.dir ?? "";
  photo.file = file.hfile.file ?? "";

  const photoRepository = connection.getRepository(Photo);

  await photoRepository.save(photo);
  appDebug("db")(`Saved ${hjoin(file.hfile)}.`);
}

export async function startCacheDB(
  event: Events,
  userConfig: UserConfig,
  connection: Connection
): Promise<Connection> {
  event.on("newFile", params =>
    onNewFile(params, event, connection, userConfig)
  );

  event.on("removeFile", params =>
    onRemoveFile(params, event, connection, userConfig)
  );

  event.on("processedFile", file => onProcessedFile(file, event, connection));

  return connection;
}
