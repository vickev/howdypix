import { extendType, stringArg } from "nexus";
import { getPhotoResolver } from "./photoResolvers";
import { EnhancedQuery } from "../../types.d";

export const getPhoto: EnhancedQuery = () =>
  extendType({
    type: "Query",
    definition(t) {
      t.field("getPhoto", {
        type: "PhotoDetail",
        args: {
          album: stringArg({ required: true }),
          file: stringArg({ required: true }),
          source: stringArg({ required: true })
        },
        nullable: true,
        resolve: getPhotoResolver()
      });
    }
  });
