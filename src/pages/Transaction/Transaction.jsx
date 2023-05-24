import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import noTransection from "./transection-img.png";
import "./Transaction.scss";
import BigNumber from "bignumber.js";
import loading from "../Send/loading.gif";
import { getAllTransactions } from "../../ethereumLogic";
import API from "../../APIs/API";

const Transaction = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const [status, setStatus] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const address = JSON.parse(localStorage.getItem("ethaddress"));
  const activeIndex = localStorage.getItem("etheai");
  const importAddress = JSON.parse(localStorage.getItem("ethimport"));
  let currentAddress =
    address.length > activeIndex
      ? address[activeIndex]
      : importAddress[activeIndex - address.length];

  // Handle Fetch Transaction History
  const fetchTransactionHistory = async () => {
    setTransactionLoading(true);
    if (currentAddress) {
      let response = await API.post('/api/v1/transactions/transaction-history',{address: currentAddress,network: "s"});
      if (response?.status) {
        setStatus(true);
        setTransactionData(response?.data?.result);
      }
    }
    setTransactionLoading(false);
  };

  // Generate Time Date from TimeStamp
  const genrateTimeDate = (timestamp) => {
    return new Date(Number(timestamp) * 1000).toDateString();
  };

  return (
    <div className="transaction-main-screen">
      <div className="transaction-body">
        {/* This code for if not have any transaction then show it */}
        {!status && !transactionLoading && (
          <div className="notransaction-section">
            <div className="heading">
              <button
                className="items"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(-1);
                  }
                }}
                onClick={() => navigate(-1)}
              >
                <BsArrowLeft />
              </button>
            </div>
            <div className="no-transaction">
              <img alt="" src={noTransection} />
              <div>You have no transactions</div>
            </div>
          </div>
        )}

        {/* This Code for Transection */}
        {status && !transactionLoading && (
          <div className="transaction-section">
            <div className="body-heading">
              <button
                className="items"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigate(-1);
                  }
                }}
                onClick={() => navigate(-1)}
              >
                <BsArrowLeft />
              </button>{" "}
              Transactions
            </div>

            <div className="all-transaction">
              {transactionData.map((element, index) => {
                return (
                  <div key={index} className="trans">
                    <button
                      className="items"
                      tabIndex={index + 1}
                      key={index}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          navigate(`/details/:${element.hash}`);
                        }
                      }}
                      onClick={() => navigate(`/details/:${element.hash}`)}
                    >
                      <div className="wrap">
                        <div style={{ display: "inline-block" }}>
                          <div className="trns-icon">
                            {element.from.toLowerCase() ==
                            currentAddress.toLowerCase() ? (
                              <FiArrowUpRight />
                            ) : (
                              <FiArrowDownLeft />
                            )}
                          </div>
                        </div>
                        <div className="trans-sec">
                          <div className="from-add mb-4">
                            <div className="trans-point">FROM ADDRESS : </div>{" "}
                            {element.from.slice(0, 5)}....
                            {element.from.slice(-5)}
                          </div>
                          <div className="to-add mb-4">
                            <div className="trans-point">TO ADDRESS : </div>{" "}
                            {element.to.slice(0, 5)}....{element.to.slice(-5)}
                          </div>
                          <div className="value mb-4">
                            <div className="trans-point">VALUE : </div>
                            {Number(element.value) / new BigNumber(1e18)} ETH
                          </div>
                          <div className="value mb-4">
                            <div className="trans-point">Time : </div>
                            {genrateTimeDate(element?.timeStamp)}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {transactionLoading && (
          <div>
            <div className="form" style={{ padding: "5rem 1rem" }}>
              <div style={{ width: "55px", height: "55px", margin: "auto" }}>
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={loading}
                  alt=""
                />
              </div>
              <p style={{ textAlign: "center", marginTop: "10px" }}>
                Loading...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
