import {
  NexusGenArgTypes,
  NexusGenFieldTypes,
  NexusGenRootTypes,
} from "@howdypix/graphql-schema/schema";
import { Connection, Not } from "typeorm";
import { appDebug, generateThumbnailUrls } from "@howdypix/utils";
import { ApolloContext } from "../../../../types";
import { Album as EntityAlbum } from "../../../../datastore/database/entity/Album";
import { Source as EntitySource } from "../../../../datastore/database/entity/Source";
import { appConfig } from "../../../../lib/config";

const debug = appDebug("gql");

const generatePreviewUrl = async (
  album: EntityAlbum | EntitySource
): Promise<string | null> => {
  const preview = await album.getPreview();

  return preview
    ? generateThumbnailUrls(appConfig.webapp.baseUrl, {
        file: typeof preview === "string" ? preview : preview.file,
        dir: typeof preview === "string" ? album.dir : preview.dir,
        source: album.source,
      })[0].url
    : null;
};

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
      source,
    },
  });

  if (album) {
    if (album.dir !== "") {
      ret.push({
        dir: album.dir,
        parentDir: album.parentDir,
        source: album.source,
        preview: await generatePreviewUrl(album),
        nbImages: await album.getNbPhotos(),
        nbAlbums: await album.getNbAlbums(),
      });
    }

    if (album.parentDir) {
      ret.push(
        ...(await fetchAlbums(connection, album.parentDir, source)).filter(
          (a) => a.dir !== album.dir
        )
      );
    } else {
      // Fetch from the source
      ret.push(
        ...(await Promise.all(
          (
            await albumRepository.find({
              where: {
                dir: Not(""),
                parentDir: "",
                source,
              },
            })
          ).map(async (a) => ({
            dir: a.dir,
            parentDir: a.parentDir,
            source: a.source,
            preview: await generatePreviewUrl(a),
            nbImages: await a.getNbPhotos(),
            nbAlbums: await a.getNbAlbums(),
          }))
        ))
      );
    }

    // Fetch any Children information
    const children = await albumRepository.find({
      where: {
        dir: Not(""),
        parentDir: dir,
        source,
      },
    });

    children.forEach(
      async (c): Promise<void> => {
        ret.push({
          dir: c.dir,
          parentDir: c.parentDir,
          source: c.source,
          preview: await generatePreviewUrl(c),
          nbImages: await c.getNbPhotos(),
          nbAlbums: await c.getNbAlbums(),
        });
      }
    );
  }

  return ret;
};

const fetchSources = async (
  connection: Connection
): Promise<NexusGenRootTypes["GetTreeSources"][]> => {
  const sourceRepository = connection.getRepository(EntitySource);

  return Promise.all(
    (await sourceRepository.find()).map(async (source) => ({
      name: source.source,
      preview: await generatePreviewUrl(source),
      nbImages: await source.getNbPhotos(),
      nbAlbums: await source.getNbAlbums(),
    }))
  );
};

export const getTreeResolver = () => async (
  root: {},
  args: NexusGenArgTypes["Query"]["getTree"],
  ctx: ApolloContext
): Promise<NexusGenFieldTypes["Query"]["getTree"]> => {
  debug(`Fetching tree for the album ${args.album}.`);

  return {
    albums: await fetchAlbums(ctx.connection, args.album, args.source),
    sources: await fetchSources(ctx.connection),
  };
};
