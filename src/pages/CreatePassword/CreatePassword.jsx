import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { savePassword } from "../../Redux/action";
import "./CreatePassword.scss";
import { BsFillCheckCircleFill } from "react-icons/bs";

const CreatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const [cpassword, setCpassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState(false);
  const [checkTerms, setCheckTerms] = useState(true);

  const importStatus = param.importStatus;

  const handleCreatePassword = () => {
    const reg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (reg.test(password)) {
      if (password === "") {
        alert("Please Enter password");
      } else if (cpassword !== password) {
        alert("Please Enter Same password");
      } else {
        if (checkTerms) {
          dispatch(savePassword(password));
          if (importStatus.slice(1) == "true") {
            navigate("/import-wallet");
          } else {
            navigate("/mnmonic");
          }
        } else {
          alert("Please Check Terms & Conditions");
        }
      }
    } else {
      alert(`*Please Enter Strong Password.
                1. Contain at least one Uppercase letter
                2. Contain at least one Lowercase letter
                3. Contain at least one numeric
                4. Contain at least one special character`);
    }
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

  const handleCheck = (cpass) => {
    if (cpass === password && cpass !== "") {
      setConfirmPass(true);
    } else {
      setConfirmPass(false);
    }
  };
  const handleCheck2 = (pass) => {
    if (cpassword === pass && cpassword !== "") {
      setConfirmPass(true);
    } else {
      setConfirmPass(false);
    }
  };

  return (
    <div className="create-password-screen">
      <div className="heading">
        <span className="brand-name">Create Password</span>
      </div>
      <div className="content">
        <p>
          *This password will be used to open the application as well as sending
          Filecoin. Do keep a secure password and make sure to remember it
        </p>
        <form>
          <div>
            <input
              className="items"
              tabIndex={0}
              value={password}
              onChange={(e) =>
                setPassword(e.target.value) + handleCheck2(e.target.value)
              }
              type="password"
              htmlFor="password"
              placeholder="New Password"
            />
          </div>
          <div>
            <input
              className="items"
              tabIndex={1}
              value={cpassword}
              onChange={(e) =>
                setCpassword(e.target.value) + handleCheck(e.target.value)
              }
              type="password"
              htmlFor="cpassword"
              placeholder="Confirm Password"
            />
          </div>

          {confirmPass && (
            <div
              style={{
                marginTop: "8px",
                fontSize: "0.7rem",
                verticalAlign: "center",
                color: "#000000",
              }}
            >
              Confirm password{" "}
              <span style={{ verticalAlign: "center" }}>
                <BsFillCheckCircleFill />
              </span>
            </div>
          )}

          <div className="btn">
            <button
              className="items"
              tabIndex={2}
              type="button"
              onClick={() => handleCreatePassword()}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
