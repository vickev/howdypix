import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Theme, useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Link from "@material-ui/core/Link";
import { Divider } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";
import { hjoin, hparse, hpaths } from "@howdypix/utils";
import { HFile } from "@howdypix/shared-types";

import { useRouter } from "next/router";
import { NextPage } from "next";

import { withApollo } from "../../src/lib/with-apollo-client";
import {
  GetSubAlbumQuery,
  GetSubAlbumQueryVariables
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";

// ========================================
// Constants
// ========================================
const imageSize = 200;
const gutter = 3;
const gridCols = {
  xl: 4,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 1
};
// ========================================
// GraphQL queries
// ========================================
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

function useWidth(): Breakpoint {
  const theme: Theme = useTheme();
  const keys: Breakpoint[] = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || "lg"
  );
}

const AlbumPage: NextPage = () => {
  const router = useRouter();
  const folder: HFile = hparse(router.query.id as string);
  const breadcrumbs: HFile[] = hpaths(folder);

  const theme = useTheme();
  // @TODO: Must consider the error case
  const { loading, data } = useQuery<
    GetSubAlbumQuery,
    GetSubAlbumQueryVariables
  >(GET_GREETING, {
    variables: {
      source: folder.source || null,
      album: folder.dir
    }
  });

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor="white" padding={gutter}>
        <Box paddingBottom={gutter} id="BreadcrumbBox">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" key="repo">
              Repository
            </Link>
            {breadcrumbs.map((bread: HFile, index) =>
              index !== breadcrumbs.length - 1 ? (
                <Link
                  color="inherit"
                  key={bread.dir}
                  href={`/album/${hjoin(bread)}`}
                >
                  {bread.name}
                </Link>
              ) : (
                <Typography color="textPrimary" key={bread.source}>
                  {bread.name}
                </Typography>
              )
            )}
          </Breadcrumbs>
        </Box>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Album {data?.getAlbum.album?.name}
          </Typography>
        </Box>
        <Box paddingBottom={gutter} id="subAlbumBox">
          {data?.getAlbum?.albums.map(
            album =>
              album?.name && (
                <Box paddingRight={gutter} component="span" key={album.name}>
                  <Button
                    size="medium"
                    variant="outlined"
                    href={`/album/${hjoin({
                      dir: album.dir,
                      source: album.source
                    })}`}
                  >
                    <FolderIcon style={{ marginRight: theme.spacing(1) }} />
                    {album.name}
                  </Button>
                </Box>
              )
          )}
        </Box>
        <Divider variant="fullWidth" />
        <Box paddingTop={gutter} id="pictureBox">
          <GridList
            spacing={theme.spacing(gutter)}
            cellHeight={imageSize}
            cols={gridCols[useWidth()]}
          >
            {data?.getAlbum.photos?.map(
              photo =>
                photo?.thumbnails[1] && (
                  <GridListTile key={photo.thumbnails[1]}>
                    <img src={photo.thumbnails[1]} alt="image" />
                  </GridListTile>
                )
            )}
          </GridList>
        </Box>
      </Box>
    </Layout>
  );
};

AlbumPage.getInitialProps = async () => ({
  namespacesRequired: ["common"]
});

export default withApollo(AlbumPage);
