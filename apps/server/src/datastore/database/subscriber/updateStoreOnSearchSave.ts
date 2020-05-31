import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from "typeorm";
import { Search } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnSearchSave: EnhancedSubscriber<Search> = (
  event,
  store
) => {
  @EventSubscriber()
  class PostSubscriber implements EntitySubscriberInterface<Search> {
    listenTo = (): typeof Search => {
      return Search;
    };

    afterInsert = (event: InsertEvent<Search>): void => {
      store.dispatch({
        type: "STORE_NEW_SEARCH",
        searchId: event.entity.id,
        data: {
          album: event.entity.album,
          source: event.entity.source,
          lastUpdatedPhoto: null,
        },
      });
    };
  }

  return PostSubscriber as EntitySubscriberInterface<Search>;
};
