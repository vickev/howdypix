import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from "typeorm";
import { SearchResult } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnSearchResultSave: EnhancedSubscriber<SearchResult> = (
  event,
  store
) => {
  @EventSubscriber()
  class PostSubscriber implements EntitySubscriberInterface<SearchResult> {
    listenTo = (): typeof SearchResult => {
      return SearchResult;
    };

    afterInsert = (event: InsertEvent<SearchResult>): void => {
      store.dispatch({
        type: "UPDATE_SEARCH_LAST_UPDATED_PHOTO",
        searchId: event.entity.id,
        data: {
          lastUpdatedPhoto: event.entity.photo.updatedAt,
        },
      });
    };
  }

  return PostSubscriber as EntitySubscriberInterface<SearchResult>;
};
