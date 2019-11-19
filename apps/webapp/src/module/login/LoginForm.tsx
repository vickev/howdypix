import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { AuthEmailMutation } from "../../__generated__/schema-types";
import { ApolloError } from "apollo-client";
import { useTranslation } from "react-i18next";

//========================================
// Styled components
//========================================
const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5, 6)
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  minWidth: 300
}));

const NextButton = styled(Button)(({ theme }) => ({
  width: "100%"
}));

type Props = {
  data?: AuthEmailMutation;
  loading: boolean;
  error?: ApolloError;
  onSubmit: (value: string) => void;
};

export const LoginForm: React.FC<Props> = ({
  onSubmit,
  loading,
  data,
  error
}) => {
  const { t } = useTranslation("common");
  let input: HTMLInputElement;

  const messageId = data?.authEmail?.messageId;
  const messageData = data?.authEmail?.messageData;
  const errorMessageId =
    messageId === "AUTH_EMAIL_ERR" || messageId === "AUTH_EMAIL_ERR_NOT_EXIST"
      ? messageId
      : null;

  if (messageData) {
    console.log(messageData);
  }

  return (
    <form
      data-testid="login_form"
      onSubmit={e => {
        e.preventDefault();
        onSubmit(input.value);
      }}
    >
      <Box display="flex" flexDirection="column">
        <CustomTextField
          data-testid="login_email"
          label={t("auth.email")}
          InputLabelProps={{
            shrink: true
          }}
          variant="outlined"
          margin="dense"
          inputRef={node => {
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
          <Typography align="center" color={"error"}>
            {t(errorMessageId)}
          </Typography>
        )}
      </Box>
    </form>
  );
};
