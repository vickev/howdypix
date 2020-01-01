import React, { ReactElement } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { NextPage } from "next";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { withApollo } from "../src/lib/with-apollo-client";
import { Layout } from "../src/module/layout/Layout";
import {
  GetSourcesQuery,
  GetSourcesQueryVariables
} from "../src/__generated__/schema-types";
import { AlbumCard } from "../src/component/AlbumCard";
import { AlbumGrid } from "../src/component/AlbumGrid";
import { AlbumGridListTile } from "../src/component/AlbumGridListTile";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

// ========================================
// Constants
// ========================================
const gutter = 3;

// ========================================
// GraphQL queries
// ========================================
const GET_SOURCES = gql`
  query getSources {
    getSources {
      name
      nbAlbums
      nbPhotos
      preview
    }
  }
`;

const Homepage: NextPage<Props, InitialProps> = () => {
  const { loading, data } = useQuery<GetSourcesQuery, GetSourcesQueryVariables>(
    GET_SOURCES
  );

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor="white" padding={gutter}>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Gallery
          </Typography>
        </Box>
        <Box paddingBottom={gutter}>
          <AlbumGrid extraHeight={100}>
            {data?.getSources.map(
              (source): ReactElement | null =>
                source && (
                  <AlbumGridListTile key={source.name}>
                    <AlbumCard
                      name={source.name}
                      dir="."
                      source={source.name}
                      nbPhotos={source.nbPhotos}
                      nbAlbums={source.nbAlbums}
                      preview={source.preview}
                    />
                  </AlbumGridListTile>
                )
            )}
          </AlbumGrid>
        </Box>
      </Box>
    </Layout>
  );
};

Homepage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(Homepage);
