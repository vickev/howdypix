import { Connection } from "typeorm";
import { appDebug, generateThumbnailPaths, hjoin } from "@howdypix/utils";
import { existsSync, statSync, unlinkSync } from "fs";
import { join, parse } from "path";
import { UserConfig } from "../config";
import { Photo } from "../entity/Photo";
import { Events, EventTypes } from "./eventEmitter";
import { Source } from "../entity/Source";
import { Album } from "../entity/Album";

export async function onNewDir(
  { root, hfile }: EventTypes["newDirectory"],
  event: Events,
  connection: Connection
): Promise<void> {
  const absolutePath = join(root, hfile.dir ?? "", hfile.file ?? "");
  const stat = statSync(absolutePath);

  // Check if it exists in the database
  const albumRepository = connection.getRepository(Album);
  const sourceRepository = connection.getRepository(Source);
  const album = await albumRepository.findOne({ where: { inode: stat.ino } });

  // Check the updated_date
  if (!album) {
    const newAlbum = new Album();
    newAlbum.dir = hfile.file ?? "";
    newAlbum.parentDir = hfile.dir ?? "";
    newAlbum.source = hfile.source;
    newAlbum.inode = stat.ino.toString();

    newAlbum.sourceLk =
      (await sourceRepository.findOne({
        source: hfile.source,
      })) ?? null;

    albumRepository.save(newAlbum);
  }
}

export async function onUnlinkDir(
  { root, hfile }: EventTypes["unlinkDirectory"],
  event: Events,
  connection: Connection
): Promise<void> {
  const absolutePath = join(root, hfile.dir ?? "", hfile.file ?? "");
  const stat = statSync(absolutePath);

  // Check if it exists in the database
  const albumRepository = connection.getRepository(Album);
  await albumRepository.delete({ inode: stat.ino.toString() });
}

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
  const photo = await photoRepository.findOne({ inode: stat.ino });

  // Check the updated_date
  if (photo?.mtime === stat.mtimeMs) {
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
  generateThumbnailPaths(userConfig.thumbnailsDir, hfile).forEach((tn) => {
    unlinkSync(tn.path);
  });
}

export async function onProcessedFile(
  file: EventTypes["processedFile"],
  event: Events,
  connection: Connection
): Promise<void> {
  const albumRepository = connection.getRepository(Album);
  const photoRepository = connection.getRepository(Photo);

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

  photo.album =
    (await albumRepository.findOne({
      dir: file.hfile.dir ?? "",
      source: file.hfile.source,
      parentDir: parse(file.hfile.dir ?? "").dir ?? "",
    })) ?? null;

  await photoRepository.save(photo);
  appDebug("db")(`Saved ${hjoin(file.hfile)}.`);
}

export async function startCacheDB(
  event: Events,
  userConfig: UserConfig,
  connection: Connection
): Promise<Connection> {
  // Insert the source entries in the database
  await Promise.all(
    Object.keys(userConfig.photoDirs).map(async (source) => {
      await Source.upsert(source, userConfig.photoDirs[source]);
    })
  );

  event.on("newFile", (params) =>
    onNewFile(params, event, connection, userConfig)
  );

  event.on("removeFile", (params) =>
    onRemoveFile(params, event, connection, userConfig)
  );

  event.on("newDirectory", (params) => onNewDir(params, event, connection));

  event.on("unlinkDirectory", (params) =>
    onUnlinkDir(params, event, connection)
  );

  event.on("processedFile", (file) => onProcessedFile(file, event, connection));

  return connection;
}
