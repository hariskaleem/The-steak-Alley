import React from "react";
import './Button2.css'
const Button2 = ({ text = "Our Menu", variant = "default", type = "button", onClick, disabled = false }) => {
  return (
    <button
      className={`fancy-btn ${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text">{text}</span>
      
    </button>
  );
};

export default Button2;