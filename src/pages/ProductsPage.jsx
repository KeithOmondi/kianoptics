import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/productCard/productCard";
import ProductSortSidebar from "../components/Filters/ProductSortSidebar";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../redux/actions/product";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const { allProducts, isLoading, error } = useSelector((state) => state.products);
  const [selectedSort, setSelectedSort] = useState("");

  const dispatch = useDispatch();

  const category = searchParams.get("category"); // <-- ✅ Get category from URL

  useEffect(() => {
    if (!allProducts.length) {
      dispatch(getAllProducts());
    }
  }, [allProducts.length, dispatch]);

  // Filter products based on category
  const filteredProducts = category
    ? allProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      )
    : allProducts;

  // Sort products
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

  const sortedData = sortProducts(filteredProducts, selectedSort); // <-- ✅ Sort *after* filtering

  if (isLoading) {
    return <h2 className="text-center">Loading products...</h2>;
  }

  if (error) {
    return <h2 className="text-center text-red-500">Error loading products: {error}</h2>;
  }

  return (
    <div>
      <Header />
      <br />
      <br />
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sorting Sidebar */}
          <ProductSortSidebar
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />

          {/* Product Grid */}
          <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedData && sortedData.length > 0 ? (
              sortedData.map((item, index) => (
                <ProductCard key={item._id || index} data={item} />
              ))
            ) : (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No products found
              </h1>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
