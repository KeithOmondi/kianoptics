import React, { useEffect, useState } from 'react';
import ProductCard from '../productCard/productCard';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts } from '../../../redux/actions/product';

const BestDeals = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    // Fetch all products initially if not available
    if (!allProducts || allProducts.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, allProducts]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const sortedData = [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
      const firstFive = sortedData.slice(0, 5);
      setData(firstFive);
    }
  }, [allProducts]);

  return (
    <div className="w-full py-10 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">Best Deals</h2>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data && data.length !== 0 ? (
            data.map((item) => (
              <ProductCard key={item._id} data={item} />
            ))
          ) : (
            <p className="text-center col-span-full">No deals available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
