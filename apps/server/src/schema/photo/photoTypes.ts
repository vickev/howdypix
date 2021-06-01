import { list, nonNull, nullable, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const PhotoDetail = (): NexusObjectTypeDef<"PhotoDetail"> =>
  objectType({
    name: "PhotoDetail",
    definition(t) {
      t.id("id");
      t.field("files", { type: list(nullable("String")) });
      t.field("make", { type: "String" });
      t.field("model", { type: "String" });
      t.field("birthtime", { type: "Float" });
      t.field("shutter", { type: "Float" });
      t.field("aperture", { type: "Float" });
      t.field("iso", { type: "Float" });
      t.field("next", { type: nullable("String") });
      t.field("previous", { type: nullable("String") });
      t.field("photoStream", {
        type: list("PhotoStreamThumbnail"),
      });
    },
  });

export const PhotoStreamThumbnail = (): NexusObjectTypeDef<
  "PhotoStreamThumbnail"
> =>
  objectType({
    name: "PhotoStreamThumbnail",
    definition(t) {
      t.id("id");
      t.id("file");
      t.field("thumbnails", { type: list("String") });
    },
  });
