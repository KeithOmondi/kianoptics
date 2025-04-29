import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "text-green-600"
          : "text-red-600",
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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/dashboard/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  const rows =
    orders?.map((order) => ({
      id: order._id,
      itemsQty: order.cart.reduce((acc, item) => acc + item.qty, 0),
      total: "Ksh " + order.totalPrice,
      status: order.status,
    })) || [];

  return (
    <div className="w-full p-8">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Overview</h3>

      <div className="w-full flex flex-col gap-4 lg:flex-row justify-between">
        {/* Account Balance */}
        <div className="w-full lg:w-[30%] bg-white shadow rounded p-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700">
              Account Balance{" "}
              <span className="text-sm text-gray-500">
                (with 10% service charge)
              </span>
            </h3>
          </div>
          <h5 className="pt-2 pl-9 text-2xl font-semibold text-gray-800">
            Ksh. {availableBalance}
          </h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-2 text-teal-600 hover:underline">
              Withdraw Money
            </h5>
          </Link>
        </div>

        {/* Orders */}
        <div className="w-full lg:w-[30%] bg-white shadow rounded p-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700">All Orders</h3>
          </div>
          <h5 className="pt-2 pl-9 text-2xl font-semibold text-gray-800">
            {orders?.length || 0}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-teal-600 hover:underline">
              View Orders
            </h5>
          </Link>
        </div>

        {/* Products */}
        <div className="w-full lg:w-[30%] bg-white shadow rounded p-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2 text-gray-600" />
            <h3 className="text-lg font-medium text-gray-700">All Products</h3>
          </div>
          <h5 className="pt-2 pl-9 text-2xl font-semibold text-gray-800">
            {products?.length || 0}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-teal-600 hover:underline">
              View Products
            </h5>
          </Link>
        </div>
      </div>

      <br />

      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Latest Orders
      </h3>

      <div className="w-full min-h-[45vh] bg-white rounded shadow p-4">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardHero;
