import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  allEvents: [],  // Initialize as an empty array to avoid undefined errors
  event: null,    // Store single event details if needed
  error: null,
  success: false, // For handling success cases (like creation)
  message: "",    // For holding success/error messages
};

export const eventReducer = createReducer(initialState, (builder) => {
  builder
    // Event Create Actions
    .addCase("eventCreateRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("eventCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.event = action.payload;  // Store the created event details
      state.message = "Event created successfully!";
    })
    .addCase("eventCreateFail", (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.payload;
      state.message = "Failed to create event.";
    })

    // Fetching all events
    .addCase("getAlleventsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAlleventsSuccess", (state, action) => {
      state.isLoading = false;
      // Ensure allEvents is always an array
      state.allEvents = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase("getAlleventsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.message = "Failed to fetch events.";
    })

    // Get all events of a shop
    .addCase("getAlleventsShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAlleventsShopSuccess", (state, action) => {
      state.isLoading = false;
      // Ensure events is always an array
      state.allEvents = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase("getAlleventsShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.message = "Failed to fetch events for shop.";
    })

    // Delete event of shop
    .addCase("deleteeventRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteeventSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;  // Message from the backend after deletion
    })
    .addCase("deleteeventFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.message = "Failed to delete event.";
    })

    // Clear Errors (useful for resetting error state after showing an error message)
    .addCase("clearErrors", (state) => {
      state.error = null;
      state.message = "";
    });
});
