import { NextRouter } from "next/router";

export const toAlbum = (
  router: NextRouter,
  source: string,
  album?: string | null
): void => {
  router.push("/album/[...slug]", {
    pathname: `/album/@${source}:${album ?? "."}`
  });
};
