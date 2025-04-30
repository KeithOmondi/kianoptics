import React, { useEffect, useState } from "react";
import {
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiFillHeart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const handleMessageSubmit = () => {
    toast.info("Messaging feature not implemented yet.");
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i.id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i.id === data.id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data.id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center md:items-start justify-center px-4 pt-12 md:pt-24">
      {data ? (
        <div className="bg-white rounded-xl shadow-2xl relative w-[90%] max-w-2xl h-[90vh] overflow-y-auto p-6 md:p-8 transition-all duration-300 ease-in-out transform hover:scale-105">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <RxCross1 size={24} />
          </button>

          <div className="md:flex gap-8">
            {/* Product Image */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <img
                src={data.images && data.images[0]?.url}
                alt={data.name}
                className="w-full h-auto rounded-md object-contain aspect-square shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
              />

              <div>
                 {/* Shop Info */}
                 <Link
                  to={`/shop/preview/${data.shop._id}`}
                  className="flex items-center text-sm text-gray-600 hover:text-primary-500 transition-colors duration-200 mb-3"
                >
                  <img
                    src={data.images && data.images[0]?.url}
                    alt={data.shop.name}
                    className="w-10 h-10 rounded-full mr-3 object-contain"
                  />
                  <span>{data.shop.name}</span>
                  {data?.ratings && (
                    <span className="ml-2">• {data.ratings} Ratings</span>
                  )}
                </Link>
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                {/* Product Title */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-3 hover:text-primary-500 transition-colors duration-300">
                  {data.name}
                </h2>
               
                {/* Description */}
                <p className="text-gray-700 mb-4 text-lg">{data.description}</p>
                {/* Price */}
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-red-500 mr-2">
                    Ksh{data.discountPrice}
                  </span>
                  {data.price && (
                    <span className="text-gray-500 line-through">
                      Ksh{data.OriginalPrice}
                    </span>
                  )}
                </div>
                {/* Sold Out Indicator */}
                {data.total_sell > 0 && (
                  <p className="text-sm text-red-600 mb-4">
                    {data.sold_out} Sold out
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4">
                {/* Quantity and Wishlist */}
                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                    <button
                      onClick={decrementCount}
                      className="bg-gray-200 text-gray-600 focus:outline-none hover:bg-gray-300 transition-colors duration-200 px-4 py-2"
                    >
                      -
                    </button>
                    <span className="bg-white text-gray-800 px-6 py-2 border-t border-b border-gray-300">
                      {count}
                    </span>
                    <button
                      onClick={incrementCount}
                      className="bg-gray-200 text-gray-600 focus:outline-none hover:bg-gray-300 transition-colors duration-200 px-4 py-2"
                    >
                      +
                    </button>
                  </div>
                  {/* Wishlist Button */}
                  <button
                    onClick={() =>
                      click
                        ? removeFromWishlistHandler(data)
                        : addToWishlistHandler(data)
                    }
                    className="text-gray-500 hover:text-red-500 transition-colors duration-200 focus:outline-none"
                    title={click ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {click ? (
                      <AiFillHeart size={24} className="text-red-500" />
                    ) : (
                      <AiOutlineHeart size={24} />
                    )}
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCartHandler(data.id)}
                  className="bg-primary-500 hover:bg-primary-600 text-blue-900 font-semibold rounded-md shadow-md focus:outline-none py-3 transition-all duration-200 ease-in-out"
                >
                  <AiOutlineShoppingCart
                    size={20}
                    className="inline-block mr-2"
                  />{" "}
                  Add to cart
                </button>

                {/* Message Button */}
                <button
                  onClick={handleMessageSubmit}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-md shadow-md focus:outline-none py-3 flex items-center justify-center transition-all duration-200 ease-in-out"
                >
                  <AiOutlineMessage size={20} className="inline-block mr-2" />{" "}
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
