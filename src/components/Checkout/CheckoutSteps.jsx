import React from 'react';

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center mt-6 px-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">

        {/* Step 1 - Shipping */}
        <div className="flex items-center md:space-x-4 flex-col md:flex-row text-center">
          <div
            className={`${
              active > 1
                ? 'bg-[#003366] text-white'
                : 'bg-blue-900 text-[#FFCC00]'
            } px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            <span>1. Shipping</span>
          </div>
          <div
            className={`${
              active > 1
                ? 'w-16 h-[5px] bg-[#003366]'
                : 'w-16 h-[5px] bg-yellow-600'
            } rounded-md hidden md:block`}
          />
        </div>

        {/* Step 2 - Payment */}
        <div className="flex items-center md:space-x-4 flex-col md:flex-row text-center">
          <div
            className={`${
              active > 2
                ? 'bg-[#003366] text-white'
                : 'bg-blue-900 text-[#FFCC00]'
            } px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            <span>2. Payment</span>
          </div>
          <div
            className={`${
              active > 2
                ? 'w-16 h-[5px] bg-[#003366]'
                : 'w-16 h-[5px] bg-yellow-600'
            } rounded-md hidden md:block`}
          />
        </div>

        {/* Step 3 - Success */}
        <div className="flex items-center flex-col md:flex-row text-center">
          <div
            className={`${
              active > 3
                ? 'bg-[#003366] text-white'
                : 'bg-blue-900 text-yellow-600 w-full'
            } px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            <span>3. Success</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSteps;
