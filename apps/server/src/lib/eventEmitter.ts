import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";

interface EventTypes {
  newFile: { root: string; path: string };
}

export type Events = StrictEventEmitter<EventEmitter, EventTypes>;
