import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoPlayCircleOutline } from "react-icons/io5";

const VdoThumb = ({ data }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const title = data?.title?.replace(/[%.?]/g, "")?.split(" ")?.join("-");

  // console.log("data and thumbnail in vdothumb : ", data, thumbnailUrl);

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  // Function to set the thumbnail URL based on the video ID or fallback to default image
  useEffect(() => {
    const videoId = extractVideoId(data?.link);

    if (videoId) {
      const maxResThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      // Check if maxresdefault is available, otherwise fallback to default image
      const img = new Image();
      img.src = maxResThumbnail;
      img.onload = () => setThumbnailUrl(maxResThumbnail); // Use maxres if available
      img.onerror = () =>
        setThumbnailUrl(
          "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-broadcast-youtube-thumbnail-design-template-d06ddc9f11789b47d62564e6e22a7730_screen.jpg?ts=1652194145"
        ); // Fallback to default thumbnail image
    } else {
      setThumbnailUrl(
        "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/breaking-news-broadcast-youtube-thumbnail-design-template-d06ddc9f11789b47d62564e6e22a7730_screen.jpg?ts=1652194145"
      ); // Set default thumbnail if no video ID found
    }
  }, [data]);

  return (
    <div>
      <Link
        to={`/videos/${title}?id=${data?._id}`}
        style={{
          backgroundColor: "white",
          padding: "9px",
          width: "100%",
          height: "content-fit",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <img
            style={{ width: "100%", height: "100%", position: "relative" }}
            src={thumbnailUrl}
            alt={data?.title}
          />
          <IoPlayCircleOutline
            style={{
              color: "white",
              fontSize: "4rem",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        <span
          style={{
            height: "2.5rem",
            padding: "5px",
          }}
        >
          {data?.title?.slice(0, 50)} ...click to watch
        </span>
      </Link>
    </div>
  );
};

export default VdoThumb;
