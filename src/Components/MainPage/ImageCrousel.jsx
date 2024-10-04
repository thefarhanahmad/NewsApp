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
          {/* {photo &&
            photo.map((img) => {
              console.log("IMG", img);
              return (
                <>
                  <h3
                    className="main-page-video-heading2"
                    style={{
                      // backgroundColor: "white",
                      // opacity:"100%",
                      padding: "6px",
                      fontSize: "2rem",
                      // paddingLeft: "50px",
                      color: "white",
                      bottom: "30px",
                      textAlign: "center",
                      // width: "98%",
                      borderRadius: "10px",
                      overflow: "hidden",
                      textAlignLast: "left",
                      marginBottom: "5px",
                    }}
                  >
                    {img?.text}
                  </h3>
                  <div
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      width: "100%",
                    }}
                    className="photoGallery-card"
                    onClick={() =>
                      window.open(img?.url ? img?.url : img?.img, "_blank")
                    }
                    key={img._id}
                    // img.title
                  >
                    <img src={img.img} alt="" />
                  </div>
                </>
              );
            })} */}
          {photo &&
            photo.map((img) => {
              console.log("IMG", img);
              const handleImageClick = () => {
                // URL validation regex
                const urlPattern = new RegExp(
                  "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+\\.[a-zA-Z]{2,})([\\/\\w\\.-]*)*\\/?$"
                );

                // Check if the URL is valid
                const isValidUrl = urlPattern.test(img?.url);

                // Redirect to the valid URL or fallback URL
                const redirectUrl = isValidUrl ? img.url : img.img;

                window.open(redirectUrl, "_blank");
              };

              return (
                <div key={img._id}>
                  <h3
                    className="main-page-video-heading2"
                    style={{
                      padding: "6px",
                      fontSize: "2rem",
                      color: "white",
                      bottom: "30px",
                      // textAlign: "center",
                      borderRadius: "10px",
                      overflow: "hidden",
                      marginBottom: "5px",
                    }}
                  >
                    {img?.text}
                  </h3>
                  <div
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      width: "100%",
                    }}
                    className="photoGallery-card"
                    onClick={handleImageClick}
                  >
                    <img src={img.img} alt="" />
                  </div>
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
