import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Search } from "./Search";
import { Photo } from "./Photo";

@Entity()
export class SearchResult {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column("int")
  searchId!: number;

  @Column("int")
  photoId!: number;

  @Column("int")
  public order!: number;

  @ManyToOne(() => Search, (search) => search.searchResults)
  public search!: Search;

  @ManyToOne(() => Photo, (photo) => photo.searchResults)
  public photo!: Photo;
}
