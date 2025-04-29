import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();``

  useEffect(() => {
    dispatch(getAllProductsShop(data?.shop._id));
    if (wishlist?.find((item) => item._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  const incrementCount = () => setCount((prev) => prev + 1);
  const decrementCount = () => count > 1 && setCount((prev) => prev - 1);

  const handleWishlist = (data) => {
    setClick(!click);
    click ? dispatch(removeFromWishlist(data)) : dispatch(addToWishlist(data));
  };

  const handleAddToCart = () => {
    const isItemExists = cart.find((item) => item._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      try {
        const res = await axios.post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId: user._id,
          sellerId: data.shop._id,
        });
        navigate(`/inbox?${res.data.conversation._id}`);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const totalReviewsLength = data?.reviews.length || 0;
  const totalRatings =
    data?.reviews.reduce((acc, review) => acc + review.rating, 0) || 0;
  const averageRating = (totalRatings / totalReviewsLength || 0).toFixed(2);

  return (
    <div className="bg-white">
      {data && (
        <div className="max-w-[1200px] w-[90%] md:w-[80%] mx-auto">
          <div className="py-5">
            <div className="block md:flex">
              <div className="w-full md:w-1/2">
                <img
                  src={data.images[select]?.url}
                  alt=""
                  className="w-[80%]"
                />
                <div className="flex flex-wrap">
                  {data.images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer ${
                        select === index ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => setSelect(index)}
                    >
                      <img
                        src={image?.url}
                        alt=""
                        className="h-[200px] object-cover mr-3 mt-3"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 pt-5">
                <h1 className="text-2xl font-semibold">{data.name}</h1>
                <p className="mt-2">{data.description}</p>
                <div className="flex items-center gap-4 pt-3">
                  <h4 className="text-xl font-bold text-red-600">
                    Ksh. {data.discountPrice}
                  </h4>
                  {data.originalPrice && (
                    <h3 className="text-lg line-through text-gray-500">
                      {data.originalPrice}Ksh
                    </h3>
                  )}
                </div>

                <div className="flex items-center mt-12 justify-between pr-3">
                  <div className="flex items-center">
                    <button
                      className="bg-teal-500 text-white font-bold rounded-l px-4 py-2 hover:opacity-75 transition"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-teal-500 text-white font-bold rounded-r px-4 py-2 hover:opacity-75 transition"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>

                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer text-red-500"
                        onClick={() => handleWishlist(data)}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer text-gray-700"
                        onClick={() => handleWishlist(data)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                <button
                  className="bg-black text-white w-full mt-6 rounded h-11 flex items-center justify-center gap-2 hover:opacity-90 transition"
                  onClick={handleAddToCart}
                >
                  Add to cart <AiOutlineShoppingCart size={20} />
                </button>

                <div className="flex items-center pt-8">
                  <div className={`${data.shop._id}`}>
                    <img
                      src={data.shop.avatar?.url}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </div>
                  <div className="pr-8">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {data.shop.name}
                      </h3>
                    </div>
                    <h5 className="text-sm text-gray-600">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded h-11 flex items-center gap-1 hover:opacity-90 transition mt-4"
                    onClick={handleMessageSubmit}
                  >
                    Send Message <AiOutlineMessage size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo
            data={data}
            averageRating={averageRating}
            totalReviewsLength={totalReviewsLength}
          />
        </div>
      )}
    </div>
  );
};

const ProductDetailsInfo = ({ data, averageRating, totalReviewsLength }) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-gray-100 px-4 md:px-10 py-6 rounded mt-8">
      <div className="flex justify-between border-b mb-6">
        {["Product Details", "Product Reviews", "Seller Information"].map(
          (tab, index) => (
            <div key={index} className="relative">
              <h5
                className="text-black text-lg font-semibold cursor-pointer"
                onClick={() => setActive(index + 1)}
              >
                {tab}
              </h5>
              {active === index + 1 && (
                <div className="h-1 bg-black w-full mt-1" />
              )}
            </div>
          )
        )}
      </div>

      {active === 1 && (
        <p className="text-lg leading-7 whitespace-pre-line">
          {data.description}
        </p>
      )}
      {active === 2 && (
        <div className="min-h-[40vh] flex flex-col items-center gap-4">
          {data.reviews.length ? (
            data.reviews.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <img
                  src={`${item.user?.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-medium">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <h5>No reviews available for this product!</h5>
          )}
        </div>
      )}
      {active === 3 && (
        <div className="block md:flex gap-8">
          <div className="flex-1">
            <div className={`${data.shop._id}`}>
              <div className="flex items-center gap-3">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{data.shop.name}</h3>
                  <h5 className="text-sm text-gray-600">
                    ({averageRating}/5) Ratings
                  </h5>
                </div>
              </div>
            </div>
            <p className="pt-3">{data.shop.description}</p>
          </div>

          <div className="flex-1 mt-5 md:mt-0 md:items-end text-right">
            <h5 className="font-semibold">
              Joined on:{" "}
              <span className="font-normal">
                {data.shop.createdAt?.slice(0, 10)}
              </span>
            </h5>
            <h5 className="font-semibold pt-3">
              Total Products:{" "}
              <span className="font-normal">{data.shop.totalProducts}</span>
            </h5>
            <h5 className="font-semibold pt-3">
              Total Reviews:{" "}
              <span className="font-normal">{totalReviewsLength}</span>
            </h5>
            <Link to="/">
              <button className="bg-black text-white px-6 py-2 rounded mt-4 hover:opacity-90 transition">
                Visit Shop
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
