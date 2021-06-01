import {
  enumType,
  objectType,
  inputObjectType,
  nonNull,
  list,
  nullable,
} from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";
import { NexusEnumTypeDef } from "nexus/dist/definitions/enumType";
import { NexusInputObjectTypeDef } from "nexus/dist/definitions/inputObjectType";
import { withPreviewAndStats } from "../mixins";

export const PhotosOrderBy = (): NexusEnumTypeDef<"PhotosOrderBy"> =>
  enumType({
    name: "PhotosOrderBy",
    members: ["DATE_ASC", "DATE_DESC", "NAME_ASC", "NAME_DESC"],
    description: "The order of which the list is sorted",
  });

export const PhotosFilterBy = (): NexusInputObjectTypeDef<"PhotosFilterBy"> =>
  inputObjectType({
    name: "PhotosFilterBy",
    definition(t) {
      t.field("make", { type: nullable(list(nullable("String"))) });
      t.field("model", { type: nullable(list(nullable("String"))) });
    },
  });

export const SearchPhoto = (): NexusObjectTypeDef<"SearchPhoto"> =>
  objectType({
    name: "SearchPhoto",
    definition(t) {
      t.id("id");
      t.field("file", { type: nonNull("String") });
      t.field("thumbnails", { type: nonNull(list(nullable("String"))) });
      t.field("birthtime", { type: nonNull("Float") });
    },
  });

export const SearchAlbum = (): NexusObjectTypeDef<"SearchAlbum"> =>
  objectType({
    name: "SearchAlbum",
    definition(t) {
      withPreviewAndStats(t);
      t.field("name", { type: nonNull("String") });
      t.field("dir", { type: nonNull("String") });
      t.field("source", { type: nonNull("String") });
    },
  });

export const GetSearchPhotos = (): NexusObjectTypeDef<"GetSearchPhotos"> =>
  objectType({
    name: "GetSearchPhotos",
    definition(t) {
      t.field("photos", { type: nonNull(list(nullable("SearchPhoto"))) });
    },
  });
