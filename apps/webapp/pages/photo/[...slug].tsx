import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Link from "next/link";
import { GlobalHotKeys } from "react-hotkeys";
import Box from "@material-ui/core/Box";
import { hjoin, hparse, removeEmptyValues } from "@howdypix/utils";
import { AvailableFilters, HFile } from "@howdypix/shared-types";
import { styled } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import querystring from "querystring";
import url from "url";

import { useRouter } from "next/router";
import { NextPage } from "next";
import {
  GetPhotoQuery,
  GetPhotoQueryVariables,
  PhotosOrderBy
} from "../../src/__generated__/schema-types";
import { PhotoStream } from "../../src/module/photo/PhotoStream";
import { PhotoRightPanel } from "../../src/module/photo/PhotoRightPanel";
import { useStore } from "../../src/context/store/storeHook";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

type QueryStringParams = {
  order: PhotosOrderBy | undefined;
} & AvailableFilters;

// ========================================
// Constants
// ========================================
const gutter = 3;
const keyMap = {
  MOVE_RIGHT: "right",
  MOVE_LEFT: "left",
  ESCAPE: "esc"
};

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
      aperture
      birthtime
      iso
      make
      model
      shutter
      files
      next
      previous
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

  // Load the general store of the app
  const { setCurrentSource, setCurrentAlbum, setRightPanel } = useStore();

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
  // Keyboard events
  //= ================================================================
  const handlers = {
    MOVE_RIGHT: (): void => {
      if (savedPhotosData?.getPhoto?.next) {
        router.push("/photo/[...slug]", {
          pathname: `/photo/${hjoin({
            ...folder,
            file: savedPhotosData?.getPhoto?.next
          })}`,
          query: removeEmptyValues({ ...filterBy, order: orderBy })
        });
      }
    },
    MOVE_LEFT: (): void => {
      if (savedPhotosData?.getPhoto?.previous) {
        router.push("/photo/[...slug]", {
          pathname: `/photo/${hjoin({
            ...folder,
            file: savedPhotosData?.getPhoto?.previous
          })}`,
          query: removeEmptyValues({ ...filterBy, order: orderBy })
        });
      }
    },
    ESCAPE: (): void => {
      router.push("/album/[...slug]", {
        pathname: `/album/@${folder.source}:${folder.dir}`,
        query: removeEmptyValues({ ...filterBy, order: orderBy })
      });
    }
  };

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

  // Save the data to the state to avoid flickering
  if (!photo.loading && savedPhotosData !== photo.data) {
    setOldData(photo.data);
  }

  //= ================================================================
  // Update the store of the app
  //= ================================================================
  setCurrentSource(folder.source);
  setCurrentAlbum(folder.dir === "." ? "" : folder.dir ?? null);
  useEffect(() => {
    setRightPanel(
      <PhotoRightPanel
        ISO={photo.data?.getPhoto?.iso}
        aperture={photo.data?.getPhoto?.aperture}
        shutter={photo.data?.getPhoto?.shutter}
        date={photo.data?.getPhoto?.birthtime}
      />
    );
  }, [photo.data]);

  return (
    <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges>
      <Box p={3} height="100%" display="flex" flexDirection="column">
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
          <Box flex={1} height="1px" textAlign="center">
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
                  photo.data?.getPhoto?.photoStream.map((photo): {
                    hfile: HFile;
                    thumbnail: string;
                  } => ({
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
    </GlobalHotKeys>
  );
};

PhotoPage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default PhotoPage;
