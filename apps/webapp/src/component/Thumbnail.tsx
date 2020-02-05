import React from "react";
import { hjoin, removeEmptyValues } from "@howdypix/utils";
import Link from "next/link";
import { HFile, AvailableFilters } from "@howdypix/shared-types";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import styled from "@material-ui/styles/styled";
import { PhotosOrderBy } from "../__generated__/schema-types";

const StyledCardMedia = styled(CardMedia)(() => ({
  minHeight: 200
}));

type Props = {
  hfile: HFile;
  url: string;
  filter: AvailableFilters | null;
  order: PhotosOrderBy | null;
};

export const Thumbnail: React.FC<Props> = ({ hfile, url, filter, order }) => (
  <CardActionArea data-testid="thumbnail">
    <Link
      href="/photo/[...slug]"
      as={{
        pathname: `/photo/${hjoin(hfile)}`,
        query: removeEmptyValues({ ...filter, order })
      }}
    >
      <StyledCardMedia image={url} />
    </Link>
  </CardActionArea>
);
