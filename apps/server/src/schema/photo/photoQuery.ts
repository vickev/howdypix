import { queryField, stringArg } from "nexus";
import { getPhotoResolver } from "./photoResolvers";
import { EnhancedQuery } from "../../types.d";
import { withFilterByQueryArg, withOrderByQueryArg } from "../mixins";

export const getPhoto: EnhancedQuery = () =>
  queryField("getPhoto", {
    type: "PhotoDetail",
    args: {
      album: stringArg({ required: true }),
      file: stringArg({ required: true }),
      source: stringArg({ required: true }),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg(),
    },
    nullable: true,
    resolve: getPhotoResolver(),
  });
