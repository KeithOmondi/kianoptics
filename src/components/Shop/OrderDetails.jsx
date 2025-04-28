import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsFillBagFill } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { getAllOrdersOfShop } from "../../redux/actions/order";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shopOrders, isLoading, error } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const [status, setStatus] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const updateOrderStatus = async () => {
    if (!selectedOrderId || !status) {
      toast.error("Please select an order and status!");
      return;
    }

    try {
      await axios.put(
        `${server}/order/update-order-status/${selectedOrderId}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order Status Updated!");
      navigate("/dashboard-orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  const updateRefundStatus = async () => {
    if (!selectedOrderId || !status) {
      toast.error("Please select an order and refund status!");
      return;
    }

    try {
      await axios.put(
        `${server}/order/order-refund-success/${selectedOrderId}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Refund Status Updated!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update refund");
    }
  };

  const handleUpdate = (order) => {
    setSelectedOrderId(order._id);
  
    if (order.status.includes("refund")) {
      updateRefundStatus();
    } else {
      updateOrderStatus();
    }
  };
  

  if (error) {
    toast.error(error);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BsFillBagFill size={40} className="text-red-500 mr-3" />
          <h1 className="text-3xl font-semibold text-gray-800">
            Order Details
          </h1>
        </div>
        <Link to="/dashboard-orders">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Order List
          </button>
        </Link>
      </div>

      {shopOrders && shopOrders.length > 0 ? (
        shopOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6"
          >
            <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Order ID: <span className="text-blue-600">#{order._id}</span>
                </h3>
                <p className="text-gray-500 text-sm">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {order.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Order Items:</h4>
              {order.cart.map((item, idx) => (
                <div key={idx} className="flex items-center border-b py-2">
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded mr-4"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500">
                      Ksh. {item.discountPrice} × {item.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800">Shipping Address:</h4>
              <p className="text-gray-600">
                {order.shippingAddress.address1},{" "}
                {order.shippingAddress.address2}
              </p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              <p className="text-gray-600">{order.user?.phoneNumber}</p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800">Payment Info:</h4>
              <p className="text-gray-600">
                Status: {order.paymentInfo?.status || "Not Paid"}
              </p>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800">Order Status:</h4>

              {order.status !== "Processing refund" &&
              order.status !== "Refund Success" ? (
                <select
                  value={status || order.status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full md:w-60 p-2 border rounded"
                >
                  {[
                    "Processing",
                    "Transferred to delivery partner",
                    "Shipping",
                    "Received",
                    "On the way",
                    "Delivered",
                  ]
                    .slice(
                      [
                        "Processing",
                        "Transferred to delivery partner",
                        "Shipping",
                        "Received",
                        "On the way",
                        "Delivered",
                      ].indexOf(order.status)
                    )
                    .map((stat, idx) => (
                      <option value={stat} key={idx}>
                        {stat}
                      </option>
                    ))}
                </select>
              ) : (
                <select
                  value={status || order.status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-2 w-full md:w-60 p-2 border rounded"
                >
                  {["Processing refund", "Refund Success"]
                    .slice(
                      ["Processing refund", "Refund Success"].indexOf(
                        order.status
                      )
                    )
                    .map((stat, idx) => (
                      <option value={stat} key={idx}>
                        {stat}
                      </option>
                    ))}
                </select>
              )}

              <button
                onClick={() => handleUpdate(order)}
                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
              >
                Update Status
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 text-center rounded-lg shadow-md text-gray-500">
          No orders found.
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
