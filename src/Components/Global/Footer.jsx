import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import axios from "axios";

import "./style/index.css";
import logo from "../../assets/footer.svg";
import { API_URL } from "../../../API";
import { AccordinRegistry } from "../../assets/registry/accordinRegistry";

import { Loading } from "../../Context";
import AccordinList from "./AccordinList";

const Footer = () => {
  const { t } = useTranslation();
  const { loading, setLoading, setEffect, effect } = useContext(Loading);
  const [itsItem, setItsItem] = useState([]);
  const [email, setEmail] = useState();
  const Navigation = useNavigate();
  const [mainObject, setMainObject] = useState({});
  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get(`${API_URL}/content?type=category`)
  //     .then((data) => {
  //       let arr = [];

  //       for (
  //         let index = 0;
  //         index < (data.data.length <= 5 ? Number(data.data.length) : 5);
  //         index++
  //       ) {
  //         const element = data.data[index];

  //         arr.push(element);
  //       }
  //       setItsItem(arr);
  //       setLoading(false);

  //       Promise.all(
  //         [
  //           arr?.map(async(cat)=>{
  //             return (axios.get(`${API_URL}/subcategory?category=${cat.text}`)
  //             .then((data) => {
  //               const tempArr=[]
  //               for (let i = 0; i < 5; i++) {
  //                 const element = data.data[i];
  //                 tempArr.push(element);
  //               }
  //             }).catch((er)=>{console.log(er)}))

  //           })
  //         ]
  //       ).then((data)=>{
  //         console.log("tempArr",data)
  //       })

  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //     });
  // }, []);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/content?type=category`)
      .then((response) => {
        // const categories = response.data.slice(0, 5); // Only take the first 5 categories
        const categories = response?.data; // Only take the first 5 categories
        setItsItem(categories);
        const tempMainObject = {};
        const requests = categories.map((category) =>
          axios.get(`${API_URL}/subcategory?category=${category.text}`)
        );
        Promise.all(requests)
          .then((subcategoriesResponses) => {
            subcategoriesResponses.forEach((subcategoriesResponse, index) => {
              const categoryName = categories[index].text;
              // const subcategories = subcategoriesResponse.data.slice(0, 5); // Only take the first 5 subcategories
              const subcategories = subcategoriesResponse?.data; // Only take the first 5 subcategories
              tempMainObject[categoryName] = subcategories;
            });
            setMainObject(tempMainObject);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching subcategories:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  console.log("categories and subcategories : ", mainObject);

  // console.log("main obj",mainObject)
  async function subscribeToNewsLetter() {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        message.error("Invalid email address");
        return; // Exit the function if the email is not valid
      }

      // Send a POST request to the backend
      const response = await axios.post(`${API_URL}/newsletter`, { email });
      console.log("newsletter api response : ", response);

      if (response.status === 201) {
        message.success("Subcribed to News Letter");
        // alert(response.data.message);
      } else {
        console.log("newsletter api response : ", response);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error.message);
      message.error("unable to subscribe to newsletter");
    }
  }

  return (
    !loading && (
      <div className="footer-main-container ">
       <div className="footer-area-main-accordin">
      {AccordinRegistry.map((AccItem, index) => (
        <AccordinList key={index} {...AccItem} />
      ))}
    </div>
        <div className="footer-checkup-main-conatiner">
          {/* <div className="footer-main" style={{ backgroundColor: "red" }}>
            {Object.entries(mainObject).map(
              ([categoryName, subcategories], index) => {
                if (index <= 3) {
                  return (
                    <div className="footer-item-box">
                      <div
                        className="footer-heading"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          Navigation(`/itempage?item=${categoryName}`);
                          setEffect(!effect);
                        }}
                      >
                        {categoryName}
                      </div>
                      <div className="footer-items">
                        {subcategories.map((item) => (
                          <div
                            onClick={() => {
                              Navigation(
                                `/itempage?item=${categoryName}&sub=${item.text}`
                              );
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              }
            )}
          </div> */}

          <div
            className="footer-main"
            style={{
              // backgroundColor: "red",
              // width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              // alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            {Object.entries(mainObject).map(
              ([categoryName, subcategories], index) => {
                // if (index >= 4 && index <= 7) {
                return (
                  <>
                    <div
                      className="footer-item-box"
                      style={{
                        // backgroundColor: "yellow",
                        width: "10%",
                      }}
                    >
                      <div
                        className="footer-heading"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          Navigation(`/itempage?item=${categoryName}`);
                          setEffect(!effect);
                        }}
                      >
                        {categoryName}
                      </div>
                      <div
                        className="footer-items"
                        style={
                          {
                            //  backgroundColor: "blue"
                            // marginBottom: "5px",
                          }
                        }
                      >
                        {subcategories.map((item) => (
                          <div
                            className="sub-items-f"
                            onClick={() => {
                              Navigation(
                                `/itempage?item=${categoryName}&sub=${item.text}`
                              );
                            }}
                          >
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
                // }
              }
            )}
          </div>
          {/* 
                    <div>{arr[0]?.text}</div>
                    <div>{arr[1]?.text}</div>
                    <div>{arr[2]?.text}</div>
                    <div>{arr[3]?.text}</div>
                    <div>{arr[4]?.text}</div>
                  */}

          {/* <div className="footer-item-box">
            <div className="footer-heading">business</div>
            <div className="footer-items">
              <div>start-up</div>
              <div>employees </div>
              <div>success </div>
              <div>videos </div>
              <div>videos </div>
            </div>
          </div>
          <div className="footer-item-box">
            <div className="footer-heading">travel</div>
            <div className="footer-items">
              <div>culture</div>
              <div>hotel </div>
              <div>food & stay </div>
              <div>stay </div>
              <div>videos </div>
            </div>
          </div>
          <div className="footer-item-box">
            <div className="footer-heading">sports</div>
            <div className="footer-items">
              <div>cricket</div>
              <div>tennis </div>
              <div>football </div>
              <div>racing </div>
              <div>esports </div>
            </div>
          </div>
          <div className="footer-item-box">
            <div className="footer-heading">states</div>
            <div className="footer-items">
              <div>bihar</div>
              <div>uttar pradesh </div>
              <div>haryana </div>
              <div>delhi </div>
              <div>Uttarakhand </div>
            </div>
          </div> */}

          {/* <div className="footer-main">
            <div className="footer-item-box">
              <div className="footer-heading">entertainment</div>
              <div className="footer-items">
                <div>movies</div>
                <div>artist </div>
                <div>television </div>
                <div>stars </div>
                <div>viral </div>
              </div>
            </div>
            <div className="footer-item-box">
              <div className="footer-heading">special</div>
              <div className="footer-items">
                <div>with us</div>
                <div>on earth </div>
                <div>independence </div>
                <div>inside asia </div>
                <div>return back </div>
              </div>
            </div>
            <div className="footer-item-box">
              <div className="footer-heading">whether</div>
              <div className="footer-items">
                <div>environment</div>
                <div>wind tracker </div>
                <div>wildlife </div>
                <div>earth quick </div>
                <div>videos </div>
              </div>
            </div>
            <div className="footer-item-box">
              <div className="footer-heading">extra</div>
              <div className="footer-items">
                <div>designs</div>
                <div>membership </div>
                <div>investment </div>
                <div>bulletin </div>
                <div>support us </div>
              </div>
            </div>
            <div className="footer-item-box">
              <div className="footer-heading">foreign</div>
              <div className="footer-items">
                <div>america</div>
                <div>russia </div>
                <div>bhutan</div>
                <div>japan </div>
                <div>nepal </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="footer-line"></div>
        <div className="footer-middle-container">
          <div className="footer-middle-area">
            <div className="footer-img">
              <img src={logo} alt="" className="footer-img" />
            </div>
            <div className="footer-middle-right">
              <div className="footer-middle-right-heading">{t("list")}</div>
              <div className="footer-middle-right-text">
                Stay updated with our weekly newsletter, delivered to your
                inbox. Don't miss out on any updates, stories or events around
                the world.
              </div>
              <div
                style={{
                  display: "flex",
                }}
                className="footer-last-bottom"
              >
                <input
                  type="text"
                  className="footer-input"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <div
                  className="footer-input-button"
                  onClick={() => {
                    subscribeToNewsLetter();
                  }}
                >
                  Subscribe Now
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-line"></div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">copyright @2023 lokshatya</div>
          <div className="footer-bottom-text">all rights reserve</div>
        </div>
      </div>
    )
  );
};

export default Footer;
