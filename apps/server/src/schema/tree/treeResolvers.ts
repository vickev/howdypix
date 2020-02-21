import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes
} from "@howdypix/graphql-schema/schema.d";
import { Connection, Not } from "typeorm";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { ApolloContext } from "../../types.d";
import { Album as EntityAlbum } from "../../entity/Album";
import { Source as EntitySource } from "../../entity/Source";
import { appConfig } from "../../config";

const debug = appDebug("gql");

const generatePreviewUrl = (album: EntityAlbum | EntitySource): string =>
  generateThumbnailUrls(appConfig.api.baseUrl, {
    file: album.preview,
    dir: album.dir,
    source: album.source
  }).map(tn => tn.url)[0];

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
    if (album.dir !== "") {
      ret.push({
        dir: album.dir,
        parentDir: album.parentDir,
        source: album.source,
        preview: generatePreviewUrl(album),
        nbImages: album.nbPhotos,
        nbAlbums: album.nbAlbums
      });
    }

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
              dir: Not(""),
              parentDir: "",
              source
            }
          })
        ).map(a => ({
          dir: a.dir,
          parentDir: a.parentDir,
          source: a.source,
          preview: generatePreviewUrl(a),
          nbImages: a.nbPhotos,
          nbAlbums: a.nbAlbums
        }))
      );
    }

    // Fetch any Children information
    const children = await albumRepository.find({
      where: {
        dir: Not(""),
        parentDir: dir,
        source
      }
    });

    children.forEach((c): void => {
      ret.push({
        dir: c.dir,
        parentDir: c.parentDir,
        source: c.source,
        preview: generatePreviewUrl(c),
        nbImages: c.nbPhotos,
        nbAlbums: c.nbAlbums
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
    name: source.source,
    preview: generatePreviewUrl(source),
    nbImages: source.nbPhotos,
    nbAlbums: source.nbAlbums
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
