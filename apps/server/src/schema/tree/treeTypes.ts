import { objectType } from "nexus";
import {
  NexusObjectTypeDef,
  ObjectDefinitionBlock
} from "nexus/dist/definitions/objectType";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withMetaInfo = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: "String", nullable: true });
  t.field("nbImages", { type: "Int", nullable: false });
  t.field("nbAlbums", { type: "Int", nullable: false });
};

export const GetTreeAlbums = (): NexusObjectTypeDef<"GetTreeAlbums"> =>
  objectType({
    name: "GetTreeAlbums",
    definition(t) {
      t.field("dir", { type: "String" });
      t.field("parentDir", { type: "String", nullable: true });
      t.field("source", { type: "String", nullable: false });
      withMetaInfo(t);
    }
  });
export const GetTreeSources = (): NexusObjectTypeDef<"GetTreeSources"> =>
  objectType({
    name: "GetTreeSources",
    definition(t) {
      t.field("name", { type: "String", nullable: false });
      t.field("preview", { type: "String", nullable: true });
      t.field("nbImages", { type: "Int", nullable: false });
      withMetaInfo(t);
    }
  });

export const GetTree = (): NexusObjectTypeDef<"GetTree"> =>
  objectType({
    name: "GetTree",
    definition(t) {
      t.field("albums", {
        type: "GetTreeAlbums",
        list: [true]
      });
      t.field("sources", {
        type: "GetTreeSources",
        list: [true]
      });
    }
  });
