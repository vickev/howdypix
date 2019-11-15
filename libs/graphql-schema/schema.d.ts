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
}

export interface NexusGenRootTypes {
  Album: {
    // root type
    dir: string; // String!
    name: string; // String!
    source: string; // String!
  };
  AuthEmailType: {
    // root type
    code?: string | null; // String
    messageData?: string | null; // String
    messageId: NexusGenEnums["AuthEmailMessage"]; // AuthEmailMessage!
  };
  GetPhotos: {
    // root type
    album?: NexusGenRootTypes["Album"] | null; // Album
    albums: NexusGenRootTypes["Album"][]; // [Album!]!
    photos: Array<NexusGenRootTypes["Photo"] | null>; // [Photo]!
  };
  Mutation: {};
  Photo: {
    // root type
    id: string; // ID!
    thumbnails: Array<string | null>; // [String]!
  };
  Query: {};
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  AuthEmailMessage: NexusGenEnums["AuthEmailMessage"];
}

export interface NexusGenFieldTypes {
  Album: {
    // field return type
    dir: string; // String!
    name: string; // String!
    source: string; // String!
  };
  AuthEmailType: {
    // field return type
    code: string | null; // String
    messageData: string | null; // String
    messageId: NexusGenEnums["AuthEmailMessage"]; // AuthEmailMessage!
  };
  GetPhotos: {
    // field return type
    album: NexusGenRootTypes["Album"] | null; // Album
    albums: NexusGenRootTypes["Album"][]; // [Album!]!
    photos: Array<NexusGenRootTypes["Photo"] | null>; // [Photo]!
  };
  Mutation: {
    // field return type
    authEmail: NexusGenRootTypes["AuthEmailType"]; // AuthEmailType!
  };
  Photo: {
    // field return type
    id: string; // ID!
    thumbnails: Array<string | null>; // [String]!
  };
  Query: {
    // field return type
    getAlbum: NexusGenRootTypes["GetPhotos"]; // GetPhotos!
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
      source?: string | null; // String
    };
  };
}

export interface NexusGenAbstractResolveReturnTypes {}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames =
  | "Album"
  | "AuthEmailType"
  | "GetPhotos"
  | "Mutation"
  | "Photo"
  | "Query";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = "AuthEmailMessage";

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
