import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
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

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/user/logout`, { withCredentials: true });
      toast.success(data.message);
      navigate("/login");
      window.location.reload(); 
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const sidebarItems = [
    { id: 1, label: "Profile", icon: <RxPerson size={24} />, action: () => setActive(1) },
    { id: 2, label: "Orders", icon: <HiOutlineShoppingBag size={24} />, action: () => setActive(2) },
    { id: 3, label: "Refunds", icon: <HiOutlineReceiptRefund size={24} />, action: () => setActive(3) },
    { id: 4, label: "Inbox", icon: <AiOutlineMessage size={24} />, action: () => { setActive(4); navigate("/inbox"); }},
    { id: 5, label: "Track Order", icon: <MdOutlineTrackChanges size={24} />, action: () => setActive(5) },
    { id: 6, label: "Change Password", icon: <RiLockPasswordLine size={24} />, action: () => setActive(6) },
    { id: 7, label: "Address", icon: <TbAddressBook size={24} />, action: () => setActive(7) },
  ];

  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8 flex flex-col gap-6">
      {/* Sidebar Navigation */}
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          onClick={item.action}
          className={`flex items-center gap-4 cursor-pointer group ${
            active === item.id ? "text-red-500" : "text-gray-700"
          }`}
        >
          {React.cloneElement(item.icon, {
            color: active === item.id ? "red" : "gray",
            className: "group-hover:text-red-500",
          })}
          <span className="hidden md:inline text-sm font-medium">
            {item.label}
          </span>
        </div>
      ))}

      {/* Admin Dashboard */}
      {user?.role === "Admin" && (
        <Link to="/admin/dashboard" className="w-full">
          <div
            onClick={() => setActive(8)}
            className={`flex items-center gap-4 cursor-pointer group ${
              active === 8 ? "text-red-500" : "text-gray-700"
            }`}
          >
            <MdOutlineAdminPanelSettings
              size={24}
              color={active === 8 ? "red" : "gray"}
              className="group-hover:text-red-500"
            />
            <span className="hidden md:inline text-sm font-medium">
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}

      {/* Logout */}
      <div
        onClick={logoutHandler}
        className="flex items-center gap-4 cursor-pointer group text-gray-700"
      >
        <AiOutlineLogin size={24} className="group-hover:text-red-500" />
        <span className="hidden md:inline text-sm font-medium">
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
