// @ts-ignore
import nextConfig from "../../../next.config";
import { FixtureSet, Mutation, Query } from "../types";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const query: Query = {
  getAlbum: params => ({
    album: { name: "Full", dir: "test", source: "test" },
    albums: [{ name: params.album || "test", dir: "", source: "" }],
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
  })
};

const mutation: Mutation = {
  authEmail
};

export default { query, mutation } as FixtureSet;
