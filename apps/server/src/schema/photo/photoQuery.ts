import { nonNull, nullable, queryField, stringArg } from "nexus";
import { getPhotoResolver } from "./photoResolvers";
import { EnhancedQuery } from "../../types.d";
import { withFilterByQueryArg, withOrderByQueryArg } from "../mixins";

export const getPhoto: EnhancedQuery = () =>
  queryField("getPhoto", {
    type: nullable("PhotoDetail"),
    args: {
      album: stringArg(),
      file: stringArg(),
      source: stringArg(),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg(),
    },
    resolve: getPhotoResolver(),
  });
