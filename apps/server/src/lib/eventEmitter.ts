import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ProcessData } from "@howdypix/shared-types";

export interface EventTypes {
  newFile: { root: string; path: string; sourceId: string };
  removeFile: { root: string; path: string; sourceId: string };
  processFile: { root: string; path: string; sourceId: string };
  processedFile: ProcessData;
}

export type Events = StrictEventEmitter<EventEmitter, EventTypes>;
