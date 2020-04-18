import {
  Column,
  Entity,
  getConnection,
  ManyToOne,
  Not,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { resolve } from "path";
import { statSync } from "fs";
import { appError, parentDir, appDebug } from "@howdypix/utils";
import { Photo, Photo as EntityPhoto } from "./Photo";
import { Source } from "./Source";

@Entity()
@Unique(["dir", "parentDir", "sourceLk"])
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  inode: string;

  @Column("text")
  dir: string;

  // TODO to remove
  @Column("text")
  source: string;

  @Column("text")
  parentDir: string;

  @OneToMany(() => Photo, (photo) => photo.album)
  public photos!: Photo[];

  @ManyToOne(() => Source, (source) => source.albums)
  public sourceLk!: Source;

  async getNbPhotos(): Promise<number> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    return photoRepository.count({
      where: { source: this.source, dir: this.dir },
    });
  }

  async getNbAlbums(): Promise<number> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    return photoRepository.count({
      where: { source: this.source, parentDir: this.dir },
    });
  }

  async getPreview(): Promise<string | null> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    const data: { preview: string } | null = await photoRepository
      .createQueryBuilder()
      .select("file", "preview")
      .where({
        source: this.source,
        dir: this.dir,
        file: Not(""),
      })
      .getRawOne();

    // TODO change for undefined picture
    return data?.preview ?? null;
  }

  static async fetchOne(source: string, dir = ""): Promise<Album | null> {
    const albumRepository = getConnection().getRepository(Album);
    const where = {
      dir,
      source,
      parentDir: parentDir(dir),
    };

    return (await albumRepository.findOne(where)) ?? null;
  }

  static async insertIfDoesntExist(
    source: Source | string,
    dir: string
  ): Promise<Album | null> {
    try {
      let sourceDB: Source | null;

      if (typeof source === "string") {
        sourceDB = await Source.fetchOne(source);

        if (!sourceDB) {
          appError("album")(
            `Impossible to save the album: the source ${source} does not exist in the databasel.`
          );

          return null;
        }
      } else {
        sourceDB = source;
      }

      const album = await Album.fetchOne(sourceDB.source, dir);

      if (!album) {
        const stat = statSync(resolve(sourceDB.dir, dir));

        const newAlbum = new Album();
        newAlbum.inode = stat.ino.toString();
        newAlbum.source = sourceDB.source;
        newAlbum.parentDir = parentDir(dir);
        newAlbum.dir = dir;
        newAlbum.sourceLk = sourceDB;
        await getConnection().getRepository(Album).save(newAlbum);

        appDebug("album")(`New album "${newAlbum.dir}" saved.`);

        return newAlbum;
      }

      return album;
    } catch (e) {
      appError("Album")(`Impossible to fetch the information of ${dir}: ${e}`);
      return null;
    }
  }
}
