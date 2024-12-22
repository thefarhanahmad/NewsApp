import { useEffect, useState } from "react";
import { Carousel } from "antd";
import axios from "axios";
import { API_URL } from "../../../API";
import { useParams } from "react-router-dom";

const ImageCrousel = () => {
  const [photo, setPhoto] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${API_URL}/photo/${id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        setPhoto(response.data.images || []);
      })
      .catch((error) => {
        console.error(
          "Error fetching images:",
          error.response ? error.response.data : error.message
        );
        setError("There was an error fetching images. Please try again later.");
      });
  }, [id]);

  return (
    <div className="ImageCarouselContainer">
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <div className="w-full bg-gray-600 h-full py-4 px-[1.2rem]">
        {/* Laptop crousel */}
        <div className="hidden sm:block">
          <Carousel className="ImageCarsouel h-full" arrows infinite={false}>
            {photo.length > 0 ? (
              photo.map((img) => {
                console.log("Image URL:", img.img); // Log image URL for debugging

                const handleImageClick = () => {
                  const urlPattern = new RegExp(
                    "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+\\.[a-zA-Z]{2,})([\\/\\w\\.-]*)*\\/?$"
                  );
                  const isValidUrl = urlPattern.test(img?.url);
                  const redirectUrl = isValidUrl ? img.url : img.img;

                  window.open(redirectUrl, "_blank");
                };

                return (
                  <div key={img._id}>
                    <h3
                      className="main-page-video-heading2 mt-12 sm:mt-0"
                      style={{
                        padding: "6px",
                        fontSize: "16px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "2px",
                      }}
                    >
                      {img?.text}
                    </h3>
                    <div
                      style={{
                        cursor: "pointer",
                        position: "relative",
                        width: "100%",

                        // background: "red",
                        // padding: "10px",
                      }}
                      className="photoGallery-card"
                      onClick={handleImageClick}
                    >
                      <img
                        src={img.img || "https://via.placeholder.com/150"}
                        alt={img.text || "Image"}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
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

        {/* Phone flex col */}
        <div className="block sm:hidden mt-16">
          <div className="image-gallery flex flex-col gap-6">
            {photo.length > 0 ? (
              photo.map((img) => {
                const handleImageClick = () => {
                  const urlPattern = new RegExp(
                    "^(https?:\\/\\/)?(www\\.)?([a-zA-Z0-9]+\\.[a-zA-Z]{2,})([\\/\\w\\.-]*)*\\/?$"
                  );
                  const isValidUrl = urlPattern.test(img?.url);
                  const redirectUrl = isValidUrl ? img.url : img.img;

                  window.open(redirectUrl, "_blank");
                };

                return (
                  <div
                    key={img._id}
                    className="image-card flex flex-col gap-2 bg-white p-4 rounded-lg"
                  >
                    <h3
                      className="main-page-video-heading2 text-gray-950"
                      style={{
                        fontSize: "16px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginBottom: "2px",
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
                        src={img.img || "https://via.placeholder.com/150"}
                        alt={img.text || "Image"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                        }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCrousel;
