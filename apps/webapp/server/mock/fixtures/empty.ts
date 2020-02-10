import nextConfig from "../../../next.config";
import { FixtureSet, Mutation, Query } from "../types";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const query: Query = {
  getFilters: () => ({
    dateTakenRange: {
      from: 0,
      to: 0
    },
    cameraMakes: [],
    cameraModels: []
  }),
  getAlbum: (_, params) => ({
    album: {
      name: "Empty",
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
        preview: null,
        nbAlbums: 0,
        nbPhotos: 0
      }
    ],
    photos: []
  }),
  getSearch: () => ({
    photos: []
  }),
  getPhoto: () => null,
  getCurrentUser: () => ({
    name: "Foo Bar",
    email: "dev@vickev.com"
  }),
  getSources: () => []
};

const mutation: Mutation = {
  authEmail
};

export default { query, mutation } as FixtureSet;
