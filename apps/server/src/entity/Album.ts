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

  @ManyToOne(() => Source, (source) => source.albums, { nullable: true })
  public sourceLk!: Source | null;

  async getNbPhotos(): Promise<number> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    const { count } = await photoRepository
      .createQueryBuilder()
      .select("COUNT(distinct id)", "count")
      .where({
        source: this.source,
        dir: this.dir,
      })
      .getRawOne();

    return count;
  }

  async getNbAlbums(): Promise<number> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    const { count } = await photoRepository
      .createQueryBuilder()
      .select("COUNT(distinct dir)", "count")
      .where({
        source: this.source,
        parentDir: this.dir,
      })
      .getRawOne();

    return count;
  }

  async getPreview(): Promise<string> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    const data = await photoRepository
      .createQueryBuilder()
      .select("file", "preview")
      .where({
        source: this.source,
        dir: this.dir,
        file: Not(""),
      })
      .getRawOne();

    // TODO change for undefined picture
    return data?.preview || "TOTO.JPG";
  }
}
