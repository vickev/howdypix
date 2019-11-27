import React, { ReactElement } from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";
import { hjoin } from "@howdypix/utils";
import { NextPage } from "next";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { withApollo } from "../src/lib/with-apollo-client";
import { Layout } from "../src/module/layout/Layout";
import {
  GetSourcesQuery,
  GetSourcesQueryVariables
} from "../src/__generated__/schema-types";

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
    }
  }
`;

const Homepage: NextPage<Props, InitialProps> = () => {
  const theme = useTheme();
  const { loading, data } = useQuery<GetSourcesQuery, GetSourcesQueryVariables>(
    GET_SOURCES
  );

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor="white" padding={gutter}>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Repository
          </Typography>
        </Box>
        <Box paddingBottom={gutter}>
          {data?.getSources.map(
            (source): ReactElement | null =>
              source && (
                <Box paddingRight={gutter} component="span" key={source.name}>
                  <Link
                    href="/album/[id]"
                    as={`/album/${hjoin({ source: source.name })}`}
                  >
                    <Button size="medium" variant="outlined">
                      <FolderIcon style={{ marginRight: theme.spacing(1) }} />
                      {source.name}
                    </Button>
                  </Link>
                </Box>
              )
          )}
        </Box>
      </Box>
    </Layout>
  );
};

Homepage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(Homepage);
