import React, { useEffect, useState } from "react";
import "./Wallet.scss";
import { FiArrowUpRight, FiArrowDown } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { AiFillSetting, AiOutlineReload } from "react-icons/ai";
import ethereumIcon from "../../Assets/images/ethereum-logo.png";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";
import API from "../../APIs/API";
import { getBalance } from "../../ethereumLogic/index";
import axios from "axios";
import loader from "../Send/loading.gif";
import { getUSDValueOfEthereum } from "../../commanFunctions/commanFunctions";

export const Wallet = () => {
  const navigate = useNavigate();

  const [dollarPrice, setDollarPrice] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [rate, setRate] = useState(0);
  const importAddress = JSON.parse(localStorage.getItem("ethimport")) || [];

  localStorage.setItem("completed", true);
  const address = JSON.parse(localStorage.getItem("ethaddress"));
  const ethek = localStorage.getItem("ethek");
  const activeIndex = Number(localStorage.getItem("etheai"));
  useEffect(() => {
    if (!ethek.length || !address.length) {
      navigate("/");
    }
    fetchBalance();
  }, []);

  // Handle fetch RPC
  const [balance, setBalance] = useState(0);
  const addres =
    address.length > activeIndex
      ? address[activeIndex]
      : importAddress[activeIndex - address.length];
  const fetchBalance = async () => {
    setIsRefresh(true);
    let amount = await getBalance(addres);
    setBalance(amount / new BigNumber(1e18));
    setIsRefresh(false);
  };

  useEffect(() => {
    getDollarPrice();
  }, [balance]);

  // Handle Dollar Price
  const getDollarPrice = async () => {
    const response = await API.get(
      "/api/v1/convert-amount/ethereum-to-usd"
    );
    if (response?.status) {
      setDollarPrice(response?.data?.result * balance);
      setRate(response?.data?.result);
    }
  };

  function nav(move) {
    try {
      const currentIndex = document.activeElement.tabIndex;
      const next = currentIndex + move;
      const items = document.querySelectorAll(".items");
      const targetElement = items[next];
      targetElement.focus();
    } catch (e) {
      console.log("Home Error:", e);
    }
  }

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  }, []);

  function handleKeydown(e) {
    e.stopImmediatePropagation();
    switch (e.key) {
      case "ArrowUp":
        nav(-1);
        break;
      case "ArrowDown":
        nav(1);
        break;
      case "ArrowRight":
        nav(1);
        break;
      case "ArrowLeft":
        nav(-1);
        break;
    }
  }

  // Handle Refrece
  const handleReloadData = async () => {
    fetchBalance();
  };

  return (
    <div>
      <div className="wallet-screen">
        {!isRefresh && <div className="content">
          <div className="account-deatils">
            <div className="heading">
              <img src={ethereumIcon} alt="" />
              <span>Ethereum Wallet</span>
            </div>

            <div className="account">
              <div className="account-name">
                <span>Account {activeIndex + 1} </span>{" "}
                <div className="btn">
                  <button
                    onClick={handleReloadData}
                    tabIndex={0}
                    className="items"
                  >
                    <AiOutlineReload />
                  </button>
                </div>
              </div>
              <div className="account-address">{addres}</div>
            </div>
          </div>
          <div className="main">
            <div className="heading">Wallet (ETH)</div>
            <div className="balance">
              {(balance + "").split(".")[0]}
              <span className="float-balance">
                .
                {(balance + "").split(".")[1]
                  ? (balance + "").split(".")[1]
                  : "00"}
              </span>
            </div>
          </div>

          <div className="main">
            <div className="heading">Wallet (USD)</div>
            <div className="balance">
              ${(dollarPrice + "").split(".")[0]}
              <span className="float-balance">
                .
                {(dollarPrice + "").split(".")[1]
                  ? (dollarPrice + "").split(".")[1]
                  : "00"}
              </span>
            </div>
          </div>

          <div className="all-btns">
            <div className="btn">
              <button tabIndex={1} className="items" onClick={() => navigate("/all-wallet")}>
                <GoPlus />
              </button>
              <label htmlFor="">Add</label>
            </div>
            <div className="btn">
              <button tabIndex={2} className="items" onClick={() => navigate("/send")}>
                <FiArrowUpRight />
              </button>
              <label htmlFor="">Send</label>
            </div>
            <div className="btn">
              <button tabIndex={3} className="items" onClick={() => navigate("/receive")}>
                <FiArrowDown />
              </button>
              <label htmlFor="">Recive</label>
            </div>
            <div className="btn">
              <button
                tabIndex={4}
                className="items"
                onClick={() => navigate("/setting")}
              >
                <AiFillSetting />
              </button>
              <label htmlFor="">Setting</label>
            </div>
          </div>
        </div>}

        {isRefresh &&
          <div className="content">
            <div className="reload-container">
              <div className="loader-img">
                <img src={loader} />
              </div>
              <span>Loading....</span>
            </div>
          </div>}
      </div>
    </div>
  );
};
