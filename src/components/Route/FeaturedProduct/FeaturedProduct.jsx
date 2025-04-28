import React from "react";
import ProductCard from "../productCard/productCard";
import { useSelector } from "react-redux";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);

  return (
    <div className="w-full py-8 px-4 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Featured Products</h1>
          <p className="text-gray-500 mt-2">Check out our best-selling items!</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {allProducts && allProducts.length !== 0 ? (
            allProducts.map((item, index) => (
              <ProductCard key={item._id || index} data={item} />
            ))
          ) : (
            <h2 className="text-center text-gray-500 col-span-full">
              No featured products available.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
