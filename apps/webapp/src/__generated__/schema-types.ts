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
  parent?: Maybe<Scalars["Int"]>;
}
export type GetAlbumQueryVariables = {};

export type GetAlbumQuery = {
  getAlbum: {
    photos: Array<Maybe<Pick<Photo, "thumbnails">>>;
    albums: Array<Pick<Album, "id" | "name">>;
  };
};
