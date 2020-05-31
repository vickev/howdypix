import { reducer, State } from "../reducer";

describe.skip("state reducer", () => {
  const baseState: State = {
    searches: {},
    searchAlbumRelation: [],
    albums: {
      0: {
        lastUpdatedPhoto: new Date(1),
      },
    },
  };

  it("should update the lastUpdatedPhoto if a more recent photo is saved", () => {
    expect(
      reducer(baseState, {
        type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO",
        albumId: 0,
        data: {
          lastUpdatedPhoto: new Date(2),
        },
      })
    ).toMatchSnapshot();
  });

  it("should NOT update the lastUpdatedPhoto if a LESS recent photo is saved", () => {
    expect(
      reducer(baseState, {
        type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO",
        albumId: 0,
        data: {
          lastUpdatedPhoto: new Date(0),
        },
      })
    ).toMatchSnapshot();
  });

  it("should update if the album lastUpdatedPhoto is null", () => {
    expect(
      reducer(
        { ...baseState, albums: { 0: { lastUpdatedPhoto: null } } },
        {
          type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO",
          albumId: 0,
          data: {
            lastUpdatedPhoto: new Date(0),
          },
        }
      )
    ).toMatchSnapshot();
  });

  it("should not do anything if the album doesn't exist in the state", () => {
    expect(
      reducer(baseState, {
        type: "UPDATE_ALBUM_LAST_UPDATED_PHOTO",
        albumId: 99999,
        data: {
          lastUpdatedPhoto: new Date(0),
        },
      })
    ).toMatchSnapshot();
  });
});
