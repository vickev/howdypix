import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  make: string;

  @Column("text")
  model: string;

  @Column("text")
  file: string;
}
