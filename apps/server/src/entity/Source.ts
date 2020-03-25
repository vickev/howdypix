import { Column, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `
SELECT
   p.source,
   COUNT(DISTINCT p2.file) AS nbPhotos,
   COUNT(DISTINCT p3.dir) AS nbAlbums,
   p.dir,
   p.file AS preview
FROM
   photo p 
   LEFT JOIN
      photo p2 
      ON (p.source = p2.source 
      AND p2.dir = "" 
      AND p2.file != "") 
   LEFT JOIN
      photo p3 
      ON (p.source = p3.source 
      AND p3.dir != "") 
GROUP BY
   p.source`,
})
export class Source {
  @Column("text")
  source: string;

  @Column("text")
  dir: string;

  @Column("text")
  preview: string;

  @Column("int")
  nbPhotos: number;

  @Column("int")
  nbAlbums: number;
}
