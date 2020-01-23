import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import { NexusGenEnums } from "@howdypix/graphql-schema/schema.d";

type Props = {
  value: NexusGenEnums["PhotosOrderBy"];
  onChange: (value: NexusGenEnums["PhotosOrderBy"]) => void;
};

type Attribute = "DATE" | "NAME";
type Order = "ASC" | "DESC";

export const SortButton: React.FC<Props> = ({ onChange, value }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [attribute, order] = value.split("_") as [Attribute, Order];
  let text: string;
  let Icon: typeof ExpandMoreIcon | typeof ExpandLessIcon;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (
    attribute: Attribute,
    order: Order
  ): (() => void) => (): void => {
    setAnchorEl(null);
    onChange(`${attribute}_${order}` as NexusGenEnums["PhotosOrderBy"]);
  };

  // Display the value
  switch (attribute) {
    case "DATE":
      text = "Date";
      break;
    case "NAME":
      text = "Name";
      break;
    default:
      text = "Date";
      break;
  }

  switch (order) {
    case "ASC":
      Icon = ExpandLessIcon;
      break;

    case "DESC":
      Icon = ExpandMoreIcon;
      break;

    default:
      Icon = ExpandLessIcon;
      break;
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        Sort By: {text}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
      >
        <MenuItem onClick={handleClick("DATE", order)}>Date</MenuItem>
        <MenuItem onClick={handleClick("NAME", order)}>Name</MenuItem>
      </Menu>
      <IconButton
        data-testid="orderAscDesc"
        onClick={handleClick(attribute, order === "ASC" ? "DESC" : "ASC")}
      >
        <Icon />
      </IconButton>
    </div>
  );
};
