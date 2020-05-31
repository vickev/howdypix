import { createStore } from "redux";
import { reducer } from "./reducer";
import { AppStore, initializeStore } from "./initialize";

let store: AppStore;

export const createAppStore = (): AppStore => {
  if (!store) {
    store = createStore(reducer);
  }

  return store;
};

export { AppStore, initializeStore };
