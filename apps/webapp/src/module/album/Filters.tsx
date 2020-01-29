import React from "react";
import { useTranslation } from "react-i18next";
import { AvailableFilters } from "@howdypix/shared-types";
import { FilterByMultipleValues } from "./FilterByMultipleValues";
import { GetFiltersQuery } from "../../__generated__/schema-types";

type Props = {
  availableFilters: GetFiltersQuery["getFilters"];
  selectedFilters: AvailableFilters;
  onChange: (filterValues: AvailableFilters) => void;
};

export const Filters: React.FC<Props> = ({
  availableFilters,
  onChange,
  selectedFilters
}) => {
  const { t } = useTranslation("common");

  const handleChange = (filterProperty: keyof AvailableFilters) => (
    value: string | string[] | null
  ): void => {
    onChange({ ...selectedFilters, [filterProperty]: value });
  };

  return (
    <div>
      <FilterByMultipleValues
        label={t("filter_camera_make")}
        values={availableFilters.cameraMakes}
        selected={selectedFilters.make || []}
        onChange={handleChange("make")}
      />{" "}
      <FilterByMultipleValues
        label={t("filter_camera_model")}
        values={availableFilters.cameraModels}
        selected={selectedFilters.model || []}
        onChange={handleChange("model")}
      />
    </div>
  );
};
