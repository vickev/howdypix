import React from "react";
import { hjoin } from "@howdypix/utils";
import Link from "next/link";
import { HFile } from "@howdypix/shared-types";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import styled from "@material-ui/styles/styled";

const StyledCardMedia = styled(CardMedia)(() => ({
  minHeight: 200
}));

type Props = {
  hfile: HFile;
  url: string;
};

export const Thumbnail: React.FC<Props> = ({ hfile, url }) => (
  <CardActionArea>
    <Link href="/photo/[...slug]" as={`/photo/${hjoin(hfile)}`}>
      <StyledCardMedia image={url} />
    </Link>
  </CardActionArea>
);
