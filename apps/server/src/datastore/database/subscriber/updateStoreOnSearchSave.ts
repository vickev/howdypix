import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from "typeorm";
import { Search } from "../entity";
import { EnhancedSubscriber } from "../../../types";

export const updateStoreOnSearchSave: EnhancedSubscriber<Search> = (
  event,
  store
) => {
  @EventSubscriber()
  class SearchSubscriber implements EntitySubscriberInterface<Search> {
    listenTo = (): typeof Search => {
      return Search;
    };

    afterInsert = (e: InsertEvent<Search>): void => {
      event.emit("insertSearchEntry", { data: e.entity });
    };

    afterUpdate = (e: UpdateEvent<Search>): void => {
      event.emit("updateSearchEntry", { data: e.entity });
    };

    afterRemove = (e: RemoveEvent<Search>): void => {
      event.emit("removeSearchEntry", { data: e.entity });
    };
  }

  return SearchSubscriber as EntitySubscriberInterface<Search>;
};
