import React, { useEffect, useState, useRef } from "react";
import { MdQrCode2 } from "react-icons/md";
import "./Send.scss";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import {
  decryptData,
  getUSDValueOfEthereum,
} from "../../commanFunctions/commanFunctions";
import QrScanner from "qr-scanner";
import API from "../../APIs/API";
import BigNumber from "bignumber.js";
import { useDispatch, useSelector } from "react-redux";
import { savePrivateKey } from "../../Redux/action/index";
import loading from "./loading.gif";
import paymentDone from "./green-tick.png";
import {
  createTransaction,
  getBalance,
  sendSignedTransaction,
  signTransaction,
} from "../../ethereumLogic";

const Send = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const videoRef = useRef();
  const photoRef = useRef();
  const inputRef = useRef(null);

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
    }
  }

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  }, []);

  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [scannerOn, setScannerOn] = useState(false);
  const [amaoutValid, setAmountValid] = useState(true);

  // This UseEffect Check Balance is Exist or not when user fill amount
  useEffect(() => {
    if (amount > balance) {
      setAmountValid(false);
    } else {
      setAmountValid(true);
    }
  }, [amount]);

  // Handle fetch RPC
  const [balance, setBalance] = useState(0);
  const fetchBalance = async () => {
    let add =
      activeIndex < address.length
        ? address[activeIndex]
        : importAddress[activeIndex - address.length];
    const bal = await getBalance(add);
    setBalance(bal / new BigNumber(1e18));
  };

  const address = JSON.parse(localStorage.getItem("ethaddress"));
  const importAddress = JSON.parse(localStorage.getItem("ethimport"));
  const ethek = JSON.parse(localStorage.getItem("ethek"));
  const activeIndex = localStorage.getItem("etheai");
  useEffect(() => {
    if (!ethek.length || !address.length) {
      navigate("/");
    }
    fetchBalance();
  }, []);

  // New Scanner Function for qr img
  const readQrCode = (file) => {
    if (!file) {
      return;
    }
    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then((result) => {
        if (result?.data) {
          setToAddress(result.data);
          setScanResult(result.data);
          setScannerOn(false);
        }
      })
      .catch((e) => setScanResult(""));
  };

  // Create a blob img
  async function blobImg(url) {
    const pngUrl = url;
    const blob = await (await fetch(pngUrl)).blob();
    // Create file form the blob
    const image = new File([blob], "qr-code.png", { type: blob.type });
    // Share Code
    try {
      readQrCode(image);
    } catch (error) {
      console.log(error);
    }
  }

  function success(stream) {
    let v = videoRef.current;
    v.srcObject = stream;
    v.play();
  }

  function showError(error) {
    console.log(error);
  }
  function setwebcam() {
    var options = true;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
          devices.forEach(function (device) {
            if (device.kind === "videoinput") {
              if (device.label.toLowerCase().search("back") > -1)
                options = {
                  deviceId: { exact: device.deviceId },
                  facingMode: "environment",
                };
            }
          });
          setwebcam2(options);
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("no navigator.mediaDevices.enumerateDevices");
      setwebcam2(options);
    }
  }

  function setwebcam2(options) {
    var n = navigator;
    if (n.mediaDevices.getUserMedia) {
      n.mediaDevices
        .getUserMedia({ video: options, audio: false })
        .then(function (stream) {
          success(stream);
        })
        .catch(function (error) {
          showError(error);
        });
    } else if (n.getUserMedia) {
      n.getUserMedia({ video: options, audio: false }, success, showError);
    } else if (n.webkitGetUserMedia) {
      n.webkitGetUserMedia(
        { video: options, audio: false },
        success,
        showError
      );
    }
  }

  // Handle video
  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1920, height: 1080 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Take Photo
  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);

    const canvas = document.getElementById("canvas");
    let image = canvas.toDataURL();
    blobImg(image);
  };

  const [confirmation, setConfirmation] = useState(false);
  const [transactionDone, setTransactionDone] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const privateKey = useSelector((state) => state.savePrivateKeyReducer);

  // Send Ethereum Function
  const sendEthereum = async (privateKey) => {
    let importAddress = JSON.parse(localStorage.getItem("ethimport"));
    let address = JSON.parse(localStorage.getItem("ethaddress"));
    const activeIndex = localStorage.getItem("etheai");
    let fromAddress =
      address.length > activeIndex
        ? address[activeIndex]
        : importAddress[activeIndex - address.length];

    setTransactionLoading(true);
    setTransactionDone(false);

    try {
      const message = await createTransaction({
        To: toAddress,
        From: fromAddress,
        Value: amount,
      });

      console.log(message)
      const signedtransaction = await signTransaction(message, privateKey);

      const transaction = await sendSignedTransaction(signedtransaction);
      if (transaction?.transactionHash) {
        setTransactionLoading(false);
        setTransactionDone(true);
        handleSaveTransaction(transaction?.from,transaction?.to,amount * new BigNumber(1e18),transaction?.transactionHash)
      }
    } catch (error) {
      alert(error);
    }
  };

  // Handle export private key
  const [inputPassword, setInputPassword] = useState("");
  const handleExportKey = () => {
    const data = JSON.parse(localStorage.getItem("ethek"));
    const activeIndex = localStorage.getItem("etheai");
    let importData = JSON.parse(localStorage.getItem("etheik"));
    let address = JSON.parse(localStorage.getItem("ethaddress"));
    let encryptedData =
      address.length > activeIndex
        ? data[activeIndex]
        : importData[activeIndex - address.length];
    try {
      const PlainData = decryptData(inputPassword, encryptedData);
      dispatch(savePrivateKey(PlainData.privateKey));
      if (PlainData?.privateKey) {
        sendEthereum(PlainData?.privateKey);
      }
    } catch (error) {
      alert("Your password is Invalid");
    }
  };

  // Handle API for save wallet transaction to our backend
  const handleSaveTransaction = async (txn_from,txn_to, txn_value,txn_hash) => {
    const response = await API.post(`/api/v1/transactions/add-transaction`, {
      txn_from,
      txn_to,
      txn_value : String(txn_value),
      txn_hash
    });
    if (response.data.msg == "success") {
    }
  };

  const handleValidation = () => {
    if (amaoutValid && toAddress.length && amount) {
      setConfirmation(true);
    }
  };

  const [dollarPrice, setDollarPrice] = useState(0);
  const [rate, setRate] = useState(0);
  // Handle Dollar Price
  const getDollarPrice = async () => {
    // const usd = await getUSDValueOfEthereum();
    // if (usd) {
    //   setRate(usd);
    // }

    const response = await API.get(
      "/api/v1/convert-amount/ethereum-to-usd"
    );
    if (response?.status) {
      setRate(response?.data?.result);
    }
  };

  // Only Call when page render
  useEffect(() => {
    getDollarPrice();
  }, []);

  // Call When amount change
  useEffect(() => {
    setDollarPrice(rate * amount);
  }, [amount]);

  return (
    <div>
      {!transactionDone &&
        !confirmation &&
        !transactionLoading &&
        !scannerOn && (
          <div id="send">
            <div className="container">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <button
                  className="items"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      navigate("/wallet");
                    }
                  }}
                  onClick={() => navigate("/wallet")}
                >
                  <BsArrowLeft className="larr" />
                </button>
                <h4>Send Money</h4>
                <MdQrCode2 className="larr" />
              </div>
              <div className="second">
                <label>To Address</label>
                <div className="data">
                  <input
                    id="to-address"
                    ref={inputRef}
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="items"
                    tabIndex={1}
                    type="text"
                    placeholder="0xb033259..."
                  />
                </div>
              </div>
              <div className="third">
                <label>Amount (ETH)</label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={amaoutValid ? "items" : "items error"}
                  tabIndex={2}
                  type="tel"
                  placeholder="0.0321"
                />
                <div
                  style={{
                    marginTop: ".5rem",
                    opacity: ".8",
                    fontSize: ".8rem",
                  }}
                >
                  {amount ? amount : "0"} ETH value is : ${dollarPrice}
                </div>
                {!amaoutValid && (
                  <div className="amount-error">
                    Cannot be more than {balance} FIL
                  </div>
                )}
              </div>

              <div className="forth">
                <div className="available-balance">Total available amount</div>
                <p>{balance} ETH</p>
                <button
                  onClick={() => handleValidation()}
                  type="button"
                  className="items"
                  tabIndex={3}
                >
                  Send
                </button>
              </div>
              <div className="forth">
                <button
                  type="button"
                  className="items"
                  tabIndex={4}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setScannerOn(true);
                      setwebcam();
                    }
                  }}
                  onClick={() => setScannerOn(true) + setwebcam()}
                >
                  QR Scanner
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Scanner Open Code Below */}
      {!transactionDone && !transactionDone && scannerOn && (
        <div className="scanner-div">
          <div className="container">
            <div
              className="heading-scanner items"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigate("/wallet");
                }
              }}
              onClick={() => navigate("/wallet")}
            >
              <BsArrowLeft className="larr" />
              <div> Scan Qr Code</div>
            </div>

            <div className="camera">
              <video ref={videoRef}></video>
            </div>
            <div className="btn">
              <button
                className="items"
                tabIndex={1}
                onClick={() => takePhoto()}
              >
                Capture Qr Code
              </button>
            </div>
            <canvas
              style={{ display: "none" }}
              id="canvas"
              ref={photoRef}
            ></canvas>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {confirmation &&
        !transactionDone &&
        !transactionLoading &&
        toAddress &&
        amount && (
          <div className="export-pop">
            <div className="form">
              <div className="heading">
                <span className="export-heading">Payment Confirmation</span>
              </div>
              <p className="normal-text">
                Are you sure you want to send {amount} ETH to {toAddress}{" "}
                address.
              </p>

              <p className="normal-text">
                *Enter your password for sending ethereum
              </p>
              <form>
                <div>
                  <input
                    className="items"
                    tabIndex={0}
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    type="password"
                    htmlFor="password"
                    placeholder="Enter your password.."
                  />
                </div>
              </form>
              <div className="btn">
                <button
                  className="items"
                  tabIndex={1}
                  onClick={() => navigate("/wallet")}
                >
                  Cancel
                </button>
                <button
                  className="items"
                  tabIndex={2}
                  onClick={() => handleExportKey()}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Loading Screen */}
      {!transactionDone && transactionLoading && (
        <div className="export-pop">
          <div className="form" style={{ padding: "5rem 1rem" }}>
            <div style={{ width: "55px", height: "55px", margin: "auto" }}>
              <img
                style={{ width: "100%", height: "100%" }}
                src={loading}
                alt=""
              />
            </div>
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Processing...
            </p>
          </div>
        </div>
      )}

      {/* After send ethereum Show it */}
      {transactionDone && !transactionLoading && (
        <div className="export-pop">
          <div className="form" style={{ padding: "2rem 1rem" }}>
            <div style={{ width: "67px", height: "61px", margin: "auto" }}>
              <img
                style={{ width: "100%", height: "100%" }}
                src={paymentDone}
                alt=""
              />
            </div>
            <div className="heading">
              <span className="export-heading">Success Transaction</span>
            </div>
            <p className="normal-text">
              Your ethereum transaction successfully completed.
            </p>
            <div className="btn">
              <button
                className="items"
                tabIndex={1}
                onClick={() => navigate("/transactions")}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Send;
