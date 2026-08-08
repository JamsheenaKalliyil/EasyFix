import { createSlice } from "@reduxjs/toolkit";

const staffSlice = createSlice({
  name: "staffs",
  initialState: {
    staffs: [],
  },
  reducers: {
    addStaff(state, action) {
      state.staffs.push(action.payload);
    },
    viewStaff(state, action) {
      state.staffs = action.payload;
    },
  },
});

export const { viewStaff, addStaff } = staffSlice.actions;
export default staffSlice.reducer;
