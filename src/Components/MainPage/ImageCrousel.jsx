import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { API_URL } from "../../../API";
import { useParams } from "react-router-dom";

const contentStyle = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",

  textAlign: "center",
  background: "#364d79",
};

function ImageCrousel() {
  const [photo, setPhoto] = useState([]);
  const { id } = useParams();
  console.log("id in params corousel  : ", id);
  useEffect(() => {
    axios
      .get(`${API_URL}/photo/${id}`)

      .then((data) => {
        console.log("img api res in corousel : ", data);
        setPhoto(data.data.images);
      })
      .catch(() => {});
  }, []);
  console.log("photo corousel : ", photo);

  return (
    <>
      <div className="ImageCarouselContainer">
        <Carousel className="ImageCarsouel" arrows infinite={false}>
          {photo &&
            photo.map((img) => {
              console.log("IMG", img);
              return (
                <div
                  style={{ cursor: "pointer" }}
                  className="photoGallery-card"
                  onClick={() => window.open(img.title, "_blank")}
                  key={img._id}
                  // img.title
                >
                  <img src={img.img} alt="" />
                </div>
              );
            })}
        </Carousel>
      </div>
      <br />
    </>
  );
}

export default ImageCrousel;
