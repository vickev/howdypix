import { FixtureSet, Query, Mutation } from "../types.d";
import full from "./full";

const newQuery: Query = {
  ...full.query,
  getSearch: (_, params) => {
    const photos = full.query.getSearch(_, params);

    if (params.filterBy?.make?.includes("make 1")) {
      delete photos.photos[0];
    }
    if (params.filterBy?.make?.includes("make 2")) {
      delete photos.photos[1];
    }

    return photos;
  }
};

const newMutation: Mutation = {
  ...full.mutation
};

export default { query: newQuery, mutation: newMutation } as FixtureSet;
