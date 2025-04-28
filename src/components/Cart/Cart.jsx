import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

    // Prevent scrolling when the cart is open
    useEffect(() => {
        if (setOpenCart) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [setOpenCart]);

  return (
    <div className="fixed top-0 left-0 w-full bg-black/40 h-screen z-50">
      <div className="fixed top-0 right-0 h-full w-[80%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-white flex flex-col overflow-y-auto justify-between shadow-lg">
        {cart && cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <h5 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-4">Your cart empty!</h5>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end pt-4 pr-4">
              <RxCross1
                size={25}
                className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setOpenCart(false)}
              />
            </div>
            {/* Cart Header */}
            <div className="flex items-center p-4 border-b">
              <IoBagHandleOutline size={25} className="text-gray-800" />
              <h5 className="pl-2 text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                {cart && cart.length} items
              </h5>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {cart &&
                cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
            </div>

            {/* Checkout Section */}
            <div className="p-4">
              <Link to="/checkout">
                <div
                  className={`h-12 flex items-center justify-center w-full bg-[#e44343] rounded-md hover:bg-[#c83737] transition-colors`}
                >
                  <h1 className="text-white text-lg font-semibold">
                    Checkout Now (Ksh. {totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-4 flex items-center">
      <div className="flex items-center gap-4 w-full">
        {/* Quantity Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className="bg-[#e44343] hover:bg-[#c83737] text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={() => increment(data)}
          >
            <HiPlus size={20} />
          </button>
          <span className="text-base sm:text-lg font-medium min-w-[2rem] text-center">{data.qty}</span>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={18} />
          </button>
        </div>

        {/* Product Image */}
        <img
          src={`${data?.images[0]?.url}`}
          alt={data.name}
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain rounded-md"
        />

        {/* Product Info */}
        <div className="flex-1 pl-2 sm:pl-4">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">{data.name}</h1>
          <h4 className="text-sm sm:text-base text-gray-600">
            ${data.discountPrice} x {value}
          </h4>
          <h4 className="font-bold text-md sm:text-lg text-red-600">
            Ksh. {totalPrice}
          </h4>
        </div>

        {/* Remove Button */}
        <button
          className="ml-auto text-gray-500 hover:text-red-500 transition-colors"
          onClick={() => removeFromCartHandler(data)}
        >
          <RxCross1 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Cart;
