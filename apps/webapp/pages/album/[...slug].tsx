import React, { ReactElement, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import GridListTile from "@material-ui/core/GridListTile";
import MUILink from "@material-ui/core/Link";
import Link from "next/link";
import { Divider } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Box from "@material-ui/core/Box";
import { hjoin, hparse, hpaths } from "@howdypix/utils";
import { HFile } from "@howdypix/shared-types";
import { NexusGenEnums } from "@howdypix/graphql-schema/schema.d";
import url from "url";
import querystring from "querystring";

import { useRouter } from "next/router";
import { NextPage } from "next";

import { withApollo } from "../../src/lib/with-apollo-client";
import {
  GetSubAlbumQuery,
  GetSubAlbumQueryVariables,
  GetPhotosQuery,
  GetPhotosQueryVariables,
  PhotosOrderBy
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";
import { AlbumCard } from "../../src/component/AlbumCard";
import { AlbumGrid } from "../../src/component/AlbumGrid";
import { AlbumGridListTile } from "../../src/component/AlbumGridListTile";
import { Thumbnail } from "../../src/component/Thumbnail";
import { RightPanel } from "../../src/module/album/RightPanel";
import { SortButton } from "../../src/component/SortButton";

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

const GET_PHOTOS = gql`
  query GetPhotos($source: String!, $album: String, $orderBy: PhotosOrderBy) {
    getSearch(source: $source, album: $album, orderBy: $orderBy) {
      photos {
        id
        thumbnails
        file
      }
    }
  }
`;

const AlbumPage: NextPage<Props, InitialProps> = () => {
  const router = useRouter();
  const orderBy: PhotosOrderBy =
    (querystring.parse(url.parse(router.asPath).query || "")
      .order as PhotosOrderBy) ?? "DATE_ASC";
  const [savedPhotosData, setOldData] = useState<GetPhotosQuery | undefined>();

  const hpath = (router.query.slug as string[]).join("/");
  const folder: HFile = hparse(hpath);

  const breadcrumbs: HFile[] = hpaths(folder);

  // @TODO: Must consider the error case
  const albumQuery = useQuery<GetSubAlbumQuery, GetSubAlbumQueryVariables>(
    GET_ALBUM,
    {
      variables: {
        source: folder.source,
        album: folder.dir
      }
    }
  );
  const albumData = albumQuery.data;
  const albumLoading = albumQuery.loading;

  const photosQuery = useQuery<GetPhotosQuery, GetPhotosQueryVariables>(
    GET_PHOTOS,
    {
      variables: {
        source: folder.source,
        album: folder.dir,
        orderBy
      }
    }
  );
  const photosData = photosQuery.data;
  const photosLoading = photosQuery.loading;

  if (!photosLoading && savedPhotosData !== photosData) {
    setOldData(photosData);
  }

  const handleSortChange = (value: NexusGenEnums["PhotosOrderBy"]): void => {
    router.replace(router.pathname, {
      pathname: url.parse(router.asPath).pathname,
      query: { order: value }
    });
  };

  return (
    <Layout
      rightComponent={
        <RightPanel nbPhotos={photosData?.getSearch.photos.length} />
      }
    >
      <Box padding={gutter}>
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
            Album {albumData?.getAlbum.album?.name}
          </Typography>
        </Box>
        <AlbumGrid extraHeight={100}>
          {albumLoading
            ? [0, 0, 0].map(() => (
                <GridListTile>
                  <Skeleton variant="rect" height={200} />
                </GridListTile>
              ))
            : albumData?.getAlbum?.albums.map(
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
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box flex={1}>
              <Divider variant="fullWidth" />
            </Box>
            <SortButton onChange={handleSortChange} value={orderBy} />
          </Box>
        </Box>
        <AlbumGrid>
          {photosLoading && !savedPhotosData
            ? [0, 0, 0].map((num, key) => (
                // eslint-disable-next-line react/no-array-index-key
                <GridListTile key={`skeleton_${key}`}>
                  <Skeleton variant="rect" height={200} />
                </GridListTile>
              ))
            : savedPhotosData?.getSearch.photos?.map(
                (photo, key): ReactElement | null =>
                  (photo?.thumbnails[1] && (
                    <GridListTile key={key + photo.thumbnails[1]}>
                      <Thumbnail
                        hfile={{
                          file: photo.file,
                          dir: folder.dir,
                          source: folder.source
                        }}
                        url={photo.thumbnails[1] ?? ""}
                      />
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
