import { Connection, EntitySchema, getConnectionManager } from "typeorm";
import { map } from "lodash";
import { AppStore } from "../state";
import * as subscribers from "./subscriber";
import * as entities from "./entity";
import { AppConfig } from "../../lib/config";
import { Events } from "../../lib/eventEmitter";

export const initializeDatabase = (
  dbConfig: AppConfig["database"],
  store: AppStore,
  event: Events
): Connection =>
  getConnectionManager().create({
    type: "sqlite",
    database: dbConfig.path,
    synchronize: true,
    logging: false,
    entities: map(entities, (entity) => (entity as unknown) as EntitySchema),
    subscribers: map(
      subscribers,
      (subscriber) => subscriber(event, store) as Function
    ),
  });
