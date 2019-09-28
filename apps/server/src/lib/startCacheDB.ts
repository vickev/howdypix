import { Events } from "./eventEmitter";

import { Connection, createConnection } from "typeorm";
import { Photo } from "../entity/Photo";
import ormConfig from "../../ormconfig.json";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { appDebug } from "@howdypix/utils";
import { statSync } from "fs";
import { join } from "path";

export async function startCacheDB(event: Events): Promise<Connection> {
  const connection = await createConnection(
    ormConfig as SqliteConnectionOptions
  );

  event.on("newFile", async ({ path, root, sourceId }) => {
    const absolutePath = join(root, path);
    const stat = statSync(absolutePath);

    // Check if it exists in the database
    const photoRepository = connection.getRepository(Photo);
    const photo = await photoRepository.find({ where: { inode: stat.ino } });

    // Check the updated_date
    if (photo && photo[0] && photo[0].mtime === stat.mtimeMs) {
      return;
    }

    // TODO Check the thumbnails

    // Act
    event.emit("processFile", { path, root, sourceId });
  });

  event.on("processedFile", async file => {
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
  });

  event.on("removeFile", async ({ root, path }) => {
    // TODO Remove the entry in the database
  });

  return connection;
}
