import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SellerProtectedRoute = ({ children }) => {
  const { isSeller } = useSelector((state) => state.seller);

  console.log("SellerProtectedRoute - Redux State:", { isSeller });

  if (!isSeller) {
    console.log("Seller not authenticated, redirecting to /shop-login...");
    return <Navigate to="/shop-login" replace />;
  }

  console.log("Seller authenticated, rendering children...");
  return children;
};

export default SellerProtectedRoute;
