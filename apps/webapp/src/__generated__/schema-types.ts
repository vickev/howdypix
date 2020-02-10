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

export interface DateTaken {
  from?: Maybe<Scalars["Float"]>;
  to?: Maybe<Scalars["Float"]>;
}

export interface GetAlbumPhotos {
  album?: Maybe<Album>;
  albums: Array<Album>;
  photos: Array<Maybe<Photo>>;
}

export interface GetFilters {
  cameraMakes: Array<Scalars["String"]>;
  cameraModels: Array<Scalars["String"]>;
  dateTakenRange: DateTaken;
}

export interface GetSearchPhotos {
  photos: Array<Maybe<SearchPhoto>>;
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

export interface PhotosFilterBy {
  make?: Maybe<Array<Maybe<Scalars["String"]>>>;
  model?: Maybe<Array<Maybe<Scalars["String"]>>>;
}

/** The order of which the list is sorted */
export enum PhotosOrderBy {
  DateAsc = "DATE_ASC",
  DateDesc = "DATE_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC"
}

export interface PhotoStream {
  photos: Array<PhotoStreamThumbnail>;
}

export interface PhotoStreamThumbnail {
  id: Scalars["ID"];
  thumbnails: Array<Scalars["String"]>;
}

export interface Query {
  getAlbum: GetAlbumPhotos;
  getCurrentUser?: Maybe<CurrentUserType>;
  getFilters: GetFilters;
  getPhoto?: Maybe<PhotoDetail>;
  getSearch: GetSearchPhotos;
  getSources: Array<Maybe<Source>>;
  getStreamPhoto?: Maybe<PhotoStream>;
}

export interface QueryGetAlbumArgs {
  album?: Maybe<Scalars["String"]>;
  source: Scalars["String"];
}

export interface QueryGetFiltersArgs {
  album?: Maybe<Scalars["String"]>;
  filterBy?: Maybe<PhotosFilterBy>;
  source: Scalars["String"];
}

export interface QueryGetPhotoArgs {
  album: Scalars["String"];
  file: Scalars["String"];
  source: Scalars["String"];
}

export interface QueryGetSearchArgs {
  album?: Maybe<Scalars["String"]>;
  filterBy?: Maybe<PhotosFilterBy>;
  orderBy?: Maybe<PhotosOrderBy>;
  source?: Maybe<Scalars["String"]>;
}

export interface QueryGetStreamPhotoArgs {
  album: Scalars["String"];
  file: Scalars["String"];
  filterBy?: Maybe<PhotosFilterBy>;
  orderBy?: Maybe<PhotosOrderBy>;
  source: Scalars["String"];
}

export interface SearchAlbum {
  dir: Scalars["String"];
  name: Scalars["String"];
  nbAlbums: Scalars["Int"];
  nbPhotos: Scalars["Int"];
  preview?: Maybe<Scalars["String"]>;
  source: Scalars["String"];
}

export interface SearchPhoto {
  birthtime: Scalars["Float"];
  file: Scalars["String"];
  id: Scalars["ID"];
  thumbnails: Array<Maybe<Scalars["String"]>>;
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
    albums: Array<
      Pick<
        Album,
        "name" | "source" | "dir" | "preview" | "nbAlbums" | "nbPhotos"
      >
    >;
  };
};

export type GetPhotosQueryVariables = {
  source: Scalars["String"];
  album?: Maybe<Scalars["String"]>;
  orderBy?: Maybe<PhotosOrderBy>;
  filterBy?: Maybe<PhotosFilterBy>;
};

export type GetPhotosQuery = {
  getSearch: {
    photos: Array<Maybe<Pick<SearchPhoto, "id" | "thumbnails" | "file">>>;
  };
};

export type GetFiltersQueryVariables = {
  source: Scalars["String"];
  album?: Maybe<Scalars["String"]>;
  filterBy?: Maybe<PhotosFilterBy>;
};

export type GetFiltersQuery = {
  getFilters: Pick<GetFilters, "cameraMakes" | "cameraModels"> & {
    dateTakenRange: Pick<DateTaken, "from" | "to">;
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

export type GetPhotoStreamQueryVariables = {
  source: Scalars["String"];
  album: Scalars["String"];
  file: Scalars["String"];
  filterBy?: Maybe<PhotosFilterBy>;
  orderBy?: Maybe<PhotosOrderBy>;
};

export type GetPhotoStreamQuery = {
  getStreamPhoto: Maybe<{
    photos: Array<Pick<PhotoStreamThumbnail, "thumbnails">>;
  }>;
};

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
