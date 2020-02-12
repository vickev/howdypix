import React from "react";
import { styled } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { AvailableFilters, HFile } from "@howdypix/shared-types";
import { Thumbnail } from "../../component/Thumbnail";
import { PhotosOrderBy } from "../../__generated__/schema-types";

const CustomGrid = styled(Box)(() => ({}));

type Props = {
  gutter?: number;
  photos: {
    thumbnail: string;
    hfile: HFile;
  }[];
  filterBy: AvailableFilters | null;
  orderBy: PhotosOrderBy | null;
};

export const PhotoStream: React.FC<Props> = ({
  photos,
  gutter = 1,
  filterBy,
  orderBy
}) => {
  return (
    <CustomGrid
      display="flex"
      mx={-1 * gutter}
      justifyContent="center"
      alignContent="center"
      flexGrow={0}
      test-dataid="photo-stream"
    >
      {photos.map(photo => (
        <Box
          flex={1}
          justifyContent="center"
          alignContent="center"
          maxWidth={150}
        >
          <Thumbnail
            hfile={photo.hfile}
            filter={filterBy}
            order={orderBy}
            url={photo.thumbnail ?? ""}
            mx={gutter}
          />
        </Box>
      ))}
    </CustomGrid>
  );
};
