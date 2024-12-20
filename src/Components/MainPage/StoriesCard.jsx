import React from "react";
import img from "../../assets/img-1.png";

const StoriesCard = ({ text, image, OnPress, id, wid }) => {
  return (
    <>
      <div
        onClick={OnPress}
        className="stories-card mobileMainPageStroyCard  flex w-full"
        id={id}
        style={{ cursor: "pointer" }}
      >
        <div className={`${wid} overflow-hidden`}>
          <img
            src={image ? image : img}
            alt=""
            className="w-full h-[100px] object-fill"
          />
        </div>
        <div className="stories-card-text  w-[55%]">
          {text ||
            '"India Have Better...": Sri Lanka Captain Honest World Cup Admission'}
        </div>
      </div>
    </>
  );
};

export default StoriesCard;
