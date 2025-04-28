import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import ProductDetailsCard from "../productDetailsCard/productDetailsCard";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
      <div className="relative w-full h-[170px] flex items-center justify-center">
        <Link to={`/product/${data._id}`} className="block w-full h-full">
          <img
            src={data.images && data.images[0]?.url}
            alt={data.name}
            className="object-contain w-full h-full"
          />
        </Link>
      </div>

      <div className="p-4">
        <div>
          <h5 className="text-gray-500 text-sm font-semibold mb-1">
            {data.shop.name}
          </h5>
        </div>
        <div className="flex">
          <Ratings rating={data?.ratings} />
        </div>
        <Link to={`/product/${data._id}`}>
          <h4 className="text-gray-800 font-semibold mb-2 line-clamp-2">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>

          <div className="flex items-center space-x-2 mb-2">
            <h5 className="text-primary-600 font-bold text-lg">
              Ksh. {data.discountPrice}
            </h5>
            {data.price && (
              <h4 className="text-gray-500 line-through text-sm">
                Ksh{data.OriginalPrice}
              </h4>
            )}
          </div>

          <div className="text-gray-600 text-xs">
            <span>{data.sold_out} sold</span>
          </div>
        </Link>
      </div>

      {/* Wishlist, Quick view, Add to cart icons */}
      <div className="absolute top-2 right-2 flex flex-col space-y-2">
        {click ? (
          <AiFillHeart
            size={25}
            className="bg-white rounded-full p-1 shadow-md cursor-pointer text-red-500"
            onClick={() => removeFromWishlistHandler(data)}
          />
        ) : (
          <AiOutlineHeart
            size={25}
            className="bg-white rounded-full p-1 shadow-md cursor-pointer text-gray-700"
            onClick={() => addToWishlistHandler(data)}
          />
        )}
        <AiOutlineEye
          size={25}
          className="bg-white rounded-full p-1 shadow-md cursor-pointer text-gray-700"
          onClick={() => setOpen(!open)}
        />
        <AiOutlineShoppingCart
          size={25}
          className="bg-white rounded-full p-1 shadow-md cursor-pointer text-gray-700"
          onClick={() => addToCartHandler(data._id)}
        />
        {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
      </div>
    </div>
  );
};

export default ProductCard;
