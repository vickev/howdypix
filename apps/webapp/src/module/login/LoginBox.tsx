import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import { withApollo } from "../../lib/with-apollo-client";
import {
  AuthEmailMutation,
  AuthEmailMutationVariables
} from "../../__generated__/schema-types";
import { Divider, styled } from "@material-ui/core";

//========================================
// GraphQL queries
//========================================
const AUTH_EMAIL = gql`
  mutation AuthEmail($email: String!) {
    authEmail(email: $email) {
      messageId
      messageData
    }
  }
`;

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

//========================================
// Main Component
//========================================
function _LoginBox() {
  const { t } = useTranslation("common");
  const theme = useTheme();

  let input: HTMLInputElement;

  const [authEmail, { data, loading, error }] = useMutation<
    AuthEmailMutation,
    AuthEmailMutationVariables
  >(AUTH_EMAIL);

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
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CustomPaper>
        <Typography variant="h4" component="h3" align="center">
          {t("auth.title")}
        </Typography>
        <Box my={4} textAlign="center">
          <Divider variant="fullWidth" />
        </Box>
        <form
          data-testid="login_form"
          onSubmit={e => {
            e.preventDefault();
            authEmail({ variables: { email: input.value } });
            // TODO redirect to the next form
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
      </CustomPaper>
    </Box>
  );
}

export const LoginBox = withApollo(_LoginBox);
