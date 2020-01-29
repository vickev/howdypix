import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SearchResult } from "./SearchResult";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

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
  createDate: number;

  @Column("text")
  source: string;

  @Column("text")
  parentDir: string;

  @Column("text")
  dir: string;

  @Column("text")
  file: string;

  @OneToMany(
    () => SearchResult,
    searchResult => searchResult.photo
  )
  public searchResults!: SearchResult[];
}
