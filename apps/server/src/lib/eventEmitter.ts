import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { ProcessData } from "@howdypix/shared-types";

interface EventTypes {
  newFile: { root: string; path: string };
  processedFile: ProcessData;
}

export type Events = StrictEventEmitter<EventEmitter, EventTypes>;
