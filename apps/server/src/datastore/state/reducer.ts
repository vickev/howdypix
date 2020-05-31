import { Reducer } from "redux";
import { uniqWith, isEqual } from "lodash";

type StateSearch = {
  lastUpdatedPhoto: Date | null;
  album: string;
  source: string;
};

type StateAlbum = {
  lastUpdatedPhoto: Date | null;
};

type StateSearchAlbumRelation = {
  searchId: number;
  albumId: number;
};

export type State = {
  searches: {
    [id: number]: StateSearch;
  };
  albums: {
    [id: number]: StateAlbum;
  };
  searchAlbumRelation: StateSearchAlbumRelation[];
};

export type Action =
  | {
      type: "RESET_STORE";
      data: State;
    }
  | {
      type: "UPDATE_SEARCH_LAST_UPDATED_PHOTO";
      searchId: number;
      data: {
        lastUpdatedPhoto: Date;
      };
    }
  | {
      type: "STORE_NEW_SEARCH";
      searchId: number;
      data: StateSearch;
    }
  | {
      type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO";
      albumId: number;
      data: {
        lastUpdatedPhoto: Date;
      };
    }
  | {
      type: "STORE_NEW_ALBUM";
      albumId: number;
      data: StateAlbum;
    }
  | {
      type: "STORE_NEW_SEARCH_ALBUM_RELATION";
      albumId: number;
      searchId: number;
    };

// ========================================================================
// Reducer
// ========================================================================
export const reducer: Reducer<State, Action> = (
  state = { searches: {}, albums: {}, searchAlbumRelation: [] },
  action
) => {
  // console.log(action);
  switch (action.type) {
    case "RESET_STORE":
      return action.data;

    case "UPDATE_SEARCH_LAST_UPDATED_PHOTO": {
      const lastUpdatedPhoto =
        state.searches[action.searchId]?.lastUpdatedPhoto;

      if (
        (lastUpdatedPhoto && action.data.lastUpdatedPhoto > lastUpdatedPhoto) ||
        lastUpdatedPhoto === null
      ) {
        return {
          ...state,
          searches: {
            ...state.searches,
            [action.searchId]: {
              ...state.searches[action.searchId],
              lastUpdatedPhoto: new Date(action.data.lastUpdatedPhoto),
            },
          },
        };
      }

      return state;
    }

    case "UPDATE_ALBUM_LAST_UPDATED_PHOTO": {
      const lastUpdatedPhoto = state.albums[action.albumId]?.lastUpdatedPhoto;

      if (
        (lastUpdatedPhoto && action.data.lastUpdatedPhoto > lastUpdatedPhoto) ||
        lastUpdatedPhoto === null
      ) {
        return {
          ...state,
          albums: {
            ...state.albums,
            [action.albumId]: {
              lastUpdatedPhoto: new Date(action.data.lastUpdatedPhoto),
            },
          },
        };
      }

      return state;
    }

    case "STORE_NEW_ALBUM":
      return {
        ...state,
        albums: {
          ...state.albums,
          [action.albumId]: {
            ...action.data,
            lastUpdatedPhoto: action.data.lastUpdatedPhoto
              ? new Date(action.data.lastUpdatedPhoto)
              : null,
          },
        },
      };

    case "STORE_NEW_SEARCH":
      return {
        ...state,
        searches: {
          ...state.searches,
          [action.searchId]: {
            ...action.data,
            lastUpdatedPhoto: action.data.lastUpdatedPhoto
              ? new Date(action.data.lastUpdatedPhoto)
              : null,
          },
        },
        searchAlbumRelation: uniqWith(
          [
            ...state.searchAlbumRelation,
            {
              searchId: action.searchId,
              albumId: action.data.album,
            },
          ],
          isEqual
        ),
      };

    case "STORE_NEW_SEARCH_ALBUM_RELATION":
      return {
        ...state,
        searchAlbumRelation: [
          ...state.searchAlbumRelation,
          ...(state.searchAlbumRelation.find(
            (relation) =>
              relation.albumId === action.albumId &&
              relation.searchId === action.searchId
          )
            ? [{ albumId: action.albumId, searchId: action.searchId }]
            : []),
        ],
      };

    default:
      return state;
  }
};
