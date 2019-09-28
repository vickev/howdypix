import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
