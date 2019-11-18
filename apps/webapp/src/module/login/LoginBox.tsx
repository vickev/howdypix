import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
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
import { LoginForm } from "./LoginForm";
import { LoginEmailSent } from "./LoginEmailSent";

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
  padding: theme.spacing(5, 6),
  width: "100%",
  maxWidth: 400
}));

//========================================
// Main Component
//========================================
function _LoginBox() {
  const { t } = useTranslation("common");

  const [authEmail, { data, loading, error }] = useMutation<
    AuthEmailMutation,
    AuthEmailMutationVariables
  >(AUTH_EMAIL);

  const hasError =
    data?.authEmail?.messageId === "AUTH_EMAIL_ERR" ||
    data?.authEmail?.messageId === "AUTH_EMAIL_ERR_NOT_EXIST";
  const displayForm = !data || hasError;

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
        {(displayForm && (
          <LoginForm
            loading={loading}
            data={data}
            error={error}
            onSubmit={email => {
              authEmail({ variables: { email } });
            }}
          />
        )) || <LoginEmailSent />}
      </CustomPaper>
    </Box>
  );
}

export const LoginBox = withApollo(_LoginBox);
