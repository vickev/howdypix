import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { withPreviewAndStats } from "../mixins";

export const Source = (): NexusObjectTypeDef<"Source"> =>
  objectType({
    name: "Source",
    definition(t) {
      withPreviewAndStats(t);
      t.field("name", { type: "String" });
    }
  });
