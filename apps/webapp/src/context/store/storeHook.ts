import { useContext } from "react";
import { StoreContext } from "./storeContext";
import { StoreContextData } from "./types";

export const useStore = (): StoreContextData => {
  return useContext(StoreContext);
};
