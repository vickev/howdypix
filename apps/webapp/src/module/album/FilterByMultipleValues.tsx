import React from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { useTranslation } from "react-i18next";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import styled from "@material-ui/styles/styled";

const StyledSelect = styled(Select)({
  "& > div": {
    padding: "8px",
    borderRight: 0
  }
});

const StyledButton = styled(Button)({
  borderLeft: 0
});

type Props = {
  label: string;
  values: string[];
  selected: string[] | string;
  onChange: (newValues: string[] | null) => void;
};

export const FilterByMultipleValues: React.FC<Props> = ({
  label,
  values,
  selected,
  onChange
}) => {
  const { t } = useTranslation("common");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const newValues = event.target.value as string[];
    onChange(newValues);
  };

  const handleClearButtonClick = () => {
    onChange(null);
  };

  return (
    <ButtonGroup>
      <FormControl variant="outlined">
        <StyledSelect
          multiple
          displayEmpty
          value={typeof selected === "string" ? [selected] : selected}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={
            selected.length === 0
              ? () => label
              : selected => (selected as string[]).join(", ")
          }
        >
          {values.map(name => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={selected.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
      {selected.length > 0 && (
        <StyledButton variant="outlined" size={"small"}>
          <HighlightOffIcon
            fontSize={"small"}
            onClick={handleClearButtonClick}
          />
        </StyledButton>
      )}
    </ButtonGroup>
  );
};