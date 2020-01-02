import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { styled } from "@material-ui/core";
import { useTranslation } from "react-i18next";

type Props = {
  nbPhotos?: number;
};

const StyledExpansionPanel = styled(ExpansionPanel)(() => ({
  background: "transparent",
  boxShadow: "none"
}));

const StyledExpansionPanelSummary = styled(ExpansionPanelSummary)(
  ({ theme }) => ({
    background: theme.palette.grey["200"],
    boxShadow: "none"
  })
);

export const RightPanel: React.FC<Props> = ({ nbPhotos }) => {
  const { t } = useTranslation("common");

  return (
    <StyledExpansionPanel defaultExpanded>
      <StyledExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{t("information")}</Typography>
      </StyledExpansionPanelSummary>
      <ExpansionPanelDetails>
        {nbPhotos ? (
          <Typography variant="body2">
            {t("photos", { count: nbPhotos })}
          </Typography>
        ) : (
          <Skeleton width="100%" />
        )}
      </ExpansionPanelDetails>
    </StyledExpansionPanel>
  );
};
