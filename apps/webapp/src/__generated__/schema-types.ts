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
  id: Scalars["ID"];
  thumbnails: Array<Maybe<Scalars["String"]>>;
}

export interface Query {
  getAlbum: GetAlbumPhotos;
  getCurrentUser?: Maybe<CurrentUserType>;
}

export interface QueryGetAlbumArgs {
  album?: Maybe<Scalars["String"]>;
  source?: Maybe<Scalars["String"]>;
}

export type GetSubAlbumQueryVariables = {
  source?: Maybe<Scalars["String"]>;
  album?: Maybe<Scalars["String"]>;
};

export type GetSubAlbumQuery = {
  getAlbum: {
    album: Maybe<Pick<Album, "name">>;
    photos: Array<Maybe<Pick<Photo, "thumbnails">>>;
    albums: Array<Pick<Album, "name" | "source" | "dir">>;
  };
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
