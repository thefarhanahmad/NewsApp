import { FaGreaterThan } from "react-icons/fa6";
import ImageCard from "./ImageCard";
import StoriesCard from "./StoriesCard";

import img3 from "../../assets/Rectangle 33.png";
import img4 from "../../assets/Rectangle 28.png";
import img5 from "../../assets/img-5.png";
import VideoCard from "./VideoCard";
import { useNavigate } from "react-router-dom";

const AllSectionArticle = ({ data }) => {
  return (
    <>
      {data
        ? data.map((element) => {
            return (
              <SingleArticle
                key={element.category}
                category={element.category}
                imgData={element.imgData}
                vidData={element.vidData}
              />
            );
          })
        : null}
    </>
  );
};

const SingleArticle = ({ category, imgData, vidData }) => {
  const navigation = useNavigate();
  return (
    <div className="main-page-technology-container container2 container3">
      <div className="main-page-technology-heading">{category}</div>
      <div className="main-page-technology-area">
        <div style={{ width: "100%" }}>
          {/* left protion */}

          {imgData && imgData.length > 0 && (
            <div className="main-page-technology-first-column">
              {imgData.map((element, index) => {
                let title = element.title
                  ?.replace(/[%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (element.slug) {
                  title = element.slug;
                }
                if (index >= 2) {
                  return;
                }
                return (
                  <div
                    key={element._id}
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <ImageCard
                      style={{
                        fontSize: "15px",
                        fontWeight: 400,
                        height: "40px",
                        borderRadius: 0,
                      }}
                      height="200px"
                      width="100%"
                      img={element.image}
                      id={element._id}
                      text={element.title}
                      title={title}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* center portion  */}
          {imgData && imgData.length > 2 && (
            <div className="main-page-technology-first-column">
              {imgData.map((element, index) => {
                let title = element.title
                  ?.replace(/[%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (element.slug) {
                  title = element.slug;
                }
                if (index < 2 && index < 5) {
                  return;
                }
                return (
                  <div
                    className="center-portion-cards"
                    key={element._id}
                    style={{
                      marginTop: "10px",
                    }}
                  >
                    <StoriesCard
                      OnPress={() =>
                        navigation(`/details/${title}?id=${element._id}`)
                      }
                      height="120px"
                      width="80%"
                      color="transparent"
                      title={title}
                      image={element.image}
                      text={element.title}
                    />
                  </div>
                );
              })}
              <div className="more-text">
                {"more"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
          )}

          {/* right protion */}

          {vidData && vidData.length > 0 && (
            <div className="main-page-technology-third-column">
              {vidData.map((element, index) => {
                if (index >= 2) {
                  return;
                }
                return (
                  <VideoCard
                    fromVideoGallery={false}
                    key={element._id}
                    data={element}
                    color="black"
                    width="100%"
                  />
                );
              })}
              <div className="more-text">
                {"more"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllSectionArticle;
