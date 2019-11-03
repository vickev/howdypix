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
          "http://localhost:3004/static/@main:00100dPORTRAIT_00100_BURST20171224092200820_COVER (1)x600.jpg",
          "http://localhost:3004/static/@main:00100dPORTRAIT_00100_BURST20171224092200820_COVER (1)x600.jpg",
          "http://localhost:3004/static/@main:00100dPORTRAIT_00100_BURST20171224092200820_COVER (1)x600.jpg"
        ]
      }
    ]
  };
};

export { getAlbum };
