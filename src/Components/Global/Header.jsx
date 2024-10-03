import React, { useEffect, useState } from "react";
import TopHeaderImg from "../../assets/TopHeader-img.svg";
import "./style/index.css";
import logo from "../../assets/logo.svg";
import { MdArrowDropDown } from "react-icons/md";
import { BiSolidSearch } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { useContext } from "react";
import { LanguageSelect, Loading } from "../../Context";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL } from "../../../API";
import { useNavigate } from "react-router-dom";
import { AutoComplete, Dropdown, Input, Select } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import MobileHeader from "./MobileHeader";
import { Option } from "antd/es/mentions";

const Header = () => {
  const [isHamBurger, setIsHamBurger] = useState(false);
  const [itsItem, setItsItem] = useState([]);
  const [AllcatgeoryData, setAllcatgeoryData] = useState([]);
  const [itsItem2, setItsItem2] = useState([]);
  const { lang, setLang } = useContext(LanguageSelect);
  const { loading, setLoading, setEffect, effect } = useContext(Loading);
  const { t, i18n } = useTranslation();
  const [topAd, setTopAd] = useState({});
  const [search, setSearch] = useState(false);
  const [displayMore, setDisplayMore] = useState(false);
  const Navigation = useNavigate();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/content?type=category`)
      .then((data) => {
        let arr = [];
        console.log("ARR", data);

        const newData = data?.data?.sort((a, b) => {
          const seqA = a.sequence !== undefined ? a.sequence : Number.MAX_VALUE;
          const seqB = b.sequence !== undefined ? b.sequence : Number.MAX_VALUE;
          return seqA - seqB;
        });

        for (
          let index = 0;
          index < (newData.length <= 8 ? Number(newData.length) : 8);
          index++
        ) {
          const element = newData[index];

          arr.push(element);
        }
        setItsItem(arr);
        let arr3 = [];
        if (newData.length > 8) {
          for (let i = 8; i < newData.length; i++) {
            const element = newData[i];
            arr3.push({
              key: element._id,
              label: (
                <a
                  target="_blank"
                  onClick={() => {
                    Navigation(`/itempage?item=${element.text}`);
                    setEffect(!effect);
                  }}
                >
                  {element.text}
                </a>
              ),
            });
          }
        }
        setAllcatgeoryData(arr3);

        let arr2 = [];

        for (let index = 0; index < newData.length; index++) {
          const element = newData[index];

          arr2.push({ value: element.text });
        }
        setItsItem2(arr2);

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    axios.get(`${API_URL}/ads?active=true&side=top`).then((data) => {
      console.log("top ad in header res : ", data);
      setTopAd(data.data.reverse()[0]);
    });
  }, []);
  console.log("top ad in header page : ", topAd);
  useEffect(() => {
    if (topAd && topAd._id) {
      // console.log("mid ad impressioning")
      axios.get(`${API_URL}/ads/click?id=${topAd._id}`).then(() => {
        // console.log("ad mid data")
      });
    }
  }, [topAd]);
  async function onClickAd(id) {
    try {
      const response = await axios.post(`${API_URL}/ads/click`, { id });
      console.log("updated Ad", response);
      // this function works for all ads so handle it respectivly
    } catch (error) {
      console.error("Error updating ads:", error);
    }
  }
  return (
    <>
      <MobileHeader />
      {loading ? (
        <></>
      ) : (
        <div className="header-main-area">
          <div>
            <a
              // style={{ backgroundColor: "red", padding: "10px",objectFit:"contain",width:"30%" }}
              href={topAd?.link}
              target="_blank"
              onClick={() => {
                onClickAd(topAd._id);
              }}
            >
              <img
                style={{
                  cursor: "pointer",
                  // objectFit: "contain",
                  padding: "2px",
                }}
                className="top-header-img"
                src={topAd?.imgLink}
                alt=""
              />
              {/* top ad will show here */}
            </a>
            {/* <img src={TopHeaderImg} alt="" " /> */}
            <select
              name="language"
              id=""
              style={{ width: 100, position: "absolute", right: 10, top: 10 }}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
              }}
            >
              <option value="hi">Hindi</option>
              <option value="en">English</option>
              <option value="ur">Urdu</option>
            </select>
          </div>
          <div className="header-contianer">
            <div
              onClick={() => Navigation("/")}
              style={{
                cursor: "pointer",
              }}
              className="header-logo-box"
            >
              <img src={logo} alt="" />
            </div>
            <div className="header-row-box">
              <ul style={{ flexWrap: "wrap" }} className="header-row-box-items">
                {
                  <>
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
                          <Dropdown
                            key={data._id}
                            menu={{
                              items: arr,
                            }}
                            placement="bottom"
                            arrow
                          >
                            <li
                              onClick={() => {
                                Navigation(`/itempage?item=${data.text}`);
                                setEffect(!effect);
                              }}
                            >
                              {data.text} <MdArrowDropDown size={20} />
                            </li>
                          </Dropdown>
                        );
                      })}
                  </>
                }

                <li onClick={() => Navigation("/live")}>{t("h14")}</li>
                <li>
                  <BiSolidSearch
                    onClick={() => {
                      setSearch(true);
                    }}
                    size={30}
                    color="white"
                    style={{
                      marginLeft: "10px",
                    }}
                  />
                </li>

                {AllcatgeoryData.length > 0 && (
                  <Dropdown
                    menu={{
                      items: AllcatgeoryData,
                    }}
                    placement="bottom"
                    arrow
                  >
                    <li>
                      Display More <MdArrowDropDown size={20} />
                    </li>
                  </Dropdown>
                )}
              </ul>
              <GiHamburgerMenu
                className="ham-burger"
                size={30}
                color="white"
                onClick={() => setIsHamBurger(true)}
              />
            </div>
          </div>
          <div
            className={`ham-burger-area `}
            style={{ display: isHamBurger ? "block" : "none" }}
          >
            <div className="header-row2-icons">
              <BiSolidSearch size={30} color="white" />
              <RxCross1
                size={30}
                color="white"
                onClick={() => setIsHamBurger(false)}
                className="ham-burger-area-cross-child"
              />
            </div>
            <ul className="header-row-box-items2">
              {itsItem.length > 0 &&
                itsItem.map((data) => {
                  return (
                    <li
                      key={data._id}
                      onClick={() => {
                        setIsHamBurger(false);
                        Navigation(`/itempage?item=${data.text}`);
                        setEffect(!effect);
                      }}
                    >
                      {data.text} <MdArrowDropDown size={20} />
                    </li>
                  );
                })}
              <li>
                {t("key")} <MdArrowDropDown size={30} />
              </li>
            </ul>
          </div>
        </div>
      )}
      {search ? (
        <div
          onClick={() => {
            // setSearch(false);
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.2)",

            position: "absolute",
            zIndex: 10,
            top: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              // height: "100%",
              // backgroundColor: "red",
              padding: "10px",
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
                // backgroundColor: "yellow",
                display: "flex",
                justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <AutoComplete
                style={{
                  width: "70%",
                  marginTop: 88,
                  // marginLeft: 180,
                }}
                options={itsItem2}
                // placeholder="try to type `b`"
                filterOption={(inputValue, option) =>
                  option.value
                    ?.toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
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
              <div style={{}}>
                <IoIosCloseCircle
                  onClick={() => setSearch(false)}
                  size={55}
                  style={{
                    // backgroundColor: "red",
                    padding: "10px",
                    marginLeft: 20,
                    // marginTop: 10,
                    marginTop: 79,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Header;
