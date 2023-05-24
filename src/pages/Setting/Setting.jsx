import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Setting.scss";
import { BsArrowLeft } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { TbDatabaseExport } from "react-icons/tb";
import { FaMoneyCheckAlt } from "react-icons/fa";

const Setting = () => {
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

  return (
    <div className="setting-screen">
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
          Settings
        </div>
        <div className="btn">
          <button
            className="items"
            tabIndex={1}
            onClick={() => navigate("/transactions")}
          >
            <FaMoneyCheckAlt /> Transactions
          </button>
          <button
            className="items"
            tabIndex={2}
            onClick={() => navigate("/export")}
          >
            <TbDatabaseExport /> Export
          </button>
          <button
            className="items"
            tabIndex={3}
            onClick={() => localStorage.clear() + navigate("/")}
          >
            <IoMdLogOut /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
