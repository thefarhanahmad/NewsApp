import { useState } from "react";
import { Link } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

import "./style/index.css";

const AccordinList = ({ title, link, items }) => {
  const [isAccordin, setIsAccordin] = useState(false);

  return (
    <div className="accordin-main-container-area">
      <div
        className="main-accordin-area-header"
        onClick={() => items?.length > 0 && setIsAccordin((prev) => !prev)} // Only toggle if items exist
      >
        <Link to={link}>
          <div className="footer-heading">{title}</div>
        </Link>
        
        {/* Render arrow only if there are items */}
        {items?.length > 0 && (
          isAccordin ? (
            <BiChevronUp color="white" size={40} />
          ) : (
            <BiChevronDown color="white" size={40} />
          )
        )}
      </div>

      {isAccordin && items?.length > 0 && (
        <div className="accordin-main-area-items">
          <div className="footer-items">
            {items.map((item, index) => (
              <Link key={index} to={item.link} className="atag">
                <div className="subtitle">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="accordin-line"></div>
    </div>
  );
};

export default AccordinList;
