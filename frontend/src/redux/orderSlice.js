import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    userOrders: [],
    adminOrders: [],
  },
  reducers: {
    addOrder(state, action) {
      state.userOrders.push(action.payload);
    },
    viewOrders(state, action) {
      state.userOrders = action.payload;
    },
    viewAllOrders(state, action) {
      state.adminOrders = action.payload;
    },
  },
});

export const { addOrder, viewOrders, viewAllOrders } = orderSlice.actions;
export default orderSlice.reducer;
