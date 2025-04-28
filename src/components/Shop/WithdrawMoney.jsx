import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";

const WithdrawMoney = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const withdrawMethod = { ...bankInfo };

    setPaymentMethod(false);

    try {
      await axios.put(`${server}/shop/update-payment-methods`, { withdrawMethod }, { withCredentials: true });
      toast.success("Withdraw method added successfully!");
      dispatch(loadSeller());
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      });
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`${server}/shop/delete-withdraw-method`, { withCredentials: true });
      toast.success("Withdraw method deleted successfully!");
      dispatch(loadSeller());
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const withdrawHandler = async () => {
    if (withdrawAmount < 50 || withdrawAmount > seller?.availableBalance) {
      toast.error("You can't withdraw this amount!");
    } else {
      try {
        await axios.post(
          `${server}/withdraw/create-withdraw-request`,
          { amount: withdrawAmount },
          { withCredentials: true }
        );
        toast.success("Withdraw money request is successful!");
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    }
  };

  const availableBalance = seller?.availableBalance?.toFixed(2);

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col shadow">
        <h5 className="text-[20px] pb-4">Available Balance: Ksh. {availableBalance}</h5>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded mt-4"
          onClick={() => (availableBalance < 50 ? toast.error("You not have enough balance to withdraw!") : setOpen(true))}
        >
          Withdraw
        </button>
      </div>

      {open && (
        <div className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className={`w-[95%] md:w-[50%] bg-white shadow rounded p-6 ${paymentMethod ? "h-[80vh] overflow-y-scroll" : "min-h-[40vh]"}`}>
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setPaymentMethod(false);
                }}
              />
            </div>

            {paymentMethod ? (
              <>
                <h3 className="text-[22px] font-semibold text-center mb-6">Add new Withdraw Method:</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Bank Name", value: "bankName" },
                    { label: "Bank Country", value: "bankCountry" },
                    { label: "Bank Swift Code", value: "bankSwiftCode" },
                    { label: "Bank Account Number", value: "bankAccountNumber" },
                    { label: "Bank Holder Name", value: "bankHolderName" },
                    { label: "Bank Address", value: "bankAddress" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <label className="block mb-1 font-medium">
                        {item.label} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={item.value.includes("AccountNumber") ? "number" : "text"}
                        required
                        value={bankInfo[item.value]}
                        onChange={(e) => setBankInfo({ ...bankInfo, [item.value]: e.target.value })}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter your ${item.label.toLowerCase()}!`}
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded w-full mt-4"
                  >
                    Add
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-[22px] font-semibold mb-6">Available Withdraw Methods:</h3>

                {seller?.withdrawMethod ? (
                  <div>
                    <div className="md:flex w-full justify-between items-center mb-4">
                      <div className="md:w-1/2 space-y-2">
                        <h5>
                          Account Number:{" "}
                          {"*".repeat(seller.withdrawMethod.bankAccountNumber.length - 3) +
                            seller.withdrawMethod.bankAccountNumber.slice(-3)}
                        </h5>
                        <h5>Bank Name: {seller.withdrawMethod.bankName}</h5>
                      </div>
                      <div className="md:w-1/2 flex justify-end">
                        <AiOutlineDelete
                          size={25}
                          className="cursor-pointer text-red-500"
                          onClick={deleteHandler}
                        />
                      </div>
                    </div>

                    <h4 className="text-lg font-medium mb-4">Available Balance: Ksh. {availableBalance}</h4>

                    <div className="md:flex w-full items-center gap-4">
                      <input
                        type="number"
                        placeholder="Amount..."
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="border rounded px-3 py-2 w-full md:w-[120px]"
                      />
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded mt-2 md:mt-0"
                        onClick={withdrawHandler}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-[18px] pt-4">No Withdraw Methods available!</p>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded mt-6"
                      onClick={() => setPaymentMethod(true)}
                    >
                      Add New
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
