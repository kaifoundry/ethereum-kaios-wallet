import React, { useEffect } from "react";
import { MdOutlineQrCode2 } from "react-icons/md";

import "./QRShare.scss";
import { useParams } from "react-router-dom";
import QRCode from "qrcode.react";

const QRShare = () => {
  const param = useParams();

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
        <div className="qr" style={{ width: "150px", height: "150px" }}>
          <QRCode
            className="icon"
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
              borderRadius: "0.5rem",
            }}
            value={param?.address.slice(1)}
            viewBox={`0 0 256 256`}
            id="qr-code-id"
            includeMargin={true}
          />
        </div>
        <div className="key">
          <p>{param?.address.slice(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default QRShare;
