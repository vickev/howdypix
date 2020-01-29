import { filterByMake } from "./filterByMake";
import { FilterValue, FilterFunctionReturn } from "./filterTypes";

export function filterFactory(
  filterType: string,
  filterValue: string | string[]
): FilterFunctionReturn | null {
  if (filterType === "make") {
    return filterByMake(filterValue);
  }

  return null;
}
