import { objectType } from "nexus";
import { NexusObjectTypeDef } from "nexus/dist/definitions/objectType";

export const GetTreeAlbums = (): NexusObjectTypeDef<"GetTreeAlbums"> =>
  objectType({
    name: "GetTreeAlbums",
    definition(t) {
      t.field("dir", { type: "String" });
      t.field("parentDir", { type: "String", nullable: true });
      t.field("source", { type: "String", nullable: false });
    }
  });
export const GetTreeSources = (): NexusObjectTypeDef<"GetTreeSources"> =>
  objectType({
    name: "GetTreeSources",
    definition(t) {
      t.field("name", { type: "String", nullable: false });
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
