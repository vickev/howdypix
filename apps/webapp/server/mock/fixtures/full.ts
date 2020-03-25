import { NexusGenRootTypes } from "@howdypix/graphql-schema/schema.d";
import nextConfig from "../../../next.config";
import { FixtureSet, Mutation, Query } from "../types.d";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const photo1: NexusGenRootTypes["SearchPhoto"] = {
  id: "id1",
  thumbnails: [
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id1`,
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id1`,
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id1`,
  ],
  file: "albert.jpg",
  birthtime: 1234,
};
const photo2: NexusGenRootTypes["SearchPhoto"] = {
  id: "id2",
  thumbnails: [
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id2`,
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id2`,
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id2`,
  ],
  file: "albert.jpg",
  birthtime: 3456,
};
const photo3: NexusGenRootTypes["SearchPhoto"] = {
  id: "id3",
  thumbnails: [
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id3`,
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id3`,
    `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?id3`,
  ],
  file: "albert.jpg",
  birthtime: 789,
};

const query: Query = {
  getFilters: () => ({
    dateTakenRange: {
      from: 0,
      to: 0,
    },
    cameraMakes: ["make 1", "make 2"],
    cameraModels: ["model 1", "model 2"],
  }),
  getAlbum: (_, params) => ({
    album: {
      name: "Full",
      dir: "test",
      source: "test",
      preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      nbAlbums: 2,
      nbPhotos: 3,
    },
    albums: [
      {
        name: params.album || "sub-test",
        dir: "test/sub-test",
        source: "test",
        preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
        nbAlbums: 2,
        nbPhotos: 3,
      },
    ],
    photos: [photo1],
  }),
  getSearch: (_, params) => {
    switch (params.orderBy) {
      case "DATE_ASC":
        return {
          photos: [photo1, photo2, photo3],
        };

      case "DATE_DESC":
        return {
          photos: [photo3, photo2, photo1],
        };

      case "NAME_ASC":
        return {
          photos: [photo2, photo1, photo3],
        };

      case "NAME_DESC":
        return {
          photos: [photo3, photo1, photo2],
        };
      default:
        return {
          photos: [photo1, photo2, photo3],
        };
    }
  },
  getPhoto: () => ({
    birthtime: new Date("January 01, 2020 01:00:00").getTime(),
    shutter: 123,
    model: "model",
    make: "make",
    iso: 123234,
    aperture: 4545,
    files: [
      `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
    ],
    id: "id1",
    photoStream: [],
  }),
  getCurrentUser: () => ({
    name: "Foo Bar",
    email: "dev@vickev.com",
  }),
  getSources: () => [
    {
      name: "source1",
      preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      nbAlbums: 2,
      nbPhotos: 3,
    },
    {
      name: "source2",
      preview: null,
      nbAlbums: 2,
      nbPhotos: 3,
    },
    {
      name: "source3",
      preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      nbAlbums: 2,
      nbPhotos: 3,
    },
  ],
  getTree: () => ({
    albums: [
      {
        dir: "TreeAlbum1",
        nbAlbums: 1,
        nbImages: 1,
        source: "treesource1",
        preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      },
    ],
    sources: [
      {
        name: "treesource1",
        nbAlbums: 1,
        nbImages: 1,
        source: "source1",
        preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      },
    ],
  }),
};

const mutation: Mutation = {
  authEmail,
};

export default { query, mutation } as FixtureSet;
