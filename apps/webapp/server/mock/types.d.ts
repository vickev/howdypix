import { NexusGenTypes } from "@howdypix/graphql-schema/schema";

export type Query = {
  getAlbum: (
    _: any,
    params: NexusGenTypes["argTypes"]["Query"]["getAlbum"]
  ) => NexusGenTypes["fieldTypes"]["Query"]["getAlbum"];
};

export type Mutation = {
  authEmail: (
    _: any,
    params: NexusGenTypes["argTypes"]["Mutation"]["authEmail"]
  ) => NexusGenTypes["fieldTypes"]["Mutation"]["authEmail"];
};

export type FixtureSet = {
  mutation: Mutation;
  query: Query;
};
