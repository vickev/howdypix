import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withApollo } from "../src/lib/with-apollo-client";

const GET_GREETING = gql`
  query GetAlbum {
    getAlbum(parent: 0) {
      photos {
        thumbnails
      }
      albums {
        id
        name
      }
    }
  }
`;

function Hello() {
  const { loading, error, data } = useQuery(GET_GREETING);
  if (loading) return <p>Loading ...</p>;
  console.log(data);
  return <h1>Hello {data.getAlbum.albums[0].name}!</h1>;
}

export default withApollo(Hello);
