import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { API_URL } from "../../../API";
import { useParams } from "react-router-dom";

const ImageCrousel = () => {
  const [photo, setPhoto] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${API_URL}/photo/${id}`)
      .then((response) => {
        console.log("API Response:", response.data); // Log API response for verification
        setPhoto(response.data.images);
      })
      .catch((error) => {
        console.error("Error fetching images:", error); // Log any errors
      });
  }, [id]);

  return (
    <div className="ImageCarouselContainer">
      <Carousel className="ImageCarsouel" arrows infinite={false}>
        {photo.length > 0 ? (
          photo.map((img) => {
            console.log("Image URL:", img.img); // Log each image URL for verification

            const handleImageClick = () => {
              // URL validation regex
              const urlPattern = new RegExp(
                "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+\\.[a-zA-Z]{2,})([\\/\\w\\.-]*)*\\/?$"
              );
              // Check if the URL is valid
              const isValidUrl = urlPattern.test(img?.url);
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
                  <img
                    src={img.img || "path/to/default-image.jpg"}
                    alt={img.text || "Image"}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <h3
              style={{
                color: "black",
                textAlign: "center",
                fontSize: "25px",
                fontWeight: "bold",
                margin: "30px 0",
              }}
            >
              No images available
            </h3>
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default ImageCrousel;
