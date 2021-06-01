import { list, nonNull, nullable, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const DateTaken = (): NexusObjectTypeDef<"DateTaken"> =>
  objectType({
    name: "DateTaken",
    definition(t) {
      t.field("from", { type: nullable("Float") });
      t.field("to", { type: nullable("Float") });
    },
  });

export const GetFilters = (): NexusObjectTypeDef<"GetFilters"> =>
  objectType({
    name: "GetFilters",
    definition(t) {
      t.field("cameraMakes", { type: list("String") });
      t.field("cameraModels", { type: list("String") });
      t.field("dateTakenRange", { type: "DateTaken" });
    },
  });
