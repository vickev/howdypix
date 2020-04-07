import {
  Column,
  Entity,
  getConnection,
  Not,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Photo as EntityPhoto } from "./Photo";
import { Album } from "./Album";

@Entity()
@Unique(["source"])
export class Source {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  source: string;

  @Column("text")
  dir: string;

  @OneToMany(() => Album, (album) => album.sourceLk)
  public albums!: Album[];

  async getNbPhotos(): Promise<number> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    const { count } = await photoRepository
      .createQueryBuilder()
      .select("COUNT(distinct file)", "count")
      .where({
        source: this.source,
        dir: "",
        file: Not(""),
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
        dir: Not(""),
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
        file: Not(""),
      })
      .getRawOne();

    // TODO change for undefined picture
    return data?.preview || "TOTO.JPG";
  }

  static async upsert(sourceName: string, dir: string): Promise<void> {
    const sourceRepository = getConnection().getRepository(Source);
    const sourceToUpdate = await sourceRepository.findOne({
      source: sourceName,
    });

    if (sourceToUpdate) {
      // Update the value
      sourceToUpdate.dir = dir;
      await sourceRepository.save(sourceToUpdate);
    } else {
      const source = new Source();
      source.source = sourceName;
      source.dir = dir;
      await sourceRepository.save(source);
    }
  }
}
