import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
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

    afterInsert = (event: InsertEvent<Album>): void => {
      store.dispatch({
        type: "STORE_NEW_ALBUM",
        albumId: event.entity.id,
        data: {
          lastUpdatedPhoto: null,
        },
      });
    };
  }

  return PostSubscriber as EntitySubscriberInterface<Album>;
};
