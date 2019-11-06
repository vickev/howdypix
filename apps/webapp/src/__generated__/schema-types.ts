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

export interface Mutation {
  sendEmail: SendEmailType;
}

export interface MutationSendEmailArgs {
  email?: Maybe<Scalars["String"]>;
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

/** The type of message that the user can get when requesting a magic link. */
export enum SendEmailMessage {
  AuthEmailErr = "AUTH_EMAIL_ERR",
  AuthEmailErrNotExist = "AUTH_EMAIL_ERR_NOT_EXIST",
  AuthEmailOk = "AUTH_EMAIL_OK"
}

export interface SendEmailType {
  messageId: SendEmailMessage;
}

export type GetAlbumQueryVariables = {};

export type GetAlbumQuery = {
  getAlbum: {
    album: Maybe<Pick<Album, "name">>;
    photos: Array<Maybe<Pick<Photo, "thumbnails">>>;
    albums: Array<Pick<Album, "name">>;
  };
};

export type SendEmailMutationVariables = {
  email: Scalars["String"];
};

export type SendEmailMutation = { sendEmail: Pick<SendEmailType, "messageId"> };
