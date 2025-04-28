import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Route/productCard/productCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const filtered =
      allProducts && allProducts.filter((item) => item.category === data.category);
    setProductData(filtered);
  }, [allProducts, data.category]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      {data && (
        <>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
            {productData &&
              productData.map((item, index) => (
                <ProductCard key={index} data={item} />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestedProduct;
