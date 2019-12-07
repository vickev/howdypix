import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import { hjoin } from "@howdypix/utils";
import React from "react";
import styled from "@material-ui/styles/styled";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import CardActionArea from "@material-ui/core/CardActionArea";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

const CustomCardMedia = styled(CardMedia)({
  height: 200
});

const CustomImageIcon = styled(ImageOutlinedIcon)({
  width: 200,
  height: 200
});

type Props = {
  name: string;
  dir: string;
  source: string;
  preview?: string | null;
  nbPhotos?: number | null;
  nbAlbums?: number | null;
};

export const AlbumCard: React.FC<Props> = ({
  preview,
  nbPhotos,
  name,
  nbAlbums,
  source,
  dir
}) => (
  <Card>
    <Link
      href="/album/[id]"
      as={`/album/${hjoin({
        dir,
        source
      })}`}
    >
      <CardActionArea data-testid="albumcard">
        {preview ? (
          <CustomCardMedia
            image={preview ?? ""}
            title={name}
            data-testid="albumcard-image"
          />
        ) : (
          <Grid container direction="row" justify="center" alignItems="center">
            <CustomImageIcon data-testid="albumcard-image" />
          </Grid>
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {nbPhotos} photos{" "}
            {nbAlbums !== null && nbAlbums !== undefined && nbAlbums > 0 && (
              <>- {nbAlbums} albums</>
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Link>
  </Card>
);
