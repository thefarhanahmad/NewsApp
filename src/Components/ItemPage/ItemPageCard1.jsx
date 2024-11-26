import React from "react";
import img from "../../assets/Rectangle 28.png";
import "./style/index.css";
import { useState } from "react";
import { useEffect } from "react";

const ItemPageCard1 = ({ title, discription, date, image, onPress, type }) => {
  const [desc, SetDesc] = useState(discription);
  useEffect(() => {
    let tt = "";
    let times = desc?.length > 100 ? 100 : desc?.length;

    for (let i = 0; i < times; i++) {
      tt += desc[i];
    }
    SetDesc(tt + "...");
  }, []);
  return (
    <div style={{ padding: "10px" }} className=" h-fit">
      <div className="line"></div>
      <div
        className="item-page-card-main-conatiner"
        onClick={onPress ? onPress : () => {}}
      >
        <div className="item-page-card-main-conatiner-img">
          <img
            style={{ width: "90%", height: "100%", objectFit: "cover" }}
            src={image}
            alt=""
            className="hidden md:block"
          />
          <img
            style={{ width: "90%", height: "70%", objectFit: "cover" }}
            src={image}
            alt=""
            className="md:hidden"
          />
        </div>
        {/* <div className="item-page-card-main-conatiner-img">
          {type === "img" ? (
            <img
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={image}
              alt=""
            />
          ) : (
            <video
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              src={image}
            />
          )}
        </div> */}

        <div className="item-page-card-main-conatiner-text">
          <div className="heading-item-page-card-main-conatiner-text">
            {title}
            {/* New Health Campaign, ‘Ayushman Bhava’ To Reach Out 7 Crore Families:
            All You Need To Know About The Initiative */}
          </div>
          <div className="date-item-page-card-main-conatiner-text">
            {date}
            {/* 15 august 2023 */}
          </div>
          {/* <div
            className="text-item-page-card-main-conatiner-text "
            dangerouslySetInnerHTML={{ __html: desc }}
          > */}
          {/* {desc} */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ItemPageCard1;
