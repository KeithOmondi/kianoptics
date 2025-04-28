import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const submitHandle = (category) => {
    navigate(`/products?category=${category.title}`);
    setDropDown(false);
  };

  return (
    <div className="absolute z-30 w-[270px] bg-white rounded-b-md shadow-md">
      {categoriesData.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition duration-200 ${
            selectedCategory === item.title ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
          onClick={() => submitHandle(item)}
        >
          <img
            src={item.image_Url}
            alt={item.title}
            className="w-6 h-6 object-contain select-none"
          />
          <h3 className="text-sm font-medium text-gray-800 select-none">
            {item.title}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default DropDown;
