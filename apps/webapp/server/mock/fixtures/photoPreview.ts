import { NexusGenRootTypes } from "@howdypix/graphql-schema/schema.d";
import { FixtureSet, Query, Mutation } from "../types.d";
import nextConfig from "../../../next.config";
import full from "./full";

const { serverRuntimeConfig } = nextConfig;

const newQuery: Query = {
  ...full.query,
  getPhoto: (_, params) => {
    const photo = full.query.getPhoto(_, params);

    const previewFile = (
      id: string
    ): NexusGenRootTypes["PhotoStreamThumbnail"] => ({
      id,
      file: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?${id}`,
      thumbnails: [
        `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?${id}`,
        `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?${id}`,
        `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg?${id}`
      ]
    });

    if (params.file === "firstPhoto.jpg") {
      photo?.photoStream.push(
        previewFile(photo.id),
        previewFile("2314"),
        previewFile("345"),
        previewFile("456"),
        previewFile("456456"),
        previewFile("4562")
      );

      if (photo) {
        photo.previous = null;
      }
    } else if (params.file === "lastPhoto.jpg") {
      photo?.photoStream.push(
        previewFile("2314"),
        previewFile("345"),
        previewFile("456"),
        previewFile("456456"),
        previewFile("4562"),
        previewFile(photo.id)
      );

      if (photo) {
        photo.next = null;
      }
    } else if (params.file === "middlePhoto.jpg") {
      photo?.photoStream.push(
        previewFile("2314"),
        previewFile("345"),
        previewFile(photo.id),
        previewFile("456"),
        previewFile("456456"),
        previewFile("4562")
      );
    } else if (params.file === "3files.jpg") {
      photo?.photoStream.push(
        previewFile("2314"),
        previewFile(photo.id),
        previewFile("456")
      );

      if (photo) {
        photo.next = "next";
        photo.previous = "previous";
      }
    }

    return photo;
  }
};

const newMutation: Mutation = {
  ...full.mutation
};

export default { query: newQuery, mutation: newMutation } as FixtureSet;
