import { Events } from "./eventEmitter";

import { createConnection } from "typeorm";
import { Photo } from "../entity/Photo";
import ormConfig from "../../ormconfig.json";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { appDebug } from "@howdypix/utils";

export async function startCacheDB(event: Events) {
  const connection = await createConnection(
    ormConfig as SqliteConnectionOptions
  );

  event.on("processedFile", async file => {
    const photo = new Photo();
    photo.make = file.exif.make || "";
    photo.model = file.exif.model || "";
    photo.file = file.thumbnails[0];

    const photoRepository = connection.getRepository(Photo);

    await photoRepository.save(photo);
    appDebug("db")(`Saved ${photo.file}.`);
  });
}
