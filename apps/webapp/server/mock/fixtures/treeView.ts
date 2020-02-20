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
            dir: "Album1",
            parentDir: "",
            nbAlbums: 1,
            nbImages: 1,
            source: "source1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          },
          {
            dir: "Album2",
            parentDir: "",
            nbAlbums: 0,
            nbImages: 2,
            source: "source1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          }
        ]
      );
    } else if (params.album === "Album1") {
      albums.push(
        ...[
          {
            dir: "Album3",
            parentDir: "Album1",
            nbAlbums: 2,
            nbImages: 3,
            source: "source1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          },
          {
            dir: "Album4",
            parentDir: "Album1",
            nbAlbums: 0,
            nbImages: 4,
            source: "source1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          }
        ]
      );
    } else if (params.album === "Album3") {
      albums.push(
        ...[
          {
            dir: "Album5",
            parentDir: "Album3",
            nbAlbums: 0,
            nbImages: 5,
            source: "source1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          },
          {
            dir: "Album6",
            parentDir: "Album3",
            nbAlbums: 0,
            nbImages: 6,
            source: "source1",
            preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
          }
        ]
      );
    }

    return {
      albums,
      sources: [
        {
          name: "source1",
          nbAlbums: 1,
          nbImages: 1,
          preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        },
        {
          name: "source2",
          nbAlbums: 0,
          nbImages: 2,
          preview: `${serverRuntimeConfig.baseUrl}/static-tests/albert.jpg`
        },
        {
          name: "source3",
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
