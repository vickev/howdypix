import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToOne
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class Thumbnail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  path: string;

  @Column("text")
  dataSourceName: string;

  @Column("int")
  width: number;

  @Column("int")
  height: number;

  // @ManyToOne(type => Photo, photo => photo.thumbnails)
  // photo: Photo;
}
