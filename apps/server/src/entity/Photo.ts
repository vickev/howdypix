import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { SearchResult } from "./SearchResult";
import { Album } from "./Album";

export enum PHOTO_STATUS {
  NOT_PROCESSED = "not_processed",
  PROCESSED = "processed",
}

@Entity()
@Unique(["album", "file"])
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  status: PHOTO_STATUS;

  @Column("int")
  inode: number;

  @Column("int")
  mtime: number;

  @Column("int")
  ctime: number;

  @Column("int")
  birthtime: number;

  @Column("int")
  size: number;

  @Column("text", { nullable: true })
  make: string;

  @Column("text", { nullable: true })
  model: string;

  @Column("int", { nullable: true })
  ISO: number;

  @Column("int", { nullable: true })
  shutter: number;

  @Column("int", { nullable: true })
  processedShutter: number;

  @Column("int", { nullable: true })
  aperture: number;

  @Column("int", { nullable: true })
  processedAperture: number;

  @Column("int", { nullable: true })
  createDate: number;

  // TODO to remove
  @Column("text")
  source: string;

  // TODO to remove
  @Column("text")
  parentDir: string;

  // TODO to remove
  @Column("text")
  dir: string;

  @ManyToOne(() => Album, (album) => album.photos)
  public album!: Album;

  @Column("text")
  file: string;

  @OneToMany(() => SearchResult, (searchResult) => searchResult.photo)
  public searchResults!: SearchResult[];
}
