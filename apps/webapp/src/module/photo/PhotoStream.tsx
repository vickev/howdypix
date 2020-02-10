import React from "react";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { styled } from "@material-ui/styles";
import { Box, Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { AvailableFilters, HFile } from "@howdypix/shared-types";
import { Thumbnail } from "../../component/Thumbnail";
import { PhotosOrderBy } from "../../__generated__/schema-types";

const Image = styled("img")(() => ({
  width: "100px"
}));

const StyledGridList = styled(GridList)(() => ({
  width: "100%"
}));

const CustomGrid = styled(Box)(() => ({}));

const CustomGridItem = styled(Box)(({ theme }) => ({
  height: 130,
  display: "block",
  overflow: "hidden",
  position: "relative",
  "& > *": {
    left: "50%",
    top: "50%",
    minHeight: "100%",
    minWidth: "100%",
    maxHeight: "100%",
    maxWidth: "100%",
    position: "relative",
    transform: "translate(-50%, -50%)"
  }
}));

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
      justifyContent={"center"}
      alignContent={"center"}
      flexGrow={0}
    >
      {photos.map(photo => (
        <Box
          flex={1}
          justifyContent={"center"}
          alignContent={"center"}
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
