import { useEffect, useState } from "react";
// import img from "../../assets/Rectangle 73.png";
import "./style/index.css";
import axios from "axios";
import { API_URL } from "../../../API";

const AdCard = ({ type }) => {
  const [data, setData] = useState();

  useEffect(() => {
    if (data && data._id) {
      axios.get(`${API_URL}/ads/click?id=${data._id}`).then(() => {});
    }
  }, [data]);

  useEffect(() => {
    if (type === "mid") {
      axios.get(`${API_URL}/ads?active=true&side=mid`).then((data) => {
        const activeAds = data.data.filter((data) => data.active);
        setData(activeAds.reverse()[0]);
      });
    } else if (type === "bottom") {
      axios.get(`${API_URL}/ads?active=true&side=bottom`).then((data) => {
        const activeAds = data.data.filter((data) => data.active);

        setData(activeAds.reverse()[0]);
      });
    }
  }, []);
  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }

  return (
    <div>
      {data && (
        <div className="border border-gray-600 sm:border-none  overflow-hidden mx-2">
          {data ? (
            <a href={data?.link}>
              <div className="text-gray-600 flex w-full justify-center items-center text-xs">
                advertisement
              </div>
              <div
                className="ad-card-main-area"
                target="_blank"
                onClick={() => {
                  onClickAd(data._id);
                }}
              >
                <img src={data?.imgLink} alt="" className="h-full" />
                <div className="ad-card-main-area-text">
                  {data
                    ? data.slugName
                    : "New Health Campaign, ‘Ayushman Bhava’ To Reach Out..."}
                </div>
              </div>
            </a>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AdCard;
