import LatesetNewsSection from "../../Components/SharedComponents/LatestNewsSection";
import ImageGallery from "./ImageGallery";

const Gallerypage = () => {
  return (
    <div style={{ marginTop: "80px" }}>
      <ImageGallery />
      <div className="pl-2">
        <div className="container-detail-page-rigth-side">
          <LatesetNewsSection />
        </div>
      </div>
    </div>
  );
};

export default Gallerypage;
