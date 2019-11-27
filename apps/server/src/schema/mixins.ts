/**
 * Functions that are common to many type definitions
 */
import { ObjectDefinitionBlock } from "nexus/dist/definitions/objectType";

// We can add these fields to any ObjectDefinition, that's why the "any"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPreviewAndStats = (t: ObjectDefinitionBlock<any>): void => {
  t.field("preview", { type: "String", nullable: true });
  t.field("nbPhotos", { type: "Int", nullable: false });
  t.field("nbAlbums", { type: "Int", nullable: false });
};
