import React from "react";
import { useNavigate } from "react-router-dom";

const ImageCard = ({
  fromVStrories = false,
  width,
  height,
  img,
  text,
  style,
  border,
  id,
  slug,
  title,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="image-box"
      style={{ width, height, borderRadius: border, cursor: "pointer" }}
      onClick={() => {
        if (fromVStrories) {
          // navigate(`/stories?id=${id}`)
          console.log("Visual story");
        } else {
          navigate(`/details/${slug}?id=${id}`);
        }
      }}
    >
      <img
        src={img}
        alt=""
        style={{ borderRadius: border, objectFit: "cover" }}
      />
      <div className="image-text-box">
        <div style={style}>{text}</div>
      </div>
    </div>
  );
};

export default ImageCard;
