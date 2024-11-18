import { useEffect, useRef, useState } from "react";
import "./style/index.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { FaGreaterThan } from "react-icons/fa6";
import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import VideoCard from "../../Components/MainPage/VideoCard";
import ImageCard from "../../Components/MainPage/ImageCard";
import StoriesCard from "../../Components/MainPage/StoriesCard";
import NewsCard from "../../Components/MainPage/NewsCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  IoCameraSharp,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { Col, Progress, Radio, Row } from "antd";
import { API_URL } from "../../../API";
import { useNavigate } from "react-router-dom";

import img1 from "../../assets/img-main1.png";
import img2 from "../../assets/img-main-2.png";
import img3 from "../../assets/Rectangle 33.png";
import img4 from "../../assets/Rectangle 28.png";
import img5 from "../../assets/img-5.png";
import slider from "../../assets/slider (2).png";
import AllSectionArticle from "../../Components/MainPage/SectionArticle";
import { PlayCircleOutlined } from "@ant-design/icons";
import VdoThumb from "../../Components/common/VdoThumb";

const MainPage = () => {
  const [sliderItem, setSliderItem] = useState(0);
  const [sliderItem2, setSliderItem2] = useState(1);
  const [imag1, setimag1] = useState();
  const [showItem, setShowItem] = useState(true);
  const [userData, setUserData] = useState([]);
  const [flashnews, setflashnews] = useState([]);
  const [Article, setArticle] = useState([]);
  const [video, setVideo] = useState([]);

  const [photo, setPhoto] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [ArticleTop, setArticleTop] = useState(null);
  const [isModal2Open, setIsModal2Open] = useState(true);
  const [breakingNews, setbreakingNews] = useState([]);
  const [sliderArticles, setSliderArticles] = useState([]);
  console.log("Slider articles f: ", sliderArticles);
  const [val, setVal] = useState("");
  const sliderItems = [slider, img1, img2, img4];
  const { t } = useTranslation();
  const [topAd, setTopAd] = useState({});
  const [midAd, setMidAd] = useState([]);
  const [bottomAd, setBottomAd] = useState({});
  const [topStories, settopStories] = useState([]);
  const navigation = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollOptions, setPollOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [stories, setStories] = useState([]);
  const [allCategoriesData, setAllCategoriesData] = useState(null);
  const [DisplayImageCrousal, setDisplayImageCrousal] = useState(false);
  const [technology, setTechnology] = useState([]);
  const scrollContainerRef = useRef(null);

  console.log("mid ad in state : ", midAd);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -190, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 190, behavior: "smooth" });
    }
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/content?type=category`)
      .then((contentResponse) => {
        let arr = [];
        for (let i = 0; i < contentResponse.data.length; i++) {
          console.log("ARR", contentResponse.data);
          const element = contentResponse.data.sort((a, b) => {
            const seqA =
              a.sequence !== undefined ? a.sequence : Number.MAX_VALUE;
            const seqB =
              b.sequence !== undefined ? b.sequence : Number.MAX_VALUE;
            return seqA - seqB;
          })[i];
          arr.push(element.text);
        }

        // Promise.all to wait for all axios requests to complete
        return Promise.all(
          arr.map(async (element) => {
            // Axios requests for both type 'vid' and 'img' for each category
            return Promise.all([
              axios.get(
                `${API_URL}/article?pagenation=true&limit=2&category=${element}&type=vid&newsType=breakingNews&status=online`
              ),
              axios.get(
                `${API_URL}/article?pagenation=true&limit=5&category=${element}&type=img&newsType=breakingNews&status=online`
              ),
            ]).then(([vidResponse, imgResponse]) => {
              const vidData = vidResponse.data;
              const imgData = imgResponse.data;
              // Filter out entries with empty arrays
              const filteredVidData = vidData.length > 0 ? vidData : null;
              const filteredImgData = imgData.length > 0 ? imgData : null;
              // Return an object containing both 'vid' and 'img' data for each category
              return {
                category: element,
                vidData: filteredVidData,
                imgData: filteredImgData,
              };
            });
          })
        );
      })
      .then((allCatData) => {
        const filtData = allCatData.filter(
          (categoryData) =>
            categoryData.vidData !== null || categoryData.imgData !== null
        );
        setAllCategoriesData(filtData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Video handlers
  // Function to convert YouTube link to embed URL
  const convertToEmbedUrl = (url) => {
    const urlParts = url.split("watch?v=");
    if (urlParts.length > 1) {
      return `https://www.youtube.com/embed/${urlParts[1].split("&")[0]}`;
    }
    return url.replace("youtu.be/", "www.youtube.com/embed/").split("?")[0];
  };
  const navigate = useNavigate();
  // style for video

  useEffect(() => {
    // Fetch stories when the component mounts
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story`);

        // Log the response data for debugging
        console.log("Raw stories response:", response.data);

        // Filter stories where status is true
        const filteredStories = response.data.filter(
          (story) => story.status === true
        );

        // Log the filtered stories for debugging
        console.log("Filtered stories:", filteredStories);

        // Set the filtered stories in the state
        setStories(filteredStories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    axios
      // .get(
      //   `${API_URL}/article?pagenation=true&limit=8&type=img&status=online&slider=true`
      // )
      // .then((sliderData) => {
      //   console.log("slider articles", sliderData.data);
      //   setSliderArticles(sliderData?.data);
      .get(
        `${API_URL}/article?pagenation=true&limit=8&type=img&status=online&slider=true`
      )
      .then((sliderData) => {
        console.log("slider articles nk", sliderData.data);

        // Filter to ensure only articles with status 'online'
        const onlineArticles = sliderData?.data.filter(
          (article) => article.status === "online"
        );

        // Set the filtered data
        setSliderArticles(onlineArticles);
        axios
          .get(
            `${API_URL}/article?pagenation=true&limit=12&type=img&newsType=breakingNews&status=online&priority=true`
          )
          .then((breakingData) => {
            console.log("breaking news res : ", breakingData);
            // Filter out articles that are already present in sliderArticles
            // const uniqueBreakingNews = breakingData.data.filter(
            //   (article) =>
            //     !sliderData.data.some(
            //       (sliderArticle) => sliderArticle._id === article._id
            //     )
            // );

            // console.log("breaking New",breakingData,uniqueBreakingNews)
            // setbreakingNews(uniqueBreakingNews);
            setbreakingNews(breakingData?.data);

            // console.log("unique breaking news : ", uniqueBreakingNews);

            // const sortedData = uniqueBreakingNews.sort(
            //   (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            // );

            // console.log("uniquebreaking news data after sorting: ", sortedData);
            // setbreakingNews(uniqueBreakingNews);
          })
          .catch(() => {});
        axios
          .get(
            `${API_URL}/article?pagenation=true&limit=10&type=img&newsType=topStories&status=online&priority=true`
          )
          .then((StoryData) => {
            // Filter out articles that are already present in sliderArticles
            const uniqueTopStories = StoryData.data.filter(
              (article) =>
                !sliderData.data.some(
                  (sliderArticle) => sliderArticle._id === article._id
                )
            );

            // console.log("topStories",StoryData,uniqueTopStories)
            settopStories(uniqueTopStories);
          });
        axios
          .get(
            `${API_URL}/article?pagenation=true&limit=14&type=img&newsType=upload&status=online&priority=true`
          )
          .then((latestData) => {
            console.log("latest news get response  : ", latestData);
            // Filter out articles that are already present in sliderArticles
            // const uniqueLatestData = latestData.data.filter(
            //   (article) =>
            //     !sliderData.data.some(
            //       (sliderArticle) => sliderArticle._id === article._id
            //     )
            // );

            // console.log("latestNews",latestData,uniqueLatestData)
            // setLatestNews(uniqueLatestData);
            setLatestNews(latestData?.data);

            // console.log("uniquelatest data : ", uniqueLatestData);
            // const sortedData = uniqueLatestData.sort(
            //   (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            // );

            // console.log("uniquelatest data after sorting: ", sortedData);
            // setLatestNews(sortedData);
          })
          .catch(() => {});
      })
      .catch(() => {});
  }, []);
  console.log("latest news on homepage : ", latestNews);
  console.log("breaking news on homepage : ", breakingNews);
  useEffect(() => {
    axios
      .get(`${API_URL}/polls`)
      .then((response) => {
        const pollsData = response.data;
        const latestPoll = pollsData.length > 0 ? pollsData.slice(-1)[0] : null;
        setCurrentPoll(latestPoll);
        setPollOptions(latestPoll ? latestPoll.options : []);
      })
      .catch((error) => {
        console.error("Error fetching polls:", error);
        // Handle error
      });
  }, []);
  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
      console.log("updated Ad", response);
      // this function works for all ads so handle it respectivly
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }

  const submitVote = async (pollId, optionIndex) => {
    try {
      // Call the backend API to update total votes
      const response = await axios.post(`${API_URL}/polls/${pollId}/vote`, {
        pollId,
        optionIndex,
      });

      // Handle the response if needed
    } catch (error) {
      // Handle errors if the API call fails
      console.error("Error submitting vote:", error);
    }
  };

  useEffect(() => {
    if (midAd && midAd._id) {
      // console.log("mid ad impressioning")
      axios.get(`${API_URL}/ads/click?id=${midAd._id}`).then(() => {
        // console.log("ad mid data")
      });
    }
    if (bottomAd && bottomAd._id) {
      axios.get(`${API_URL}/ads/click?id=${bottomAd._id}`).then((data) => {});
    }
    if (topAd && topAd._id) {
      axios.get(`${API_URL}/ads/click?id=${topAd._id}`).then((data) => {
        // console.log("top ad data response : ", data);
      });
    }
  }, [midAd, bottomAd, topAd]);

  useEffect(() => {
    axios.get(`${API_URL}/ads?active=true&side=top`).then((data) => {
      console.log("top ad data response : ", data);
      setTopAd(data.data.reverse()[0]);
    });
    axios.get(`${API_URL}/ads?active=true&side=mid`).then((data) => {
      console.log("mid ad data response : ", data);
      setMidAd(data.data.reverse());
    });
    axios.get(`${API_URL}/ads?active=true&side=bottom`).then((data) => {
      console.log("bottom ad data response : ", data);
      setBottomAd(data.data.reverse()[0]);
    });
  }, []);
  console.log("midads on homepage : ", midAd);
  const showModal2 = () => {
    setIsModal2Open(true);
  };
  const handleCancel2 = () => {
    setIsModal2Open(false);
  };
  useEffect(() => {
    axios
      .get(`${API_URL}/article?pagenation=true&limit=6&type=img`)
      .then((data) => {
        setArticle(data.data);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_URL}/video`);

        // Log the raw response data for debugging
        console.log("Raw videos response:", response.data);

        // Filter videos where status is true
        const filteredVideos = response.data.filter(
          (video) => video.status === true
        );

        // Log the filtered videos for debugging
        console.log("Filtered videos:", filteredVideos);

        // Set the filtered videos in the state
        setVideo(filteredVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}/photo`)
  //     .then((response) => {
  //       console.log("data response f photo : ", response.data);

  //       // Filter images with status true
  //       const filteredPhotos = response.data.filter(
  //         (item) => item.status === true
  //       );

  //       setPhoto(filteredPhotos);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching photos:", error);
  //     });
  // }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/photo`)
      .then((response) => {
        // Filter and sort photos
        const filteredPhotos = response.data
          .filter((item) => item.status === true) // Only photos with status: true
          .sort((a, b) => {
            // Sort by periority (true first), then by createdAt (newest first)
            if (a.periority === b.periority) {
              return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
            }
            // Higher priority (true) first
            return (
              (b.periority === true ? 1 : 0) - (a.periority === true ? 1 : 0)
            );
          });
        console.log("filtered photos : ", filteredPhotos);
        setPhoto(filteredPhotos); // Update state with filtered and sorted photos
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  }, []);

  console.log("photo in gallery on home page : ", photo);
  useEffect(() => {
    axios
      .get(`${API_URL}/article?id=6524337309c3cf5a3cca172a`)
      .then((data) => {
        setArticleTop(data.data[0]);
        // console.log(Article);
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    axios
      .get(`${API_URL}/flashnews`)
      .then((users) => {
        const activeFlashNews = users.data.filter(
          (item) => item.status === "active"
        );
        setflashnews(activeFlashNews);
      })
      .catch((err) => {
        console.log(err);
      });

    // axios
    //   .get(`${API_URL}/poll`)
    //   .then((users) => {
    //     setUserData(users.data.reverse()[0]);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? flashnews.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === flashnews.length - 1 ? 0 : prevIndex + 1
    );
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSliderItem((prevItem) => (prevItem + 1) % sliderArticles.length);
      if (flashnews.length) {
        handleNextClick();
      }
    }, 7000);
    return () => {
      clearInterval(intervalId);
    };
  }, [flashnews.length]);

  console.log("sliderArticles", sliderArticles);

  return (
    <>
      <div className="main-page-conatiner">
        <ul className="mobileMainPageAnchorSlider">
          <li>
            <a href="/itempage2?newsType=Top-Stories">Top Stories</a>
          </li>
          <li>
            <a href="/itempage2?newsType=LatestNews">Latest News</a>
          </li>
          <li>
            <a href="/itempage2?newsType=BigNews">Big News</a>
          </li>
          <li>
            <a href="/itempage2?newsType=videos">Videos</a>
          </li>
          <li>
            <a href="/story">Visual Stories</a>
          </li>
          <li>
            <a href="/photos">Photos</a>
          </li>
        </ul>

        <div className="mobileMainPageContainer">
          {video?.map((item, index) => {
            let title = item.title
              .replace(/[/\%.?]/g, "")
              .split(" ")
              .join("-");
            if (item.slug) {
              title = item.slug;
            }
            if (index >= 1) return;

            return (
              <div
                key={index}
                onClick={() => {
                  navigation(`/videos2/${title}?id=${item?._id}`, {
                    state: item,
                  });
                }}
                style={{ position: "relative" }}
                className="mobile-main-page-videos-items"
              >
                <PlayCircleOutlined
                  style={{
                    borderRadius: "100%",
                    position: "absolute",
                    backgroundColor: "red",
                    top: "50%",
                    left: "50%",
                    fontSize: "50px",
                    color: "white",
                    translate: "-50% -50%",
                  }}
                />
                <video
                  onClick={() => {
                    navigation(`/videos2/${title}?id=${item?._id}`, {
                      state: item,
                    });
                  }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  src={item.image}
                />
              </div>
            );
          })}
          <div className="container3">
            <div className="main-page-flash-news container">
              <div className="flash-news-2">
                <div className="flash-news-slider">
                  <div className="flash-news-2-text">
                    {flashnews.length > 0 && (
                      <a
                        href={flashnews[currentIndex].link}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        {flashnews[currentIndex].slugName.substring(0, 45)}
                      </a>
                    )}
                  </div>
                  <div className="flash-news-2-icons">
                    <IoMdArrowDropleft size={25} onClick={handlePrevClick} />
                    <IoMdArrowDropright size={25} onClick={handleNextClick} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* second */}
          {/* <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "3%",
              padding: "0 9px",
            }}
          >
            <div className="main-page-slider-setting">
              {sliderItem % 2 === 0 ? (
                <>
                  {sliderArticles?.map((data, index) => {
                    if (index == sliderItem) {
                      return (
                        <ImageCard
                          key={index}
                          img={data.image}
                          text={data.title}
                          slug={data.slug}
                          title={data.title}
                          id={data._id}
                          height="50vh"
                          width="100%"
                        />
                      );
                    } else {
                      <ImageCard
                        img={sliderItems[sliderItem]}
                        text={data.title}
                        slug={data.slug}
                        title={data.title}
                        id={data._id}
                        height="50vh"
                        width="100%"
                      />;
                    }
                  })}
                </>
              ) : (
                <></>
              )}

              <div className="main-page-slider-items">
                {sliderArticles
                  .map((_, i) => i)
                  .filter((i) => i % 2 === 0)
                  .map((item, index) => (
                    <div
                      key={item}
                      className={`slider-item ${
                        sliderItem === item ? "slider-item-active" : ""
                      }`}
                      onClick={() => {
                        setShowItem(false);
                        setTimeout(() => {
                          setShowItem(true);
                          setSliderItem(item);
                        }, 1000);
                      }}
                    ></div>
                  ))}
              </div>
            </div>
            <div className="main-page-slider-setting">
              {sliderItem2 % 2 !== 0 ? (
                <>
                  {sliderArticles?.map((data, index) => {
                    // let title = data?.title
                    //   ?.replace(/[/\%.?]/g, "")
                    //   .split(" ")
                    //   .join("-");
                    // if (data.slug) {
                    //   title = data.slug;
                    // }
                    if (index == sliderItem2) {
                      return (
                        <ImageCard
                          key={index}
                          img={data.image}
                          text={data.title}
                          slug={data.slug}
                          title={data.title}
                          id={data._id}
                          height="50vh"
                          width="100%"
                        />
                      );
                    } else {
                      <ImageCard
                        img={sliderItems[sliderItem2]}
                        text={data.title}
                        slug={data.slug}
                        title={data.title}
                        id={data._id}
                        height="50vh"
                        width="100%"
                      />;
                    }
                  })}
                </>
              ) : (
                <></>
              )}

              <div className="main-page-slider-items">
                {sliderArticles
                  .map((_, i) => i)
                  .filter((i) => i % 2 !== 0)
                  .map((item) => (
                    <div
                      key={item}
                      className={`slider-item ${
                        sliderItem2 === item ? "slider-item-active" : ""
                      }`}
                      onClick={() => {
                        setShowItem(false);
                        setTimeout(() => {
                          setShowItem(true);
                          setSliderItem2(item);
                        }, 1000);
                      }}
                    ></div>
                  ))}
              </div>
            </div>
          </div> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "3%",
              padding: "0 9px",
            }}
          >
            <div className="main-page-slider-setting">
              {sliderArticles?.length > 0 ? (
                <Slide easing="ease" duration={3000} indicators={true}>
                  {sliderArticles.map((data) => (
                    <div key={data._id} className="each-slide">
                      <ImageCard
                        img={data?.image}
                        text={data.title}
                        slug={data.slug}
                        title={data.title}
                        id={data._id}
                        width="100%"
                        height="32vh"
                      />
                    </div>
                  ))}
                </Slide>
              ) : (
                <div className="text-center">Loading...</div>
              )}
            </div>
          </div>

          {/* third */}
          {/* <div className="main-conatiner container container3">
            <div
              className="main-page-slider-setting"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              {sliderArticles?.length > 0 ? (
                <Slide
                  easing="ease"
                  duration={2000}
                  indicators={(index) => (
                    <div
                      style={{
                        display: "inline-block",
                        width: "8px",
                        height: "8px",
                        margin: "0 4px",
                        backgroundColor:
                          currentIndex === index ? "black" : "gray",
                        borderRadius: "50%",
                      }}
                    ></div>
                  )}
                >
                  {sliderArticles?.slice(0, 10).map((data) => (
                    <div key={data._id} className="each-slide">
                      <ImageCard
                        img={data?.image}
                        text={data.title}
                        title={data.title}
                        slug={data.slug}
                        id={data._id}
                        height="35vh"
                        width="100%"
                      />
                    </div>
                  ))}
                </Slide>
              ) : (
                <div>Loading...</div>
              )}
            </div> */}

          {/* Breaking news section */}
          {/* <div id="LatestNews" className="main-left-side">
              <div className="mobileMainPageHeading">
                <div>{t("ln")}</div>
              </div>
              <div className="top-stories-all-cards">
                {breakingNews.map((data, index) => {
                  let title = data.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (data.slug) {
                    title = data.slug;
                  }
                  if (index > 3) {
                    return (
                      <StoriesCard
                        data={data}
                        key={index}
                        OnPress={() =>
                          navigation(`/details/${title}?id=${data?._id}`)
                        }
                        image={data?.image}
                        text={data?.title}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>

            {/* Top stories section */}
          {/* <div id="TopStories" className="main-left-side">
              <div className="mobileMainPageHeading">
                <div>{t("ts")}</div>
              </div>
              <div className="mobile-main-page-videos-container flex-col">
                {topStories?.map((item, index) => {
                  let title = item.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (item.slug) {
                    title = item.slug;
                  }

                  if (title && index < 6) {
                    return (
                      <div
                        key={index}
                        onClick={() =>
                          navigation(`/details/${title}?id=${item?._id}`, {
                            state: item,
                          })
                        }
                        className="mobileTopStoryCard flex-row-reverse"
                      >
                        <img
                          style={{
                            width: "150px",
                            height: "118px",
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          src={item.image}
                        />
                        <div
                          style={{
                            height: "50%",
                            width: "100%",
                            fontSize: "13px",
                            padding: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.title}
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          </div>  */}

          {/* sheersh aalekh */}
          <div>
            <div className=" flex items-center justify-center my-2 mt-4">
              {midAd?.map((data, i) => {
                return (
                  <>
                    <div className=" w-full ">
                      <a
                        href={data?.link}
                        target="_blank"
                        onClick={() => {
                          onClickAd(data?._id);
                        }}
                        rel="noreferrer"
                      >
                        <img
                          style={{
                            cursor: "pointer",
                            padding: "2px",
                          }}
                          className="h-56 w-[80%] mx-auto"
                          src={data?.imgLink}
                          alt=""
                        />
                      </a>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div
            className="webMainPagecomponent  main-component-group flex gap-7"
            style={{ padding: "20px 30px", width: "100%", display: "flex" }}
          >
            <div className="main-component-group-left" style={{ width: "70%" }}>
              <div className="image-conatiner">
                <div
                  className="main-conatiner-image-1"
                  style={{ position: "relative" }}
                >
                  <ImageCard
                    height="100%"
                    width="100%"
                    img={breakingNews?.[0]?.image}
                    text={breakingNews?.[0]?.title}
                    title={breakingNews?.[0]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    slug={breakingNews?.[0]?.slug}
                    id={breakingNews?.[0]?._id}
                  />
                </div>
                <div
                  className="main-conatiner-image-2"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <ImageCard
                    img={breakingNews?.[1]?.image}
                    text={breakingNews?.[1]?.title}
                    title={breakingNews?.[1]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    slug={breakingNews?.[1]?.slug}
                    id={breakingNews?.[1]?._id}
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>

              <div className="image-conatiner" style={{ marginTop: "5%" }}>
                <div className="main-conatiner-image-1">
                  <ImageCard
                    height="100%"
                    width="100%"
                    img={sliderArticles?.[0]?.image}
                    text={sliderArticles?.[0]?.title}
                    title={sliderArticles?.[0]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    id={sliderArticles?.[0]?._id}
                  />
                </div>
                <div
                  className="main-conatiner-image-2"
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  <ImageCard
                    img={sliderArticles?.[1]?.image}
                    text={sliderArticles?.[1]?.title}
                    title={sliderArticles?.[1]?.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-")}
                    id={sliderArticles?.[1]?._id}
                    height="100%"
                    width="100%"
                  />
                </div>
              </div>

              <div
                className="more-text"
                onClick={() => {
                  navigation(`/itempage2?newsType=topStories`);
                }}
              >
                {"more"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
            <div
              id="TopStories"
              className="main-component-group-right"
              style={{ width: "30%" }}
            >
              <div className="main-left-side-top">
                <div>{t("ts")}</div>
              </div>
              <div className="top-stories-all-cards">
                {topStories
                  ?.sort(
                    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                  )
                  .map((data, index) => {
                    let title = data.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }

                    if (title && index < 5) {
                      return (
                        <StoriesCard
                          data={data}
                          key={index}
                          OnPress={() =>
                            navigation(`/details/${title}?id=${data?._id}`)
                          }
                          image={data?.image}
                          text={data?.title}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          </div>
          {/* forth */}
          <div className="main-conatiner container container3">
            <div
              id="BigNews"
              className="main-left-side"
              style={{ flexDirection: "column", position: "relative" }}
            >
              <div className="mobileMainPageHeading">
                <div>{t("bn")}</div>
              </div>

              {/* Slider control buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "10px",
                  position: "absolute",
                  bottom: "74px",
                }}
              >
                <button
                  onClick={scrollLeft}
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IoChevronBack />
                </button>
                <button
                  onClick={scrollRight}
                  style={{
                    background: "rgba(255, 255, 255, 0.6)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IoChevronForward />
                </button>
              </div>

              {/* Top stories container */}
              <div
                ref={scrollContainerRef}
                className="top-stories-all-cards"
                style={{
                  display: "flex",

                  overflowX: "auto",

                  columnGap: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                {topStories &&
                  topStories.length > 3 &&
                  topStories.map((data, index) => {
                    let title = data.title
                      .replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }

                    if (title && index < 10 && index >= 5) {
                      return (
                        <StoriesCard
                          data={data}
                          key={index}
                          OnPress={() =>
                            navigation(`/details/${title}?id=${data?._id}`)
                          }
                          image={data?.image}
                          text={data?.title}
                          id="columnReverse"
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          </div>
          {/* fifth */}
          <div
            // id="Videos"
            style={{
              backgroundColor: "blue",
              padding: "0px 10px",
              width: "90%",
              display: "none",
            }}
            className="main-left-side"
          >
            <div
              style={{
                color: "white",
                backgroundColor: "transparent",
                padding: "0",
              }}
              className="mobileMainPageHeading"
            >
              Top {t("v")}
            </div>
            <div className="mobile-main-page-videos-container">
              {video?.map((item, index) => {
                let title = item.title
                  .replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (item.slug) {
                  title = item.slug;
                }
                if (index < 1) return;

                return (
                  <>
                    <div
                      onClick={() => {
                        navigation(`/videos2/${title}?id=${item?._id}`, {
                          state: item,
                        });
                      }}
                      className="mobile-main-page-videos-items"
                    >
                      {item.image ? (
                        <video
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                          }}
                          src={item.image}
                        />
                      ) : (
                        <iframe
                          className="video video-card-img"
                          title="Youtube player"
                          sandbox="allow-same-origin allow-forms allow-popups allow-scripts allow-presentation"
                          src={item.link}
                          // width={"300px"}
                          // height={"200px"}
                        ></iframe>
                      )}
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <AllSectionArticle data={allCategoriesData} />
          <div className="main-conatiner container  ">
            <div
              id="VisualStories"
              style={{ padding: "0px 10px" }}
              className="visual-stories-main-container container2 container3"
            >
              <div className="mobileMainPageHeading">{t("vs")}</div>

              <div className="main-page-visual-story-Ad-container ">
                <div className="main-page-visual-story-container">
                  {stories.map((story) => {
                    console.log("story: ", story);

                    // Find the image with albumPeriority: true
                    const prioritizedImage = story.images.find(
                      (image) => image.albumPeriority === true
                    );
                    console.log("prioritized: ", prioritizedImage);

                    // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                    const displayImage = prioritizedImage
                      ? prioritizedImage.img
                      : story.images[0]?.img;
                    const displayText = prioritizedImage
                      ? prioritizedImage.text
                      : story.images[0]?.text;

                    return (
                      <a
                        href={`/stories?id=${story._id}`}
                        target="_blank"
                        key={story._id}
                        rel="noreferrer"
                      >
                        <div className="visual-story-card">
                          <ImageCard
                            style={{
                              fontSize: "15px",
                              fontWeight: 400,
                              height: "80px",
                              borderRadius: 0,
                            }}
                            height="300px"
                            width="100"
                            img={displayImage}
                            id={story._id}
                            title={displayText}
                            text={story?.title}
                            fromVStrories={true}
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* <div
            id="Photos"
            className="main-video-gallery-main-container container2 container3"
          >
            <div className="main-page-video-heading2">{t("ph")}</div>
            <div className="main-page-photoGallery-container">
              {photo &&
                photo.map((img, index) => {
                  console.log("img to show in thumbnail : ", img);

                  // Find the image with albumPeriority: true
                  const prioritizedImage = img?.images.find(
                    (image) => image.albumPeriority === true
                  );
                  console.log("prioritized: ", prioritizedImage);

                  // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                  const displayImage = prioritizedImage
                    ? prioritizedImage.img
                    : img?.images[0]?.img;

                  const displayText = prioritizedImage
                    ? prioritizedImage.text
                    : img?.images[0]?.text;
                  return (
                    <div key={index}>
                      <a
                        href={`/photos/${img?._id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="photoGallery-card">
                          <img src={displayImage} alt={displayText} />
                        </div>
                      </a>
                      <div
                        className=""
                        style={{
                          // background: "red",
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          // marginTop: "0.5rem",
                          alignItems: "center",
                          // padding:"0px 3px"
                        }}
                      >
                        <span className="pgt">{img?.title.toUpperCase()}</span>

                        <div className="pgt-r">
                          <div
                            style={{
                              display: "flex",
                              gap: "5px",
                              alignItems: "center", // This aligns items vertically
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                lineHeight: "1",
                              }}
                            >
                              <IoCameraSharp />
                            </span>
                            <span style={{ lineHeight: "1" }}>
                              {img?.images?.length < 10
                                ? "0" + img?.images?.length
                                : img?.images?.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div> */}

          <div
            id="Photos"
            className="main-video-gallery-main-container container2 container3"
            style={{ position: "relative" }}
          >
            <div className="main-page-video-heading2">{t("ph")}</div>

            {/* Arrow buttons for scrolling */}
            <div
              style={{
                width: "95%",
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                position: "absolute",
                bottom: "186px",
              }}
            >
              <button
                onClick={scrollLeft}
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoChevronBack />
              </button>
              <button
                onClick={scrollRight}
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoChevronForward />
              </button>
            </div>

            <div
              ref={scrollContainerRef}
              className="main-page-photoGallery-container"
              style={{ display: "flex", overflowX: "auto", gap: "20px" }}
            >
              {photo &&
                photo.map((img, index) => {
                  console.log("img to show in thumbnail: ", img);

                  // Find the image with albumPeriority: true
                  const prioritizedImage = img?.images.find(
                    (image) => image.albumPeriority === true
                  );
                  console.log("prioritized: ", prioritizedImage);

                  // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                  const displayImage = prioritizedImage
                    ? prioritizedImage.img
                    : img?.images[0]?.img;

                  const displayText = prioritizedImage
                    ? prioritizedImage.text
                    : img?.images[0]?.text;

                  return (
                    <div key={index}>
                      <a
                        href={`/photos/${img?._id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <div className="photoGallery-card">
                          <img
                            src={displayImage}
                            alt={displayText}
                            style={{ width: "100%" }}
                          />
                        </div>
                      </a>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span className="pgt">{img?.title.toUpperCase()}</span>
                        <div
                          className="pgt-r"
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              lineHeight: "1",
                            }}
                          >
                            <IoCameraSharp />
                          </span>
                          <span style={{ lineHeight: "1" }}>
                            {img?.images?.length < 10
                              ? "0" + img?.images?.length
                              : img?.images?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* main mobile */}

        <div className="container3 webMainPagecomponent">
          <div className="main-page-flash-news container">
            <div className="flash-news-1 ">{t("fn")}</div>
            <div className="flash-news-2">
              <div className="flash-news-slider">
                <div className="flash-news-2-text">
                  {flashnews.length > 0 && (
                    <a
                      href={flashnews[currentIndex].link}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      {flashnews[currentIndex].slugName}
                    </a>
                  )}
                </div>
                <div className="flash-news-2-icons">
                  <IoMdArrowDropleft size={25} onClick={handlePrevClick} />
                  <IoMdArrowDropright size={25} onClick={handleNextClick} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        <div className="main-conatiner container container3 webMainPagecomponent mainwebSecond">
          <div className="main-rigth-side">
            <div className="image-conatiner">
              <div className="main-conatiner-image-1">
                <ImageCard
                  height="100%"
                  width="100%"
                  img={breakingNews?.[0]?.image}
                  text={breakingNews?.[0]?.title}
                  title={breakingNews?.[0]?.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-")}
                  slug={breakingNews?.[0]?.slug}
                  id={breakingNews?.[0]?._id}
                />
              </div>
              <div
                className="main-conatiner-image-2"
                style={{
                  marginLeft: "10px",
                }}
              >
                <ImageCard
                  img={breakingNews?.[1]?.image}
                  text={breakingNews?.[1]?.title}
                  title={breakingNews?.[1]?.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-")}
                  slug={breakingNews?.[1]?.slug}
                  id={breakingNews?.[1]?._id}
                  height="100%"
                  width="100%"
                />
              </div>
            </div>

            {/* <div className="image-conatiner" style={{ marginTop: "5%" }}>
              <div className="main-conatiner-image-1">
                <ImageCard
                  height="100%"
                  width="100%"
                  img={sliderArticles?.[0]?.image}
                  text={sliderArticles?.[0]?.title}
                  title={sliderArticles?.[0]?.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-")}
                  id={sliderArticles?.[0]?._id}
                />
              </div>
              <div
                className="main-conatiner-image-2"
                style={{
                  marginLeft: "10px",
                }}
              >
                <ImageCard
                  img={sliderArticles?.[1]?.image}
                  text={sliderArticles?.[1]?.title}
                  title={sliderArticles?.[1]?.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-")}
                  id={sliderArticles?.[1]?._id}
                  height="100%"
                  width="100%"
                />
              </div>
            </div> */}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "3%",
              }}
            >
              <div className="main-page-slider-setting">
                {sliderItem % 2 === 0 ? (
                  <>
                    {sliderArticles?.map((data, index) => {
                      // let title = data?.title
                      //   ?.replace(/[/\%.?]/g, "")
                      //   .split(" ")
                      //   .join("-");
                      // if (data.slug) {
                      //   title = data.slug;
                      // }
                      if (index == sliderItem) {
                        return (
                          <>
                            <ImageCard
                              img={data.image}
                              text={data.title}
                              slug={data.slug}
                              title={data.title}
                              id={data._id}
                              height="50vh"
                              width="100%"
                            />
                          </>
                        );
                      } else {
                        <ImageCard
                          img={sliderItems[sliderItem]}
                          text={data.title}
                          slug={data.slug}
                          title={data.title}
                          id={data._id}
                          height="50vh"
                          width="100%"
                        />;
                        // <img
                        //   src={sliderItems[sliderItem]}
                        //   alt=""
                        //   className={`slider-img ${showItem ? "show" : ""}`}
                        // />;
                      }
                    })}
                  </>
                ) : (
                  <></>
                )}

                <div className="main-page-slider-items">
                  {sliderArticles
                    .map((_, i) => i)
                    .filter((i) => i % 2 === 0)
                    .map((item, index) => (
                      <div
                        key={item}
                        className={`slider-item ${
                          sliderItem === item ? "slider-item-active" : ""
                        }`}
                        onClick={() => {
                          setShowItem(false);
                          setTimeout(() => {
                            setShowItem(true);
                            setSliderItem(item);
                          }, 1000);
                        }}
                      ></div>
                    ))}
                </div>
              </div>
              <div className="main-page-slider-setting">
                {sliderItem2 % 2 !== 0 ? (
                  <>
                    {sliderArticles?.map((data, index) => {
                      // let title = data?.title
                      //   ?.replace(/[/\%.?]/g, "")
                      //   .split(" ")
                      //   .join("-");
                      // if (data.slug) {
                      //   title = data.slug;
                      // }
                      if (index == sliderItem2) {
                        return (
                          <>
                            <ImageCard
                              img={data.image}
                              text={data.title}
                              slug={data.slug}
                              title={data.title}
                              id={data._id}
                              height="50vh"
                              width="100%"
                            />
                          </>
                        );
                      } else {
                        <ImageCard
                          img={sliderItems[sliderItem2]}
                          text={data.title}
                          slug={data.slug}
                          title={data.title}
                          id={data._id}
                          height="50vh"
                          width="100%"
                        />;
                        // <img
                        //   src={sliderItems[sliderItem]}
                        //   alt=""
                        //   className={`slider-img ${showItem ? "show" : ""}`}
                        // />;
                      }
                    })}
                  </>
                ) : (
                  <></>
                )}

                <div className="main-page-slider-items">
                  {sliderArticles
                    .map((_, i) => i)
                    .filter((i) => i % 2 !== 0)
                    .map((item, index) => (
                      <div
                        key={item}
                        className={`slider-item ${
                          sliderItem2 === item ? "slider-item-active" : ""
                        }`}
                        onClick={() => {
                          setShowItem(false);
                          setTimeout(() => {
                            setShowItem(true);
                            setSliderItem2(item);
                          }, 1000);
                        }}
                      ></div>
                    ))}
                </div>
              </div>
            </div>
            <div
              className="more-text"
              onClick={() => {
                navigation(`/itempage2?newsType=topStories`);
              }}
            >
              {"more"}{" "}
              <FaGreaterThan
                style={{
                  marginLeft: "6px",
                }}
              />
            </div>
          </div>
          <div id="TopStories" className="main-left-side">
            <div className="main-left-side-top">
              <div>{t("ts")}</div>
            </div>
            <div className="top-stories-all-cards">
              {topStories
                ?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((data, index) => {
                  let title = data.title
                    .replace(/[/\%.?]/g, "")
                    .split(" ")
                    .join("-");
                  if (data.slug) {
                    title = data.slug;
                  }

                  if (title && index < 7) {
                    return (
                      <StoriesCard
                        data={data}
                        key={index}
                        OnPress={() =>
                          navigation(`/details/${title}?id=${data?._id}`)
                        }
                        image={data?.image}
                        text={data?.title}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
            </div>
          </div>
        </div>
        {/*  */}
        <div className="main-news-area webMainPagecomponent">
          <div
            id="LatestNews"
            // style={{ backgroundColor: "red" }}
            className="news-main-side-left"
          >
            <div className="main-news-heading">{t("ln")}</div>
            <div className="news-cards-area container3">
              {latestNews.slice(0, 6).map((data) => {
                let title = data?.title
                  ?.replace(/[/\%.?]/g, "")
                  .split(" ")
                  .join("-");
                if (data.slug) {
                  title = data.slug;
                }
                // Check if title is defined before rendering the NewsCard
                if (title) {
                  return (
                    <div
                      className="news-card-items-area latesteNewsWebVersionCards"
                      key={data?._id}
                    >
                      <NewsCard
                        data={data}
                        onPress={() =>
                          navigation(`/details/${title}?id=${data._id}`)
                        }
                      />
                    </div>
                  );
                } else {
                  // Handle the case where title is undefined or null
                  return null; // or handle it in a way that makes sense for your application
                }
              })}
            </div>
            <div
              className="more-text"
              style={{ marginRight: "40px" }}
              onClick={() => {
                navigation(`/itempage2?newsType=upload`);
              }}
            >
              {"more"}{" "}
              <FaGreaterThan
                style={{
                  marginLeft: "6px",
                }}
              />
            </div>
          </div>
          <div className="news-main-side-rigth">
            <div id="BigNews" className="news-main-rigth-part1">
              <div className="main-news-heading">{t("bn")}</div>
              <div
                className="news-cards-area container3"
                // style={{ backgroundColor: "yellow" }}
              >
                {breakingNews &&
                  breakingNews.length > 2 &&
                  // breakingNews.map((data, index) => {
                  breakingNews.slice(0, 3).map((data, index) => {
                    let title = data?.title
                      ?.replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }

                    // Check if title is defined before rendering the NewsCard
                    // if (title && index > 1 && index < 5) {
                    if (title) {
                      return (
                        <div className="news-card-items-area" key={data?._id}>
                          <NewsCard
                            data={data}
                            onPress={() =>
                              navigation(`/details/${title}?id=${data._id}`)
                            }
                          />
                        </div>
                      );
                    } else {
                      // Handle the case where title is undefined or null
                      // console.error("No title ")
                      return null; // or handle it in a way that makes sense for your application
                    }
                  })}

                {/* {breakingNews.length > 0 &&
                  breakingNews.map((data) => {
                    let title = data?.title
                      ?.replace(/[/\%.?]/g, "")
                      .split(" ")
                      .join("-");
                    if (data.slug) {
                      title = data.slug;
                    }
                    return (
                      <div className="news-card-items-area" key={data?._id}>
                        <NewsCard
                          data={data}
                          onPress={() =>
                            navigation(`/details/${title}?id=${data._id}`)
                          }
                        />
                      </div>
                    );
                  })} */}
              </div>
              <div
                className="more-text"
                onClick={() => {
                  navigation(`/itempage2?newsType=breakingNews`);
                }}
              >
                {"more"}{" "}
                <FaGreaterThan
                  style={{
                    marginLeft: "6px",
                  }}
                />
              </div>
            </div>
            <div className="news-main-rigth-part2">
              {/* <a
                href={midAd?.link}
                target="_blank"
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "20px",
                    backgroundColor: "white",
                    position: "absolute",
                    top: 16,
                    textAlign: "center",
                  }}
                >
                  advertisement
                </div>
                <img
                  style={{ cursor: "pointer" }}
                  src={midAd?.imgLink}
                  alt=""
                />
                <div
                  style={{
                    width: "100%",
                    height: "80px",
                    backgroundColor: "white",
                    position: "absolute",
                    bottom: 0,
                    paddingLeft: 10,
                  }}
                >
                  <div style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                    {midAd?.slugName}
                  </div>
                  <a href={midAd?.link}>{midAd?.link}</a>
                </div>
              </a> */}
              {midAd.length > 0 && (
                <div>
                  {midAd?.slice(0, 4).map((midAd) => {
                    return (
                      <a
                        key={midAd._id}
                        href={midAd.link}
                        target="_blank"
                        onClick={() => {
                          onClickAd(midAd._id);
                        }}
                        rel="noreferrer"
                      >
                        <img
                          src={midAd.imgLink}
                          style={{ width: "100%", marginBottom: "10px" }}
                        />
                        <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                          {/* {midAd.slugName} */}
                        </p>
                      </a>
                    );
                  })}
                </div>
              )}
              {/* {topAd && (
                <a
                  style={{
                    background: "white",
                    padding: "10px",
                    position: "absolute",
                    top: "0",
                    left: "13rem",
                    width: "20%",
                    paddingBottom: "0px",
                    height: "auto",
                  }}
                  href={topAd.link}
                  target="_blank"
                  onClick={() => {
                    onClickAd(topAd._id);
                  }}
                >
                  <img src={topAd.imgLink} style={{ width: "100%" }} />
                  <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                    {topAd.slugName}
                  </p>
                </a>
              )} */}
              {/* {bottomAd && (
                <a
                  // style={{ backgroundColor: "red", padding: "10px" }}
                  href={bottomAd.link}
                  target="_blank"
                  onClick={() => {
                    onClickAd(bottomAd._id);
                  }}
                >
                  <img src={bottomAd.imgLink} style={{ width: "100%" }} />
                  <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                    {bottomAd.slugName}
                  </p>
                </a>
              )} */}
              <div
                style={{
                  width: "100%",
                  // height: "100%",
                  background: "White",
                  marginTop: 10,
                  borderRadius: 10,
                  padding: 10,
                  paddingBottom: 50,
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: 18,
                    textAlign: "start",
                    fontFamily: "Poppins",
                  }}
                >
                  {currentPoll?.question}
                </div>
                <Radio.Group
                  value={selectedOption}
                  style={{ width: "100%", marginTop: "20px" }}
                >
                  <Row gutter={12}>
                    {pollOptions.map((option, index) => (
                      <Col xs={12} key={index}>
                        <div
                          style={{
                            width: "90%",
                            minHeight: "40px",
                            maxHeight: "60px",
                            overflow: "hidden",
                            borderRadius: 10,
                            border: "1px solid black",
                            marginBottom: 10,
                            alignItems: "center",
                            display: "flex",
                            paddingLeft: "10px",
                            textTransform: "capitalize",
                          }}
                        >
                          <Radio
                            onClick={() => {
                              if (selectedOption === null) {
                                setSelectedOption(index);
                                submitVote(currentPoll._id, index);
                              }
                            }}
                            value={index}
                            disabled={selectedOption !== null}
                          >
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                marginTop: "-10px",
                              }}
                            >
                              {option.optionText}
                            </div>
                          </Radio>

                          {selectedOption !== null && (
                            <Progress
                              percent={option.percentage.toFixed(0)} // Adjust the decimal places as needed
                              size="small"
                            />
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        <div
          className="all-videos"
          style={{
            backgroundColor: "blue",
            padding: "1rem 2.5rem",
            height: "content-fit",
          }}
        >
          <h1 className="main-page-video-heading2" id="Videos">
            {" "}
            Videos
          </h1>
          <div className="video-containerr">
            <div className="left-columnn">
              {video.slice(0, 2).map((vdo, index) => {
                return <VdoThumb key={index} data={vdo} />;
              })}
            </div>
            <div className="middle-columnn">
              <VdoThumb data={video[2]} />
            </div>
            <div className="right-columnn">
              {video.slice(3, 5).map((vdo, index) => {
                return <VdoThumb key={index} data={vdo} />;
              })}
            </div>
          </div>
          {/* see more btn */}
          <div
            className="more-text"
            onClick={() => navigate("/itempage2?newsType=videos")}
          >
            {"more"}{" "}
            <FaGreaterThan
              style={{
                marginLeft: "6px",
              }}
            />
          </div>
        </div>
        {/* <div
          id="Videos"
          className="main-page-videos-conatiner container2 container3 webMainPagecomponent"
        >
          <div
            className="main-page-video-heading"
            // style={{ backgroundColor: "green" }}
          >
            {t("v")}{" "}
          </div>
          {/* Video Container */}
        {/* <div className="video-cards "> */}
        {/* <div style={{ backgroundColor: "red" }}>video container</div> */}
        {/* <div
              className=""
              style={{
                // backgroundColor: "yellow",
                paddingLeft: "5rem",
                paddingTop: "2rem",
                // gap:"px",
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-between",
                margin: "auto",
                // gap:"-20px"
              }}
            > */}
        {/* video container */}
        {/* {video.slice(0, 4).map((video) => (
                <div style={{ width: "50%" }} key={video._id}>
                  {video.link.includes("<iframe") ? (
                    // If the link already contains iframe, render it with dangerouslySetInnerHTML
                    <div
                      // style={{ width: "400px", height: "200px", marginBottom:"10px" }}
                      dangerouslySetInnerHTML={{
                        __html: video.link,
                      }}
                    />
                  ) : ( */}
        {/* // Otherwise, convert the link to an embed URL and use an iframe */}
        {/* <iframe
                      width="500"
                      height="250"
                      // style={{ marginBottom: "140px" }}
                      src={convertToEmbedUrl(video.link)}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div> */}
        {/* ))} */}
        {/* </div> */}
        {/* <div className="video-card-box-1 video-card-box-left">
            {video && video[0] ? (
                <VideoCard fromVideoGallery={true} data={video[0]} />
              ) : null}
              {video && video[1] ? (
                // <VideoCard fromVideoGallery={true} data={video && video[1]} />
                <Link>
                <img src={video[0].image} alt="thumbnail" />
                </Link>
              ) : null}
            </div> */}
        {/* <div className="video-box" style={{ marginBottom: "40px" }}>
              {video && video[2] ? (
                <VideoCard
                  fromVideoGallery={true}
                  isMain={true}
                  width={500}
                  data={video && video[2]}
                />
              ) : null}
            <div className="video-items-box">
                <FaRegCirclePlay size={50} color="red" style={{ zIndex: 1 }} />
                <div className="video-text-box">
                  <div>
                    War Of Words Between Babar, Shaheen After Pakistan's Asia
                    Cup Exit: Report
                  </div>
                </div>
              </div>
            </div> */}
        {/* <div className="video-card-box-1 video-card-box-right">
              {video && video[3] ? (
                <VideoCard fromVideoGallery={true} data={video && video[3]} />
              ) : null}
              {video && video[4] ? (
                <VideoCard fromVideoGallery={true} data={video && video[4]} />
              ) : null}
            </div>
          </div>
        </div>*/}
        <div className="webMainPagecomponent all-category-data">
          <AllSectionArticle data={allCategoriesData} />
        </div>

        {stories && stories.length > 0 && (
          <div
            id="VisualStories"
            className="visual-stories-main-container container2 container3 webMainPagecomponent"
          >
            <div className="main-page-technology-heading">{t("vs")}</div>

            <div className="main-page-visual-story-Ad-container">
              <div className="main-page-visual-story-container">
                {stories.map((story) => {
                  console.log("story: ", story);

                  // Find the image with albumPeriority: true
                  const prioritizedImage = story.images.find(
                    (image) => image.albumPeriority === true
                  );
                  console.log("prioritized: ", prioritizedImage);

                  // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                  const displayImage = prioritizedImage
                    ? prioritizedImage.img
                    : story.images[0]?.img;
                  const displayText = prioritizedImage
                    ? prioritizedImage.text
                    : story.images[0]?.text;

                  return (
                    <a
                      href={`/stories?id=${story._id}`}
                      target="_blank"
                      key={story._id}
                      rel="noreferrer"
                    >
                      <div className="visual-story-card">
                        <ImageCard
                          style={{
                            fontSize: "15px",
                            fontWeight: 400,
                            height: "80px",
                            borderRadius: 0,
                          }}
                          height="300px"
                          width="100"
                          img={displayImage}
                          id={story._id}
                          text={story.title}
                          title={displayText}
                          fromVStrories={true}
                        />
                      </div>
                    </a>
                  );
                })}
              </div>
              <div className="main-page-Ad-container-visualStory">
                {bottomAd && (
                  <a
                    href={bottomAd.link}
                    target="_blank"
                    onClick={() => {
                      onClickAd(bottomAd._id);
                    }}
                    rel="noreferrer"
                  >
                    <img
                      src={bottomAd.imgLink}
                      style={{ width: "100%", height: "100%" }}
                    />
                    <p style={{ fontSize: "16px", fontFamily: "Poppins" }}>
                      {/* {bottomAd.slugName} */}
                    </p>
                  </a>
                )}
              </div>
            </div>

            {/* <div className="visual-stories-main-container2 container3">
            <div className="visual-stories-main-container-part1">
              <div
                className="visual-stories-main-container-main-area"
                style={{
                  display: "flex", // Set display to flex
                  flexWrap: "wrap", // Allow wrapping to the next line
                }}
              >
                {console.log("***************storues",stories)}
                {stories &&
                  stories.length > 0 &&
                  stories.map((story) => (
                    <Col span={8} key={story._id}>
                      <Card
                        hoverable
                        style={{ marginBottom: 16, flex: 1 }}
                        cover={<img alt={story.title} src={story.image} />}
                      >
                        <Meta
                          title={story.title}
                          description="www.instagram.com"
                        />
                      </Card>
                    </Col>
                  ))}
              </div>
            </div>
          </div> */}
            {/* ... (your existing JSX code) */}
          </div>
        )}

        <div
          id="Photos"
          className="main-video-gallery-main-container container2 container3 webMainPagecomponent"
        >
          <div className="main-page-video-heading2">{t("ph")}</div>
          <div className="main-page-photoGallery-container">
            {photo &&
              photo.map((img, index) => {
                // Find the image with albumPeriority: true
                const prioritizedImage = img?.images.find(
                  (image) => image.albumPeriority === true
                );

                // If prioritizedImage is found, use it; otherwise, fallback to the 0th image
                const displayImage = prioritizedImage
                  ? prioritizedImage.img
                  : img?.images[0]?.img;

                const displayText = prioritizedImage
                  ? prioritizedImage.text
                  : img?.images[0]?.text;

                return (
                  <div key={index}>
                    <a
                      href={`/photos/${img?._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div className="photoGallery-card">
                        <img src={displayImage} alt={displayText} />
                      </div>
                    </a>
                    <div
                      className=""
                      style={{
                        // background: "red",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        // marginTop: "0.5rem",
                        alignItems: "center",
                        padding: "0px 3px",
                      }}
                    >
                      <span className="pgt">{img?.title.toUpperCase()}</span>

                      <div className="pgt-r">
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center", // This aligns items vertically
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              lineHeight: "1",
                            }}
                          >
                            <IoCameraSharp />
                          </span>
                          <span style={{ lineHeight: "1" }}>
                            {img?.images?.length < 10
                              ? "0" + img?.images?.length
                              : img?.images?.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* <Slider
            className="main-video-gallery-imgs"
            dots={true}
            infinite={true}
            slidesToShow={4}
            slidesToScroll={1}
          >
            <div>
              <img src={Article.length > 0 ? Article[0].image : null} alt="" />
            </div>
            
            <div>
              <img src={Article.length > 0 ? Article[1].image : null} alt="" />
            </div>
            <div>
              <img src={Article.length > 0 ? Article[2].image : null} alt="" />
            </div>
            <div>
              <img src={Article.length > 0 ? Article[0].image : null} alt="" />
            </div>
            <div>
              <img src={Article.length > 0 ? Article[0].image : null} alt="" />
            </div>
            <div>
              <img src={Article.length > 0 ? Article[0].image : null} alt="" />
            </div>
            <div>
              <img src={Article.length > 0 ? Article[0].image : null} alt="" />
            </div>
          </Slider> */}

        {/* <Modal
        title="Polling Modal"
        open={isModal2Open}
        onCancel={handleCancel2}
        onOk={() => {
          sessionStorage.setItem("data", "yes");
          handleCancel2();
        }}
      >
        <div>{userData.question}</div>
        <Radio.Group>
          <Radio value={1}>{userData.option1}</Radio>
          <br />
          <Radio value={2}>{userData.option2}</Radio>
        </Radio.Group>
      </Modal> */}
      </div>
    </>
  );
};

export default MainPage;
