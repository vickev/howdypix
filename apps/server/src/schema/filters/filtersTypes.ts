import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const DateTaken = (): NexusObjectTypeDef<"DateTaken"> =>
  objectType({
    name: "DateTaken",
    definition(t) {
      t.field("from", { type: "Float", nullable: true });
      t.field("to", { type: "Float", nullable: true });
    }
  });

export const GetFilters = (): NexusObjectTypeDef<"GetFilters"> =>
  objectType({
    name: "GetFilters",
    definition(t) {
      t.field("cameraMakes", { type: "String", list: [true] });
      t.field("cameraModels", { type: "String", list: [true] });
      t.field("dateTakenRange", { type: "DateTaken" });
    }
  });
