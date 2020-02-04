import { NexusGenTypes } from "@howdypix/graphql-schema/schema.d";

export type Query = {
  getAlbum: (
    _: unknown,
    params: NexusGenTypes["argTypes"]["Query"]["getAlbum"]
  ) => NexusGenTypes["fieldTypes"]["Query"]["getAlbum"];
  getSearch: (
    _: unknown,
    params: NexusGenTypes["argTypes"]["Query"]["getSearch"]
  ) => NexusGenTypes["fieldTypes"]["Query"]["getSearch"];
  getPhoto: (
    _: unknown,
    params: NexusGenTypes["argTypes"]["Query"]["getPhoto"]
  ) => NexusGenTypes["fieldTypes"]["Query"]["getPhoto"];
  getCurrentUser: () => NexusGenTypes["fieldTypes"]["Query"]["getCurrentUser"];
  getSources: () => NexusGenTypes["fieldTypes"]["Query"]["getSources"];
  getFilters: () => NexusGenTypes["fieldTypes"]["Query"]["getFilters"];
};

export type Mutation = {
  authEmail: (
    _: unknown,
    params: NexusGenTypes["argTypes"]["Mutation"]["authEmail"]
  ) => NexusGenTypes["fieldTypes"]["Mutation"]["authEmail"];
};

export type FixtureSet = {
  mutation: Mutation;
  query: Query;
};
