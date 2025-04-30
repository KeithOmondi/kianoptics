import React, { useState } from "react";
import { AiOutlineLogin, AiOutlineMenu } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineAdminPanelSettings, MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      toast.success(data.message);
      navigate("/login");
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const sidebarItems = [
    { id: 1, label: "Profile", icon: RxPerson },
    { id: 2, label: "Orders", icon: HiOutlineShoppingBag },
    { id: 3, label: "Refunds", icon: HiOutlineReceiptRefund },
    { id: 5, label: "Track Order", icon: MdOutlineTrackChanges },
    { id: 6, label: "Change Password", icon: RiLockPasswordLine },
    { id: 7, label: "Address", icon: TbAddressBook },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4">
      {/* Mobile Toggle */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
          <AiOutlineMenu size={24} />
        </button>
      </div>

      <div className={`flex flex-col space-y-4 ${isOpen ? "block" : "hidden"} md:block`}>
        {/* Sidebar Items */}
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              setIsOpen(false);
            }}
            className={`flex items-center w-full gap-3 px-3 py-2 rounded-md transition-colors 
              ${active === id ? "bg-red-100 text-red-600" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <Icon size={22} className={`${active === id ? "text-red-500" : "text-gray-500"}`} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}

        {/* Admin Panel */}
        {user?.role === "Admin" && (
          <Link to="/admin/dashboard" onClick={() => setActive(8)}>
            <div
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors 
                ${active === 8 ? "bg-red-100 text-red-600" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <MdOutlineAdminPanelSettings
                size={22}
                className={`${active === 8 ? "text-red-500" : "text-gray-500"}`}
              />
              <span className="text-sm font-medium">Admin Dashboard</span>
            </div>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={logoutHandler}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <AiOutlineLogin size={22} className="text-gray-500" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
