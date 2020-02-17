import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import { Connection } from "typeorm";
import { appDebug } from "@howdypix/utils";
import { ApolloContext } from "../../types.d";
import { Album as EntityAlbum } from "../../entity/Album";
import { Source as EntitySource } from "../../entity/Source";

const debug = appDebug("gql");

const fetchAlbums = async (
  connection: Connection,
  dir: string,
  source: string
): Promise<NexusGenRootTypes["GetTreeAlbums"][]> => {
  const ret: NexusGenRootTypes["GetTreeAlbums"][] = [];

  const albumRepository = connection.getRepository(EntityAlbum);

  // Fetch the album information
  const album = await albumRepository.findOne({
    where: {
      dir,
      source
    }
  });

  if (album) {
    ret.push({
      dir: album.dir,
      parentDir: album.parentDir,
      source: album.source
    });

    if (album.parentDir) {
      ret.push(
        ...(await fetchAlbums(connection, album.parentDir, source)).filter(
          a => a.dir !== album.dir
        )
      );
    } else {
      // Fetch from the source
      ret.push(
        ...(
          await albumRepository.find({
            where: {
              parentDir: "",
              source
            }
          })
        ).map(a => ({
          dir: a.dir,
          parentDir: a.parentDir,
          source: a.source
        }))
      );
    }

    // Fetch any Children information
    const children = await albumRepository.find({
      where: {
        parentDir: dir,
        source
      }
    });

    children.forEach((c): void => {
      ret.push({
        dir: c.dir,
        parentDir: c.parentDir,
        source: c.source
      });
    });
  }

  return ret;
};

const fetchSources = async (
  connection: Connection
): Promise<NexusGenRootTypes["GetTreeSources"][]> => {
  const sourceRepository = connection.getRepository(EntitySource);

  return (await sourceRepository.find()).map(source => ({
    name: source.source
  }));
};

export const getTreeResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getTree"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getTree"]> => {
  debug(`Fetching tree for the album ${args.album}.`);

  return {
    albums: await fetchAlbums(ctx.connection, args.album, args.source),
    sources: await fetchSources(ctx.connection)
  };
};
