import React from "react";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTranslation } from "react-i18next";
import { ExpansionPanel } from "../../component/ExpansionPanel";

type Props = {
  nbPhotos?: number;
};

export const AlbumInformationPanel: React.FC<Props> = ({ nbPhotos }) => {
  const { t } = useTranslation("common");

  return (
    <ExpansionPanel label={t("information")}>
      {nbPhotos ? (
        <Typography variant="body2">
          {t("photos", { count: nbPhotos })}
        </Typography>
      ) : (
        <Skeleton width="100%" />
      )}
    </ExpansionPanel>
  );
};
