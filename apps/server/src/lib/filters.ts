import { In } from "typeorm";
import { flatten } from "lodash";
import { AvailableFilters } from "@howdypix/shared-types";

//= =============================================================
// Define the types
//= =============================================================
type FilterValue = string | (string | null)[] | null | undefined;
type FilterFunctionReturn = {
  whereStatement: { [key: string]: string } | {};
};

type FilterFunction = (filterValue: FilterValue) => FilterFunctionReturn;

//= =============================================================
// Define the generic functions
//= =============================================================
export const filterWithText: (
  property: keyof AvailableFilters
) => FilterFunction = property => (value): FilterFunctionReturn => {
  return {
    whereStatement: value
      ? {
          [property]: In(flatten([value]))
        }
      : {}
  };
};

//= =============================================================
// Define the filter functions
//= =============================================================
export const filterByMake = filterWithText("make");
export const filterByModel = filterWithText("model");
