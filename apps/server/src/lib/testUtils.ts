import {
  Source,
  Album,
  Photo,
  PHOTO_STATUS,
  SearchResult,
  Search,
} from "../datastore/database/entity";

export const generateSource = (
  id: number,
  overrides: Partial<Source> = {}
): Source => {
  const source = new Source();

  source.id = id;
  source.source = `source${id}`;
  source.dir = `sourceDir${id}`;

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    source[key] = overrides[key];
  });

  return source;
};

export const generateAlbum = (
  id: number,
  source: Source,
  overrides: Partial<Album> = {}
): Album => {
  const album = new Album();

  album.id = id;
  album.inode = `albumInode${id}`;
  album.dir = `albumDir${id}`;
  album.parentDir = `albumParentDir${id}`;
  album.sourceLk = source;
  album.source = source.source;

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    album[key] = overrides[key];
  });

  return album;
};

export const generatePhoto = (
  id: number,
  album: Album | null = null,
  overrides: Partial<Photo> = {}
): Photo => {
  const photo = new Photo();

  photo.id = id;
  photo.inode = parseInt(`10000${id}`, 0);
  photo.file = `File${id}`;
  photo.dir = album?.dir ?? "";
  photo.parentDir = album?.parentDir ?? "";
  if (album) {
    photo.album = album;
  }
  photo.source = album?.source ?? "";
  photo.status = PHOTO_STATUS.PROCESSED;
  photo.aperture = parseInt(`1111${id}`, 0);
  photo.ISO = parseInt(`2222${id}`, 0);
  photo.shutter = parseInt(`3333${id}`, 0);
  photo.size = parseInt(`4444${id}`, 0);
  photo.birthtime = new Date(parseInt(`00${id}`, 0)).getMilliseconds();
  photo.ctime = new Date(parseInt(`11${id}`, 0)).getMilliseconds();
  photo.mtime = new Date(parseInt(`22${id}`, 0)).getMilliseconds();
  photo.createDate = new Date(parseInt(`33${id}`, 0)).getMilliseconds();
  photo.make = `make${id}`;
  photo.model = `model${id}`;

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    photo[key] = overrides[key];
  });

  return photo;
};

const searchResultsIncrements: { [key: string]: number } = {};
export const generateSearchResult = (
  id: number,
  search: Search,
  photo: Photo,
  overrides: Partial<Photo> = {}
): SearchResult => {
  searchResultsIncrements[`${search.id}:${photo.id}`] =
    (searchResultsIncrements[`${search.id}:${photo.id}`] ?? 0) + 1;

  const searchResult = new SearchResult();

  searchResult.id = id;
  searchResult.search = search;
  searchResult.searchId = search.id;
  searchResult.photo = photo;
  searchResult.photoId = photo.id;
  searchResult.order = searchResultsIncrements[`${search.id}:${photo.id}`];

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    searchResult[key] = overrides[key];
  });

  return searchResult;
};

export const generateSearch = (
  id: number,
  photos: Photo[] = [],
  overrides: Partial<Photo> = {}
): Search => {
  const search = new Search();

  search.id = id;
  search.album = `album${id}`;
  search.source = `source${id}`;
  search.orderBy = `orderBy${id}`;
  search.filterBy = `filterBy${id}`;

  search.searchResults = photos.map((photo) =>
    generateSearchResult(parseInt(`${id}${photo.id}`, 0), search, photo)
  );

  Object.keys(overrides).forEach((key) => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    search[key] = overrides[key];
  });

  return search;
};

export const mockDate = (): { restore: () => void } => {
  const RealDate = Date;

  // @ts-ignore
  global.Date = class extends RealDate {
    constructor() {
      super();
      return new RealDate("2016");
    }
  };

  return {
    restore: (): void => {
      global.Date = RealDate;
    },
  };
};
