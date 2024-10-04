import React, { useContext, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { BiSolidSearch } from "react-icons/bi";
import { Loading } from "../../Context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../API";
import { AutoComplete, Dropdown, Input } from "antd";
import logo from "../../assets/logo.svg";
import { MdArrowDropDown } from "react-icons/md";
import { ArrowLeftOutlined, PlayCircleOutlined } from "@ant-design/icons";

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

const MobileHeader = ({ data }) => {
  const [isHamBurgClicked, setHambergClicked] = useState(false);
  const [itsItem, setItsItem] = useState([]);
  const [itsItem2, setItsItem2] = useState([]);
  const { loading, setLoading, setEffect, effect } = useContext(Loading);
  const [search, setSearch] = useState(false);
  const { search: searchQueryId, pathname } = useLocation();
  const isVideoPresent = pathname.includes("/video");
  const isDetailsPresent = pathname.includes("/details");
  const isLivePage = pathname.includes("/live");

  const navigate = useNavigate();
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
  // console.log(pathname,isDetailsPresent,isVideoPresent)

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
        }
        setItsItem2(arr2);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);
  return (
    <div className="mobileNavBarContainer">
      <div className="mobilevisibleNavItems">
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
              {isVideoPresent && "Video"}
              {isLivePage && "Live"}
              {isDetailsPresent &&
                (articleType === "breakingNews"
                  ? "Breaking News"
                  : "Top Stories")}
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
          <span
            onClick={() => {
              Navigation("/");
              setHambergClicked(false);
            }}
            className="mobilevisibleNavItemsUlChild"
          >
            Home
          </span>
          <div
            onClick={() => {
              Navigation("/");
              setHambergClicked(false);
            }}
            className="header-logo-boxx"
            style={{ width: "9rem", marginLeft: "1rem" }}
          >
            <img src={logo} alt="" />
          </div>
        </div>

        <ul className="mobilevisibleNavItemsUlChild">
          {!isLivePage ? (
            <li
              style={{ cursor: "pointer" }}
              onClick={() => {
                Navigation("/live");
                setHambergClicked(false);
              }}
            >
              <PlayCircleOutlined style={{ marginRight: "5px" }} /> live
            </li>
          ) : null}

          <li>
            <BiSolidSearch
              onClick={() => {
                setSearch((prevState) => !prevState);

                setHambergClicked(false);
              }}
              size={25}
              color="white"
              style={{
                marginLeft: "10px",
                cursor: "pointer",
              }}
            />
          </li>
        </ul>
      </div>

      <div
        className={`mobileNavAbsoluteContainer ${
          isHamBurgClicked ? "mobileNavAbsoluteContainerCLicked" : ""
        }`}
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
                // <Dropdown
                //   key={data._id}
                //   menu={{
                //     items: arr,
                //   }}
                //   placement="bottom"
                //   arrow
                // >
                <li
                  onClick={() => {
                    setHambergClicked(false);
                    Navigation(`/itempage?item=${data.text}`);
                    setEffect(!effect);
                  }}
                >
                  {data.text}
                  {/* {data.text} <MdArrowDropDown size={20} /> */}
                </li>
                // </Dropdown>
              );
            })}
        </ul>
      </div>

      {search && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <AutoComplete
            style={{
              width: "90%",
              height: "100%",
            }}
            options={itsItem2}
            // placeholder="try to type `b`"
            filterOption={(inputValue, option) =>
              option.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          >
            <Input.Search
              autoFocus
              size="large"
              placeholder="Search"
              enterButton
              onSearch={(e) => {
                Navigation(`itempage?item=${e}`);
                setSearch(false);
              }}
            />
          </AutoComplete>
        </div>
      )}
    </div>
  );
};
export default MobileHeader;
