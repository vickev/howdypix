import { list, nonNull, nullable, objectType } from "nexus";
import {
  NexusObjectTypeDef,
  ObjectDefinitionBlock,
} from "nexus/dist/definitions/objectType";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withMetaInfo = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: nullable("String") });
  t.field("nbImages", { type: "Int" });
  t.field("nbAlbums", { type: "Int" });
};

export const GetTreeAlbums = (): NexusObjectTypeDef<"GetTreeAlbums"> =>
  objectType({
    name: "GetTreeAlbums",
    definition(t) {
      t.field("dir", { type: "String" });
      t.field("parentDir", { type: nullable("String") });
      t.field("source", { type: "String" });
      withMetaInfo(t);
    },
  });
export const GetTreeSources = (): NexusObjectTypeDef<"GetTreeSources"> =>
  objectType({
    name: "GetTreeSources",
    definition(t) {
      t.field("name", { type: "String" });
      withMetaInfo(t);
    },
  });

export const GetTree = (): NexusObjectTypeDef<"GetTree"> =>
  objectType({
    name: "GetTree",
    definition(t) {
      t.field("albums", {
        type: list("GetTreeAlbums"),
      });
      t.field("sources", {
        type: list("GetTreeSources"),
      });
    },
  });
