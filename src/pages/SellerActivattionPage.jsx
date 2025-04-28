import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, { activation_token });
          console.log(res.data.message);
        } catch (err) {
          setError(true);
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Activation Failed</h1>
            <p className="text-gray-700 mb-6">Your activation token has expired or is invalid. Please try again later.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-4">Activation Successful!</h1>
            <p className="text-gray-700 mb-6">Your account has been activated successfully. Please proceed to login.</p>
          </>
        )}
        <a
          href="/shop-login"
          className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default SellerActivationPage;
