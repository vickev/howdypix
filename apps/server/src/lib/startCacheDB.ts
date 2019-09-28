import { Events, EventTypes } from "./eventEmitter";

import { Connection, createConnection } from "typeorm";
import { Photo } from "../entity/Photo";
import ormConfig from "../../ormconfig.json";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { appDebug, generateThumbnailPaths } from "@howdypix/utils";
import { statSync, existsSync, unlinkSync } from "fs";
import { join } from "path";
import { UserConfigState } from "../state";

export async function onNewFile(
  { path, root, sourceId }: EventTypes["newFile"],
  event: Events,
  connection: Connection,
  userConfig: UserConfigState
) {
  const absolutePath = join(root, path);
  const stat = statSync(absolutePath);

  // Check if it exists in the database
  const photoRepository = connection.getRepository(Photo);
  const photo = await photoRepository.find({ where: { inode: stat.ino } });

  // Check the updated_date
  if (photo && photo[0] && photo[0].mtime === stat.mtimeMs) {
    const thumbnailsExist: boolean = generateThumbnailPaths(
      userConfig.thumbnailsDir,
      sourceId,
      path
    ).reduce(
      (accumulator: boolean, tn) => accumulator && existsSync(tn.path),
      true
    );

    if (thumbnailsExist) {
      return;
    }
  }

  // Act
  event.emit("processFile", { path, root, sourceId });
}

export async function onRemoveFile(
  { path, root, sourceId }: EventTypes["newFile"],
  event: Events,
  connection: Connection,
  userConfig: UserConfigState
) {
  const photoRepository = connection.getRepository(Photo);

  // Remove from database
  await photoRepository.delete({ root, path, sourceId });

  // Remove thumbnails
  generateThumbnailPaths(userConfig.thumbnailsDir, sourceId, path).forEach(
    tn => {
      unlinkSync(tn.path);
    }
  );
}

export async function onProcessedFile(
  file: EventTypes["processedFile"],
  connection: Connection
) {
  const photo = new Photo();
  photo.make = file.exif.make || "";
  photo.model = file.exif.model || "";
  photo.ISO = file.exif.ISO || 0;
  photo.createDate = file.exif.createDate || 0;
  photo.inode = file.stat.inode;
  photo.mtime = file.stat.mtime;
  photo.ctime = file.stat.ctime;
  photo.birthtime = file.stat.birthtime;
  photo.size = file.stat.size;
  photo.path = file.path;
  photo.root = file.root;
  photo.sourceId = file.sourceId;

  const photoRepository = connection.getRepository(Photo);

  await photoRepository.save(photo);
  appDebug("db")(`Saved ${photo.path}.`);
}

export async function startCacheDB(
  event: Events,
  userConfig: UserConfigState
): Promise<Connection> {
  const connection = await createConnection(
    ormConfig as SqliteConnectionOptions
  );

  event.on(
    "newFile",
    async params => await onNewFile(params, event, connection, userConfig)
  );

  event.on(
    "removeFile",
    async params => await onRemoveFile(params, event, connection, userConfig)
  );

  event.on(
    "processedFile",
    async file => await onProcessedFile(file, connection)
  );

  return connection;
}
