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
  const { userOrders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = userOrders && userOrders.find((item) => item._id === id);

  const reviewHandler = async () => {
    try {
      const { data: resData } = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );
      toast.success(resData.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(1);
      setOpen(false);
    } catch (error) {
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

  return (
    <div className="py-4 px-4 min-h-screen">
      {/* Top header */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-2xl font-semibold">Order Details</h1>
        </div>
      </div>

      {/* Order basic info */}
      <div className="w-full flex items-center justify-between pt-2 text-gray-600">
        <h5>Order ID: <span className="text-black">#{data?._id?.slice(0, 8)}</span></h5>
        <h5>Placed on: <span className="text-black">{data?.createdAt?.slice(0, 10)}</span></h5>
      </div>

      {/* Order Items */}
      <div className="mt-6 space-y-5">
        {data && data.cart.map((item, index) => (
          <div key={index} className="w-full flex items-start gap-4">
            <img
              src={item.images[0]?.url}
              alt=""
              className="w-20 h-20 object-contain"
            />
            <div className="flex-1">
              <h5 className="text-lg font-semibold">{item.name}</h5>
              <h5 className="text-gray-600">Ksh. {item.discountPrice} x {item.qty}</h5>
            </div>
            {!item.isReviewed && data.status === "Delivered" && (
              <button
                onClick={() => {
                  setOpen(true);
                  setSelectedItem(item);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Write a Review
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="w-full max-w-lg bg-white rounded-md shadow-md p-6 relative">
            <button
              className="absolute top-4 right-4"
              onClick={() => setOpen(false)}
            >
              <RxCross1 size={25} className="text-gray-600 hover:text-black" />
            </button>
            <h2 className="text-2xl font-semibold text-center mb-6">Give a Review</h2>

            <div className="flex items-center gap-4">
              <img
                src={selectedItem?.images[0]?.url}
                alt=""
                className="w-20 h-20 object-contain"
              />
              <div>
                <h5 className="text-lg font-medium">{selectedItem?.name}</h5>
                <h5 className="text-gray-600">Ksh. {selectedItem?.discountPrice} x {selectedItem?.qty}</h5>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">Give a Rating <span className="text-red-500">*</span></h5>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) =>
                  rating >= i ? (
                    <AiFillStar
                      key={i}
                      className="cursor-pointer text-yellow-400"
                      size={30}
                      onClick={() => setRating(i)}
                    />
                  ) : (
                    <AiOutlineStar
                      key={i}
                      className="cursor-pointer text-yellow-400"
                      size={30}
                      onClick={() => setRating(i)}
                    />
                  )
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium mb-2">Write a Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-3 rounded resize-none outline-none"
                rows="4"
                placeholder="Share your experience..."
              ></textarea>
            </div>

            <button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Total Price */}
      <div className="border-t mt-10 pt-4 text-right">
        <h5 className="text-lg">
          Total Price: <strong>Ksh. {data?.totalPrice}</strong>
        </h5>
      </div>

      {/* Shipping Address & Payment Info */}
      <div className="mt-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <h4 className="text-xl font-semibold mb-2">Shipping Address:</h4>
          <p>{data?.shippingAddress?.address1} {data?.shippingAddress?.address2}</p>
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

      {/* Message Button */}
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
