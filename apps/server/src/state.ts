export type DispatcherState = {
  connected: boolean;
};

export type User = {
  email: string;
  name: string;
};

export type UserConfigState = {
  photoDirs: { [sourceId: string]: string };
  thumbnailsDir: string;
  users: User[];
  emailSender: User;
};

export type FileQueueState = string[];

export type State = {
  dispatcher: DispatcherState;
  userConfig: UserConfigState;
  fileQueue: FileQueueState;
};

export const state: State = {
  dispatcher: {
    connected: false
  },
  userConfig: {
    photoDirs: {},
    thumbnailsDir: "",
    users: [],
    emailSender: {
      email: "",
      name: ""
    }
  },
  fileQueue: []
};
