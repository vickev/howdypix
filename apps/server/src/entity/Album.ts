import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  sourceId: string;

  @Column("text")
  path: string;

  @OneToMany(type => Photo, photo => photo.album)
  photos: Photo[];

  @OneToMany(type => Album, album => album.id)
  children: Album[];

  @ManyToOne(type => Album, album => album.children)
  parent: Album;
}
