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
  
  // Redux state
  const { orders, error: ordersError } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products, error: productsError } = useSelector((state) => state.products);

  // Fetching orders and products when the seller's id is available
  useEffect(() => {
    if (seller?.id) {
      dispatch(getAllOrdersOfShop(seller.id));
      dispatch(getAllProductsShop(seller.id));
    }
  }, [dispatch, seller?.id]);

  // Formatting available balance to two decimal places
  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  // Columns for the DataGrid (for displaying orders)
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor",
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
      field: "action",
      flex: 1,
      minWidth: 150,
      headerName: "Action",
      type: "number",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/dashboard/order/${params.id}`}>
          <Button variant="contained" color="primary">
            <AiOutlineArrowRight size={20} />
          </Button>
        </Link>
      ),
    },
  ];

  // Mapping orders to the rows for DataGrid
  const rows = orders
    ? orders.map((order) => ({
        id: order.id,
        itemsQty: order.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "Ksh " + order.totalPrice,
        status: order.status,
      }))
    : [];

  if (ordersError || productsError) {
    return (
      <div className="w-full p-8 bg-gray-50">
        <h3 className="text-[24px] font-semibold pb-4 text-gray-700">Error</h3>
        <p className="text-red-600">{ordersError || productsError}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-50">
      <h3 className="text-[24px] font-semibold pb-4 text-gray-700">Overview</h3>

      <div className="w-full flex flex-wrap justify-between gap-6 overflow-hidden">
        {/* Account Balance Card */}
        <div className="w-full sm:w-[30%] min-h-[20vh] bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 shadow-lg rounded-xl p-6 text-white transition-transform hover:scale-105">
          <div className="flex items-center mb-4">
            <AiOutlineMoneyCollect size={40} className="mr-3" />
            <h3 className="text-[18px] font-medium">Account Balance</h3>
          </div>
          <p className="text-[22px] font-bold">{`Ksh. ${availableBalance}`}</p>
          <Link to="/dashboard-withdraw-money">
            <p className="pt-4 text-[#f5f5f5] font-medium hover:underline">
              Withdraw Money
            </p>
          </Link>
        </div>

        {/* Orders Card */}
        <div className="w-full sm:w-[30%] min-h-[20vh] bg-gradient-to-r from-purple-500 via-pink-400 to-red-500 shadow-lg rounded-xl p-6 text-white transition-transform hover:scale-105">
          <div className="flex items-center mb-4">
            <MdBorderClear size={40} className="mr-3" />
            <h3 className="text-[18px] font-medium">All Orders</h3>
          </div>
          <p className="text-[22px] font-bold">{orders ? orders.length : 0}</p>
          <Link to="/dashboard-orders">
            <p className="pt-4 text-[#f5f5f5] font-medium hover:underline">
              View Orders
            </p>
          </Link>
        </div>

        {/* Products Card */}
        <div className="w-full sm:w-[30%] min-h-[20vh] bg-gradient-to-r from-green-400 via-teal-300 to-cyan-500 shadow-lg rounded-xl p-6 text-white transition-transform hover:scale-105">
          <div className="flex items-center mb-4">
            <AiOutlineMoneyCollect size={40} className="mr-3" />
            <h3 className="text-[18px] font-medium">All Products</h3>
          </div>
          <p className="text-[22px] font-bold">{products ? products.length : 0}</p>
          <Link to="/dashboard-products">
            <p className="pt-4 text-[#f5f5f5] font-medium hover:underline">
              View Products
            </p>
          </Link>
        </div>
      </div>

      <br />
      <h3 className="text-[24px] font-semibold pb-4 text-gray-700">Latest Orders</h3>

      <div className="w-full min-h-[45vh] bg-white rounded-xl shadow-lg p-6">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          className="rounded-xl"
        />
      </div>
    </div>
  );
};

export default DashboardHero;
