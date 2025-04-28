import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/productCard/productCard";
import ProductSortSidebar from "../components/Filters/ProductSortSidebar";
import Footer from "../components/Layout/Footer";
import { getAllProducts } from "../redux/actions/product";

const Sunglasses = () => {
  const dispatch = useDispatch();
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [sunglasses, setSunglasses] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  // Fetch products from Redux if not loaded
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  // Filter sunglasses when allProducts change
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const filtered = allProducts.filter(
        (item) => item.category === "Sunglasses"
      );
      setSunglasses(filtered);
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

  const sortedSunglasses = sortProducts(sunglasses, selectedSort);

  return (
    <>
      <Helmet>
        <title>Sunglasses - Kian Optic</title>
      </Helmet>

      <Header />

      {/* Banner Section */}
      <section
        className="w-full h-[60vh] bg-contain bg-center flex items-center justify-center text-white text-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://optica.africa/cdn/shop/files/all_sg_web_banner.jpg?v=1744124333')",
        }}
      ></section>

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sunglasses</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Reusable Sorting Sidebar */}
          <ProductSortSidebar
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />

          {/* Product Grid or Loading State */}
          <div className="w-full md:w-3/4 min-h-[300px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : sortedSunglasses.length > 0 ? (
              sortedSunglasses.map((product) => (
                <ProductCard key={product._id} data={product} />
              ))
            ) : (
              <h2 className="col-span-full text-center text-lg text-gray-500">
                No sunglasses found!
              </h2>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Sunglasses;
