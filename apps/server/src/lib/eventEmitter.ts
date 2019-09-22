import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";

interface EventTypes {
  newFile: string;
  "queue:newFile": string;
}

export type Events = StrictEventEmitter<EventEmitter, EventTypes>;
