import { FaGreaterThan } from "react-icons/fa6";
import ImageCard from "./ImageCard";
// import StoriesCard from "./StoriesCard";
import VideoCard from "./VideoCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { memo } from "react";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import VdoThumb from "../common/VdoThumb";

const AllSectionArticle = ({ data }) => {
  // console.log("all categories data from props : ", data);
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

const MiddleItemsCard = ({ text, image, OnPress, id, wid, date }) => {
  return (
    <div
      onClick={OnPress}
      className="stories-card mobileMainPageStroyCard  flex w-full"
      id={id}
      style={{ cursor: "pointer" }}
    >
      <div className={`${wid}`}>
        <img
          src={image ? image : img}
          alt=""
          className="w-full h-[110px] object-fill"
        />
      </div>
      <div className=" flex flex-col  w-[55%] h-full">
        <span className="stories-card-text-4-line  w-full">
          {text ||
            '"India Have Better...": Sri Lanka Captain Honest World Cup Admission'}
        </span>
        <span className="text-red-600 pl-[10px]">{date ? date : ""}</span>
      </div>
    </div>
  );
};

const SingleArticle = ({ category, imgData, vidData }) => {
  const navigation = useNavigate();

  return (
    <div className="main-page-technology-container container2 container3 border border-collapse sm:border-0 sm:m-0 m-1 border-gray-500">
      <div className="main-page-technology-heading border-b sm:border-0 sm:mb-0 border-gray-500 mb-4">
        <Link to={`/itempage?item=${category}`}> {category}</Link>
      </div>

      {/* Mobile sliders categry */}
      <div className="main-page-technology-area mobile-page-category">
        <div className="all-technology-cards" style={{ width: "100%" }}>
          {/* Left Portion */}
          {imgData && imgData.length > 0 && (
            <div className="main-page-technology-first-column">
              <div className="slide-container">
                <Slide indicators={true}>
                  {/* {console.log("img data in slider : ", imgData)} */}
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

      {/* Laptop categories */}
      <div className="main-page-technology-area flex flex-col desktok-page-category  ">
        <div className="all-technology-cards" style={{ width: "100%" }}>
          {/* Left Portion */}
          {imgData && imgData.length > 0 && (
            <div className="main-page-technology-first-column flex justify-between">
              {/* left portion */}
              <div className=" w-1/2">
                <div className="flex flex-col gap-2 w-full">
                  {imgData.slice(0, 2).map((element) => {
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

              {/* Center portion */}
              <div className=" w-1/2">
                <div className="flex flex-col gap-1">
                  {imgData.slice(2, 5).map((element, index) => {
                    let title = element.title
                      ?.replace(/[%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (element.slug) {
                      title = element.slug;
                    }

                    return (
                      // <Link
                      //   key={element._id}
                      //   style={{ marginTop: "10px" }}
                      //   className="cat-list"
                      //   to={`details/${title}?id=${element._id}`}
                      // >
                      //   <ImageCard
                      //     style={{
                      //       fontSize: "15px",
                      //       fontWeight: 400,
                      //       height: "auto",
                      //       borderRadius: 0,
                      //     }}
                      //     height="110px"
                      //     img={element.image}
                      //     dis={false}
                      //     text={element.title}
                      //   />
                      // </Link>
                      <MiddleItemsCard
                        data={element}
                        key={index}
                        OnPress={() =>
                          navigation(`/details/${title}?id=${element?._id}`)
                        }
                        wid="w-[50%]"
                        image={element?.image}
                        text={element?.title}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/*  Right Video Portions */}

          <div className="main-page-technology-first-column">
            {/* Video Portion */}
            {/* {vidData && vidData.length > 0 && (
              <div className="main-page-technology-third-column">
                {vidData.slice(0, 2).map((element, index) => (
                  <VdoThumb key={index} data={element} />
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
            )} */}

            {/* Image section */}
            {imgData && imgData.length > 0 && (
              <div className="flex md:ml-10  flex-col gap-2 w-full">
                {imgData.slice(5, 7).map((element) => {
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
                          width: "100%",

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
            )}
          </div>
        </div>
        {/* <Link className="bg-red-500 my-4 h-fit self-end mr-10">See More</Link> */}
      </div>
    </div>
  );
};

export default memo(AllSectionArticle);
