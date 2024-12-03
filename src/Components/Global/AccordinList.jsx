import { useState } from "react";
import { Link } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

import "./style/index.css";

const AccordinList = ({ title, link, items }) => {
  const [isAccordin, setIsAccordin] = useState(false);
  console.log("nav title : ", title);
  console.log("nav link : ", link);
  console.log("nav items : ", items);

  return (
    <div className="accordin-main-container-area ">
      {/* <div
        className="main-accordin-area-header"
        onClick={() => items?.length > 0 && setIsAccordin((prev) => !prev)} // Only toggle if items exist
      > */}
      <Link to={link}>
        <div className="footer-heading text-lg flex gap-1 justify-start items-center ">
          <span>{title}</span>
          <span>
            <HiOutlineChevronDoubleRight className="text-xl" />
          </span>
        </div>
      </Link>

      {/* Render arrow only if there are items */}
      {/* {items?.length > 0 &&
          (isAccordin ? (
            <BiChevronUp color="white" size={40} />
          ) : (
            <BiChevronDown color="white" size={40} />
          ))} 
      </div>*/}

      {/* {isAccordin && items?.length > 0 && (
        <div className="accordin-main-area-items"> */}
      <div className="footer-items">
        {items?.map((item, index) => (
          <Link key={index} to={item.link} className="atag">
            <div
              className={`subtitle text-sm text-gray-400 my-1 w-fit py-0 pr-3 ${
                items.length > 1 && index !== items.length - 1 ? "border-r" : ""
              }`}
            >
              {item.title}
            </div>
          </Link>
        ))}
      </div>
      {/* </div>
      )} */}
      <div className="accordin-line"></div>
    </div>
  );
};

export default AccordinList;
