import { list, nonNull, nullable, objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { withPreviewAndStats } from "../mixins";

export const Photo = (): NexusObjectTypeDef<"Photo"> =>
  objectType({
    name: "Photo",
    definition(t) {
      t.id("id");
      t.id("file");
      t.field("thumbnails", { type: nonNull(list(nullable("String"))) });
      t.field("birthtime", { type: nonNull("Float") });
    },
  });

export const Album = (): NexusObjectTypeDef<"Album"> =>
  objectType({
    name: "Album",
    definition(t) {
      withPreviewAndStats(t);
      t.field("name", { type: nonNull("String") });
      t.field("dir", { type: nonNull("String") });
      t.field("source", { type: nonNull("String") });
    },
  });

export const GetAlbumPhotos = (): NexusObjectTypeDef<"GetAlbumPhotos"> =>
  objectType({
    name: "GetAlbumPhotos",
    definition(t) {
      t.field("photos", { type: nonNull(list(nullable("Photo"))) });
      t.field("albums", { type: nonNull(list(nonNull("Album"))) });
      t.field("album", { type: nullable("Album") });
    },
  });
