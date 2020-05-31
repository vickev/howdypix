import FileSync from "lowdb/adapters/FileSync";
import lowdb, { LowdbSync } from "lowdb";
import { State } from "../state/reducer";

export const initializeLowDb = (Adapter = FileSync): LowdbSync<State> => {
  const adapter = new Adapter("db.json");
  return lowdb(adapter) as LowdbSync<State>;
};
