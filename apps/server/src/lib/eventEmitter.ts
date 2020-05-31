import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { HFile, QueueData, QueueName } from "@howdypix/shared-types";
import {
  Photo,
  SearchResult,
  Search,
  Album,
} from "../datastore/database/entity";

export interface EventTypes {
  newDirectory: { root: string; hfile: HFile };
  unlinkDirectory: { root: string; hfile: HFile };
  newFile: { root: string; hfile: HFile };
  removeFile: { root: string; hfile: HFile };
  processFile: { root: string; hfile: HFile };
  processedFile: QueueData[QueueName.PROCESSED];

  insertPhotoEntry: {
    data: Photo;
  };
  updatePhotoEntry: {
    data: Photo;
  };
  removePhotoEntry: {
    data?: Photo;
  };

  insertSearchResultEntry: {
    data: SearchResult;
  };
  updateSearchResultEntry: {
    data: SearchResult;
  };
  removeSearchResultEntry: {
    data?: SearchResult;
  };

  insertSearchEntry: {
    data: Search;
  };
  updateSearchEntry: {
    data: Search;
  };
  removeSearchEntry: {
    data?: Search;
  };

  insertAlbumEntry: {
    data: Album;
  };
  updateAlbumEntry: {
    data: Album;
  };
  removeAlbumEntry: {
    data?: Album;
  };
}

export type Events = StrictEventEmitter<EventEmitter, EventTypes>;
