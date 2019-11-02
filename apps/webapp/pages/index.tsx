import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTranslation } from "react-i18next";
import { styled, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import { withApollo } from "../src/lib/with-apollo-client";
import {
  GetAlbumQuery,
  GetAlbumQueryVariables
} from "../src/__generated__/schema-types";
import Layout from "../src/modules/layout/Layout";
import { Divider } from "@material-ui/core";

//========================================
// Constants
//========================================
const imageSize = 200;
const gutter = 4;

//========================================
// Custom components
//========================================
const CustomPaper = styled(Paper)(props => ({
  padding: props.theme.spacing(4),
  textAlign: "center"
}));

const CustomGridList = styled(GridList)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: imageSize
  },
  [theme.breakpoints.up("sm")]: {
    width: imageSize * 2
  },
  [theme.breakpoints.up("md")]: {
    width: imageSize * 3
  },
  [theme.breakpoints.up("lg")]: {
    width: imageSize * 4
  },
  [theme.breakpoints.up("xl")]: {
    width: imageSize * 5
  },
  marginRight: "auto !important",
  marginLeft: "auto !important"
}));

//========================================
// GraphQL queries
//========================================
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
  const theme = useTheme();
  const { loading, error, data } = useQuery<
    GetAlbumQuery,
    GetAlbumQueryVariables
  >(GET_GREETING);

  if (loading) return <p>Loading...</p>;
  console.log(data);

  return (
    <Layout>
      <Box bgcolor={"white"} padding={gutter}>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Album {data && data.getAlbum.album && data.getAlbum.album.name}
          </Typography>
        </Box>
        <Divider variant="fullWidth" />
        <Box paddingTop={gutter}>
          <GridList spacing={theme.spacing(gutter)}>
            {data &&
              data.getAlbum.photos.map(
                photo =>
                  photo &&
                  photo.thumbnails &&
                  photo.thumbnails[1] && (
                    <GridListTile
                      style={{ height: imageSize, width: imageSize }}
                      cols={1}
                    >
                      <img src={photo.thumbnails[1]} />
                    </GridListTile>
                  )
              )}
          </GridList>
        </Box>
      </Box>
    </Layout>
  );
}

export default withApollo(Hello);
