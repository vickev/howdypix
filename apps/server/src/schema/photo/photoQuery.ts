import { nonNull, nullable, queryField, stringArg } from "nexus";
import { getPhotoResolver } from "./photoResolvers";
import { EnhancedQuery } from "../../types.d";
import { withFilterByQueryArg, withOrderByQueryArg } from "../mixins";

export const getPhoto: EnhancedQuery = () =>
  queryField("getPhoto", {
    type: nullable("PhotoDetail"),
    args: {
      album: nonNull(stringArg()),
      file: nonNull(stringArg()),
      source: nonNull(stringArg()),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg(),
    },
    resolve: getPhotoResolver(),
  });
