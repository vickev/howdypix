import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import { withApollo } from "../src/lib/with-apollo-client";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables
} from "../src/__generated__/schema-types";
import Layout from "../src/modules/layout/Layout";
import { Divider, styled } from "@material-ui/core";

//========================================
// GraphQL queries
//========================================
const SEND_EMAIL = gql`
  mutation SendEmail($email: String!) {
    sendEmail(email: $email) {
      messageId
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
  width: 300
}));

const NextButton = styled(Button)(({ theme }) => ({
  width: "100%"
}));

//========================================
// Main Component
//========================================
function Login() {
  const { t, i18n } = useTranslation("common");
  const theme = useTheme();

  let input: HTMLInputElement;

  const [sendEmail, { data }] = useMutation(SEND_EMAIL);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CustomPaper>
        <Typography variant="h4" component="h3" align="center">
          Authentication
        </Typography>
        <Box my={4} textAlign="center">
          <Divider variant="fullWidth" />
        </Box>
        <form
          onSubmit={e => {
            e.preventDefault();
            sendEmail({ variables: { email: input.value } });
            input.value = "";
          }}
        >
          <Box display="flex" flexDirection="column">
            <Box textAlign="center">
              <CustomTextField
                label="Email address"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                margin="dense"
                inputRef={node => {
                  input = node;
                }}
              />
            </Box>
            <Box mt={2}>
              <NextButton variant="contained" color="primary" type="submit">
                Next
              </NextButton>
            </Box>
          </Box>
        </form>
      </CustomPaper>
    </Box>
  );
}

Login.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default withApollo(Login);
