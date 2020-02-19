import { useContext } from "react";
import { StoreContext, StoreContextData } from "./storeContext";

export const useStore = (): StoreContextData => {
  return useContext(StoreContext);
};
