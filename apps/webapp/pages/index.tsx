import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { useTheme, Theme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";
import { hjoin } from "@howdypix/utils";

import { withApollo } from "../src/lib/with-apollo-client";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables
} from "../src/__generated__/schema-types";
import { Layout } from "../src/module/layout/Layout";
import { Divider } from "@material-ui/core";

//========================================
// Constants
//========================================
const gutter = 3;
// TODO: create graphql query..
const rootDir = ["main", "second"];

//========================================
// GraphQL queries
//========================================
const GET_GREETING = gql`
  query GetAlbum {
    getAlbum(source: "") {
      album {
        name
      }
      photos {
        thumbnails
      }
      albums {
        name
        source
        dir
      }
    }
  }
`;

function Homepage(props: any) {
  const { t, i18n } = useTranslation("common");
  const theme = useTheme();
  const { loading, error, data } = useQuery<
    GetAlbumQuery,
    GetAlbumQueryVariables
  >(GET_GREETING);

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor={"white"} padding={gutter}>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Repository
          </Typography>
        </Box>
        <Box paddingBottom={gutter}>
          {rootDir.map(dir => (
            <Box paddingRight={gutter} component="span" key={dir}>
              <Button
                size="medium"
                variant="outlined"
                href={`/album/${hjoin({ source: dir })}`}
              >
                <FolderIcon style={{ marginRight: theme.spacing(1) }} />
                {dir}
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
}

Homepage.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default withApollo(Homepage);
