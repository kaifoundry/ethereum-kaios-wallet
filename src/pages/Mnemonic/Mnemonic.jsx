import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { generateMnemonic } from "../../ethereumLogic";
import { saveMnmonic } from "../../Redux/action";
import "./Mnemonic.scss";
import { GoPrimitiveDot } from "react-icons/go";

const Mnemonic = () => {
  const [readInstruction, setReadInstruction] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mnmonic, setMnmonic] = useState("");
  const [mnmonicArr, setMnmonicArr] = useState([]);

  const saveRedux = () => {
    dispatch(saveMnmonic(mnmonicArr));
  };

  useEffect(() => {
    const generateMnemonicFunction = async () => {
      let mnemonic = await generateMnemonic();
      setMnmonicArr(mnemonic.split(" "));
      setMnmonic(mnemonic);
    };
    generateMnemonicFunction();
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

  return (
    <div className="mnemonic-screen">
      {!readInstruction && (
        <>
          <div className="heading brand-name">Secret Recovery Phrase</div>
          <div className="content">
            <div className="inst">
              <div className="pera">
                <GoPrimitiveDot />
                <span>
                  Your Secret Recovery Phrase makes it easy to back up and
                  restore your account.
                </span>
              </div>
              <div className="warning">
                <span>WARNING:</span> Never disclose your Secret Recovery
                Phrase. Anyone with this phrase can take your Filecoin forever.
                Please store it at a safe location.
              </div>
              <div className="btn">
                <button
                  className="items"
                  tabIndex={0}
                  onClick={() => setReadInstruction(true) + saveRedux()}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {readInstruction && (
        <>
          <div className="heading brand-name">Your Seed Phrase</div>

          <div className="content">
            <ul>
              {mnmonicArr.length &&
                mnmonicArr.map((item, index) => {
                  return <li key={index}>{index + 1 + `. ` + item}</li>;
                })}
            </ul>
            <div className="btn">
              <button
                className="items"
                tabIndex={1}
                onClick={() => navigate("/verification")}
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

export default Mnemonic;
