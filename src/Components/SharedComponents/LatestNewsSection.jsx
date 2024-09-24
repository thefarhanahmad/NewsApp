import { useTranslation } from "react-i18next";
import DetailsVideoCard from "../DetailsPage/VideoCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../API";


function LatesetNewsSection({currentVideoId}) {
    const { t } = useTranslation();
    const [latestVidData,setLatestVidData] = useState()
    useEffect(()=>{
        fetchLatestVidData()
    },[])

    async function fetchLatestVidData() {
        const response = await axios.get(`${API_URL}/article?pagenation=true&limit=3&type=vid&newsType=breakingNews&status=online`)
        const data  = response.data
        setLatestVidData(data)
        
    }
    return (
        <>
        {latestVidData &&
            <div className="details-page-latest-news">
                <div className="details-main-related-new-area-heading">
                {t("ln")}
                </div>
                <div className="details-page-video-cards">
                {latestVidData?.map((vidNews)=>{
                    if(vidNews._id === currentVideoId) return
                    return (<DetailsVideoCard key={vidNews._id} data={vidNews}/>)
                })}
                
                </div>
            </div>
          }
        </>
    )

}
export default LatesetNewsSection