import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { withPreviewAndStats } from "../mixins";

export const Photo = (): NexusObjectTypeDef<"Photo"> =>
  objectType({
    name: "Photo",
    definition(t) {
      t.id("id");
      t.field("thumbnails", { type: "String", list: [false] });
    }
  });

export const Album = (): NexusObjectTypeDef<"Album"> =>
  objectType({
    name: "Album",
    definition(t) {
      withPreviewAndStats(t);
      t.field("name", { type: "String" });
      t.field("dir", { type: "String" });
      t.field("source", { type: "String" });
    }
  });

export const GetAlbumPhotos = (): NexusObjectTypeDef<"GetAlbumPhotos"> =>
  objectType({
    name: "GetAlbumPhotos",
    definition(t) {
      t.field("photos", { type: "Photo", list: [false] });
      t.field("albums", { type: "Album", list: [true] });
      t.field("album", { type: "Album", nullable: true });
    }
  });
