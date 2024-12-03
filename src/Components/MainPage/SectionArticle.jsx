import { FaGreaterThan } from "react-icons/fa6";
import ImageCard from "./ImageCard";
import StoriesCard from "./StoriesCard";
import VideoCard from "./VideoCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { memo } from "react";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";

const AllSectionArticle = ({ data }) => {
  console.log("nidhi", data);
  return (
    <>
      {data
        ? data.map((element) => (
            <SingleArticle
              key={element.category}
              category={element.category}
              imgData={element.imgData}
              id={element._id}
              vidData={element.vidData}
            />
          ))
        : null}
    </>
  );
};

const SingleArticle = ({ category, imgData, vidData }) => {
  const navigation = useNavigate();

  return (
    <div className="main-page-technology-container container2 container3 border border-collapse sm:border-0 sm:m-0 m-1 border-gray-500">
      <div className="main-page-technology-heading border-b sm:border-0 sm:mb-0 border-gray-500 mb-4">
        <Link to={`/itempage?item=${category}`}> {category}</Link>
      </div>
      <div className="main-page-technology-area mobile-page-category">
        <div className="all-technology-cards" style={{ width: "100%" }}>
          {/* Left Portion */}
          {imgData && imgData.length > 0 && (
            <div className="main-page-technology-first-column">
              <div className="slide-container">
                <Slide indicators={true}>
                  {console.log("img data in slider : ", imgData)}
                  {imgData.map((element) => {
                    let title = element.title
                      ?.replace(/[%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (element.slug) {
                      title = element.slug;
                    }

                    return (
                      <Link
                        key={element._id}
                        to={`details/${title}?id=${element._id}`}
                        style={{ marginTop: "10px" }}
                        className="cat-list"
                      >
                        <ImageCard
                          id={element._id}
                          img={element.image}
                          dis={false}
                          text={element.title}
                          style={{
                            fontSize: "15px",
                            fontWeight: 400,

                            borderRadius: 0,
                          }}
                          height="200px"
                          width="100%"
                        />
                      </Link>
                    );
                  })}
                </Slide>
              </div>
            </div>
          )}

          {/* Center and Right Portions */}
          {/* {imgData && imgData.length > 2 && (
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
          )} */}

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

      <div className="main-page-technology-area desktok-page-category">
        <div className="all-technology-cards" style={{ width: "100%" }}>
          {/* Left Portion */}
          {imgData && imgData.length > 0 && (
            <div className="main-page-technology-first-column">
              <div className="slide-container">
                {imgData.map((element) => {
                  let title = element.title
                    ?.replace(/[%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (element.slug) {
                    title = element.slug;
                  }

                  return (
                    <Link
                      key={element._id}
                      style={{ marginTop: "10px" }}
                      className="cat-list"
                      to={`details/${title}?id=${element._id}`}
                    >
                      <ImageCard
                        style={{
                          fontSize: "15px",
                          fontWeight: 400,
                          height: "auto",
                          borderRadius: 0,
                        }}
                        height="200px"
                        img={element.image}
                        dis={false}
                        text={element.title}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Center and Right Portions */}
          {imgData && imgData.length > 2 && (
            <div className="main-page-technology-first-column">
              {imgData.slice(0, 4).map((element) => {
                let title = element.title
                  ?.replace(/[%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (element.slug) {
                  title = element.slug;
                }

                return (
                  <Link
                    className="center-portion-cards"
                    key={element._id}
                    style={{ marginTop: "10px" }}
                    to={`details/${title}?id=${element._id}`}
                  >
                    <StoriesCard
                      OnClick={() =>
                        navigation(`/details/${title}?id=${element._id}`)
                      }
                      height="120px"
                      wid="w-[45%]"
                      color="transparent"
                      title={title}
                      image={element.image}
                      text={element.title}
                    />
                  </Link>
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
