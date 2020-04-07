import { Connection } from "typeorm";
import {
  appDebug,
  appError,
  generateThumbnailPaths,
  hjoin,
  parentDir,
} from "@howdypix/utils";
import { existsSync, statSync, unlinkSync } from "fs";
import { join, parse } from "path";
import { UserConfig } from "../config";
import { Photo, PHOTO_STATUS } from "../entity/Photo";
import { Events, EventTypes } from "./eventEmitter";
import { Source } from "../entity/Source";
import { Album } from "../entity/Album";

export async function onNewDir(
  { root, hfile }: EventTypes["newDirectory"],
  event: Events,
  connection: Connection
): Promise<void> {
  const relativePath = join(hfile.dir ?? "", hfile.file ?? "");
  const absolutePath = join(root, relativePath);
  const stat = statSync(absolutePath);

  // Check if it exists in the database
  const albumRepository = connection.getRepository(Album);
  const sourceRepository = connection.getRepository(Source);
  const album = await albumRepository.findOne({ where: { inode: stat.ino } });

  // Check the updated_date
  if (!album) {
    const newAlbum = new Album();
    newAlbum.dir = relativePath === "." ? "" : relativePath;
    newAlbum.parentDir = parentDir(relativePath);
    newAlbum.source = hfile.source;
    newAlbum.inode = stat.ino.toString();

    // TODO to refactor
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

  if (!photo) {
    const album = await Album.fetchOne(hfile.source, hfile.dir);

    if (!album) {
      appError("db")(
        `The album { ${hfile.source}, ${hfile.dir} } does not exist.`
      );
    } else {
      const newPhoto = new Photo();
      newPhoto.inode = stat.ino;
      newPhoto.mtime = stat.mtime.getMilliseconds();
      newPhoto.ctime = stat.ctime.getMilliseconds();
      newPhoto.birthtime = stat.birthtime.getMilliseconds();
      newPhoto.size = stat.size;
      newPhoto.source = hfile.source;
      newPhoto.parentDir = parse(hfile.dir ?? "").dir ?? "";
      newPhoto.dir = hfile.dir ?? "";
      newPhoto.file = hfile.file ?? "";
      newPhoto.status = PHOTO_STATUS.NOT_PROCESSED;
      newPhoto.album = album;

      await photoRepository.save(newPhoto);
    }

    event.emit("processFile", { root, hfile });
  }
  // else if (photo.mtime === stat.mtimeMs) {
  //     const thumbnailsExist: boolean = generateThumbnailPaths(
  //       userConfig.thumbnailsDir,
  //       hfile
  //     ).reduce((accumulator: boolean, tn) => {
  //       return accumulator && existsSync(tn.path);
  //     }, true);
  //
  //     if (thumbnailsExist) {
  //       return;
  //     }
  //   }
  // }

  // Act
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
  const where = {
    where: {
      file: file.hfile.file,
      dir: file.hfile.dir,
      source: file.hfile.source,
    },
  };

  const photo = await photoRepository.findOne(where);
  const album = await Album.fetchOne(file.hfile.source, file.hfile.dir);

  if (photo) {
    if (album) {
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

      photo.album = album;

      await photoRepository.save(photo);
      appDebug("db")(`Saved ${hjoin(file.hfile)}.`);
    } else {
      appError("db")(
        `The album { ${file.hfile.source}, ${file.hfile.dir} } does not exist.`
      );
    }
  } else {
    appError("db")(
      `Impossible to find { ${JSON.stringify(
        where
      )} } in the database to save the information.`
    );
  }
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
