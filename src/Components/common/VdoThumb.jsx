import React from "react";
import { Link } from "react-router-dom";
import { IoPlayCircleOutline } from "react-icons/io5";

const VdoThumb = ({ data }) => {
  console.log("data is vdo thumb : ", data);
  const title = data?.title.replace(/[%.?]/g, "").split(" ").join("-");

  return (
    <div>
      <Link
        to={`/videos/${title}?id=${data?._id}`}
        style={{
          backgroundColor: "white",
          padding: "9px",
          width: "100%",
          height: "content-fit",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <span
          style={{
            backgroundColor: "red",
            padding: "10px",
            position: "absolute",
            bottom: "0",
           
          }}
        >
          {data?.title.slice(0,125)}...
        </span> */}
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            style={{ width: "100%", height: "100%", position: "relative" }}
            src={data?.image}
            alt={data?.title}
          />
          <IoPlayCircleOutline
            style={{
              color: "white",
              // padding: "10px",
              fontSize: "4rem",
              position: "absolute",
              top: "50%",
              left: "50%",
              translate: "-50%",
            }}
          />
        </div>

        <span
          style={{
            // backgroundColor: "yellow",
            height: "2.5rem",
            padding: "5px",
          }}
        >
          {data?.title.slice(0, 50)} ...click to watch
        </span>
      </Link>
    </div>
  );
};

export default VdoThumb;
