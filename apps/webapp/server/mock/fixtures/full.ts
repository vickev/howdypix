import nextConfig from "../../../next.config";
import { FixtureSet, Mutation, Query } from "../types.d";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const query: Query = {
  getAlbum: (_, params) => ({
    album: {
      name: "Full",
      dir: "test",
      source: "test",
      preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      nbAlbums: 2,
      nbPhotos: 3
    },
    albums: [
      {
        name: params.album || "sub-test",
        dir: "test/sub-test",
        source: "test",
        preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
        nbAlbums: 2,
        nbPhotos: 3
      }
    ],
    photos: [
      {
        id: "id1",
        thumbnails: [
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        ],
        file: "albert.jpg"
      }
    ]
  }),
  getPhoto: () => ({
    files: [
      `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
    ],
    id: "id1"
  }),
  getCurrentUser: () => ({
    name: "Foo Bar",
    email: "dev@vickev.com"
  }),
  getSources: () => [
    {
      name: "source1",
      preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      nbAlbums: 2,
      nbPhotos: 3
    },
    {
      name: "source2",
      preview: null,
      nbAlbums: 2,
      nbPhotos: 3
    },
    {
      name: "source3",
      preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
      nbAlbums: 2,
      nbPhotos: 3
    }
  ]
};

const mutation: Mutation = {
  authEmail
};

export default { query, mutation } as FixtureSet;
