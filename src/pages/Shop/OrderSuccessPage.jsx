import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

const OrderSuccessPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-10 sm:py-16">
        {/* Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-green-500 mb-4 sm:mb-6"
        >
          <FaCheckCircle size={80} className="sm:size-24" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center px-4 max-w-xl"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-3 sm:mb-4">
            Order Successful!
          </h1>
          <p className="text-gray-700 text-base sm:text-lg mb-6">
            Thank you for shopping with{" "}
            <span className="font-semibold text-blue-900">Kian Optics</span>!{" "}
            <br />
            Your vision just got an upgrade! 👓✨
          </p>

          {/* Illustration */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3164/3164206.png"
            alt="Eyeglasses"
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6"
          />

          {/* Button */}
          <Link
            to="/"
            className="inline-block bg-blue-900 text-white px-6 py-3 rounded-md hover:bg-blue-800 transition text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccessPage;
