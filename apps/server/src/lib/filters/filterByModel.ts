import { In } from "typeorm";
import { flatten } from "lodash";
import { FilterFunction } from "./filterTypes";

export const filterByModel: FilterFunction = value => {
  return {
    whereStatement: value
      ? {
          model: In(flatten([value]))
        }
      : {}
  };
};
