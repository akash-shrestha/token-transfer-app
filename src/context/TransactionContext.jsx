import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

let provider;
let account;
let signer;

const getEthereumContract = () => {
  provider = new ethers.providers.Web3Provider(ethereum);
  signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
  });
  const [accountDetails, setAccountDetails] = useState({
    tokenName: "Token name",
    tokenSupply: "Total",
    tokenSymbol: "Symbol",
    tokenBalance: "Loading",
    ethereumBalance: "Loading",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return "Please install metamask wallet";

      const accounts = await ethereum.request({ method: "eth_accounts" });
      account = accounts[0];

      if (accounts.length) {
        setCurrentAccount(account);

        return true;
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const getAccountDetails = async () => {
    const transactionContract = getEthereumContract();

    const tokenName = await transactionContract.name();
    const tokenSupply = await transactionContract.totalSupply();
    const tokenSupplyInEth = ethers.utils.formatEther(tokenSupply);
    const tokenSymbol = await transactionContract.symbol();
    const ethereumBalance = await provider.getBalance(account);
    const ethereumBalanceInEth = ethers.utils.formatEther(ethereumBalance);
    const tokenBalance = await transactionContract.balanceOf(account);
    const tokenBalanceInEth = ethers.utils.formatEther(tokenBalance);

    setAccountDetails({
      tokenName: tokenName,
      tokenSupply: tokenSupplyInEth,
      tokenSymbol: tokenSymbol,
      tokenBalance: tokenBalanceInEth,
      ethereumBalance: ethereumBalanceInEth,
    });
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask !");

      const { addressTo, amount } = formData;

      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      setIsLoading(true);
      const transferResult = await transactionContract.transfer(
        addressTo,
        parsedAmount
      );
      setIsLoading(false);
      setFormData({
        addressTo: "",
        amount: "",
      });

      let signerAddress = await signer.getAddress();

      transactionContract.on("Transfer", async (from) => {
        if (from == signerAddress) {
          getAccountDetails();
        }
      });
    } catch (error) {
      alert("Error occurred, please try again");
      setIsLoading(false);
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected() && getAccountDetails();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        accountDetails,
        formData,
        setFormData,
        handleChange,
        sendTransaction,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
