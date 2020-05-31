import { queryField, stringArg } from "nexus";
import { getPhotoResolver } from "./photoResolvers";
import { EnhancedQuery } from "../../../../types";
import { withFilterByQueryArg, withOrderByQueryArg } from "../mixins";

export const getPhoto: EnhancedQuery = () =>
  queryField("getPhoto", {
    type: "PhotoDetail",
    args: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      album: stringArg({ required: true }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      file: stringArg({ required: true }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      source: stringArg({ required: true }),
      ...withOrderByQueryArg(),
      ...withFilterByQueryArg(),
    },
    nullable: true,
    resolve: getPhotoResolver(),
  });
