import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller?._id}`, { withCredentials: true })
      .then((res) => {
        setIsLoading(false);
        setCoupouns(res.data.couponCodes);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    axios.delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then(() => {
        toast.success("Coupon code deleted successfully!");
        window.location.reload();
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${server}/coupon/create-coupon-code`, {
        name,
        minAmount,
        maxAmount,
        selectedProducts,
        value,
        shopId: seller?._id,
      }, { withCredentials: true })
      .then(() => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Coupon Code", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Value", minWidth: 100, flex: 0.6 },
    {
      field: "Delete",
      headerName: "",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleDelete(params.id)}
          className="text-red-600 hover:text-red-800"
        >
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ];

  const rows = coupouns.map((item) => ({
    id: item._id,
    name: item.name,
    price: item.value + " %",
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 mt-10 bg-white rounded-md shadow-md">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Create Coupon Code
            </button>
          </div>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />

          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white w-[90%] md:w-[40%] h-[80vh] rounded-md shadow-lg p-6 overflow-y-scroll">
                <div className="flex justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>

                <h2 className="text-2xl font-semibold text-center mb-6">Create Coupon Code</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700">Name<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                      placeholder="Enter coupon code name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Discount Percentage<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="value"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                      placeholder="Enter discount value"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Min Amount</label>
                    <input
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmout(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                      placeholder="Enter minimum amount"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Max Amount</label>
                    <input
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                      placeholder="Enter maximum amount"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Select Product</label>
                    <select
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
                    >
                      <option value="">Choose a product</option>
                      {products &&
                        products.map((product) => (
                          <option key={product._id} value={product.name}>
                            {product.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
