// action:
import axios from "axios";
import { server } from "../../server";

export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });

    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });

    console.log("Full seller response:", data); // See exactly what comes back

    // **Crucial:** You need to check the structure of 'data' to find the seller info.
    // Assuming the seller data is within a 'seller' property of the response:
    if (data && data.seller) {
      dispatch({
        type: "LoadSellerSuccess",
        payload: data.seller, //  Send the seller object
      });
    } else {
       // Handle the case where the seller data is not in the expected format.
      const errorMessage = "Seller data not found in response.";
      console.error(errorMessage);
      dispatch({ type: "LoadSellerFail", payload: errorMessage });
    }


  } catch (error) {
    console.log("Failed to load seller:", error.response?.data?.message);
    const message = error.response?.data?.message || "Failed to load seller";
    dispatch({ type: "LoadSellerFail", payload: message });
  }
};