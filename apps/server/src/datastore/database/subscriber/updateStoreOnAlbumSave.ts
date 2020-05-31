import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { Album } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnAlbumSave: EnhancedSubscriber<Album> = (
  event,
  store
) => {
  @EventSubscriber()
  class PostSubscriber implements EntitySubscriberInterface<Album> {
    listenTo = (): typeof Album => {
      return Album;
    };

    afterInsert = (e: InsertEvent<Album>): void => {
      event.emit("insertAlbumEntry", { data: e.entity });
    };

    afterUpdate = (e: UpdateEvent<Album>): void => {
      event.emit("updateAlbumEntry", { data: e.entity });
    };

    afterRemove = (e: RemoveEvent<Album>): void => {
      event.emit("removeAlbumEntry", { data: e.entity });
    };
  }

  return PostSubscriber as EntitySubscriberInterface<Album>;
};
