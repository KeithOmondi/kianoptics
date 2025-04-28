import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (address1 === "" || address2 === "" || zipCode === null || country === "" || city === "") {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = { address1, address2, zipCode, country, city };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;

      if (res.data.couponCode !== null) {
        const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exist!");
        setCouponCode("");
      }
    });
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-8 bg-gray-50">
      <div className="w-[90%] max-w-6xl mx-auto block lg:flex">
        {/* Shipping Info Section */}
        <div className="w-full lg:w-[65%] p-5 bg-white rounded-lg shadow-lg">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>

        {/* Cart Data Section */}
        <div className="w-full lg:w-[35%] lg:mt-0 mt-8 p-5 bg-white rounded-lg shadow-lg">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
          />
        </div>
      </div>

      {/* Payment Button */}
      <div
        className="bg-[#f63b60] w-[200px] lg:w-[280px] mt-10 py-3 text-center text-white rounded-lg cursor-pointer shadow-lg transition-all duration-300 hover:scale-105"
        onClick={paymentSubmit}
      >
        <h5 className="text-lg font-semibold">Proceed to Payment</h5>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-md">
      <h5 className="text-xl font-semibold text-gray-700 mb-5">Shipping Address</h5>
      <form>
        {/* Name and Email Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              value={user?.name}
              required
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              value={user?.email}
              required
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
            />
          </div>
        </div>

        {/* Phone and Zip Code Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="number"
              required
              value={user?.phoneNumber}
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
            />
          </div>
        </div>

        {/* Country and City Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Country</label>
            <select
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">City</label>
            <select
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your City</option>
              {State.getStatesOfCountry(country).map((item) => (
                <option key={item.isoCode} value={item.isoCode}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address 1 and 2 Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Address 1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Address 2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className="w-full border h-12 rounded-md p-3 mt-1 shadow-sm"
            />
          </div>
        </div>
      </form>

      {/* Saved Addresses */}
      <h5
        className="text-sm font-medium text-blue-500 cursor-pointer mt-3"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div className="mt-2">
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex mt-2" key={index}>
                <input
                  type="checkbox"
                  className="mr-3"
                  value={item.addressType}
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                <h2 className="text-sm font-medium">{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({ handleSubmit, totalPrice, shipping, subTotalPrice, couponCode, setCouponCode, discountPercentenge }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-5">
      {/* Subtotal */}
      <div className="flex justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Subtotal:</h3>
        <h5 className="text-lg font-semibold">Ksh{subTotalPrice}</h5>
      </div>
      {/* Shipping */}
      <div className="flex justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">Shipping:</h3>
        <h5 className="text-lg font-semibold">Ksh{shipping.toFixed(2)}</h5>
      </div>
      {/* Discount */}
      <div className="flex justify-between border-b pb-3 mb-4">
        <h3 className="text-sm font-medium text-gray-600">Discount:</h3>
        <h5 className="text-lg font-semibold">
          - {discountPercentenge ? "Ksh" + discountPercentenge.toString() : null}
        </h5>
      </div>
      {/* Total Price */}
      <h5 className="text-lg font-semibold text-right pt-3">Ksh{totalPrice}</h5>

      {/* Coupon Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full h-12 border rounded-md p-3 mt-4"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full h-12 bg-[#f63b60] text-white rounded-md mt-5 hover:bg-[#e23e52] transition-all duration-300"
        >
          Apply code
        </button>
      </form>
    </div>
  );
};

export default Checkout;
