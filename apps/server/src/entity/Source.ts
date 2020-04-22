import {
  Column,
  Entity,
  getConnection,
  Not,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { appWarning } from "@howdypix/utils";
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

    const { count }: { count: number } = await photoRepository
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

    const { count }: { count: number } = await photoRepository
      .createQueryBuilder()
      .select("COUNT(distinct dir)", "count")
      .where({
        source: this.source,
        dir: Not(""),
      })
      .getRawOne();

    return count;
  }

  async getPreview(): Promise<{ dir: string; file: string } | null> {
    const photoRepository = getConnection().getRepository(EntityPhoto);

    const data: {
      file: EntityPhoto["file"];
      dir: EntityPhoto["dir"];
    } | null = await photoRepository
      .createQueryBuilder()
      .select("file, dir")
      .where({
        source: this.source,
        file: Not(""),
      })
      .getRawOne();

    return data ?? null;
  }

  static async upsert(sourceName: string, dir: string): Promise<Source> {
    const sourceRepository = getConnection().getRepository(Source);
    const sourceToUpdate = await sourceRepository.findOne({
      source: sourceName,
    });

    if (sourceToUpdate) {
      // Update the value
      sourceToUpdate.dir = dir;
      await sourceRepository.save(sourceToUpdate);
      return sourceToUpdate;
    }

    const source = new Source();
    source.source = sourceName;
    source.dir = dir;
    await sourceRepository.save(source);
    return source;
  }

  static async fetchOne(name: string): Promise<Source | null> {
    const sourceRepository = getConnection().getRepository(Source);
    const where = {
      source: name,
    };

    const data = await sourceRepository.findOne(where);

    if (!data) {
      appWarning("source")(
        `The source ${JSON.stringify(where)} does not exist.`
      );
    }

    return data ?? null;
  }
}
