// @ts-ignore
import nextConfig from "../../../next.config";
import { Mutation, Query } from "../types";
import { authEmail } from "../shared";

const { serverRuntimeConfig } = nextConfig;

const query: Query = {
  getAlbum: params => ({
    album: { name: "Empty", dir: "test", source: "test" },
    albums: [{ name: params.album || "test", dir: "", source: "" }],
    photos: []
  })
};

const mutation: Mutation = {
  authEmail
};

export default { query, mutation };
