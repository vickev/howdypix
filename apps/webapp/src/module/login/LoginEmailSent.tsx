import React from "react";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

export const LoginEmailSent: React.FC = () => {
  const { t } = useTranslation("common");

  return <Typography>{t("auth.emailSent")}</Typography>;
};
