// @ts-ignore
import nextConfig from "../../../next.config";
import { FixtureSet, Mutation, Query } from "../types";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const query: Query = {
  getAlbum: params => ({
    album: { name: "Empty", dir: "test", source: "test" },
    albums: [
      { name: params.album || "sub-test", dir: "test/sub-test", source: "test" }
    ],
    photos: []
  })
};

const mutation: Mutation = {
  authEmail
};

export default { query, mutation } as FixtureSet;
