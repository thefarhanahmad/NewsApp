import { FaGreaterThan } from "react-icons/fa6";
import ImageCard from "./ImageCard";
import StoriesCard from "./StoriesCard";
import VideoCard from "./VideoCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import 'react-slideshow-image/dist/styles.css';
import { Slide } from 'react-slideshow-image';

const AllSectionArticle = ({ data }) => {
  return (
    <>
      {data
        ? data.map((element) => (
            <SingleArticle
              key={element.category}
              category={element.category}
              imgData={element.imgData}
              vidData={element.vidData}
            />
          ))
        : null}
    </>
  );
};

const SingleArticle = ({ category, imgData, vidData }) => {
  const navigation = useNavigate();


  const isLifestyleOrSports = imgData.some(
    (element) => ["sports", "Business", "Lifestyle"].includes(element.topic)
  );

  return (
    <div className="main-page-technology-container container2 container3">
      <div className="main-page-technology-heading">{category}</div>
      <div className="main-page-technology-area">
        <div style={{ width: "100%" }}>
          {/* Left Portion */}
          {imgData && imgData.length > 0 && (
            <div className="main-page-technology-first-column">
              <div className="slide-container">
                {isLifestyleOrSports ? (
                  <Slide>
                    {imgData.map((element) => {
                      let title = element.title

                        ?.replace(/[%.?]/g, "")
                        .split(" ")
                        .join("-");
                      if (element.slug) {
                        title = element.slug;
                      }

                      return (
                        <div key={element._id} style={{ marginTop: "10px" }} className="cat-list">
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
                            dis={false}
                            text={element.title}
                          />
                        </div>
                      );
                    })}
                  </Slide>
                ) : (
                  imgData.map((element) => {
                    let title = element.title
                      ?.replace(/[%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (element.slug) {
                      title = element.slug;
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
                            borderRadius: "0px",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
                  })
                )}
              </div>
            </div>
          )}

          {/* Center and Right Portions */}
          {imgData && imgData.length > 2 && (
            <div className="main-page-technology-first-column">
              {imgData.slice(2, 5).map((element) => {
                let title = element.title
                  ?.replace(/[%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (element.slug) {
                  title = element.slug;
                }

                return (
                  <div
                    className="center-portion-cards"
                    key={element._id}
                    style={{ marginTop: "10px" }}
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

          {/* Video Portion */}
          {vidData && vidData.length > 0 && (
            <div className="main-page-technology-third-column">
              {vidData.slice(0, 2).map((element) => (
                <VideoCard
                  fromVideoGallery={false}
                  key={element._id}
                  data={element}
                  color="black"
                  width="100%"
                />
              ))}
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

export default memo(AllSectionArticle);
