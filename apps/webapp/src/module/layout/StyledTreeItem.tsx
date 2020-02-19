import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import styled from "styled-components";
import TreeView from "@material-ui/lab/TreeView";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { useStore } from "../store/storeHook";

// ========================================================================
// Styles
// ========================================================================
declare module "csstype" {
  interface Properties {
    "--tree-view-color"?: string;
  }
}

const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      "&:focus > $content": {
        backgroundColor: `transparent`,
        color: "var(--tree-view-color)"
      }
    },
    content: {
      "&:hover": {
        backgroundColor: "transparent"
      }
    },
    group: {
      marginLeft: theme.spacing(1),
      "& $content": {
        paddingLeft: theme.spacing(1)
      }
    },
    expanded: {}
  })
);

const LabelWrapper = styled(Button)<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  margin: ${({ theme }): string => theme.spacing(0.5, 0)};
  border-radius: 10000px;
  text-transform: none;
  text-align: left;
  ${({ theme, selected }): string =>
    selected ? `background-color: ${theme.palette.grey[300]}` : ""};

  &:hover {
    background-color: ${({ theme }): string => theme.palette.grey[300]};
  }
`;

const LabelGroup = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;
const LabelText = styled(Typography)`
  flex: 1;
`;
const LabelPreview = styled.div``;
const LabelCount = styled(Chip)``;

const StyledDivImg = styled.div<{ src?: string | null }>`
  ${({ src }): string | null =>
    src ? `background-image: url("${src}");` : null};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10000px;
  height: 25px;
  width: 25px;
  margin-right: ${({ theme }): string => `${theme.spacing(0.5)}px;`};
`;

type PreviewProps = {
  src?: string | null;
};
const Preview: React.FC<PreviewProps> = ({ src }) => {
  return <StyledDivImg src={src} />;
};

type Props = TreeItemProps & {
  label: string;
  preview?: string | null;
  nbImages: number;
  nbAlbums: number;
  selected?: boolean;
  onClickExpand: () => void;
  onClickItem: () => void;
  onClick?: undefined;
};

export const StyledTreeItem: React.FC<Props> = ({
  label,
  preview,
  nbImages,
  nbAlbums,
  onClickExpand,
  onClickItem,
  selected,
  ...rest
}) => {
  const classes = useTreeItemStyles();

  return (
    <TreeItem
      collapseIcon={
        <IconButton size="small" onClick={onClickExpand}>
          <ExpandMoreIcon />
        </IconButton>
      }
      expandIcon={
        <IconButton size="small" onClick={onClickExpand}>
          <ChevronRightIcon />
        </IconButton>
      }
      endIcon={
        <IconButton size="small" onClick={onClickExpand} disabled={!nbAlbums}>
          <ChevronRightIcon />
        </IconButton>
      }
      label={
        <LabelWrapper
          fullWidth
          size="small"
          onClick={onClickItem}
          selected={selected}
        >
          <LabelGroup>
            <LabelPreview>
              <Preview src={preview} />
            </LabelPreview>
            <LabelText variant="body1">{label}</LabelText>
            <LabelCount variant="outlined" size="small" label={nbImages} />
          </LabelGroup>
        </LabelWrapper>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group
      }}
      {...rest}
    />
  );
};
