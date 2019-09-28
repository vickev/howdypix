export type DispatcherState = {
  connected: boolean;
};

export type UserConfigState = {
  photoDirs: { [sourceId: string]: string };
  thumbnailsDir: string;
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
    thumbnailsDir: ""
  },
  fileQueue: []
};
