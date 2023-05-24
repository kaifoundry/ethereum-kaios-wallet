import React, { useEffect, useState } from "react";
import "./MultiWalletScreen.scss";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineDownload } from "react-icons/hi";
import { BiSelectMultiple } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  createWalletFromMnemonic,
  getBalance,
  importWalletfromPrivateKey,
} from "../../ethereumLogic";
import { saveAddress, savePassword } from "../../Redux/action";
import {
  decryptData,
  encryptData,
  saveData,
} from "../../commanFunctions/commanFunctions";
import BigNumber from "bignumber.js";

function MultiWalletScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const acIndex = Number(localStorage.getItem("ethei")) + 1;
  const mnmonic = localStorage.getItem("ethem");
  const activeIndex = localStorage.getItem("etheai");
  const [isPassword, setIsPassword] = useState(false);
  const [password, setPassword] = useState(
    useSelector((state) => state.savePasswordReducer)
  );
  const address = JSON.parse(localStorage.getItem("ethaddress"));
  const importAddress = JSON.parse(localStorage.getItem("ethimport")) || [];
  const importFek = JSON.parse(localStorage.getItem("etheik")) || [];
  const filecoinEncryptedKey = JSON.parse(localStorage.getItem("ethek"));

  //   Generate New Wallet address
  const genrateAddress = async () => {
    try {
      const generatedKeypair = await createWalletFromMnemonic(
        acIndex,
        decryptData(password, mnmonic.slice(1,-1))
      );
      dispatch(saveAddress(generatedKeypair.address));
      address.push(generatedKeypair.address);
      saveData("ethaddress", address);
      let encrypt = encryptData(password, generatedKeypair);
      filecoinEncryptedKey.push(encrypt);
      dispatch(savePassword(password));
      saveData("ethek", filecoinEncryptedKey);
      saveData("ethei", acIndex);
      saveData("etheai", acIndex);
      navigate("/wallet");
    } catch (err) {
      setPassword("");
      alert("*Please enter vaild password.");
    }
  };

  const [isImportWallet, setIsImportWallet] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  // Fetch All Wallet
  const [allBalance, setAllBalance] = useState([]);
  const fetchAllWalletBalance = async () => {
    let arr = [address, importAddress];
    let data = arr.reduce((acc, curVal) => {
      return acc.concat(curVal);
    }, []);
    let bal = await Promise.all(
      data.map(async (item) => {
        const result = await fetchBalanceAsycn(item);
        return result;
      })
    );
    setAllBalance(bal);
  };

  async function fetchBalanceAsycn(item) {
    return new Promise((resolve) => {
      let balance = getBalance(item);
      resolve(balance);
    });
  }

  useEffect(() => {
    fetchAllWalletBalance();
  }, []);

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

  // Handle Import Wallet from Private Key
  const handleImportWallet = async () => {
    if (privateKey.length) {
      try {
        const generatedKeypair = await importWalletfromPrivateKey(privateKey);
        dispatch(saveAddress(generatedKeypair.address));
        importAddress.push(generatedKeypair.address);
        saveData("ethimport", importAddress);
        let encrypt = encryptData(password, generatedKeypair);
        importFek.push(encrypt);
        dispatch(savePassword(password));
        saveData("etheik", importFek);
        saveData("etheai", address.length + importAddress.length - 1);
        navigate("/wallet");
      } catch (error) {
        setPassword("");
        alert(error);
      }
    } else {
      alert("*Please enter your private key.");
    }
  };

  const [type, setType] = useState("");
  // Handle check password
  const checkPassword = (type) => {
    if (password.length && type == "new_wallet") {
      setIsPassword(false);
      genrateAddress();
    } else if (password.length && type == "import") {
      try {
        let data = decryptData(password, mnmonic.slice(1,-1));
        setIsImportWallet(true);
        setIsPassword(false);
      } catch (error) {
        alert("*Please enter vaild password.");
      }
    } else {
      setType(type);
      setIsPassword(true);
    }
  };

  return (
    <div className="multi-wallet">
      {!isImportWallet && !isPassword && (
        <div className="container">
          <div style={{ display: "flex", alignItems: "center" }}>
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
              <BsArrowLeft />
            </button>
            <h4>My Accounts</h4>
          </div>
          <button
            onClick={() => checkPassword("new_wallet")}
            type="button"
            className="items btn"
            tabIndex={1}
          >
            <AiOutlinePlus /> Create Account
          </button>
          <button
            onClick={() => checkPassword("import")}
            type="button"
            className="items btn"
            tabIndex={2}
          >
            <HiOutlineDownload /> Import Account
          </button>

          <div className="wallet-container">
            {address.map((element, index) => {
              return (
                <div key={index} className="wallet">
                  <div className="heading">Account {index + 1}</div>
                  <div className="address">{element}</div>
                  <div className="value">
                    Value :{" "}
                    {(Number(allBalance[index]) / new BigNumber(1e18)).toFixed(
                      2
                    )}{" "}
                    ETH
                  </div>
                  <button
                    onClick={() =>
                      index == activeIndex
                        ? ""
                        : localStorage.setItem("etheai", index) +
                        navigate("/wallet")
                    }
                    type="button"
                    className={
                      index == activeIndex ? "items btn opacity-5" : "items btn"
                    }
                    tabIndex={index + 3}
                  >
                    <BiSelectMultiple />{" "}
                    {index == activeIndex ? "Selected" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="wallet-container">
            {importAddress.map((element, index) => {
              return (
                <div key={index} className="wallet">
                  <div className="heading">
                    Account {index + address.length + 1} <span>Import</span>
                  </div>
                  <div className="address">{element}</div>
                  <div className="value">
                    Value :{" "}
                    {(
                      Number(allBalance[address.length + index]) /
                      new BigNumber(1e18)
                    ).toFixed(2)}{" "}
                    FIL
                  </div>
                  <button
                    onClick={() =>
                      index + address.length == activeIndex
                        ? ""
                        : localStorage.setItem(
                          "etheai",
                          index + address.length
                        ) + navigate("/wallet")
                    }
                    type="button"
                    className={
                      index + address.length == activeIndex
                        ? "items btn opacity-5"
                        : "items btn"
                    }
                    tabIndex={index + address.length + 3}
                  >
                    <BiSelectMultiple />{" "}
                    {index + address.length == activeIndex
                      ? "Selected"
                      : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isPassword && (
        <div className="inner-container">
          <div className="form">
            <div className="heading">
              <button
                className="items back-btn"
                tabIndex={0}
                onClick={() => setIsPassword(false)}
              >
                <BsArrowLeft />
              </button>
              <span className="export-heading">Enter your password</span>
            </div>
            <p className="normal-text">
              *Please enter your password for create or import wallet.
            </p>
            <form>
              <div>
                <input
                  className="items"
                  tabIndex={1}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  htmlFor="password"
                  placeholder="Enter your password.."
                />
              </div>
              <div className="btn">
                <button
                  className="items btn1"
                  tabIndex={2}
                  type="button"
                  onClick={() => checkPassword(type)}
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImportWallet && !isPassword && (
        <div className="inner-container">
          <div className="form">
            <div className="heading">
              <button
                className="items back-btn "
                tabIndex={0}
                onClick={() => setIsImportWallet(false)}
              >
                <BsArrowLeft />
              </button>
              <span className="export-heading">Import Wallet</span>
            </div>
            <p className="normal-text">
              *Imported accounts will not be associated with your originally
              created <br /> Kai foundry account
            </p>
            <form>
              <div>
                <input
                  className="items"
                  tabIndex={1}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  type="text"
                  htmlFor="privatekey"
                  placeholder="Enter your private key.."
                />
              </div>
              <div className="btn">
                <button
                  className="items btn1"
                  tabIndex={2}
                  type="button"
                  onClick={() => handleImportWallet()}
                >
                  Import Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiWalletScreen;
