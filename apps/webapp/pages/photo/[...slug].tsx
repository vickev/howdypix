import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MUILink from "@material-ui/core/Link";
import Link from "next/link";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { hjoin, hparse, hpaths } from "@howdypix/utils";
import { HFile } from "@howdypix/shared-types";
import { styled } from "@material-ui/styles";

import { useRouter } from "next/router";
import { NextPage } from "next";

import { withApollo } from "../../src/lib/with-apollo-client";
import {
  GetPhotoQuery,
  GetPhotoQueryVariables
} from "../../src/__generated__/schema-types";
import { Layout } from "../../src/module/layout/Layout";

type Props = {};
type InitialProps = { namespacesRequired: string[] };

// ========================================
// Constants
// ========================================
const gutter = 3;

const Image = styled("img")(() => ({
  width: "100%"
}));

// ========================================
// GraphQL queries
// ========================================
const GET_PHOTO = gql`
  query GetPhoto($source: String!, $album: String!, $file: String!) {
    getPhoto(source: $source, album: $album, file: $file) {
      files
    }
  }
`;

const PhotoPage: NextPage<Props, InitialProps> = () => {
  const router = useRouter();

  const hpath = (router.query.slug as string[]).join("/");
  const folder: HFile = hparse(hpath);

  const breadcrumbs: HFile[] = hpaths(folder);

  if (!folder.file) {
    return <div>Error</div>;
  }

  // @TODO: Must consider the error case
  const { loading, data } = useQuery<GetPhotoQuery, GetPhotoQueryVariables>(
    GET_PHOTO,
    {
      variables: {
        source: folder.source,
        album: folder.dir === "." ? "" : folder.dir ?? "",
        file: folder.file
      }
    }
  );

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <Box bgcolor="white" padding={gutter}>
        <Box paddingBottom={gutter} id="BreadcrumbBox">
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" key="repo">
              <MUILink href="">Repository</MUILink>
            </Link>
            {breadcrumbs.map((bread: HFile) => (
              <Link
                href="/album/[id]"
                as={`/album/${hjoin(bread)}`}
                key={bread.dir}
              >
                <MUILink href="">{bread.name}</MUILink>
              </Link>
            ))}
          </Breadcrumbs>
        </Box>
        <Box paddingBottom={gutter}>
          <Typography variant="h3" component="h1" />
        </Box>
        <Box py={gutter} id="pictureBox">
          <Image
            data-testid="picture-detail"
            src={data?.getPhoto?.files[2] ?? ""}
          />
        </Box>
      </Box>
    </Layout>
  );
};

PhotoPage.getInitialProps = async (): Promise<InitialProps> => ({
  namespacesRequired: ["common"]
});

export default withApollo(PhotoPage);
