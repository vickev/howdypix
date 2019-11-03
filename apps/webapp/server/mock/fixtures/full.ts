import { NexusGenTypes } from "@howdypix/graphql-schema/schema";

type GetAlbum = (
  params: NexusGenTypes["argTypes"]["Query"]["getAlbum"]
) => NexusGenTypes["fieldTypes"]["Query"]["getAlbum"];

const getAlbum: GetAlbum = params => {
  return {
    album: { name: "Full", dir: "test", source: "test" },
    albums: [{ name: params.album || "test", dir: "", source: "" }],
    photos: [
      {
        id: "id1",
        thumbnails: [
          "http://localhost:3000/static-tests/albert.jpg",
          "http://localhost:3000/static-tests/albert.jpg",
          "http://localhost:3000/static-tests/albert.jpg"
        ]
      }
    ]
  };
};

export { getAlbum };
