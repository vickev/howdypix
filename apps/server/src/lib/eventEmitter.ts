import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";
import { HFile, QueueData, QueueName } from "@howdypix/shared-types";

export interface EventTypes {
  newDirectory: { root: string; hfile: HFile };
  unlinkDirectory: { root: string; hfile: HFile };
  newFile: { root: string; hfile: HFile };
  removeFile: { root: string; hfile: HFile };
  processFile: { root: string; hfile: HFile };
  processedFile: QueueData[QueueName.PROCESSED];
}

export type Events = StrictEventEmitter<EventEmitter, EventTypes>;
