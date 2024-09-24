import React, { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import "./style/index.css";

const Accordin = ({ title="", items=[] }) => {
  const [isAccordin, setIsAccordin] = useState(false);
  return (
    <div className="accordin-main-container-area">
      <div
        className="main-accordin-area-header"
        onClick={() => setIsAccordin(!isAccordin)}
      >
        
        <div className="footer-heading">{title}</div>
        {isAccordin ? (
          <BiChevronUp color="white" size={40} />
        ) : (
          <BiChevronDown color="white" size={40} />
        )}
      </div>
      {isAccordin ? (
        <>
          <div className="accordin-main-area-items">
            <div className="footer-items">
              {items?.map((item) => {
                return <div>{item}</div>;
              })}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="accordin-line"></div>
    </div>
  );
};

export default Accordin;
