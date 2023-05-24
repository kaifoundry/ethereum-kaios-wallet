import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { encryptData, saveData } from "../../commanFunctions/commanFunctions";
import { importWalletFromMnemonic } from "../../ethereumLogic";
import { saveAddress, savePassword } from "../../Redux/action";
import "./ImportWallet.scss";

const ImportWallet = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mnmonic, setMnmonic] = useState("");

  const [password, setPassword] = useState(
    useSelector((state) => state.savePasswordReducer)
  );

  const genrateAddress = async() => {
    const generatedKeypair = await importWalletFromMnemonic(0, mnmonic);
    console.log(generatedKeypair);
    dispatch(saveAddress(generatedKeypair.address));
    saveData("ethaddress", [generatedKeypair.address]);
    dispatch(savePassword(password));
    let encrypt = encryptData(password, generatedKeypair);
    let encryptMnemonic = encryptData(password, mnmonic);
    saveData("ethek", [encrypt]);
    saveData("ethem", encryptMnemonic);
    saveData("etheai", 0);
    saveData("ethei", 0);
    navigate("/wallet");
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

  const handleImportWallet = () => {
    const arr = mnmonic.split(" ");
    if (arr.length === 12 || arr.length === 24) {
      genrateAddress();
    }else{
        alert("Please enter vaild mneonics")
    }
  };

  return (
    <div>
      <div className="import-wallet-screen">
        <div className="heading brand-name">Import External Wallet</div>
        <div className="content">
          <p>
            *Enter your mnemonic key (12 Words or 24 Words) to import a wallet
            from another provider.
          </p>

          <form>
            <div>
              <label htmlFor="import">Enter your code here</label>
              <br />
              <textarea
                placeholder="Enter your mnemonic...."
                className="items"
                tabIndex={0}
                rows={4}
                value={mnmonic}
                onChange={(e) => setMnmonic(e.target.value)}
                type="text"
                htmlFor="import"
              />
            </div>

            <div className="btn">
              <button
                className="items"
                tabIndex={1}
                type="button"
                onClick={() => handleImportWallet()}
              >
                Import
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImportWallet;
