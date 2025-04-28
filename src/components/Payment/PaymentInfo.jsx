import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(null); // Default to no payment method selected

  // Retrieve PayPal Client ID from environment variables
  const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      {/* PayPal payment option */}
      <div>
        <div
          className="flex w-full pb-5 border-b mb-2 cursor-pointer"
          onClick={() => setSelect(2)} // Select PayPal
        >
          <div
            className={`w-[25px] h-[25px] rounded-full bg-transparent border-[3px] relative flex items-center justify-center ${
              select === 2 ? "border-[#1d1a1ab4]" : "border-[#d1d5db]"
            }`}
          >
            {select === 2 && (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            )}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1] select-none">
            Pay with Paypal
          </h4>
        </div>

        {/* PayPal payment */}
        {select === 2 && (
          <div className="w-full flex flex-col items-start">
            <button
              className="bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] px-6 py-0 self-start"
              onClick={() => setOpen(true)}
            >
              Pay Now
            </button>
            {open && (
              <div className="w-full fixed top-0 left-0 bg-[#00000039] h-screen flex items-center justify-center z-[99999]">
                <div className="w-full 800px:w-[40%] h-screen 800px:h-[80vh] bg-white rounded-[5px] shadow flex flex-col justify-center p-4 relative overflow-y-auto">
                  <div className="w-full flex justify-end p-3">
                    <button
                      className="cursor-pointer absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                    <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        onApprove={onApprove}
                        createOrder={createOrder}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <br />
      {/* Cash on Delivery option */}
      <div className="cursor-pointer" onClick={() => setSelect(3)}>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className={`w-[25px] h-[25px] rounded-full bg-transparent border-[3px] relative flex items-center justify-center ${
              select === 3 ? "border-[#1d1a1ab4]" : "border-[#d1d5db]"
            }`}
          >
            {select === 3 && (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            )}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1] select-none">
            Cash on Delivery
          </h4>
        </div>

        {/* Cash on delivery form */}
        {select === 3 && (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <input
                type="submit"
                value="Confirm Cash on Delivery"
                className="bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600] w-full"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentInfo;
