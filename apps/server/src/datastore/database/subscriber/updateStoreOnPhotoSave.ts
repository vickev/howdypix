import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from "typeorm";
import { Photo } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnPhotoSave: EnhancedSubscriber<Photo> = (
  event,
  store
) => {
  @EventSubscriber()
  class PostSubscriber implements EntitySubscriberInterface<Photo> {
    listenTo = (): typeof Photo => {
      return Photo;
    };

    afterInsert = (e: InsertEvent<Photo>): void => {
      store.dispatch({
        type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO",
        albumId: e.entity.albumId,
        data: {
          lastUpdatedPhoto: e.entity.updatedAt,
        },
      });

      event.emit("newPhotoEntry", { data: e.entity });
    };

    afterUpdate = (e: InsertEvent<Photo>): void => {
      event.emit("newPhotoEntry", { data: e.entity });
    };
  }

  return PostSubscriber as EntitySubscriberInterface<Photo>;
};
