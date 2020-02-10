import React from "react";
import { styled } from "@material-ui/styles";

const Image = styled("img")(() => ({
  width: "100px"
}));

type Props = {
  photos: {
    thumbnail: string;
  }[];
};

export const PhotoStream: React.FC<Props> = ({ photos }) => {
  return (
    <div>
      {photos.map(photo => (
        <Image src={photo.thumbnail} />
      ))}
    </div>
  );
};
