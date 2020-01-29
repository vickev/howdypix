import { In } from "typeorm";
import { flatten } from "lodash";
import { FilterFunction } from "./filterTypes";

export const filterByMake: FilterFunction = value => {
  return {
    whereStatement: value
      ? {
          make: In(flatten([value]))
        }
      : {}
  };
};
