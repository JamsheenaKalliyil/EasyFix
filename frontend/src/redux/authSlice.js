import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    users: [],
      loading: true,
  },

  reducers: {
    signUp(state, action) {
      state.users.push(action.payload);
    },

    signIn(state, action) {
      state.user = action.payload.user;
       state.loading = false;
    },

    signOut(state) {
      state.user = null;
       state.loading = false;
    },

    viewUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { signUp, signIn, signOut, viewUsers } = authSlice.actions;

export default authSlice.reducer;