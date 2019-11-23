import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FolderIcon from "@material-ui/icons/Folder";
import { hjoin } from "@howdypix/utils";
import { NextPage } from "next";
import Link from "next/link";

import { withApollo } from "../src/lib/with-apollo-client";
import { Layout } from "../src/module/layout/Layout";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

// ========================================
// Constants
// ========================================
const gutter = 3;
// TODO: create graphql query..
const rootDir = ["main", "second"];

const Homepage: NextPage<Props, InitialProps> = () => {
  const theme = useTheme();

  return (
    <Layout>
      <Box bgcolor="white" padding={gutter}>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1">
            Repository
          </Typography>
        </Box>
        <Box paddingBottom={gutter}>
          {rootDir.map(dir => (
            <Box paddingRight={gutter} component="span" key={dir}>
              <Link href="/album/[id]" as={`/album/${hjoin({ source: dir })}`}>
                <Button size="medium" variant="outlined">
                  <FolderIcon style={{ marginRight: theme.spacing(1) }} />
                  {dir}
                </Button>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

Homepage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(Homepage);
