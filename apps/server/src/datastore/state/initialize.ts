import { Connection } from "typeorm";
import { LowdbSync } from "lowdb";
import { Store } from "redux";
import { Action, State } from "./reducer";

export type AppStore = Store<State, Action>;

export const initializeStore = async (
  store: AppStore,
  connection: Connection,
  statedb: LowdbSync<State>
): Promise<void> => {};
