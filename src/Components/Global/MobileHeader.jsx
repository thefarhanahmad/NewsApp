import { useContext, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { BiSolidSearch } from "react-icons/bi";
import { Loading } from "../../Context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../API";
import { AutoComplete, Input } from "antd";
import logo from "../../assets/logo-small.png";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { IoIosCloseCircle } from "react-icons/io";
import NewSearchModel from "../../models/newSearchModel";
import { FaNewspaper } from "react-icons/fa6";
import { MdAutoStories } from "react-icons/md";
import { TfiGallery } from "react-icons/tfi";
import { FaPhotoVideo } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useAd } from "../../Context/TopAdContext";
function findStoryIdFromUrl(pathname) {
  // Regular expression to find the 'id' parameter and its value
  const idRegex = /id=([^&]+)/;

  // Match the 'id' parameter in the URL
  const idMatch = pathname.match(idRegex);

  // Check if the 'id' parameter is found
  if (idMatch) {
    // Extract the value of the 'id' parameter
    const id = idMatch[1];

    return id;

    // You can now use the 'id' variable for further processing
  } else {
    console.log("ID parameter not found in the URL.");
  }
}

const MobileHeader = ({ listitem }) => {
  const [isHamBurgClicked, setHambergClicked] = useState(false);
  const [itsItem, setItsItem] = useState([]);
  const [itsItem2, setItsItem2] = useState([]);
  const { setLoading, setEffect, effect } = useContext(Loading);
  const [isOpen, setIsOpen] = useState(false);

  const { search: searchQueryId, pathname } = useLocation();
  const isVideoPresent = pathname.includes("/video");
  const isDetailsPresent = pathname.includes("/details");
  const isLivePage = pathname.includes("/live");

  const goToPreviousPage = () => {
    window.history.back();
  };

  const storyId = findStoryIdFromUrl(searchQueryId);
  const [articleType, setArticleType] = useState("");

  const Navigation = useNavigate();
  useEffect(() => {
    axios
      .get(`${API_URL}/article?id=${storyId}`)
      .then(async (article) => {
        setArticleType(article.data[0]?.newsType);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/content?type=category`)
      .then((data) => {
        let arr = [];

        for (
          let index = 0;
          index < (data.data.length <= 10 ? Number(data.data.length) : 10);
          index++
        ) {
          const element = data.data[index];
          arr.push(element);
        }
        setItsItem(arr);

        let arr2 = [];

        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          arr2.push({ value: element.text });

          arr2.push({ value: "Cricket" });
          // if (index == data.data.length) {
          //   console.log("arr2");
          // }
        }
        setItsItem2(arr2);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const [topAd, setTopAd] = useState({});
  useEffect(() => {
    axios.get(`${API_URL}/ads?active=true&side=top`).then((data) => {
      setTopAd(data.data.reverse()[0]);
    });
  }, []);

  useEffect(() => {
    if (topAd && topAd._id) {
      axios.get(`${API_URL}/ads/click?id=${topAd._id}`).then(() => {});
    }
  }, [topAd]);
  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
      // this function works for all ads so handle it respectivly
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }
  const location = useLocation();

  const { showAd, closeAd } = useAd();
  console.log("showAd : ", showAd);
  return (
    <>
      {isOpen && (
        <NewSearchModel
          closeModel={() => setIsOpen(false)}
          autoList={itsItem2}
        />
      )}
      {/* Top Ad */}
      {location?.pathname === "/" && topAd && showAd && (
        <div className="fixed top-0 left-0 mb-4 mob-ad z-50 overflow-hidden w-full h-[68px]">
          <IoCloseCircleOutline
            onClick={closeAd}
            className="text-3xl cursor-pointer md:text-5xl top-0 right-0 bg-gray-800 text-white rounded-full absolute"
          />
          <a
            href={topAd?.link}
            target="_blank"
            onClick={() => {
              onClickAd(topAd?._id);
            }}
            rel="noreferrer"
          >
            <img
              style={{
                cursor: "pointer",
              }}
              className="top-header-img object-fill w-full h-full"
              src={topAd?.imgLink}
              alt=""
            />
          </a>
        </div>
      )}

      <div className="mobileNavBarContainer ">
        <div
          className={`mobilevisibleNavItems ${
            location?.pathname === "/" && topAd && showAd
              ? "top-[68px]"
              : "top-0"
          }`}
        >
          <div>
            {pathname !== "/" ? (
              <div
                style={{
                  color: "white",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                onClick={goToPreviousPage}
              >
                <ArrowLeftOutlined color="white" />
              </div>
            ) : isHamBurgClicked ? (
              <RxCross1
                size={25}
                color="white"
                onClick={() => setHambergClicked(false)}
                className="ham-burger-area-cross-child"
              />
            ) : (
              <GiHamburgerMenu
                className="ham-burger"
                size={25}
                color="white"
                onClick={() => {
                  setHambergClicked((prevState) => !prevState);
                }}
              />
            )}
          </div>
          <div className="mobile-visible-containerr ">
            <Link
              // onClick={() => {
              //   Navigation("/");
              //   setHambergClicked(false);
              // }}
              to="http://epaper.loksatya.com"
              className="mobilevisibleNavItemsUlChild flex self-end  flex-col items-center justify-center"
            >
              <FaNewspaper size={18} />
              <span className="text-xs">ई-पेपर</span>
            </Link>
            <div
              onClick={() => {
                Navigation("/");
                setHambergClicked(false);
              }}
              className="header-logo-boxx"
              style={{ width: "9rem", height: "53px" }}
            >
              <img src={logo} alt="" />
            </div>
          </div>

          <ul className="mobilevisibleNavItemsUlChild">
            <li
            // style={{ cursor: "pointer" }}
            // onClick={() => {
            //   Navigation("/live");
            //   setHambergClicked(false);
            // }}
            >
              <Link to="/live">
                <PlayCircleOutlined style={{ fontSize: "18px" }} />
              </Link>
            </li>

            <li>
              <Link to="/story">
                <MdAutoStories size={18} />
              </Link>
            </li>
            <li>
              <Link to="/photos">
                <TfiGallery size={18} />
              </Link>
            </li>
            <li>
              <Link to="/itempage2?newsType=videos">
                <FaPhotoVideo size={18} />
              </Link>
            </li>
            <li
              data-modal-target="default-modal"
              data-modal-toggle="default-modal"
            >
              <BiSolidSearch
                onClick={() => {
                  setIsOpen((prevState) => !prevState);
                  setHambergClicked(false);
                }}
                size={25}
                color="white"
                style={{
                  cursor: "pointer",
                }}
              />
            </li>
          </ul>
        </div>

        <div
          className={`mobileNavAbsoluteContainer ${
            topAd && showAd ? "top-[130px]" : "top-[62px]"
          }  ${isHamBurgClicked ? "mobileNavAbsoluteContainerCLicked" : ""} `}
        >
          <ul>
            {itsItem.length > 0 &&
              itsItem.map((data) => {
                let arr = [];
                // let item = [];
                axios
                  .get(`${API_URL}/subcategory?category=${data.text}`)
                  .then((data) => {
                    for (let i = 0; i < data.data.length; i++) {
                      const element = data.data[i];
                      arr.push({
                        key: element._id,
                        label: (
                          <a
                            target="_blank"
                            onClick={() => {
                              Navigation(
                                `/itempage?item=${element.category}&sub=${element.text}`
                              );
                              setEffect(!effect);
                            }}
                          >
                            {element.text}
                          </a>
                        ),
                      });
                    }
                  });
                return (
                  <>
                    <li
                      onClick={() => {
                        setHambergClicked(false);
                        Navigation(`/itempage?item=${data.text}`);
                        setEffect(!effect);
                      }}
                    >
                      {data.text}
                    </li>
                  </>
                );
              })}

            {
              <>
                {listitem.length > 0 && (
                  <li className="">
                    <select
                      name="Display More"
                      className="block outline-none shadow-none w-full border-none bg-white"
                      onChange={(e) => {
                        setHambergClicked(false);
                        const selectedItem = listitem.find(
                          (i) => i.label.props.children === e.target.value
                        );
                        if (selectedItem && selectedItem.label.props.onClick) {
                          selectedItem.label.props.onClick();
                        }
                      }}
                      defaultValue="display-more"
                    >
                      <option
                        value="display-more"
                        className="p-4 ml-4"
                        disabled
                      >
                        Display More
                      </option>
                      {listitem.map((i) => (
                        <option key={i.key} value={i.label.props.children}>
                          {i.label.props.children}
                        </option>
                      ))}
                    </select>
                  </li>
                )}
              </>
            }
          </ul>
        </div>
      </div>
    </>
  );
};
export default MobileHeader;
