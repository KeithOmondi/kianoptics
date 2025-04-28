import React from 'react';

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-[90%] 800px:w-[50%] flex items-center justify-between">

        {/* Step 1 - Shipping */}
        <div className="flex items-center space-x-4">
          <div
            className={`${
              active > 1 ? 'bg-[#003366] text-white' : 'bg-[#FDE1E6] text-[#FFCC00]'
            } px-5 py-2 rounded-full text-[16px] font-semibold transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            
            <span>1. Shipping</span>
          </div>
          <div
            className={`${
              active > 1 ? 'w-[80px] h-[5px] bg-[#003366]' : 'w-[80px] h-[5px] bg-[#FDE1E6]'
            } rounded-md`}
          />
        </div>

        {/* Step 2 - Payment */}
        <div className="flex items-center space-x-4">
          <div
            className={`${
              active > 2 ? 'bg-[#003365] text-white' : 'bg-[#FDE1E6] text-[#FFCC00]'
            } px-5 py-2 rounded-full text-[16px] font-semibold transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            <span>2. Payment</span>
          </div>
          <div
            className={`${
              active > 2 ? 'w-[80px] h-[5px] bg-[#003365]' : 'w-[80px] h-[5px] bg-[#FDE1E6]'
            } rounded-md`}
          />
        </div>

        {/* Step 3 - Success */}
        <div className="flex items-center space-x-4">
          <div
            className={`${
              active > 3 ? 'bg-[#003365] text-white' : 'bg-[#FDE1E6] text-[#FFCC00]'
            } px-5 py-2 rounded-full text-[16px] font-semibold transition-all duration-300 ease-in-out transform hover:scale-105`}
          >
            <span>3. Success</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSteps;
