import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { styled, makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";

import { withApollo } from "../src/lib/with-apollo-client";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables
} from "../src/__generated__/schema-types";

const CustomPaper = styled(Paper)(props => ({
  padding: props.theme.spacing(3, 2),
  textAlign: "left"
}));

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

const GET_GREETING = gql`
  query GetAlbum {
    getAlbum(source: "main") {
      album {
        name
      }
      photos {
        thumbnails
      }
      albums {
        name
      }
    }
  }
`;

function Hello() {
  const { t, i18n } = useTranslation("common");
  const { loading, error, data } = useQuery<
    GetAlbumQuery,
    GetAlbumQueryVariables
  >(GET_GREETING);
  const classes = useStyles();

  if (loading) return <p>Loading...</p>;
  console.log(data);

  return (
    <Container maxWidth={"md"}>
      <Box p={5}>
        <CustomPaper>
          <Typography variant="h4" component="h1" align="center">
            Album {data && data.getAlbum.album && data.getAlbum.album.name}
          </Typography>
          {data &&
            data.getAlbum.albums.map(
              album =>
                album &&
                album.name && (
                  <Button
                    size="medium"
                    variant="outlined"
                    className={classes.margin}
                  >
                    <FolderIcon className={classes.extendedIcon} />
                    {album.name}
                  </Button>
                )
            )}
          <GridList cellHeight={160} cols={3}>
            {data &&
              data.getAlbum.photos.map(
                photo =>
                  photo &&
                  photo.thumbnails &&
                  photo.thumbnails[1] && (
                    <GridListTile cols={1}>
                      <img src={photo.thumbnails[1]} />
                    </GridListTile>
                  )
              )}
          </GridList>
        </CustomPaper>
      </Box>
    </Container>
  );
}

export default withApollo(Hello);
