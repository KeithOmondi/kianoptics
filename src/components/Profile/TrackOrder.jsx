import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { FaCheckCircle, FaShippingFast, FaBoxOpen, FaHome } from "react-icons/fa";

const statusMessages = {
  "Processing": "Your order is being prepared.",
  "Transferred to delivery partner": "On the way to the delivery partner.",
  "Shipping": "Out for delivery!",
  "Received": "Arrived in your city. Delivery soon!",
  "On the way": "Almost there. Hang tight!",
  "Delivered": "Delivered. Enjoy your purchase!",
  "Processing refund": "Refund is being processed.",
  "Refund Success": "Refund completed successfully.",
};

const statusSteps = [
  "Processing",
  "Transferred to delivery partner",
  "Shipping",
  "Received",
  "On the way",
  "Delivered",
];

const getStatusStep = (status) => statusSteps.indexOf(status);

const TrackOrder = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const { userOrders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  if (!user || !user._id || isLoading) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-xl font-medium text-gray-700 animate-pulse">
          Loading your order...
        </h1>
      </div>
    );
  }

  const order = userOrders.find((item) => item._id === id);
  const currentStep = getStatusStep(order?.status);
  const message = order?.status ? statusMessages[order.status] : null;

  if (!order) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <h1 className="text-xl font-semibold text-red-500">Order not found.</h1>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-600">
        Track Your Order
      </h1>
      <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
        {message || "Order status unavailable."}
      </p>

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0 text-center">
        {statusSteps.map((step, index) => (
          <div key={index} className="flex-1 relative">
            <div
              className={`w-10 h-10 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center text-sm
                ${index <= currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
                }`}
            >
              {index < currentStep ? (
                <FaCheckCircle size={16} />
              ) : index === currentStep ? (
                <FaShippingFast size={16} />
              ) : (
                <FaBoxOpen size={16} />
              )}
            </div>
            <div
              className={`mt-2 text-xs sm:text-sm ${
                index <= currentStep ? "text-green-600 font-medium" : "text-gray-500"
              }`}
            >
              {step}
            </div>

            {/* Progress line (hidden on last item) */}
            {index < statusSteps.length - 1 && (
              <div
                className={`hidden sm:block absolute top-4 left-1/2 h-1 w-full transform -translate-x-1/2 
                  ${index < currentStep ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-base sm:text-lg text-gray-700">
          Tracking Order ID:{" "}
          <span className="font-semibold text-black">{order._id.slice(0, 8)}</span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Placed on: {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {order.status === "Delivered" && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full shadow-sm text-sm sm:text-base">
            <FaHome />
            <span className="font-medium">Delivered Successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
