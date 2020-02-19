import React from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
// eslint-disable-next-line import/no-named-default
import { default as MuiExpansionPanel } from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { styled } from "@material-ui/core";

const StyledExpansionPanel = styled(MuiExpansionPanel)(() => ({
  background: "transparent",
  boxShadow: "none"
}));

const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)(
  ({ theme }) => ({
    background: theme.palette.grey["200"],
    boxShadow: "none"
  })
);

type Props = {
  label: string;
};

export const ExpansionPanel: React.FC<Props> = ({ children, label }) => (
  <StyledExpansionPanel defaultExpanded>
    <StyledExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography>{label}</Typography>
    </StyledExpansionPanelSummary>
    <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
  </StyledExpansionPanel>
);
