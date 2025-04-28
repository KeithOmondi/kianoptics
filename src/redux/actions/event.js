import axios from "axios";
import { server } from "../../server";

// create event
export const createevent = (data) => async (dispatch) => {
  try {
    dispatch({
      type: "eventCreateRequest",
    });

    const { d } = await axios.post(`${server}/event/create-event`, data);
    dispatch({
      type: "eventCreateSuccess",
      payload: d.event,
    });
  } catch (error) {
    // Check if error.response exists before trying to access error.response.data
    const errorMessage = error.response?.data?.message || "Something went wrong!";
    dispatch({
      type: "eventCreateFail",
      payload: errorMessage,
    });
  }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAlleventsShopRequest",
    });

    const { data } = await axios.get(`${server}/event/get-all-events/${id}`);
    dispatch({
      type: "getAlleventsShopSuccess",
      payload: data.events,
    });
  } catch (error) {
    // Check if error.response exists before trying to access error.response.data
    const errorMessage = error.response?.data?.message || "Something went wrong!";
    dispatch({
      type: "getAlleventsShopFailed",
      payload: errorMessage,
    });
  }
};

// delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteeventRequest",
    });

    const { data } = await axios.delete(
      `${server}/event/delete-shop-event/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteeventSuccess",
      payload: data.message,
    });
  } catch (error) {
    // Check if error.response exists before trying to access error.response.data
    const errorMessage = error.response?.data?.message || "Something went wrong!";
    dispatch({
      type: "deleteeventFailed",
      payload: errorMessage,
    });
  }
};

// get all events

// Get all events
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "getAlleventsRequest" });

    const { data } = await axios.get(`${server}/event/get-all-events`);
    dispatch({
      type: "getAlleventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    dispatch({
      type: "getAlleventsFailed",
      payload: error.response?.data?.message || "Something went wrong!",
    });
  }
};
