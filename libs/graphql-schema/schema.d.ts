/**
 * This file was automatically generated by Nexus 0.11.7
 * Do not make changes to this file directly
 */

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {}

export interface NexusGenEnums {
  AuthEmailMessage:
    | "AUTH_EMAIL_ERR"
    | "AUTH_EMAIL_ERR_NOT_EXIST"
    | "AUTH_EMAIL_OK";
  PhotosOrderBy: "DATE_ASC" | "DATE_DESC" | "NAME_ASC" | "NAME_DESC";
}

export interface NexusGenRootTypes {
  Album: {
    // root type
    dir: string; // String!
    name: string; // String!
    nbAlbums: number; // Int!
    nbPhotos: number; // Int!
    preview?: string | null; // String
    source: string; // String!
  };
  AuthEmailType: {
    // root type
    code?: string | null; // String
    messageData?: string | null; // String
    messageId: NexusGenEnums["AuthEmailMessage"]; // AuthEmailMessage!
  };
  CurrentUserType: {
    // root type
    email: string; // String!
    name: string; // String!
  };
  GetAlbumPhotos: {
    // root type
    album?: NexusGenRootTypes["Album"] | null; // Album
    albums: NexusGenRootTypes["Album"][]; // [Album!]!
    photos: Array<NexusGenRootTypes["Photo"] | null>; // [Photo]!
  };
  GetSearchPhotos: {
    // root type
    photos: Array<NexusGenRootTypes["SearchPhoto"] | null>; // [SearchPhoto]!
  };
  Mutation: {};
  Photo: {
    // root type
    birthtime: number; // Float!
    file: string; // ID!
    id: string; // ID!
    thumbnails: Array<string | null>; // [String]!
  };
  PhotoDetail: {
    // root type
    files: Array<string | null>; // [String]!
    id: string; // ID!
  };
  Query: {};
  SearchAlbum: {
    // root type
    dir: string; // String!
    name: string; // String!
    nbAlbums: number; // Int!
    nbPhotos: number; // Int!
    preview?: string | null; // String
    source: string; // String!
  };
  SearchPhoto: {
    // root type
    birthtime: number; // Float!
    file: string; // String!
    id: string; // ID!
    thumbnails: Array<string | null>; // [String]!
  };
  Source: {
    // root type
    name: string; // String!
    nbAlbums: number; // Int!
    nbPhotos: number; // Int!
    preview?: string | null; // String
  };
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AuthEmailMessage: NexusGenEnums["AuthEmailMessage"];
  PhotosOrderBy: NexusGenEnums["PhotosOrderBy"];
}

export interface NexusGenFieldTypes {
  Album: {
    // field return type
    dir: string; // String!
    name: string; // String!
    nbAlbums: number; // Int!
    nbPhotos: number; // Int!
    preview: string | null; // String
    source: string; // String!
  };
  AuthEmailType: {
    // field return type
    code: string | null; // String
    messageData: string | null; // String
    messageId: NexusGenEnums["AuthEmailMessage"]; // AuthEmailMessage!
  };
  CurrentUserType: {
    // field return type
    email: string; // String!
    name: string; // String!
  };
  GetAlbumPhotos: {
    // field return type
    album: NexusGenRootTypes["Album"] | null; // Album
    albums: NexusGenRootTypes["Album"][]; // [Album!]!
    photos: Array<NexusGenRootTypes["Photo"] | null>; // [Photo]!
  };
  GetSearchPhotos: {
    // field return type
    photos: Array<NexusGenRootTypes["SearchPhoto"] | null>; // [SearchPhoto]!
  };
  Mutation: {
    // field return type
    authEmail: NexusGenRootTypes["AuthEmailType"]; // AuthEmailType!
  };
  Photo: {
    // field return type
    birthtime: number; // Float!
    file: string; // ID!
    id: string; // ID!
    thumbnails: Array<string | null>; // [String]!
  };
  PhotoDetail: {
    // field return type
    files: Array<string | null>; // [String]!
    id: string; // ID!
  };
  Query: {
    // field return type
    getAlbum: NexusGenRootTypes["GetAlbumPhotos"]; // GetAlbumPhotos!
    getCurrentUser: NexusGenRootTypes["CurrentUserType"] | null; // CurrentUserType
    getPhoto: NexusGenRootTypes["PhotoDetail"] | null; // PhotoDetail
    getSearch: NexusGenRootTypes["GetSearchPhotos"]; // GetSearchPhotos!
    getSources: Array<NexusGenRootTypes["Source"] | null>; // [Source]!
  };
  SearchAlbum: {
    // field return type
    dir: string; // String!
    name: string; // String!
    nbAlbums: number; // Int!
    nbPhotos: number; // Int!
    preview: string | null; // String
    source: string; // String!
  };
  SearchPhoto: {
    // field return type
    birthtime: number; // Float!
    file: string; // String!
    id: string; // ID!
    thumbnails: Array<string | null>; // [String]!
  };
  Source: {
    // field return type
    name: string; // String!
    nbAlbums: number; // Int!
    nbPhotos: number; // Int!
    preview: string | null; // String
  };
}

export interface NexusGenArgTypes {
  Mutation: {
    authEmail: {
      // args
      email?: string | null; // String
    };
  };
  Query: {
    getAlbum: {
      // args
      album?: string | null; // String
      source: string; // String!
    };
    getPhoto: {
      // args
      album: string; // String!
      file: string; // String!
      source: string; // String!
    };
    getSearch: {
      // args
      album?: string | null; // String
      orderBy?: NexusGenEnums["PhotosOrderBy"] | null; // PhotosOrderBy
      source?: string | null; // String
    };
  };
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames =
  | "Album"
  | "AuthEmailType"
  | "CurrentUserType"
  | "GetAlbumPhotos"
  | "GetSearchPhotos"
  | "Mutation"
  | "Photo"
  | "PhotoDetail"
  | "Query"
  | "SearchAlbum"
  | "SearchPhoto"
  | "Source";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = "AuthEmailMessage" | "PhotosOrderBy";

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes:
    | NexusGenTypes["inputNames"]
    | NexusGenTypes["enumNames"]
    | NexusGenTypes["scalarNames"];
  allOutputTypes:
    | NexusGenTypes["objectNames"]
    | NexusGenTypes["enumNames"]
    | NexusGenTypes["unionNames"]
    | NexusGenTypes["interfaceNames"]
    | NexusGenTypes["scalarNames"];
  allNamedTypes:
    | NexusGenTypes["allInputTypes"]
    | NexusGenTypes["allOutputTypes"];
  abstractTypes: NexusGenTypes["interfaceNames"] | NexusGenTypes["unionNames"];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}
