import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { useTheme, Theme } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";
import { hjoin,hparse } from '@howdypix/utils'
import { useRouter } from 'next/router'

import { withApollo } from "../../src/lib/with-apollo-client";
import {
  GetSubAlbumQuery,
  GetSubAlbumQueryVariables
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";
import { Divider } from "@material-ui/core";

//========================================
// Constants
//========================================
const imageSize = 200;
const gutter = 3;
const gridCols = {
  xl: 4,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 1
}
//========================================
// GraphQL queries
//========================================
const GET_GREETING = gql`
  query GetSubAlbum($source: String, $album: String) {
    getAlbum(source: $source, album: $album) {
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

function useWidth() {
  const theme: Theme = useTheme();
  const keys: Breakpoint[] = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'lg'
  );
}

function AlbumPage(props: any) {
  const router = useRouter();

  console.log(router.query.id)

  const { dir, source } = hparse(router.query.id as string);

  const { t, i18n } = useTranslation("common");
  const theme = useTheme();
  const { loading, error, data } = useQuery<
    GetSubAlbumQuery,
    GetSubAlbumQueryVariables
  >(GET_GREETING, {
    variables: {
      source: source,
      album: dir
    }
  });


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
                    <Button size="medium" variant="outlined" href={`/album/${hjoin({dir: album.dir, source: album.source})}`}>
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
            cols={gridCols[useWidth()]}
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

AlbumPage.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default withApollo(AlbumPage);
