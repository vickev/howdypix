import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { Photo } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnPhotoSave: EnhancedSubscriber<Photo> = (event) => {
  @EventSubscriber()
  class PhotoSubscriber implements EntitySubscriberInterface<Photo> {
    listenTo = (): typeof Photo => {
      return Photo;
    };

    afterInsert = (e: InsertEvent<Photo>): void => {
      event.emit("insertPhotoEntry", { data: e.entity });
    };

    afterUpdate = (e: UpdateEvent<Photo>): void => {
      event.emit("updatePhotoEntry", { data: e.entity });
    };

    afterRemove = (e: RemoveEvent<Photo>): void => {
      event.emit("removePhotoEntry", { data: e.entity });
    };
  }

  return PhotoSubscriber as EntitySubscriberInterface<Photo>;
};
