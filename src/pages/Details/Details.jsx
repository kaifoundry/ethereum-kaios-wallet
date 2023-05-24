import React, { useEffect, useState } from "react";
import "./Details.scss";
import { FaRegCopy } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import API from "../../APIs/API";
import BigNumber from "bignumber.js";
import { getTransactionDetails } from "../../ethereumLogic";

function Details() {
  const navigate = useNavigate();
  const param = useParams();
  const messageid = param.messageid.slice(1);
  const activeIndex = localStorage.getItem("etheai");
  const address = JSON.parse(localStorage.getItem("ethaddress"));
  const importAddress = JSON.parse(localStorage.getItem("ethimport"));
  let currentAddress =
    address.length > activeIndex
      ? address[activeIndex]
      : importAddress[activeIndex - address.length];

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

  const [transactionData, setTransactionData] = useState([]);
  // Handle Api Call for Getting All Data from Message id
  const getDataFromMsg = async () => {
    if (messageid) {
      const transaction = await getTransactionDetails(messageid);
      if (transaction) {
        setTransactionData(transaction);
      }
    }
  };

  useEffect(() => {
    getDataFromMsg();
  }, []);

  // Generate Time Date from TimeStamp
  const genrateTimeDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div>
      <div id="details">
        <div className="container">
          <div className="first">
            <button
              style={{ fontSize: "1.3rem" }}
              className="items"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigate(-1);
                }
              }}
              onClick={() => navigate(-1)}
            >
              <BsArrowLeft className="larr" />
            </button>
            <div>Transaction Details</div>
          </div>
          <div className="second">
            <div className="label">To</div>
            <div className="data">
              <span>{transactionData?.to}</span>
              <FaRegCopy
                className="items"
                tabIndex={1}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigator.clipboard.writeText("").then(function (x) {
                      alert("Copied to clipboard");
                    });
                  }
                }}
                onClick={() => {
                  navigator.clipboard.writeText("").then(function (x) {
                    alert("Copied to clipboard");
                  });
                }}
              />
            </div>
          </div>
          <div className="second">
            <div className="label">From</div>
            <div className="data">
              <span>{transactionData?.from}</span>
              <FaRegCopy
                className="items"
                tabIndex={2}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigator.clipboard.writeText("").then(function (x) {
                      alert("Copied to clipboard");
                    });
                  }
                }}
                onClick={() => {
                  navigator.clipboard.writeText("").then(function (x) {
                    alert("Copied to clipboard");
                  });
                }}
              />
            </div>
          </div>

          <div className="second">
            <div className="label">Amount (ETH)</div>
            <div className="data">
              <span>
                {Number(transactionData?.value) / new BigNumber(1e18)} ETH
              </span>
            </div>
          </div>
          {transactionData?.timestamp && (
            <div className="second">
              <div className="label">Time</div>
              <div className="data">
                <span>{genrateTimeDate(transactionData.timestamp)}</span>
              </div>
            </div>
          )}
          <div className="second">
            <div className="label">Block ID</div>
            <div className="data">
              <span>{transactionData?.blockHash}</span>
              <FaRegCopy
                className="items"
                tabIndex={3}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigator.clipboard.writeText("").then(function (x) {
                      alert("Copied to clipboard");
                    });
                  }
                }}
                onClick={() => {
                  navigator.clipboard.writeText("").then(function (x) {
                    alert("Copied to clipboard");
                  });
                }}
              />
            </div>
          </div>
          <div className="second">
            <div className="label">Transaction Hash</div>
            <div className="data">
              <span>{transactionData?.hash}</span>
              <FaRegCopy
                className="items"
                tabIndex={3}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigator.clipboard.writeText("").then(function (x) {
                      alert("Copied to clipboard");
                    });
                  }
                }}
                onClick={() => {
                  navigator.clipboard.writeText("").then(function (x) {
                    alert("Copied to clipboard");
                  });
                }}
              />
            </div>
          </div>
          <div className="second">
            <div className="label">Block No.</div>
            <div className="data">
              <span>{transactionData?.blockNumber}</span>
              <FaRegCopy
                className="items"
                tabIndex={4}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    navigator.clipboard.writeText("").then(function (x) {
                      alert("Copied to clipboard");
                    });
                  }
                }}
                onClick={() => {
                  navigator.clipboard.writeText("").then(function (x) {
                    alert("Copied to clipboard");
                  });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
