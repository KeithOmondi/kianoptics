// reducer:
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  isSeller: false,
  seller: null,
  error: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    // Load single seller
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
      state.error = null; // Clear any previous errors
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      console.log("LoadSellerSuccess payload:", action.payload);
      state.isSeller = true; //  Set isSeller to true
      state.isLoading = false;
      state.seller = action.payload; // Store the seller data
      state.error = null;
    })
    .addCase("LoadSellerFail", (state, action) => {
      console.log("LoadSellerFail payload:", action.payload);
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false; //  Set isSeller to false on failure
      state.seller = null;
    })
    // Get all sellers (This part is fine, but not directly related to the loading issue)
    .addCase("getAllSellersRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.isLoading = false;
      state.sellers = action.payload;
      state.error = null;
    })
    .addCase("getAllSellersFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // Utilities
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
