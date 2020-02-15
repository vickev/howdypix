import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { styled } from "@material-ui/core";
import { useTranslation } from "react-i18next";

type Props = {
  ISO: number | undefined;
  aperture: number | undefined;
  shutter: number | undefined;
  date: number | undefined;
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

export const RightPanel: React.FC<Props> = ({
  date,
  ISO,
  aperture,
  shutter
}) => {
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
        <Box display="flex" flexDirection="column">
          <Typography variant="body2">
            {t("date_taken_x", { value: date ? new Date(date) : "N/A" })}
          </Typography>
          <Typography variant="body2">
            {t("iso", { value: ISO ? ISO : "N/A" })}
          </Typography>
          <Typography variant="body2">
            {t("aperture", {
              value: aperture ? `f/${aperture}` : "N/A"
            })}
          </Typography>
          <Typography variant="body2">
            {t("shutter", {
              value: shutter ? `1/${shutter}` : "N/A"
            })}
          </Typography>
        </Box>
      </ExpansionPanelDetails>
    </StyledExpansionPanel>
  );
};
