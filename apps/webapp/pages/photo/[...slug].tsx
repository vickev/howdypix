import React, { useState } from "react";
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
  GetPhotosQuery,
  PhotosOrderBy
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";
import { PhotoStream } from "../../src/module/photo/PhotoStream";
import { Thumbnail } from "../../src/component/Thumbnail";

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
  maxWidth: "100%",
  maxHeight: "100%"
}));

// ========================================
// GraphQL queries
// ========================================
const GET_PHOTO = gql`
  query GetPhoto(
    $source: String!
    $album: String!
    $file: String!
    $filterBy: PhotosFilterBy
    $orderBy: PhotosOrderBy
  ) {
    getPhoto(
      source: $source
      album: $album
      file: $file
      filterBy: $filterBy
      orderBy: $orderBy
    ) {
      files
      photoStream {
        file
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

  // State to save the old set of data, to avoid flickering when changing the order
  const [savedPhotosData, setOldData] = useState<GetPhotoQuery | undefined>();

  //= ================================================================
  // Load the file detail
  //= ================================================================
  const photo = useQuery<GetPhotoQuery, GetPhotoQueryVariables>(GET_PHOTO, {
    variables: {
      source: folder.source,
      album: folder.dir === "." ? "" : folder.dir ?? "",
      file: folder.file,
      orderBy,
      filterBy
    }
  });

  if (photo.loading && !savedPhotosData) return <p>Loading...</p>;

  // Save the data to the state to avoid flickering
  if (!photo.loading && savedPhotosData !== photo.data) {
    setOldData(photo.data);
  }

  return (
    <Layout>
      <Box p={3} height="100%" display={"flex"} flexDirection={"column"}>
        <Box>
          <Link
            href="/album/[...slug]"
            as={{
              pathname: `/album/@${folder.source}:${folder.dir}`,
              query: removeEmptyValues({ ...filterBy, order: orderBy })
            }}
          >
            <Button variant="outlined">{t("previous")}</Button>
          </Link>
        </Box>
        <Box
          pt={gutter}
          id="pictureBox"
          display="flex"
          flexDirection="column"
          flex={1}
        >
          <Box flex={1} height={"1px"} textAlign={"center"}>
            <Image
              data-testid="picture-detail"
              src={photo.data?.getPhoto?.files[2] ?? ""}
            />
          </Box>
          <Box pt={gutter}>
            {photo.data?.getPhoto?.photoStream && (
              <PhotoStream
                filterBy={filterBy}
                orderBy={orderBy}
                photos={
                  photo.data?.getPhoto?.photoStream.map(photo => ({
                    hfile: {
                      file: photo.file,
                      dir: folder.dir,
                      source: folder.source
                    },
                    thumbnail: photo.thumbnails[1]
                  })) ?? []
                }
              />
            )}
          </Box>{" "}
        </Box>
      </Box>
    </Layout>
  );
};

PhotoPage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(PhotoPage);
