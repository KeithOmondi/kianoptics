import React from "react";

const ProductSortSidebar = ({ selectedSort, onSortChange }) => {
  return (
    <div className="w-full md:w-1/4 bg-white shadow-md p-4 rounded-md h-fit">
      <h2 className="text-xl font-semibold mb-4">Sort By</h2>
      <select
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        <option value="">Default</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
        <option value="a-z">Name: A - Z</option>
        <option value="z-a">Name: Z - A</option>
      </select>
    </div>
  );
};

export default ProductSortSidebar;
