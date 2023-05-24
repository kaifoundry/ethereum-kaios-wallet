import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import "./NewUserCard.scss";

const NewUserCard = ({heading,msg,btnName,navigation,tabIndex}) => {
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
    <div className='new-user-card'>
        <div className="content">
            <div className="heading">{heading}</div>
            <div className="msg">{msg}</div>
            <div className="btn">
                <button tabIndex={tabIndex} className='items' onClick={()=> navigate(navigation)} onKeyPress={(e) => e.key === " " && navigate(navigation)}>
                    {btnName}
                </button>
            </div>
        </div>
    </div>
  )
}

export default NewUserCard