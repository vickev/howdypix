import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from "typeorm";
import { Photo, SearchResult } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnSearchResultSave: EnhancedSubscriber<SearchResult> = (
  event,
  store
) => {
  @EventSubscriber()
  class SearchResultSubscriber
    implements EntitySubscriberInterface<SearchResult> {
    listenTo = (): typeof SearchResult => {
      return SearchResult;
    };

    afterInsert = (e: InsertEvent<SearchResult>): void => {
      event.emit("insertSearchResultEntry", { data: e.entity });
    };

    afterUpdate = (e: UpdateEvent<SearchResult>): void => {
      event.emit("updateSearchResultEntry", { data: e.entity });
    };

    afterRemove = (e: RemoveEvent<SearchResult>): void => {
      event.emit("removeSearchResultEntry", { data: e.entity });
    };
  }

  return SearchResultSubscriber as EntitySubscriberInterface<SearchResult>;
};
