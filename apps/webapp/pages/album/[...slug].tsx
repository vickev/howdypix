import React, { ReactElement } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import GridListTile from "@material-ui/core/GridListTile";
import MUILink from "@material-ui/core/Link";
import Link from "next/link";
import { Divider } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
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
import { AlbumCard } from "../../src/component/AlbumCard";
import { AlbumGrid } from "../../src/component/AlbumGrid";
import { AlbumGridListTile } from "../../src/component/AlbumGridListTile";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

// ========================================
// Constants
// ========================================
const gutter = 3;

// ========================================
// GraphQL queries
// ========================================
const GET_ALBUM = gql`
  query GetSubAlbum($source: String!, $album: String) {
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
        preview
        nbAlbums
        nbPhotos
      }
    }
  }
`;

const AlbumPage: NextPage<Props, InitialProps> = () => {
  const router = useRouter();

  const hpath = (router.query.slug as string[]).join("/");
  const folder: HFile = hparse(hpath);

  const breadcrumbs: HFile[] = hpaths(folder);

  // @TODO: Must consider the error case
  const { loading, data } = useQuery<
    GetSubAlbumQuery,
    GetSubAlbumQueryVariables
  >(GET_ALBUM, {
    variables: {
      source: folder.source,
      album: folder.dir
    }
  });

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor="white" padding={gutter}>
        <Box paddingBottom={gutter} id="BreadcrumbBox">
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" key="repo">
              <MUILink href="">Repository</MUILink>
            </Link>
            {breadcrumbs.map((bread: HFile, index) =>
              index !== breadcrumbs.length - 1 ? (
                <Link
                  href="/album/[...slug]"
                  as={`/album/${hjoin(bread)}`}
                  key={bread.dir}
                >
                  <MUILink href="">{bread.name}</MUILink>
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
        <AlbumGrid>
          {data?.getAlbum?.albums.map(
            (album): ReactElement => (
              <AlbumGridListTile key={album.name}>
                <AlbumCard
                  name={album.name}
                  dir={album.dir}
                  source={album.source}
                  nbAlbums={album.nbPhotos}
                  nbPhotos={album.nbPhotos}
                  preview={album.preview}
                />
              </AlbumGridListTile>
            )
          )}
        </AlbumGrid>
        <Box py={gutter} id="pictureBox">
          <Divider variant="fullWidth" />
        </Box>
        <AlbumGrid>
          {data?.getAlbum.photos?.map(
            (photo, key): ReactElement | null =>
              (photo?.thumbnails[1] && (
                <GridListTile key={key + photo.thumbnails[1]}>
                  <img src={photo.thumbnails[1]} alt="Thumbnail" />
                </GridListTile>
              )) ||
              null
          )}
        </AlbumGrid>
      </Box>
    </Layout>
  );
};

AlbumPage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(AlbumPage);
