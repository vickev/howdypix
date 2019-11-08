import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";

import { withApollo } from "../src/lib/with-apollo-client";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables
} from "../src/__generated__/schema-types";
import Layout from "../src/modules/layout/Layout";
import { Divider } from "@material-ui/core";

//========================================
// Constants
//========================================
const imageSize = 200;
const gutter = 3;
//========================================
// GraphQL queries
//========================================
const GET_GREETING = gql`
  query GetAlbum {
    getAlbum(source: "main") {
      album {
        name
      }
      photos {
        thumbnails
      }
      albums {
        name
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

  const getGridListCols = () => {
    if (isWidthUp("lg", props.width)) {
      return 4;
    }
    if (isWidthUp("md", props.width)) {
      return 3;
    }
    if (isWidthUp("sm", props.width)) {
      return 2;
    }
    return 1;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor={"white"} padding={gutter}>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Album {data && data.getAlbum.album && data.getAlbum.album.name}
          </Typography>
        </Box>
        <Box paddingBottom={gutter}>
          {data &&
            data.getAlbum.albums.map(
              album =>
                album &&
                album.name && (
                  <Box paddingRight={gutter} component="span">
                    <Button size="medium" variant="outlined">
                      <FolderIcon style={{ marginRight: theme.spacing(1) }} />
                      {album.name}
                    </Button>
                  </Box>
                )
            )}
        </Box>
        <Divider variant="fullWidth" />
        <Box paddingTop={gutter}>
          <GridList
            spacing={theme.spacing(gutter)}
            cellHeight={imageSize}
            cols={getGridListCols()}
          >
            {data &&
              data.getAlbum.photos.map(
                photo =>
                  photo &&
                  photo.thumbnails &&
                  photo.thumbnails[1] && (
                    <GridListTile cols={1} key={photo.thumbnails[1]}>
                      <img src={photo.thumbnails[1]} alt="image" />
                    </GridListTile>
                  )
              )}
          </GridList>
        </Box>
      </Box>
    </Layout>
  );
}

Homepage.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default withWidth()(withApollo(Homepage));
