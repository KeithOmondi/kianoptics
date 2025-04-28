import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import Ratings from "../Products/Ratings";
import ProductCard from "../Route/productCard/productCard";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  const allReviews = products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="flex">
          <div className="flex items-center cursor-pointer pr-5" onClick={() => setActive(1)}>
            <h5 className={`font-semibold text-[20px] ${active === 1 ? "text-red-500" : "text-gray-800"}`}>
              Shop Products
            </h5>
          </div>
          <div className="flex items-center cursor-pointer pr-5" onClick={() => setActive(2)}>
            <h5 className={`font-semibold text-[20px] ${active === 2 ? "text-red-500" : "text-gray-800"}`}>
              Running Events
            </h5>
          </div>
          <div className="flex items-center cursor-pointer pr-5" onClick={() => setActive(3)}>
            <h5 className={`font-semibold text-[20px] ${active === 3 ? "text-red-500" : "text-gray-800"}`}>
              Shop Reviews
            </h5>
          </div>
        </div>

        {isOwner && (
          <Link to="/dashboard">
            <div className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer text-center h-[42px] flex items-center justify-center">
              Go Dashboard
            </div>
          </Link>
        )}
      </div>

      <br />

      {active === 1 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
          {products &&
            products.map((product, index) => (
              <ProductCard data={product} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {events &&
              events.map((event, index) => (
                <ProductCard
                  data={event}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Events for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((review, index) => (
              <div key={index} className="w-full flex my-4">
                <img
                  src={review.user.avatar?.url}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="pl-2">
                  <div className="flex items-center">
                    <h1 className="font-semibold pr-2">{review.user.name}</h1>
                    <Ratings rating={review.rating} />
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-gray-500 text-sm">2 days ago</p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
