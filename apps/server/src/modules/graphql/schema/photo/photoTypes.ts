import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const PhotoDetail = (): NexusObjectTypeDef<"PhotoDetail"> =>
  objectType({
    name: "PhotoDetail",
    definition(t) {
      t.id("id");
      t.field("files", { type: "String", list: [false] });
      t.field("make", { type: "String" });
      t.field("model", { type: "String" });
      t.field("birthtime", { type: "Float" });
      t.field("shutter", { type: "Float" });
      t.field("aperture", { type: "Float" });
      t.field("iso", { type: "Float" });
      t.field("next", { type: "String", nullable: true });
      t.field("previous", { type: "String", nullable: true });
      t.field("photoStream", { type: "PhotoStreamThumbnail", list: [true] });
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
      t.field("thumbnails", { type: "String", list: [true] });
    },
  });
