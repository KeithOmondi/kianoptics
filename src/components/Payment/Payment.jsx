import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
            amount: {
              currency_code: "Ksh",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  // M-Pesa payment handler
  const mpesaPaymentHandler = async () => {
    try {
      const response = await axios.post(`${server}/payment/process`, order);
      if (response.data.success) {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      } else {
        toast.error("M-Pesa payment failed.");
      }
    } catch (error) {
      toast.error("M-Pesa payment failed.");
    }
  };

  return (
    <div className="flex justify-center items-center py-8 bg-gray-50">
      <div className="flex flex-col w-full max-w-screen-lg bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1">
            <PaymentInfo
              user={user}
              open={open}
              setOpen={setOpen}
              onApprove={onApprove}
              createOrder={createOrder}
              cashOnDeliveryHandler={cashOnDeliveryHandler}
              mpesaPaymentHandler={mpesaPaymentHandler} // M-Pesa handler added
            />
          </div>
          <div className="flex-1 md:mt-0 mt-6">
            <CartData orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  cashOnDeliveryHandler,
  mpesaPaymentHandler, // M-Pesa handler passed
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div>
        <div className="flex items-center pb-4 border-b">
          <div
            className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${
              select === 1 ? "bg-[#1d1a1acb]" : "border-gray-400"
            }`}
            onClick={() => setSelect(1)}
          >
            {select === 1 && <div className="w-3 h-3 bg-white rounded-full" />}
          </div>
          <h4 className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
            <span className="text-lg font-semibold text-gray-800">
              Pay with PayPal
            </span>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrJdjso_lcyN_0SmKZH4T0LwvUKVms39KghA&s"
              alt="PayPal logo"
              className="w-28 h-8 rounded-md object-contain"
            />
          </h4>
        </div>

        {select === 1 && (
          <div className="mt-4">
            <button
              className="w-full bg-[#003366] text-[#FFCC00] text-lg font-semibold py-3 rounded-md hover:bg-[#001f33] hover:text-[#FFD700]"
              onClick={() => setOpen(true)}
            >
              Pay Now
            </button>

            {open && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-full sm:w-1/2 h-auto max-h-3/4 rounded-lg shadow-lg relative overflow-y-auto p-6">
                  <div className="absolute top-3 right-3">
                    <RxCross1
                      size={30}
                      className="cursor-pointer"
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "AfWNdR4C1GEQnvGXoX7uJJLC-5mHj6vtj_wAo65J6G4GiwTAPYYJiX5ut7jhv-lLrJTC-1VZVah_3X8o",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      onApprove={onApprove}
                      createOrder={createOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* M-Pesa Payment Option */}
      <div className="mt-6">
        <div className="flex items-center pb-4 border-b">
          <div
            className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${
              select === 3 ? "bg-[#1d1a1acb]" : "border-gray-400"
            }`}
            onClick={() => setSelect(3)}
          >
            {select === 3 && <div className="w-3 h-3 bg-white rounded-full" />}
          </div>
          <h4 className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
            <span className="text-lg font-semibold text-gray-800">
              Pay with M-Pesa
            </span>
            <img
              src="data:image/png;base64,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"
              className="w-24 h-12 rounded-md"
              alt="M-Pesa Logo"
            />
          </h4>
        </div>

        {select === 3 && (
          <div className="mt-4">
            <button
              className="w-full bg-[#003366] text-[#FFCC00] text-lg font-semibold py-3 rounded-md hover:bg-[#001f33] hover:text-[#FFD700]"
              onClick={mpesaPaymentHandler}
            >
              Pay with M-Pesa
            </button>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center pb-4 border-b">
          <div
            className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${
              select === 2 ? "bg-[#1d1a1acb]" : "border-gray-400"
            }`}
            onClick={() => setSelect(2)}
          >
            {select === 2 && <div className="w-3 h-3 bg-white rounded-full" />}
          </div>
          <h4 className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md border border-gray-200">
            <span className="text-lg font-semibold text-gray-800">
              Cash on Delivery
            </span>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiAjJXei-eVRVm7e-d50oi6cYXC4wILvqddw&s"
              alt="Cash on Delivery"
              className="w-24 h-12 rounded-md object-contain pl-1.5"
            />
          </h4>
        </div>

        {select === 2 && (
          <div className="mt-4">
            <form onSubmit={cashOnDeliveryHandler}>
              <button
                type="submit"
                className="w-full bg-[#003366] text-[#FFCC00] text-lg font-semibold py-3 rounded-md hover:bg-[#001f33] hover:text-[#FFD700]"
              >
                Confirm
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between pb-4 border-b">
        <h3 className="text-md text-gray-600">Subtotal:</h3>
        <h5 className="text-lg font-semibold text-gray-900">
          Ksh {orderData?.subTotalPrice}
        </h5>
      </div>
      <div className="flex justify-between pb-4 border-b">
        <h3 className="text-md text-gray-600">Shipping:</h3>
        <h5 className="text-lg font-semibold text-gray-900">Ksh {shipping}</h5>
      </div>
      <div className="flex justify-between pb-4 border-b">
        <h3 className="text-md text-gray-600">Discount:</h3>
        <h5 className="text-lg font-semibold text-gray-900">
          {orderData?.discountPrice ? "Ksh " + orderData.discountPrice : "-"}
        </h5>
      </div>
      <div className="flex justify-between pt-3">
        <h3 className="text-lg font-semibold text-gray-900">Total:</h3>
        <h5 className="text-lg font-semibold text-gray-900">
          Ksh {orderData?.totalPrice}
        </h5>
      </div>
    </div>
  );
};

export default Payment;
