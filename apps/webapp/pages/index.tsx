import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { styled } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

import { withApollo } from "../src/lib/with-apollo-client";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables
} from "../src/__generated__/schema-types";

const CustomPaper = styled(Paper)(props => ({
  padding: props.theme.spacing(3, 2),
  textAlign: "center"
}));

const GET_GREETING = gql`
  query GetAlbum {
    getAlbum(parent: 0) {
      photos {
        thumbnails
      }
      albums {
        id
        name
      }
    }
  }
`;

function Hello() {
  const { t, i18n } = useTranslation();
  const { loading, error, data } = useQuery<
    GetAlbumQuery,
    GetAlbumQueryVariables
  >(GET_GREETING);

  if (loading) return <p>Loading...</p>;
  console.log(data);

  return (
    <Container maxWidth={"md"}>
      <Box p={5}>
        <CustomPaper>
          <Typography variant="h4" component="h1" gutterBottom>
            Hello {data && data.getAlbum.albums[0].name}!
            <p>{t("my translated text")}</p>
          </Typography>
        </CustomPaper>
      </Box>
    </Container>
  );
}

export default withApollo(Hello);
