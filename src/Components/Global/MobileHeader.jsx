import { useContext, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { BiSolidSearch } from "react-icons/bi";
import { Loading } from "../../Context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../API";
import { AutoComplete, Input } from "antd";
import logo from "../../assets/logo.svg";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { IoIosCloseCircle } from "react-icons/io";
import NewSearchModel from "../../models/newSearchModel";
import { FaNewspaper } from "react-icons/fa6";
import { MdAutoStories } from "react-icons/md";
import { TfiGallery } from "react-icons/tfi";
import { FaPhotoVideo } from "react-icons/fa";
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
  return (
    <>
      {isOpen && (
        <NewSearchModel
          closeModel={() => setIsOpen(false)}
          autoList={itsItem2}
        />
      )}

      <div className="mobileNavBarContainer">
        <div className="mobilevisibleNavItems h-[72px]">
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
          <div className="mobile-visible-containerr">
            <Link
              // onClick={() => {
              //   Navigation("/");
              //   setHambergClicked(false);
              // }}
              to="http://epaper.loksatya.com"
              className="mobilevisibleNavItemsUlChild"
            >
              <FaNewspaper size={25} />
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
                  <PlayCircleOutlined
                    style={{ marginLeft: "10px", fontSize: "18px" }}
                  />
                </Link>
              </li>
            

            <li>
              <Link to="/itempage?item=Web%20Story">
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
            isHamBurgClicked ? "mobileNavAbsoluteContainerCLicked" : ""
          } `}
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
