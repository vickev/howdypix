import { NexusGenTypes } from "@howdypix/graphql-schema/schema";
// @ts-ignore
import nextConfig from "../../../next.config";

const { serverRuntimeConfig } = nextConfig;

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
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`,
          `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        ]
      }
    ]
  };
};

export { getAlbum };
