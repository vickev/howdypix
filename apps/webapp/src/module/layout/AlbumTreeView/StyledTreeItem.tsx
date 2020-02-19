import React from "react";
import styled from "styled-components";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem, { TreeItemProps } from "@material-ui/lab/TreeItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// ========================================================================
// Styles
// ========================================================================
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

// ========================================================================
// Styled components
// ========================================================================
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
LabelText.defaultProps = {
  variant: "body1"
};

const LabelPreview = styled.div``;

const StyledChip = styled(Chip)``;
const LabelCount: React.FC<{}> = ({ children }) => (
  <StyledChip variant="outlined" size="small" label={children} />
);

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

const Preview: React.FC<{
  src?: string | null;
}> = ({ src }) => <StyledDivImg src={src} />;

// ========================================================================
// Component
// ========================================================================
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

  const iconButton = (icon: React.ReactElement): React.ReactElement => (
    <IconButton size="small" onClick={onClickExpand}>
      {icon}
    </IconButton>
  );

  return (
    <TreeItem
      collapseIcon={iconButton(<ExpandMoreIcon />)}
      expandIcon={iconButton(<ChevronRightIcon />)}
      endIcon={iconButton(<ChevronRightIcon />)}
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
            <LabelText>{label}</LabelText>
            <LabelCount>{nbImages}</LabelCount>
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
