import axios from "axios";
import { server } from "../../server";

// Create product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: "productCreateRequest" });

    const { data } = await axios.post(
      `${server}/product/create-product`,
      productData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });

    // Fetch all products again to refresh the frontend
    dispatch(getAllProducts());

  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data.message || error.message,
    });
  }
};

// Get all products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsShopRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);

    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data.message || error.message,
    });
  }
};

// Delete product
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteProductRequest" });

    const { data } = await axios.delete(`${server}/product/delete-shop-product/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });

    // Optionally you can refetch all products here too if needed
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data.message || error.message,
    });
  }
};

// Get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllProductsRequest" });

    const { data } = await axios.get(`${server}/product/get-all-products`);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data.message || error.message,
    });
  }
};
