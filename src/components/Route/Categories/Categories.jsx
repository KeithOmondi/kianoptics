import React from "react";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";

const Categories = () => {
  const navigate = useNavigate();

  const handleSubmit = (category) => {
    navigate(`/products?category=${category.title}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="bg-white p-6 rounded-lg mb-12" id="categories">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categoriesData.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSubmit(item)}
              className="w-full h-[100px] flex items-center justify-between rounded-md p-4 cursor-pointer hover:shadow-md transition"
            >
              <h5 className="text-base sm:text-lg font-semibold">{item.title}</h5>
              <img
                src={item.image_Url}
                alt={item.title}
                className="w-[70px] sm:w-[100px] h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
