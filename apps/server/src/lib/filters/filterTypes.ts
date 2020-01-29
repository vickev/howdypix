export type FilterValue = string | (string | null)[] | null | undefined;
export type FilterFunctionReturn = {
  whereStatement: { [key: string]: string } | {};
};

export type FilterFunction = (filterValue: FilterValue) => FilterFunctionReturn;
