import { useContext, useEffect } from "react";
import { TreeViewContext } from "./treeViewContext";
import { TreeViewContextData } from "./types";

type Props = {
  album?: string;
  source?: string;
};

export const useTreeView = ({ album, source }: Props): TreeViewContextData => {
  const context = useContext(TreeViewContext);

  useEffect(() => {
    context.expand({
      album: album ?? null,
      source: source ?? ""
    });
  }, [album, source]);

  return context;
};
