import React, { ReactElement, useEffect, useState } from "react";
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
import { hjoin, hparse, hpaths, removeEmptyValues } from "@howdypix/utils";
import { AvailableFilters, HFile } from "@howdypix/shared-types";
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
  PhotosOrderBy,
  GetFiltersQuery,
  GetFiltersQueryVariables
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";
import { AlbumCard } from "../../src/component/AlbumCard";
import { AlbumGrid } from "../../src/component/AlbumGrid";
import { AlbumGridListTile } from "../../src/component/AlbumGridListTile";
import { Thumbnail } from "../../src/component/Thumbnail";
import { AlbumInformationPanel } from "../../src/module/album/AlbumInformationPanel";
import { SortButton } from "../../src/component/SortButton";
import { Filters } from "../../src/module/album/Filters";
import { AlbumTreeView } from "../../src/module/layout/AlbumTreeView";
import { useStore } from "../../src/module/store/storeHook";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

type QueryStringParams = {
  order: PhotosOrderBy | undefined;
} & AvailableFilters;

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
  query GetPhotos(
    $source: String!
    $album: String
    $orderBy: PhotosOrderBy
    $filterBy: PhotosFilterBy
  ) {
    getSearch(
      source: $source
      album: $album
      orderBy: $orderBy
      filterBy: $filterBy
    ) {
      photos {
        id
        thumbnails
        file
      }
    }
  }
`;

const GET_FILTRERS = gql`
  query GetFilters(
    $source: String!
    $album: String
    $filterBy: PhotosFilterBy
  ) {
    getFilters(source: $source, album: $album, filterBy: $filterBy) {
      cameraMakes
      cameraModels
      dateTakenRange {
        from
        to
      }
    }
  }
`;

const AlbumPage: NextPage<Props, InitialProps> = () => {
  //= ================================================================
  // Load the hooks
  //= ================================================================
  const router = useRouter();
  const qs: QueryStringParams = querystring.parse(
    url.parse(router.asPath).query || ""
  ) as QueryStringParams;

  // Order by parsed from the URL
  const orderBy = qs.order ?? PhotosOrderBy.DateAsc;

  // Load the general store of the app
  const { setCurrentSource, setCurrentAlbum, setRightPanel } = useStore();

  // Filter by parsed from the URL
  const filterBy = {
    make: typeof qs.make === "string" ? [qs.make] : qs.make,
    model: typeof qs.model === "string" ? [qs.model] : qs.model
  };

  // State to save the old set of data, to avoid flickering when changing the order
  const [savedPhotosData, setOldData] = useState<GetPhotosQuery | undefined>();

  //= ================================================================
  // Parse the route to get the folder details and the breadcrumbs
  //= ================================================================
  const hpath = (router.query.slug as string[]).join("/");
  const folder: HFile = hparse(hpath);
  const breadcrumbs: HFile[] = hpaths(folder);

  //= ================================================================
  // Album Query
  //= ================================================================
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

  //= ================================================================
  // Photo Query
  //= ================================================================
  const photosQuery = useQuery<GetPhotosQuery, GetPhotosQueryVariables>(
    GET_PHOTOS,
    {
      variables: {
        source: folder.source,
        album: folder.dir,
        orderBy,
        filterBy
      }
    }
  );
  const photosData = photosQuery.data;
  const photosLoading = photosQuery.loading;

  // Save the data to the state to avoid flickering
  if (!photosLoading && savedPhotosData !== photosData) {
    setOldData(photosData);
  }

  //= ================================================================
  // Filters Query
  //= ================================================================
  const filtersQuery = useQuery<GetFiltersQuery, GetFiltersQueryVariables>(
    GET_FILTRERS,
    {
      variables: {
        source: folder.source,
        album: folder.dir,
        filterBy
      }
    }
  );
  const filtersData = filtersQuery.data;

  //= ================================================================
  // Update the store of the app
  //= ================================================================
  setCurrentSource(folder.source);
  setCurrentAlbum(folder.dir ?? null);
  useEffect(() => {
    setRightPanel(
      <AlbumInformationPanel nbPhotos={photosData?.getSearch.photos.length} />
    );
  }, [photosData, photosLoading]);

  //= ================================================================
  // Callback functions
  //= ================================================================
  const handleSortChange = (value: NexusGenEnums["PhotosOrderBy"]): void => {
    router.replace(router.pathname, {
      pathname: url.parse(router.asPath).pathname,
      query: removeEmptyValues({ ...qs, order: value })
    });
  };

  const handleFilterChange = (filterValues: AvailableFilters): void => {
    router.push(router.pathname, {
      pathname: url.parse(router.asPath).pathname,
      query: removeEmptyValues({ ...qs, ...filterValues })
    });
  };

  //= ================================================================
  // Render
  //= ================================================================
  return (
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
                key={`bread_${bread.dir}`}
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
        {filtersData && (
          <Filters
            availableFilters={filtersData?.getFilters}
            selectedFilters={qs}
            onChange={handleFilterChange}
          />
        )}
      </Box>
      <Box paddingBottom={gutter}>
        <Typography variant="h3" component="h1">
          Album {albumData?.getAlbum.album?.name}
        </Typography>
      </Box>
      <AlbumGrid extraHeight={100}>
        {albumLoading
          ? [0, 0, 0].map((value, key) => (
              <GridListTile key={`skeleton_album_${key}`}>
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
              <GridListTile key={`skeleton_photo_${key}`}>
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
                      filter={filterBy}
                      order={orderBy}
                      url={photo.thumbnails[1] ?? ""}
                    />
                  </GridListTile>
                )) ||
                null
            )}
      </AlbumGrid>
    </Box>
  );
};

AlbumPage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default AlbumPage;
