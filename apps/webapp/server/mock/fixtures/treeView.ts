import { FixtureSet, Query, Mutation } from "../types.d";
import full from "./full";
import { serverRuntimeConfig } from "../../../next.config";

const newQuery: Query = {
  ...full.query,
  getTree: (_, params) => {
    const albums = [];

    if (params.album === "") {
      albums.push(
        ...[
          {
            dir: "TreeAlbum1",
            parentDir: "",
            nbAlbums: 1,
            nbImages: 1,
            source: "treesource1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          },
          {
            dir: "TreeAlbum2",
            parentDir: "",
            nbAlbums: 0,
            nbImages: 2,
            source: "treesource1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          }
        ]
      );
    } else if (params.album === "TreeAlbum1") {
      albums.push(
        ...[
          {
            dir: "TreeAlbum3",
            parentDir: "TreeAlbum1",
            nbAlbums: 2,
            nbImages: 3,
            source: "treesource1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          },
          {
            dir: "TreeAlbum4",
            parentDir: "TreeAlbum1",
            nbAlbums: 0,
            nbImages: 4,
            source: "treesource1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          }
        ]
      );
    } else if (params.album === "TreeAlbum3") {
      albums.push(
        ...[
          {
            dir: "TreeAlbum5",
            parentDir: "TreeAlbum3",
            nbAlbums: 0,
            nbImages: 5,
            source: "treesource1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          },
          {
            dir: "TreeAlbum6",
            parentDir: "TreeAlbum3",
            nbAlbums: 0,
            nbImages: 6,
            source: "treesource1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          }
        ]
      );
    }

    return {
      albums,
      sources: [
        {
          name: "treesource1",
          nbAlbums: 1,
          nbImages: 1,
          preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        },
        {
          name: "treesource2",
          nbAlbums: 0,
          nbImages: 2,
          preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        },
        {
          name: "treesource3",
          nbAlbums: 0,
          nbImages: 3,
          preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        }
      ]
    };
  }
};

const newMutation: Mutation = {
  ...full.mutation
};

export default { query: newQuery, mutation: newMutation } as FixtureSet;
