import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then(() => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/shop/update-seller-info`,
        { name, address, zipCode, phoneNumber, description },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md">
        {/* Avatar Section */}
        <div className="flex justify-center mb-10 relative">
          <img
            src={avatar || seller?.avatar?.url}
            alt="Shop Avatar"
            className="w-40 h-40 rounded-full object-cover border-4 border-red-400"
          />
          <label
            htmlFor="image"
            className="absolute bottom-4 right-[42%] bg-red-500 hover:bg-red-600 text-white p-2 rounded-full cursor-pointer shadow-md"
          >
            <AiOutlineCamera size={20} />
          </label>
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImage}
          />
        </div>

        {/* Form Section */}
        <form onSubmit={updateHandler} className="flex flex-col gap-6">
          {[
            { label: "Shop Name", value: name, setValue: setName, placeholder: seller?.name },
            { label: "Shop Description", value: description, setValue: setDescription, placeholder: seller?.description || "Enter your shop description" },
            { label: "Shop Address", value: address, setValue: setAddress, placeholder: seller?.address },
            { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, placeholder: seller?.phoneNumber, type: "number" },
            { label: "Zip Code", value: zipCode, setValue: setZipcode, placeholder: seller?.zipCode, type: "number" }
          ].map(({ label, value, setValue, placeholder, type = "text" }, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-sm text-gray-700 mb-2">{label}</label>
              <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                required
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Update Shop
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
