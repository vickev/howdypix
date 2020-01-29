import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const Camera = (): NexusObjectTypeDef<"Camera"> =>
  objectType({
    name: "Camera",
    definition(t) {
      t.field("make", { type: "String" });
      t.field("model", { type: "String" });
    }
  });

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
      t.field("cameras", { type: "Camera", list: [false] });
      t.field("dateTakenRange", { type: "DateTaken" });
    }
  });
