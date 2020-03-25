/**
 * Functions that are common to many type definitions
 */
import { ObjectDefinitionBlock } from "nexus/dist/definitions/objectType";
import { arg } from "nexus";
import { NexusArgDef } from "nexus/dist/definitions/args";

// We can add these fields to any ObjectDefinition, that's why the "any"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPreviewAndStats = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: "String", nullable: true });
  t.field("nbPhotos", { type: "Int", nullable: false });
  t.field("nbAlbums", { type: "Int", nullable: false });
};

export const withOrderByQueryArg = (): { orderBy: NexusArgDef<string> } => ({
  orderBy: arg({
    type: "PhotosOrderBy",
    required: false,
    default: "DATE_DESC",
  }),
});

export const withFilterByQueryArg = (): { filterBy: NexusArgDef<string> } => ({
  filterBy: arg({
    type: "PhotosFilterBy",
    required: false,
  }),
});
