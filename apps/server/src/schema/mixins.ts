/**
 * Functions that are common to many type definitions
 */
import { ObjectDefinitionBlock } from "nexus/dist/definitions/objectType";
import { arg, nullable } from "nexus";
import { NexusArgDef } from "nexus/dist/core";

// We can add these fields to any ObjectDefinition, that's why the "any"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPreviewAndStats = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: nullable("String") });
  t.field("nbPhotos", { type: "Int" });
  t.field("nbAlbums", { type: "Int" });
};

export const withOrderByQueryArg = (): { orderBy: NexusArgDef<"String"> } => ({
  orderBy: arg({
    type: nullable("PhotosOrderBy"),
    default: "DATE_DESC",
  }) as NexusArgDef<"String">,
});

export const withFilterByQueryArg = (): {
  filterBy: NexusArgDef<"String">;
} => ({
  filterBy: arg({
    type: nullable("PhotosFilterBy"),
  }) as NexusArgDef<"String">,
});
