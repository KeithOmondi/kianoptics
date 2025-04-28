import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between px-6 py-6 md:py-10 mb-8">
      {/* Image section */}
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <img
          src={
            "https://images.pexels.com/photos/1236678/pexels-photo-1236678.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
          alt="Happy Customer"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Text section */}
      <div className="w-full md:w-1/2 md:pl-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Discover Joy in Every Purchase!
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          Explore our latest products designed to bring happiness and comfort to
          your lifestyle.
        </p>
        <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Banner;
