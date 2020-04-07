import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  Unique,
} from "typeorm";
import { SearchResult } from "./SearchResult";
import { Album } from "./Album";

@Entity()
@Unique(["album", "file"])
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  status: number;

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

  @Column("text")
  make: string;

  @Column("text")
  model: string;

  @Column("int")
  ISO: number;

  @Column("int")
  shutter: number;

  @Column("int")
  processedShutter: number;

  @Column("int")
  aperture: number;

  @Column("int")
  processedAperture: number;

  @Column("int")
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

  @ManyToOne(() => Album, (album) => album.photos, { nullable: true })
  public album!: Album | null;

  @Column("text")
  file: string;

  @OneToMany(() => SearchResult, (searchResult) => searchResult.photo)
  public searchResults!: SearchResult[];
}
