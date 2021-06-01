import { list, nonNull, nullable, objectType } from "nexus";
import {
  NexusObjectTypeDef,
  ObjectDefinitionBlock,
} from "nexus/dist/definitions/objectType";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withMetaInfo = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: nullable("String") });
  t.field("nbImages", { type: nonNull("Int") });
  t.field("nbAlbums", { type: nonNull("Int") });
};

export const GetTreeAlbums = (): NexusObjectTypeDef<"GetTreeAlbums"> =>
  objectType({
    name: "GetTreeAlbums",
    definition(t) {
      t.field("dir", { type: nonNull("String") });
      t.field("parentDir", { type: nullable("String") });
      t.field("source", { type: nonNull("String") });
      withMetaInfo(t);
    },
  });
export const GetTreeSources = (): NexusObjectTypeDef<"GetTreeSources"> =>
  objectType({
    name: "GetTreeSources",
    definition(t) {
      t.field("name", { type: nonNull("String") });
      withMetaInfo(t);
    },
  });

export const GetTree = (): NexusObjectTypeDef<"GetTree"> =>
  objectType({
    name: "GetTree",
    definition(t) {
      t.field("albums", {
        type: nonNull(list(nonNull("GetTreeAlbums"))),
      });
      t.field("sources", {
        type: nonNull(list(nonNull("GetTreeSources"))),
      });
    },
  });
