import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const PhotoDetail = (): NexusObjectTypeDef<"PhotoDetail"> =>
  objectType({
    name: "PhotoDetail",
    definition(t) {
      t.id("id");
      t.field("files", { type: "String", list: [false] });
    }
  });

export const PhotoStreamThumbnail = (): NexusObjectTypeDef<"PhotoStreamThumbnail"> =>
  objectType({
    name: "PhotoStreamThumbnail",
    definition(t) {
      t.id("id");
      t.field("thumbnails", { type: "String", list: [true] });
    }
  });

export const PhotoStream = (): NexusObjectTypeDef<"PhotoStream"> =>
  objectType({
    name: "PhotoStream",
    definition(t) {
      t.field("photos", { type: "PhotoStreamThumbnail", list: [true] });
    }
  });
