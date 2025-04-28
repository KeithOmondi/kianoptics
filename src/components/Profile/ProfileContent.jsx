import React, { useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { deleteUserAddress, loadUser, updateUserAddress, updateUserInformation } from "../../redux/actions/user";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md">
  {/* profile */}
  {active === 1 && (
    <>
      <div className="flex justify-center w-full mb-6">
        <div className="relative">
          <img
            src={`${user?.avatar?.url}`}
            className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
            alt="User Avatar"
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label htmlFor="image">
              <AiOutlineCamera />
            </label>
          </div>
        </div>
      </div>

      <div className="w-full px-5">
        <form onSubmit={handleSubmit} aria-required={true}>
          {/* Full Name & Email Row */}
          <div className="w-full 800px:flex block gap-6 pb-4">
            <div className="w-full 800px:w-[50%]">
              <label className="block text-gray-700 font-medium pb-2">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full 800px:w-[50%]">
              <label className="block text-gray-700 font-medium pb-2">Email Address</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone Number & Password Row */}
          <div className="w-full 800px:flex block gap-6 pb-4">
            <div className="w-full 800px:w-[50%]">
              <label className="block text-gray-700 font-medium pb-2">Phone Number</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="w-full 800px:w-[50%]">
              <label className="block text-gray-700 font-medium pb-2">Enter your password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <input
              className="w-[250px] h-[40px] bg-blue-600 text-white text-center rounded-md mt-4 cursor-pointer hover:bg-blue-700 transition"
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </>
  )}

  {/* Order Section */}
  {active === 2 && (
    <div className="mt-6">
      <AllOrders />
    </div>
  )}

  {/* Refund Section */}
  {active === 3 && (
    <div className="mt-6">
      <AllRefundOrders />
    </div>
  )}

  {/* Track Order Section */}
  {active === 5 && (
    <div className="mt-6">
      <TrackOrder />
    </div>
  )}

  {/* Change Password Section */}
  {active === 6 && (
    <div className="mt-6">
      <ChangePassword />
    </div>
  )}

  {/* User Address Section */}
  {active === 7 && (
    <div className="mt-6">
      <Address />
    </div>
  )}
</div>

  );
};

const AllOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { userOrders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: " ",
      type: "number",
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const rows = userOrders?.map((order) => ({
    id: order._id,
    itemsQty: order.cart.length,
    total: "Ksh. " + order.totalPrice,
    status: order.status,
  })) || [];

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        loading={isLoading}
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { userOrders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user._id]);

  const eligibleOrders = userOrders?.filter(
    (order) => order.status === "Processing refund"
  ) || [];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: " ",
      flex: 1,
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = eligibleOrders.map((order) => ({
    id: order._id,
    itemsQty: order.cart.length,
    total: "Ksh. " + order.totalPrice,
    status: order.status,
  }));

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        loading={isLoading}
      />
    </div>
  );
};

const TrackOrder = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { userOrders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user && user._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user._id]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.row.status === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "actions",
      headerName: " ",
      flex: 1,
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/user/track/order/${params.id}`}>
          <Button>
            <MdTrackChanges size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows = userOrders.map((order) => ({
    id: order._id,
    itemsQty: order.cart.length,
    total: "Ksh. " + order.totalPrice,
    status: order.status,
  }));

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        loading={isLoading}
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      toast.success(data.success);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>

      <div className="w-full">
        <form
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className="w-full 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className="w-[95%] p-2 border rounded mb-4"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className="w-[95%] p-2 border rounded mb-4"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="w-full 800px:w-[50%] mt-2">
            <label className="block pb-2">Confirm your new password</label>
            <input
              type="password"
              className="w-[95%] p-2 border rounded mb-4"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-[95%] h-[40px] border border-[#3a24db] text-[#3a24db] rounded mt-8 cursor-pointer"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    { name: "Default" },
    { name: "Home" },
    { name: "Office" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(updateUserAddress(country, city, address1, address2, zipCode, addressType));
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">Add New Address</h1>
            <form onSubmit={handleSubmit} className="w-full p-4">
              <div className="w-full pb-2">
                <label className="block pb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-[95%] border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose your country</option>
                  {Country &&
                    Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full pb-2">
                <label className="block pb-2">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-[95%] border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose your city</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full pb-2">
                <label className="block pb-2">Address 1</label>
                <input
                  type="text"
                  className="w-[95%] border h-[40px] rounded-[5px]"
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="w-full pb-2">
                <label className="block pb-2">Address 2</label>
                <input
                  type="text"
                  className="w-[95%] border h-[40px] rounded-[5px]"
                  required
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className="w-full pb-2">
                <label className="block pb-2">Zip Code</label>
                <input
                  type="number"
                  className="w-[95%] border h-[40px] rounded-[5px]"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div className="w-full pb-2">
                <label className="block pb-2">Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-[95%] border h-[40px] rounded-[5px]"
                >
                  <option value="">Choose Address Type</option>
                  {addressTypeData.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full pb-2">
                <input
                  type="submit"
                  className="w-[95%] bg-blue-500 text-white rounded-[5px] py-2 cursor-pointer"
                  value="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">My Addresses</h1>
        <div
          className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <span>Add New</span>
        </div>
      </div>
      <br />
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">You don't have any saved address!</h5>
      )}

      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px]">{item.address1} {item.address2}</h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px]">{user && user.phoneNumber}</h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};


export default ProfileContent;
