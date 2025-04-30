import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { userOrders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0); // Initialize rating to 0

  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = userOrders?.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    if (rating === 0) {
      toast.warning("Please give a rating before submitting a review.");
      return;
    }
  
    console.log("user ID:", user?._id);
    console.log("rating:", rating);
    console.log("comment:", comment);
    console.log("product ID:", selectedItem?._id);
    console.log("order ID:", id);
  
    const reviewPayload = {
      userId: user?._id, // ✅ changed key name
      rating,
      comment,
      productId: selectedItem?._id,
      orderId: id,
    };
  
    console.log("Submitting review:", reviewPayload);
  
    try {
      const res = await axios.put(
        `${server}/product/create-new-review`,
        reviewPayload,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(0);
      setOpen(false);
    } catch (error) {
      console.error("Review submission error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  const refundHandler = async () => {
    try {
      const { data: resData } = await axios.put(
        `${server}/order/order-refund/${id}`,
        { status: "Processing refund" },
        { withCredentials: true }
      );
      toast.success(resData.message);
      dispatch(getAllOrdersOfUser(user._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (isLoading || !data) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-[20px]">Loading your order...</h1>
      </div>
    );
  }

  return (
    <div className="py-14 px-4 min-h-screen pb-52">
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-2xl font-semibold">Order Details</h1>
        </div>
      </div>

      <div className="w-full flex items-center justify-between pt-2 text-gray-600">
        <h5>
          Order ID:{" "}
          <span className="text-black">#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5>
          Placed on:{" "}
          <span className="text-black">{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      <div className="mt-6 space-y-5">
        {data.cart.map((item, index) => (
          <div key={index} className="w-full flex items-start gap-4">
            <img
              src={item.images[0]?.url}
              alt=""
              className="w-20 h-20 object-contain"
            />
            <div className="flex-1">
              <h5 className="text-lg font-semibold">{item.name}</h5>
              <h5 className="text-gray-600">
                Ksh. {item.discountPrice} x {item.qty}
              </h5>
            </div>
            {!item.isReviewed && data.status === "Delivered" && (
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedItem(item);
                  setRating(0); // Reset rating when opening the review modal
                  setComment(""); // Reset comment as well
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Write a Review
              </button>
            )}
          </div>
        ))}
      </div>

      {open && selectedItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000052] z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-md p-6 w-[90%] md:w-[50%]">
            <RxCross1
              className="absolute top-3 right-3 cursor-pointer"
              size={20}
              onClick={() => setOpen(false)}
            />
            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className="text-white bg-blue-500 hover:bg-blue-600 text-center rounded py-2 mt-4 cursor-pointer"
              onClick={reviewHandler}
            >
              Submit Review
            </div>
          </div>
        </div>
      )}

      <div className="border-t mt-10 pt-4 text-right">
        <h5 className="text-lg">
          Total Price: <strong>Ksh. {data?.totalPrice}</strong>
        </h5>
      </div>

      <div className="mt-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <h4 className="text-xl font-semibold mb-2">Shipping Address:</h4>
          <p>
            {data?.shippingAddress?.address1} {data?.shippingAddress?.address2}
          </p>
          <p>{data?.shippingAddress?.country}</p>
          <p>{data?.shippingAddress?.city}</p>
          <p>{data?.user?.phoneNumber}</p>
        </div>

        <div className="flex-1">
          <h4 className="text-xl font-semibold mb-2">Payment Info:</h4>
          <p>Status: {data?.paymentInfo?.status || "Not Paid"}</p>

          {data?.status === "Delivered" && (
            <button
              onClick={refundHandler}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
            >
              Request Refund
            </button>
          )}
        </div>
      </div>

      <div className="mt-10">
        <Link to="/">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-8 rounded">
            Send Message
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserOrderDetails;
