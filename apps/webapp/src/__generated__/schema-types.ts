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
  dir: Scalars["String"];
  name: Scalars["String"];
  source: Scalars["String"];
}

export interface GetPhotos {
  album?: Maybe<Album>;
  albums: Array<Album>;
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
  getAlbum: {
    album: Maybe<Pick<Album, "name">>;
    photos: Array<Maybe<Pick<Photo, "thumbnails">>>;
    albums: Array<Pick<Album, "name">>;
  };
};
