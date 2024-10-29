import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Stories from "react-insta-stories";
import { API_URL } from "../../../API";
import { useLocation } from "react-router-dom";

function WebStory() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const { pathname, search, state } = useLocation();
  const query1 = new URLSearchParams(search);
  const storyId = query1.get("id");

  useEffect(() => {
    // Fetch stories when the component mounts
    const fetchStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story?id=${storyId}`);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);

  
  const displayStories =
    stories && stories.length > 0
      ? stories[0].images.map((image, index) => {
          return {
            content: ({ action, isPaused }) => {
              const [active, setActive] = useState(false);
              useEffect(() => {
                setTimeout(() => {
                  // action("pause")
                  setActive(true);
                }, 10);
              }, []);
              return (
                <div style={{ position: "relative" }}>
                  <img
                    className={`WebstroyCardImg ${
                      active ? " WebstroyCardImgActive" : ""
                    }`}
                    src={image?.img}
                  />
                  <p
                    className={`WebstroyCardText ${
                      active ? " WebstroyCardTextActive" : ""
                    }`}
                  >
                    {image?.text}
                  </p>
                </div>
              );
            },
          };
        })
      : null;
  const blurImgStoriesStyle =
    stories && stories.length > 0
      ? stories[0].images.map((image) => {
          return {
            backgroundImage: `url(${image})`,
            backgroundSize: "cover", // Optional: Adjust as needed
            backgroundPosition: "center",
          };
        })
      : null;
  function Increment() {
    if (stories.length < 0 || !stories[0].images) return;
    if (currentIndex < stories[0].images.length - 1) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  }
  function Decrement() {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  }
  function containerStyles() {
    if (!blurImgStoriesStyle) return;
    return blurImgStoriesStyle[currentIndex];
  }

  return (
    <>
      <div style={containerStyles()} className="webStoryBlurredImage"></div>

      <div className="webStoryContainer">
        <LeftOutlined className="webStoryControlIcon" onClick={Decrement} />
        {stories.length > 0 && (
          <Stories
            // isPaused={true}
            loop={true}
            keyboardNavigation={true}
            stories={displayStories}
            defaultInterval={5500}
            width={432}
            height={"100vh"}
            currentIndex={currentIndex}
            // onStoryEnd={(s, st) => setCurrentIndex(s)}
            // onAllStoriesEnd={(s, st) => console.log("all stories ended", s, st)}
            onStoryStart={(s, st) => setCurrentIndex(s)}
          />
        )}
        <RightOutlined className="webStoryControlIcon" onClick={Increment} />
      </div>
    </>
  );
}

export default WebStory;
