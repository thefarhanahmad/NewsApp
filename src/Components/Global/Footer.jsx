import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import axios from "axios";

import "./style/index.css";
import logo from "../../assets/footer.svg";
import { API_URL } from "../../../API";
import { Loading } from "../../Context";
import MobileFooter from "./AccordinList";

const Footer = () => {
  const { t } = useTranslation();
  const { loading, setLoading, setEffect, effect } = useContext(Loading);
  const [itsItem, setItsItem] = useState([]);
  const [email, setEmail] = useState();
  const Navigation = useNavigate();
  const [mainObject, setMainObject] = useState({});

  console.log("main objects footer category", mainObject);

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

  async function subscribeToNewsLetter() {
    try {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        message.error("Invalid email address");
        return; // Exit the function if the email is not valid
      }

      // Send a POST request to the backend
      const response = await axios.post(`${API_URL}/newsletter`, { email });

      if (response.status === 201) {
        message.success("Subcribed to News Letter");
        // alert(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error.message);
    }
  }

  return (
    !loading && (
      <div className="footer-main-container ">
        <div className="footer-area-main-accordin">
          <MobileFooter />
        </div>
        <div className="footer-checkup-main-conatiner">
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
          <div className="footer-bottom-text">copyright @2023 Loksatya </div>
          <div className="footer-bottom-text">all rights reserve</div>
        </div>
      </div>
    )
  );
};

export default Footer;
