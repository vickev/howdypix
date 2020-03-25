import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { ApolloError } from "apollo-client";
import { useTranslation } from "react-i18next";
import { AuthEmailMutation } from "../../__generated__/schema-types";

//= =======================================
// Styled components
//= =======================================
const CustomTextField = styled(TextField)(() => ({
  width: "100%",
  minWidth: 300,
}));

const NextButton = styled(Button)(() => ({
  width: "100%",
}));

type Props = {
  data?: AuthEmailMutation;
  loading: boolean;
  error?: ApolloError;
  onSubmit: (value: string) => void;
};

export const LoginForm: React.FC<Props> = ({ onSubmit, loading, data }) => {
  const { t } = useTranslation("common");
  let input: HTMLInputElement;

  const messageId = data?.authEmail?.messageId;
  const messageData = data?.authEmail?.messageData;
  const errorMessageId =
    messageId === "AUTH_EMAIL_ERR" || messageId === "AUTH_EMAIL_ERR_NOT_EXIST"
      ? messageId
      : null;

  if (messageData) {
    // We want to console.log in case we need to debug in prod.
    // eslint-disable-next-line no-console
    console.log(messageData);
  }

  return (
    <form
      data-testid="login_form"
      onSubmit={(e): void => {
        e.preventDefault();
        onSubmit(input.value);
      }}
    >
      <Box display="flex" flexDirection="column">
        <CustomTextField
          data-testid="login_email"
          label={t("auth.email")}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          margin="dense"
          inputRef={(node): void => {
            input = node;
          }}
          disabled={loading}
        />
        <Box my={2}>
          <NextButton
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {t("auth.next")}
          </NextButton>
        </Box>
        {errorMessageId && (
          <Typography align="center" color="error">
            {t(errorMessageId)}
          </Typography>
        )}
      </Box>
    </form>
  );
};
