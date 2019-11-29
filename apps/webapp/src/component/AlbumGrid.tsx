import { CardMedia } from "@material-ui/core";
import React from "react";
import styled from "@material-ui/styles/styled";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import GridList from "@material-ui/core/GridList";
import Box from "@material-ui/core/Box";
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
  xs: 1
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

type Props = {};

export const AlbumGrid: React.FC<Props> = ({ children }) => {
  const width = useWidth();
  const theme = useTheme();

  return (
    <GridList
      spacing={theme.spacing(gutter)}
      cellHeight={imageSize + 100}
      cols={gridCols[width]}
    >
      {children}
    </GridList>
  );
};
