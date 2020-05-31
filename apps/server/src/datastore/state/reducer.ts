import { Reducer } from "redux";

export type State = {};

export type Action = {
  type: string;
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
    default:
      return state;
  }
};
