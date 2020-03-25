import React from "react";
import GridList from "@material-ui/core/GridList";
import { Theme, useTheme } from "@material-ui/core/styles";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// ========================================
// Constants
// ========================================
const imageSize = 200;
const gutter = 3;
const gridCols = {
  xl: 4,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 1,
};

function useWidth(): Breakpoint {
  const theme: Theme = useTheme();
  const keys: Breakpoint[] = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output: Breakpoint | null, key: Breakpoint) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || "lg"
  );
}

type Props = {
  extraHeight?: number;
};

export const AlbumGrid: React.FC<Props> = ({ children, extraHeight }) => {
  const width = useWidth();
  const theme = useTheme();

  return (
    <GridList
      spacing={theme.spacing(gutter)}
      cellHeight={imageSize + (extraHeight ?? 0)}
      cols={gridCols[width]}
    >
      {children}
    </GridList>
  );
};
