import React from "react";
import "./myStyle.css";

export default function Typing() {
  return (
    <div className="other-message-container">
      <div className="other-text-content">
        <p className="typing-text">
          <span className="dot one">.</span>
          <span className="dot two">.</span>
          <span className="dot three">.</span>
        </p>
      </div>
    </div>
  );
}
