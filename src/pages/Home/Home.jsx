import React, { useEffect } from "react";
import "./Home.scss";
import star from "../../Assets/images/white-star.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const addressStore = window.localStorage.getItem("ethaddress");
  const ethek = localStorage.getItem("ethek");
  useEffect(() => {
    if (!ethek || !addressStore) {
      localStorage.clear();
      navigate("/");
    } else {
      navigate("/wallet");
    }
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

  useEffect(() => {
    document.body.addEventListener("keydown", handleKeydown);
    return () => document.body.removeEventListener("keydown", handleKeydown);
  }, []);

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

  return (
    <div className="home-screen-container">
      <div className="animated-bg">
        {/* <img className="star-1" src={star} alt="" />
        <img className="star-2" src={star} alt="" />
        <img className="star-3" src={star} alt="" /> */}
        <div className="circle-1"></div>
        <div className="circle-2"></div>
      </div>
      <div className="content">
        <div className="heading">
          <span> Welcome to </span> <br />{" "}
          <span className="brand-name">Ethereum Wallet</span>
        </div>
        <div className="subtitle">
          send and recieve ethereum using this application.
        </div>
        <div className="btn">
          <button
            onKeyPress={(e) => e.key === " " && navigate("/new-user")}
            onClick={() => navigate("/new-user")}
            className="items"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
