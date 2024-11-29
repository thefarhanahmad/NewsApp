import { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseCircleOutline } from "react-icons/io5";
import "./style/index.css";
import { API_URL } from "../../../API";

const AdCardPopup = ({ type, adPopup, setAdPopup }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (data && data._id) {
      axios.get(`${API_URL}/ads/click?id=${data._id}`).then(() => {});
    }
  }, [data]);

  useEffect(() => {
    if (type === "mid") {
      axios.get(`${API_URL}/ads?active=true&side=mid`).then((data) => {
        setData(data.data.reverse()[0]);
      });
    } else if (type === "bottom") {
      axios.get(`${API_URL}/ads?active=true&side=bottom`).then((data) => {
        setData(data.data.reverse()[0]);
      });
    } else if (type === "top") {
      axios.get(`${API_URL}/ads?active=true&side=top`).then((data) => {
        setData(data.data.reverse()[0]);
      });
    }
  }, []);

  async function onClickAd(id) {
    try {
      await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }

  return (
    <div className="relative w-full h-[70vh]  lg:h-[500px]  lg:w-[800px] overflow-hidden bg-white rounded-md">
      {adPopup && (
        <div className="h-full">
          <div className=" w-full flex mt-2 font-semibold  justify-center items-center text-lg text-black">
            Advertisement
          </div>
          {/* Close Ad */}
          <button
            onClick={() => setAdPopup(false)}
            className="absolute top-2 right-0  rounded-full"
          >
            <IoCloseCircleOutline className="text-3xl md:text-6xl" />
          </button>
          {data ? (
            <a href={data?.link} className="h-full">
              <div
                className="w-full h-full"
                onClick={() => onClickAd(data._id)}
              >
                <img
                  className="object-cover h-full  w-full"
                  src={data?.imgLink}
                  alt=""
                />
              </div>
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AdCardPopup;
