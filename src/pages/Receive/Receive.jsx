import React, { useEffect } from "react";
import { MdContentCopy, MdShare } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";
import "./Receive.scss";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";

const Receive = () => {
  const navigate = useNavigate();
  const address = JSON.parse(localStorage.getItem("ethaddress"));
  const importAdress = JSON.parse(localStorage.getItem("ethimport"));
  const activeIndex = localStorage.getItem("etheai");
  const addres =
    address.length > activeIndex
      ? address[activeIndex]
      : importAdress[activeIndex - address.length];

  const shareUrl = window.location.origin + `/qrcode/:${addres}`;

  async function shareFiles() {
    const pngUrl = document.getElementById("qr-code-id").toDataURL();
    const blob = await (await fetch(pngUrl)).blob();
    // Create file form the blob
    const image = new File([blob], "qr-code.png", { type: blob.type });
    // Share Code
    try {
      let url = `https://wa.me/?text=Ethereum_Wallet:-${addres} and Link ${shareUrl}`;
      window.location = url;
    } catch (error) {
      console.log(error);
    }
  }

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
    <div className="receive-screen">
      <div className="content">
        <div className="heading">
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
          </button>{" "}
          Receive Ethereum
        </div>
        <div className="qr">
          <QRCode
            className="icon"
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
              borderRadius: "0.5rem",
            }}
            value={addres}
            viewBox={`0 0 256 256`}
            id="qr-code-id"
            includeMargin={true}
          />
        </div>
        <div className="key">
          <p>{address.length && addres}</p>
          <div className="btn">
            <button
              className="icons items"
              tabIndex={1}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigator.clipboard.writeText(addres).then(function (x) {
                    alert("Copied to clipboard");
                  });
                }
              }}
              onClick={() => {
                navigator.clipboard.writeText(addres).then(function (x) {
                  alert("Copied to clipboard");
                });
              }}
            >
              <MdContentCopy className="icon" />
            </button>
            <button
              className=" icons items"
              tabIndex={2}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  shareFiles();
                }
              }}
              onClick={() => shareFiles()}
            >
              <MdShare id="share" className="icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receive;
