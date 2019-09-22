export type DispatcherState = {
  connected: boolean;
};

export type UserConfigState = {
  photoDirs: string[];
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
    photoDirs: []
  },
  fileQueue: []
};
