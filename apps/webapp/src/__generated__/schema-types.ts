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
  nbAlbums: Scalars["Int"];
  nbPhotos: Scalars["Int"];
  preview?: Maybe<Scalars["String"]>;
  source: Scalars["String"];
}

/** The type of message that the user can get when requesting a magic link. */
export enum AuthEmailMessage {
  AuthEmailErr = "AUTH_EMAIL_ERR",
  AuthEmailErrNotExist = "AUTH_EMAIL_ERR_NOT_EXIST",
  AuthEmailOk = "AUTH_EMAIL_OK"
}

export interface AuthEmailType {
  code?: Maybe<Scalars["String"]>;
  messageData?: Maybe<Scalars["String"]>;
  messageId: AuthEmailMessage;
}

export interface CurrentUserType {
  email: Scalars["String"];
  name: Scalars["String"];
}

export interface GetAlbumPhotos {
  album?: Maybe<Album>;
  albums: Array<Album>;
  photos: Array<Maybe<Photo>>;
}

export interface Mutation {
  authEmail: AuthEmailType;
}

export interface MutationAuthEmailArgs {
  email?: Maybe<Scalars["String"]>;
}

export interface Photo {
  birthtime: Scalars["Float"];
  file: Scalars["ID"];
  id: Scalars["ID"];
  thumbnails: Array<Maybe<Scalars["String"]>>;
}

export interface PhotoDetail {
  files: Array<Maybe<Scalars["String"]>>;
  id: Scalars["ID"];
}

/** The order of which the list is sorted */
export enum PhotosOrderBy {
  DateAsc = "DATE_ASC",
  DateDesc = "DATE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC"
}

export interface Query {
  getAlbum: GetAlbumPhotos;
  getCurrentUser?: Maybe<CurrentUserType>;
  getPhoto?: Maybe<PhotoDetail>;
  getSources: Array<Maybe<Source>>;
}

export interface QueryGetAlbumArgs {
  album?: Maybe<Scalars["String"]>;
  orderBy?: Maybe<PhotosOrderBy>;
  source: Scalars["String"];
}

export interface QueryGetPhotoArgs {
  album: Scalars["String"];
  file: Scalars["String"];
  source: Scalars["String"];
}

export interface Source {
  name: Scalars["String"];
  nbAlbums: Scalars["Int"];
  nbPhotos: Scalars["Int"];
  preview?: Maybe<Scalars["String"]>;
}

export type GetSubAlbumQueryVariables = {
  source: Scalars["String"];
  album?: Maybe<Scalars["String"]>;
};

export type GetSubAlbumQuery = {
  getAlbum: {
    album: Maybe<Pick<Album, "name">>;
    photos: Array<Maybe<Pick<Photo, "thumbnails" | "file">>>;
    albums: Array<
      Pick<
        Album,
        "name" | "source" | "dir" | "preview" | "nbAlbums" | "nbPhotos"
      >
    >;
  };
};

export type GetSourcesQueryVariables = {};

export type GetSourcesQuery = {
  getSources: Array<
    Maybe<Pick<Source, "name" | "nbAlbums" | "nbPhotos" | "preview">>
  >;
};

export type GetPhotoQueryVariables = {
  source: Scalars["String"];
  album: Scalars["String"];
  file: Scalars["String"];
};

export type GetPhotoQuery = { getPhoto: Maybe<Pick<PhotoDetail, "files">> };

export type AuthEmailMutationVariables = {
  email: Scalars["String"];
};

export type AuthEmailMutation = {
  authEmail: Pick<AuthEmailType, "messageId" | "messageData">;
};

export type GetCurrentUserQueryVariables = {};

export type GetCurrentUserQuery = {
  getCurrentUser: Maybe<Pick<CurrentUserType, "name" | "email">>;
};
