import React from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  if (!data || !data.images || !data.images[0]) {
    return <div>Loading...</div>; // Show loading if data is incomplete
  }

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-md mb-10 p-6 transition-all duration-300 hover:shadow-xl">
      {/* Image Container */}
      <div className="flex-shrink-0 mb-6">
        <img
          src={data.images[0]?.url}
          alt={data.name}
          className="w-full h-[250px] object-contain rounded-lg"
        />
      </div>

      {/* Info Container */}
      <div className="flex flex-col justify-between flex-grow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {data.name}
        </h2>
        <p className="text-gray-600 text-lg mb-4">{data.description}</p>

        {/* Price and Sold Information */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-lg font-medium text-red-500 line-through mr-4">
              {data.originalPrice} Ksh
            </span>
            <span className="text-xl font-bold text-gray-800">
              {data.discountPrice} Ksh
            </span>
          </div>
          <span className="text-sm text-green-500">{data.sold_out} sold</span>
        </div>

        {/* Countdown Timer */}
        <CountDown data={data} />

        {/* Actions */}
        <div className="flex mt-6">
          <Link
            to={`/product/${data._id}?isEvent=true`}
            className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md text-center mr-4 transition-all duration-300 hover:bg-gray-700"
          >
            See Details
          </Link>
          <div
            onClick={() => addToCartHandler(data)}
            className="inline-block bg-green-500 text-white px-6 py-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-green-600"
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
