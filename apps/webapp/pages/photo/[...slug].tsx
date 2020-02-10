import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { hparse, removeEmptyValues } from "@howdypix/utils";
import { AvailableFilters, HFile } from "@howdypix/shared-types";
import { styled } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import querystring from "querystring";
import url from "url";

import { useRouter } from "next/router";
import { NextPage } from "next";

import { withApollo } from "../../src/lib/with-apollo-client";
import {
  GetPhotoQuery,
  GetPhotoQueryVariables,
  GetPhotoStreamQuery,
  GetPhotoStreamQueryVariables,
  PhotosOrderBy
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";
import { PhotoStream } from "../../src/module/photo/PhotoStream";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

type QueryStringParams = {
  order: PhotosOrderBy | undefined;
} & AvailableFilters;

// ========================================
// Constants
// ========================================
const gutter = 3;

const Image = styled("img")(() => ({
  width: "100%"
}));

// ========================================
// GraphQL queries
// ========================================
const GET_PHOTO = gql`
  query GetPhoto($source: String!, $album: String!, $file: String!) {
    getPhoto(source: $source, album: $album, file: $file) {
      files
    }
  }
`;

const GET_PHOTO_STREAM = gql`
  query GetPhotoStream(
    $source: String!
    $album: String!
    $file: String!
    $filterBy: PhotosFilterBy
    $orderBy: PhotosOrderBy
  ) {
    getStreamPhoto(
      source: $source
      album: $album
      file: $file
      filterBy: $filterBy
      orderBy: $orderBy
    ) {
      photos {
        thumbnails
      }
    }
  }
`;

const PhotoPage: NextPage<Props, InitialProps> = () => {
  //= ================================================================
  // Load the hooks
  //= ================================================================
  const { t } = useTranslation("common");
  const router = useRouter();
  const qs: QueryStringParams = querystring.parse(
    url.parse(router.asPath).query || ""
  ) as QueryStringParams;

  // Order by parsed from the URL
  const orderBy = qs.order ?? PhotosOrderBy.DateAsc;

  // Filter by parsed from the URL
  const filterBy = {
    make: typeof qs.make === "string" ? [qs.make] : qs.make,
    model: typeof qs.model === "string" ? [qs.model] : qs.model
  };

  const hpath = (router.query.slug as string[]).join("/");
  const folder: HFile = hparse(hpath);

  if (!folder.file) {
    return <div>Error</div>;
  }

  //= ================================================================
  // Load the file detail
  //= ================================================================
  const photo = useQuery<GetPhotoQuery, GetPhotoQueryVariables>(GET_PHOTO, {
    variables: {
      source: folder.source,
      album: folder.dir === "." ? "" : folder.dir ?? "",
      file: folder.file
    }
  });

  //= ================================================================
  // Load the photo stream
  //= ================================================================
  const photoStream = useQuery<
    GetPhotoStreamQuery,
    GetPhotoStreamQueryVariables
  >(GET_PHOTO_STREAM, {
    variables: {
      source: folder.source,
      album: folder.dir === "." ? "" : folder.dir ?? "",
      file: folder.file,
      orderBy,
      filterBy
    }
  });

  if (photo.loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box p={2}>
        <Link
          href="/album/[...slug]"
          as={{
            pathname: `/album/@${folder.source}:${folder.dir}`,
            query: removeEmptyValues({ ...filterBy, order: orderBy })
          }}
        >
          <Button variant="outlined">{t("previous")}</Button>
        </Link>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1" />
        </Box>
        <Box py={gutter} id="pictureBox">
          <Image
            data-testid="picture-detail"
            src={photo.data?.getPhoto?.files[2] ?? ""}
          />
        </Box>
        <Box py={gutter} id="pictureBox">
          {photoStream.data && (
            <PhotoStream
              photos={
                photoStream.data?.getStreamPhoto?.photos.map(photo => ({
                  thumbnail: photo.thumbnails[1]
                })) ?? []
              }
            />
          )}
        </Box>
      </Box>
    </Layout>
  );
};

PhotoPage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(PhotoPage);
