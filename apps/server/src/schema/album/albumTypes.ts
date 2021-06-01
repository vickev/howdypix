import { list, nonNull, nullable, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { withPreviewAndStats } from "../mixins";

export const Photo = (): NexusObjectTypeDef<"Photo"> =>
  objectType({
    name: "Photo",
    definition(t) {
      t.id("id");
      t.id("file");
      t.field("thumbnails", { type: list(nullable("String")) });
      t.field("birthtime", { type: "Float" });
    },
  });

export const Album = (): NexusObjectTypeDef<"Album"> =>
  objectType({
    name: "Album",
    definition(t) {
      withPreviewAndStats(t);
      t.field("name", { type: "String" });
      t.field("dir", { type: "String" });
      t.field("source", { type: "String" });
    },
  });

export const GetAlbumPhotos = (): NexusObjectTypeDef<"GetAlbumPhotos"> =>
  objectType({
    name: "GetAlbumPhotos",
    definition(t) {
      t.field("photos", { type: list(nullable("Photo")) });
      t.field("albums", { type: list("Album") });
      t.field("album", { type: nullable("Album") });
    },
  });
