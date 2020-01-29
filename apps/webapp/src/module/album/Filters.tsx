import React from "react";
import { useTranslation } from "react-i18next";
import { FilterByMultipleValues } from "./FilterByMultipleValues";
import { GetFiltersQuery } from "../../__generated__/schema-types";

export type FilterValues = {
  cameraModel?: string[] | string;
  cameraMake?: string[] | string;
};

type Props = {
  availableFilters: GetFiltersQuery["getFilters"];
  selectedFilters: FilterValues;
  onChange: (filterValues: FilterValues) => void;
};

export const Filters: React.FC<Props> = ({
  availableFilters,
  onChange,
  selectedFilters
}) => {
  const { t } = useTranslation("common");

  const handleChange = (filterProperty: keyof FilterValues) => (
    value: string | string[] | null
  ): void => {
    onChange({ ...selectedFilters, [filterProperty]: value });
  };

  return (
    <div>
      <FilterByMultipleValues
        label={t("filter_camera_make")}
        values={availableFilters.cameraMakes}
        selected={selectedFilters.cameraMake || []}
        onChange={handleChange("cameraMake")}
      />{" "}
      <FilterByMultipleValues
        label={t("filter_camera_model")}
        values={availableFilters.cameraModels}
        selected={selectedFilters.cameraModel || []}
        onChange={handleChange("cameraModel")}
      />
    </div>
  );
};
