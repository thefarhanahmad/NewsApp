import React from "react";
import img from "../../assets/img-1.png";

const StoriesCard = ({ text, image, OnPress }) => {
  return (
    <>
      <div
        onClick={OnPress}
        className="stories-card mobileMainPageStroyCard"
        style={{ cursor: "pointer" }}
      >
        <img src={image ? image : img} alt="" />
        <div className="stories-card-text">
          {text ||
            '"India Have Better...": Sri Lanka Captain Honest World Cup Admission'}
        </div>
      </div>
    </>
  );
};

export default StoriesCard;
