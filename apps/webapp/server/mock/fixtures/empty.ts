import { NexusGenTypes } from "@howdypix/graphql-schema/schema";

type GetAlbum = (
  params: NexusGenTypes["argTypes"]["Query"]["getAlbum"]
) => NexusGenTypes["fieldTypes"]["Query"]["getAlbum"];

const getAlbum: GetAlbum = params => {
  return {
    album: { name: "Empty", dir: "test", source: "test" },
    albums: [{ name: params.album || "test", dir: "", source: "" }],
    photos: []
  };
};

export { getAlbum };
