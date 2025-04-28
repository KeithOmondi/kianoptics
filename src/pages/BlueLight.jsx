import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/productCard/productCard";
import ProductSortSidebar from "../components/Filters/ProductSortSidebar";
import Footer from "../components/Layout/Footer";
import { getAllProducts } from "../redux/actions/product";

const BlueLight = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [blueLight, setBlueLight] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  // Fetch products from Redux if not loaded
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  // Filter blue light glasses when allProducts change
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const filtered = allProducts.filter(item => item.category === "Blue Light");
      setBlueLight(filtered);
    }
  }, [allProducts]);

  // Sorting function
  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    switch (sortType) {
      case "price-low-high":
        return sorted.sort((a, b) => a.discount_price - b.discount_price);
      case "price-high-low":
        return sorted.sort((a, b) => b.discount_price - a.discount_price);
      case "a-z":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "z-a":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };

  const sortedBlueLight = sortProducts(blueLight, selectedSort);

  return (
    <>
      <div>
        <Helmet>
          <title>Blue Light Glasses - Kian Optic</title>
        </Helmet>

        <Header />
        <br />
        <br />

        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Blue Light Glasses</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sorting Sidebar */}
            <ProductSortSidebar
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
            />

            {/* Product Grid */}
            <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <h2 className="text-center text-lg w-full">Loading products...</h2>
              ) : sortedBlueLight.length > 0 ? (
                sortedBlueLight.map((product) => (
                  <ProductCard key={product._id} data={product} />
                ))
              ) : (
                <h2 className="text-center text-lg w-full">No blue light glasses found!</h2>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlueLight;
