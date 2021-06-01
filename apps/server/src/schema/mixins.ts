/**
 * Functions that are common to many type definitions
 */
import { ObjectDefinitionBlock } from "nexus/dist/definitions/objectType";
import { arg, nonNull, nullable } from "nexus";
import { NexusArgDef } from "nexus/dist/definitions/args";

// We can add these fields to any ObjectDefinition, that's why the "any"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPreviewAndStats = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: nullable("String") });
  t.field("nbPhotos", { type: nonNull("Int") });
  t.field("nbAlbums", { type: nonNull("Int") });
};

export const withOrderByQueryArg = (): { orderBy: NexusArgDef<string> } => ({
  orderBy: arg({
    type: nullable("PhotosOrderBy"),
    default: "DATE_DESC",
  }) as NexusArgDef<string>,
});

export const withFilterByQueryArg = (): { filterBy: NexusArgDef<string> } => ({
  filterBy: arg({
    type: nullable("PhotosFilterBy"),
  }) as NexusArgDef<string>,
});
