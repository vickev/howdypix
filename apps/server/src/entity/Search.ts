import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { SearchResult } from "./SearchResult";

@Entity()
export class Search {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", nullable: true })
  orderBy: string;

  @Column({ type: "text", nullable: true })
  filterBy: string;

  @Column({ type: "text", nullable: true })
  album: string;

  @Column({ type: "text", nullable: true })
  source: string;

  @OneToMany(
    () => SearchResult,
    searchResult => searchResult.search
  )
  public searchResults!: SearchResult[];
}
