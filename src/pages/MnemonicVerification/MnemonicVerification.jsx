import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { encryptData, saveData } from "../../commanFunctions/commanFunctions";
import { createWalletFromMnemonic } from "../../ethereumLogic";
import { saveAddress, savePassword } from "../../Redux/action";
import "./MnemonicVerification.scss";
import API from "../../APIs/API";

const MnemonicVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mnmonicArr = useSelector((state) => state.saveMnmonicReducer);

  useEffect(() => {
    if (mnmonicArr.length === 0) {
      navigate("/");
    }
  }, []);

  const [verification, setVerification] = useState(false);
  const [password, setPassword] = useState(
    useSelector((state) => state.savePasswordReducer)
  );

  const genrateAddress = async() => {
    const generatedKeypair = await createWalletFromMnemonic(0, mnmonicArr.join(" "));
    dispatch(saveAddress(generatedKeypair.address));
    saveData("ethaddress", [generatedKeypair.address]);
    dispatch(savePassword(password));
    let encrypt = encryptData(password, generatedKeypair);
    let encryptMnemonic = encryptData(password, mnmonicArr.join(" "));
    saveData("ethek", [encrypt]);
    saveData("ethem", encryptMnemonic);
    saveData("etheai", 0);
    saveData("ethei", 0);
    handleSaveAddress();
  };

    // Handle API for save wallet address to our backend
    const handleSaveAddress = async () => {
      const address = JSON.parse(localStorage.getItem("ethaddress"))[0];
      const response = await API.post(`/api/v1/accounts/add-account/`,{address});
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

  // Generate random array for verification
  const [random, setRandom] = useState([]);
  useEffect(() => {
    let rand1 = Math.round(Math.random() * 11);
    let rand2 = Math.round(Math.random() * 11);
    let rand3 = Math.round(Math.random() * 11);
    let arr = [rand1, rand2, rand3].sort(function (a, b) {
      return a - b;
    });
    setRandom(Array.from(new Set(arr)));
  }, []);

  const [inputs, setInputs] = useState({
    input1: "init",
    input2: "init",
    input3: "init",
  });
  const [inputsString, setInputsString] = useState({
    input1: "",
    input2: "",
    input3: "",
  });

  const handleInputs = (e, index) => {
    let randindex = random.indexOf(index);
    if (randindex === 0) {
      setInputsString({
        input1: e.target.value,
        input2: inputsString.input2,
        input3: inputsString.input3,
      });
      if (mnmonicArr[index] === e.target.value) {
        setInputs({
          input1: true,
          input2: inputs.input2,
          input3: inputs.input3,
        });
      } else {
        setInputs({
          input1: false,
          input2: inputs.input2,
          input3: inputs.input3,
        });
      }
    } else if (randindex === 1) {
      setInputsString({
        input1: inputsString.input1,
        input2: e.target.value,
        input3: inputsString.input3,
      });
      if (mnmonicArr[index] === e.target.value) {
        setInputs({
          input1: inputs.input1,
          input2: true,
          input3: inputs.input3,
        });
      } else {
        setInputs({
          input1: inputs.input1,
          input2: false,
          input3: inputs.input3,
        });
      }
    } else if (randindex === 2) {
      setInputsString({
        input1: inputsString.input1,
        input2: inputsString.input2,
        input3: e.target.value,
      });
      if (mnmonicArr[index] === e.target.value) {
        setInputs({
          input1: inputs.input1,
          input2: inputs.input2,
          input3: true,
        });
      } else {
        setInputs({
          input1: inputs.input1,
          input2: inputs.input2,
          input3: false,
        });
      }
    }
  };

  const checkIndex = (index) => {
    let randindex = random.indexOf(index);
    if (randindex === 0) {
      return inputs.input1;
    }
    if (randindex === 1) {
      return inputs.input2;
    }
    if (randindex === 2) {
      return inputs.input3;
    }
  };
  const getValue = (index) => {
    let randindex = random.indexOf(index);
    if (randindex === 0) {
      return inputsString.input1;
    }
    if (randindex === 1) {
      return inputsString.input2;
    }
    if (randindex === 2) {
      return inputsString.input3;
    }
  };

  // Handle Next Process
  const handleNextProcess = () => {
    if (random.length === 1 && inputs.input1 !== "init") {
      if (mnmonicArr[random[0]] === inputsString.input1) {
        setVerification(true);
        genrateAddress();
      } else {
        alert("Please Enter Valid Mnemonic.");
      }
    } else if (
      random.length === 2 &&
      inputs.input1 !== "init" &&
      inputs.input2 !== "init"
    ) {
      if (
        mnmonicArr[random[0]] === inputsString.input1 &&
        mnmonicArr[random[1]] === inputsString.input2
      ) {
        setVerification(true);
        genrateAddress();
      } else {
        alert("Please Enter Valid Mnemonic.");
      }
    } else if (
      random.length === 3 &&
      inputs.input1 !== "init" &&
      inputs.input2 !== "init" &&
      inputs.input3 !== "init"
    ) {
      if (
        mnmonicArr[random[0]] === inputsString.input1 &&
        mnmonicArr[random[1]] === inputsString.input2 &&
        mnmonicArr[random[2]] === inputsString.input3
      ) {
        setVerification(true);
        genrateAddress();
      } else {
        alert("Please Enter Valid Mnemonic.");
      }
    } else {
      alert("Please Verify the Mnemonic");
    }
  };

  return (
    <div className="mnemonic-verification-screen">
      {!verification && (
        <div className="content">
          <ul>
            {mnmonicArr &&
              mnmonicArr.map((element, index) => {
                if (random.includes(index)) {
                  return (
                    <li
                      className={
                        checkIndex(index) !== "init"
                          ? checkIndex(index)
                            ? `success`
                            : `error`
                          : "init"
                      }
                      key={index}
                    >
                      {index + 1}.{" "}
                      <input
                        readOnly={checkIndex(index) === true}
                        value={getValue(index)}
                        tabIndex={random.indexOf(index)}
                        onChange={(e) => handleInputs(e, index)}
                        className="items enter"
                        type="text"
                      />
                    </li>
                  );
                } else {
                  return (
                    <li key={index}>
                      {index + 1}. {element}
                    </li>
                  );
                }
              })}
          </ul>
          <div className="btn">
            <button
              className="items"
              tabIndex={3}
              onClick={() => handleNextProcess()}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {verification && (
        <>
          <div className="content">
          <div className="pera">
            *Passphrase is a required part of your wallet. Without the passphrase
            you will not be able to do any transaction
          </div>
            <div className="pera">
              <label htmlFor="last-passcode">Your Passphrase</label>
              <br />
              <input
                className="input"
                name="last-passcode"
                type="text"
                value={password}
                readOnly
              />
              <br />
              <div className="pera">
                Your passphrase will not be shown to you again.
              </div>
            </div>
            <div className="btn">
              <button
                className="items"
                tabIndex={4}
                onClick={() => navigate("/wallet")}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MnemonicVerification;
