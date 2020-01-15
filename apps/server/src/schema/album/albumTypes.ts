import { enumType, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { NexusEnumTypeDef } from "nexus/dist/definitions/enumType";
import { withPreviewAndStats } from "../mixins";

export const PhotosOrderBy = (): NexusEnumTypeDef<"PhotosOrderBy"> =>
  enumType({
    name: "PhotosOrderBy",
    members: ["DATE_ASC", "DATE_DESC", "NAME_ASC", "NAME_DESC"],
    description: "The order of which the list is sorted"
  });

export const Photo = (): NexusObjectTypeDef<"Photo"> =>
  objectType({
    name: "Photo",
    definition(t) {
      t.id("id");
      t.id("file");
      t.field("thumbnails", { type: "String", list: [false] });
      t.field("birthtime", { type: "Float" });
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
