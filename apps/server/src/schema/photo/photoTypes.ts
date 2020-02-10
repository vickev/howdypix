import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const PhotoDetail = (): NexusObjectTypeDef<"PhotoDetail"> =>
  objectType({
    name: "PhotoDetail",
    definition(t) {
      t.id("id");
      t.field("files", { type: "String", list: [false] });
      t.field("next", { type: "String", nullable: true });
      t.field("previous", { type: "String", nullable: true });
      t.field("photoStream", { type: "PhotoStreamThumbnail", list: [true] });
    }
  });

export const PhotoStreamThumbnail = (): NexusObjectTypeDef<"PhotoStreamThumbnail"> =>
  objectType({
    name: "PhotoStreamThumbnail",
    definition(t) {
      t.id("id");
      t.id("file");
      t.field("thumbnails", { type: "String", list: [true] });
    }
  });
