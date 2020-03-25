import React from "react";
import { hjoin, removeEmptyValues } from "@howdypix/utils";
import Link from "next/link";
import { HFile, AvailableFilters } from "@howdypix/shared-types";
import CardActionArea from "@material-ui/core/CardActionArea";
import Box from "@material-ui/core/Box";
import CardMedia, { CardMediaProps } from "@material-ui/core/CardMedia";
import styled from "@material-ui/styles/styled";
import { PhotosOrderBy } from "../__generated__/schema-types";

const StyledCardMedia = styled(CardMedia)((props) => ({
  minHeight: props.height ?? "auto",
  paddingBottom: !props.height ? "100%" : "inherit",
})) as React.ComponentType<CardMediaProps & { height?: number }>;

type Props = {
  hfile: HFile;
  url: string;
  filter: AvailableFilters | null;
  order: PhotosOrderBy | null;
  mx?: number;
  height?: number;
  maxWidth?: number;
};

export const Thumbnail: React.FC<Props> = ({
  hfile,
  url,
  filter,
  order,
  mx,
  height,
  maxWidth,
}) => (
  <Box mx={mx} maxWidth={maxWidth ?? "auto"}>
    <CardActionArea data-testid="thumbnail" disableRipple>
      <Link
        href="/photo/[...slug]"
        as={{
          pathname: `/photo/${hjoin(hfile)}`,
          query: removeEmptyValues({ ...filter, order }),
        }}
      >
        <StyledCardMedia
          image={url}
          height={height}
          data-testid="thumbnail-image"
        />
      </Link>
    </CardActionArea>
  </Box>
);
