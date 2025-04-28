import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-600 animate-spin"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-b-4 border-yellow-600 animate-spin [animation-delay:-0.5s]"></div>
      </div>
    </div>
  );
};

export default Loader;
