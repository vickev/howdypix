import { Column, ViewEntity } from "typeorm";

@ViewEntity({
  expression: `
SELECT
   P.DIR,
   P.SOURCE,
   P.PARENTDIR,
   COUNT(DISTINCT P2.ID) AS NBPHOTOS,
   COUNT(DISTINCT P3.DIR) AS NBALBUMS,
   (
      SELECT
         FILE 
      FROM
         PHOTO P4 
      WHERE
         P4.DIR = P.DIR 
         AND P4.SOURCE = P.SOURCE LIMIT 0,
         1
   )
   AS PREVIEW 
FROM
   PHOTO P 
   LEFT JOIN
      PHOTO P2 
      ON (P2.DIR = P.DIR 
      AND P2.SOURCE = P.SOURCE) 
   LEFT JOIN
      PHOTO P3 
      ON (P3.PARENTDIR = P.DIR 
      AND P3.SOURCE = P.SOURCE) 
GROUP BY
   P.DIR,
   P.SOURCE,
   P.PARENTDIR;
    `,
})
export class Album {
  @Column("text")
  dir: string;

  @Column("text")
  source: string;

  @Column("text")
  parentDir: string;

  @Column("text")
  preview: string;

  @Column("int")
  nbPhotos: number;

  @Column("int")
  nbAlbums: number;
}
