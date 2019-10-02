export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface Album {
  id: Scalars["ID"];
  name: Scalars["String"];
}

export interface GetPhotos {
  albums: Array<Scalars["String"]>;
  photos: Array<Maybe<Photo>>;
}

export interface Photo {
  id: Scalars["ID"];
  thumbnails: Array<Maybe<Scalars["String"]>>;
}

export interface Query {
  getAlbum: GetPhotos;
}

export interface QueryGetAlbumArgs {
  album?: Maybe<Scalars["String"]>;
  source?: Maybe<Scalars["String"]>;
}
export type GetAlbumQueryVariables = {};

export type GetAlbumQuery = {
  getAlbum: Pick<GetPhotos, "albums"> & {
    photos: Array<Maybe<Pick<Photo, "thumbnails">>>;
  };
};
