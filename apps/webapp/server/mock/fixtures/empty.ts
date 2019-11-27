import { FixtureSet, Mutation, Query } from "../types.d";
import { authEmail } from "../shared";

const query: Query = {
  getAlbum: (_, params) => ({
    album: { name: "Empty", dir: "test", source: "test" },
    albums: [
      { name: params.album || "sub-test", dir: "test/sub-test", source: "test" }
    ],
    photos: []
  }),
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
