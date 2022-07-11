import React, { useContext } from "react";
import { BsWallet2 } from "react-icons/bs";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { Loader } from ".";
import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.000001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Main = () => {
  const {
    connectWallet,
    currentAccount,
    formData,
    sendTransaction,
    handleChange,
    isLoading,
    accountDetails,
  } = useContext(TransactionContext);

  const handleSubmit = (e) => {
    const { addressTo, amount } = formData;

    e.preventDefault();

    if (!addressTo || !amount) return;

    sendTransaction();
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
        <div className="flex flex-1 justify-start items-start flex-col mf:mr-10">
          {!currentAccount ? (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 border-[2px] p-2 border-[#b6fcb7] bg-[#9249fa]  p-3 rounded-full cursor-pointer hover:bg-[#b383f7]"
            >
              <BsWallet2 className="text-white mr-2" />
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>
          ) : (
            <div>
              <p className="text-green-300 text-lg text-center pb-9 italic">
                Balance 💸
              </p>
              <p className="text-white font-bold text-xl">
                💰 {accountDetails.tokenBalance} SOL
              </p>
              <p className="text-white font-bold pt-2 text-xl">
                ⛽ {accountDetails.ethereumBalance} ETH
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 animate-bounce rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                <p className="text-white"> {accountDetails.tokenSymbol}</p>
                <BsInfoCircle fontSize={17} color="#fff" />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-white font-semibold text-sm">
                  {currentAccount ? shortenAddress(currentAccount) : "Address"}
                </p>
                <div>
                  <p className="text-white font-light text-sm">
                    {accountDetails.tokenName}
                  </p>
                  <p className="text-white font-light text-sm">
                    {accountDetails.tokenSupply} supply
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
            <Input
              placeholder="Address To"
              name="addressTo"
              type="text"
              value={formData.addressTo}
              handleChange={handleChange}
            />
            <Input
              placeholder="Amount (SOL)"
              name="amount"
              type="number"
              value={formData.amount}
              handleChange={handleChange}
            />
            <div className="h-[1px] w-full bg-indigo-300 my-2" />
            {isLoading ? (
              <Loader />
            ) : (
              <button
                type="button"
                onClick={currentAccount ? handleSubmit : connectWallet}
                className="text-white w-full animate-pulse mt-2 border-[1px] p-2 border-[#4ec74f] hover:bg-[#b383f7] rounded-full cursor-pointer"
              >
                {currentAccount ? "Send now" : "Please connect wallet"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
