import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorite: [],
  },

  reducers: {
    viewFavorite(state, action) {
      state.favorite = action.payload;
    },
    addFavorite(state, action) {
      state.favorite.push(action.payload);
    },
    removeFavorite(state, action) {
      state.favorite = state.favorite.filter(
        (fav) => String(fav.service._id) !== String(action.payload),
      );
    },
  },
});

export const { viewFavorite, addFavorite, removeFavorite } =
  favoriteSlice.actions;
export default favoriteSlice.reducer;
