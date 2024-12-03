import { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./style/index.css";
import { API_URL } from "../../../API";
import { useLocation } from "react-router-dom";

const AdCardPopup = ({ type, adPopup, setAdPopup }) => {
  const [mobileData, setMobileData] = useState();
  const [laptopData, setLaptopData] = useState();

  useEffect(() => {
    if (mobileData && mobileData._id) {
      axios.get(`${API_URL}/ads/click?id=${mobileData._id}`).then(() => {});
    }
    if (laptopData && laptopData._id) {
      axios.get(`${API_URL}/ads/click?id=${laptopData._id}`).then(() => {});
    }
  }, [mobileData, laptopData]);

  useEffect(() => {
    axios
      .get(`${API_URL}/ads`)
      .then((response) => {
        console.log("ads in popup : ", response);

        // Reverse data array to ensure latest entries come first
        const reversedData = response.data.reverse();

        // Find the latest entry for mobile and laptop devices
        const latestMobileData = reversedData.find(
          (ad) => ad.device === "mobile"
        );
        const latestLaptopData = reversedData.find(
          (ad) => ad.device === "laptop"
        );

        // Set states with the latest data
        setMobileData(latestMobileData);
        setLaptopData(latestLaptopData);
      })
      .catch((error) => {
        console.error("Error fetching ads data:", error);
      });
  }, []);
  console.log("mobile data : ", mobileData);
  console.log("laptop data : ", laptopData);
  async function onClickAd(id) {
    try {
      await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }
  const location = useLocation();
  return (
    <div className={`adCardPopup ${location.pathname === "/" ? "mt-20" : ""}`}>
      {/* Display only mobile ad */}
      <div className="relative w-full  h-[70vh] flex md:hidden  lg:h-[500px]   lg:w-[800px] overflow-hidden bg-white rounded-md">
        {adPopup && (
          <div className="h-full w-full">
            <div className=" w-full flex mt-2 font-semibold  justify-center items-center text-lg text-black">
              Advertisement
            </div>

            <button
              onClick={() => setAdPopup(false)}
              className="absolute top-2 right-0  rounded-full"
            >
              <IoCloseCircleOutline className="text-3xl md:text-6xl" />
            </button>
            {mobileData ? (
              <a href={mobileData?.link} className="h-full w-full">
                <div
                  className="w-full h-full"
                  onClick={() => onClickAd(mobileData._id)}
                >
                  <img
                    className="object-cover h-full w-full"
                    src={mobileData?.imgLink}
                    alt=""
                  />
                </div>
              </a>
            ) : null}
          </div>
        )}
      </div>

      {/* Display only mobile ad */}
      <div className="relative w-full h-[70vh] hidden md:flex  lg:h-[500px]   lg:w-[800px] overflow-hidden bg-white rounded-md">
        {adPopup && (
          <div className="h-full w-full">
            <div className=" w-full flex mt-2 font-semibold  justify-center items-center text-lg text-black">
              Advertisement
            </div>

            <button
              onClick={() => setAdPopup(false)}
              className="absolute top-2 right-0  rounded-full"
            >
              <IoCloseCircleOutline className="text-3xl md:text-6xl" />
            </button>
            {laptopData ? (
              <a href={laptopData?.link} className="h-full">
                <div
                  className="w-full h-full"
                  onClick={() => onClickAd(laptopData._id)}
                >
                  <img
                    className="object-cover h-full  w-full"
                    src={laptopData?.imgLink}
                    alt=""
                  />
                </div>
              </a>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdCardPopup;
