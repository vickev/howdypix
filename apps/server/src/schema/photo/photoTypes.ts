import { list, nonNull, nullable, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const PhotoDetail = (): NexusObjectTypeDef<"PhotoDetail"> =>
  objectType({
    name: "PhotoDetail",
    definition(t) {
      t.id("id");
      t.field("files", { type: nonNull(list(nullable("String"))) });
      t.field("make", { type: nonNull("String") });
      t.field("model", { type: nonNull("String") });
      t.field("birthtime", { type: nonNull("Float") });
      t.field("shutter", { type: nonNull("Float") });
      t.field("aperture", { type: nonNull("Float") });
      t.field("iso", { type: nonNull("Float") });
      t.field("next", { type: nullable("String") });
      t.field("previous", { type: nullable("String") });
      t.field("photoStream", {
        type: nonNull(list(nonNull("PhotoStreamThumbnail"))),
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
      t.field("thumbnails", { type: nonNull(list(nonNull("String"))) });
    },
  });
