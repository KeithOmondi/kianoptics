import { createReducer } from "@reduxjs/toolkit";

// Initial state for orders
const initialState = {
  isLoading: true,
  userOrders: [],
  shopOrders: [],
  adminOrders: [],
  error: null,
};

// Order reducer using createReducer
export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all orders of user
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.userOrders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders of shop
    .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.shopOrders = action.payload;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders of admin
    .addCase("adminAllOrdersRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.isLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
