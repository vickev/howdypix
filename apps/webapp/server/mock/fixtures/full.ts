import nextConfig from "../../../next.config";
import { FixtureSet, Mutation, Query } from "../types.d";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const query: Query = {
  getAlbum: (_, params) => ({
    album: { name: "Full", dir: "test", source: "test" },
    albums: [
      { name: params.album || "sub-test", dir: "test/sub-test", source: "test" }
    ],
    photos: [
      {
        id: "id1",
        thumbnails: [
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        ]
      }
    ]
  }),
  getCurrentUser: () => ({
    name: "Foo Bar",
    email: "dev@vickev.com"
  })
};

const mutation: Mutation = {
  authEmail
};

export default { query, mutation } as FixtureSet;
