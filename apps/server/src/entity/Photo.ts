import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { Thumbnail } from "./Thumbnail";
import { createThumbnails } from "@howdypix/app-worker/src/libs/process";

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
  root: string;

  @Column("text")
  path: string;

  @Column("text")
  sourceId: string;

  // @OneToMany(type => Thumbnail, tn => tn.photo)
  // thumbnails: Thumbnail[];
}
