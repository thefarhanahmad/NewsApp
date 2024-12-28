import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

import "./style/index.css";
import { API_URL } from "../../../API";

const MobileFooter = () => {
  const [mainObject, setMainObject] = useState({});

  useEffect(() => {
    // Fetch categories and subcategories
    axios
      .get(`${API_URL}/content?type=category`)
      .then((response) => {
        const categories = response?.data;
        const tempMainObject = {};
        const requests = categories.map((category) =>
          axios.get(`${API_URL}/subcategory?category=${category.text}`)
        );

        Promise.all(requests).then((subcategoriesResponses) => {
          subcategoriesResponses.forEach((subcategoriesResponse, index) => {
            const categoryName = categories[index].text;
            const subcategories = subcategoriesResponse?.data;
            tempMainObject[categoryName] = subcategories;
          });
          setMainObject(tempMainObject);
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [API_URL]);

  console.log("main object in mobile footer  : ", mainObject);

  return (
    <div className="accordin-main-container-area">
      {Object.entries(mainObject).map(([categoryName, subcategories]) => (
        <div key={categoryName} className=" py-2 border-b">
          {/* Category Header */}
          <div className=" flex justify-between items-center ">
            <Link to={`/itempage?item=${categoryName}`}>
              <div className="footer-heading text-lg flex gap-1 justify-start items-center">
                <span>{categoryName}</span>
                <HiOutlineChevronDoubleRight className="text-lg" />
              </div>
            </Link>
          </div>

          {/* Subcategories */}
          <div className="footer-items pl-4">
            {subcategories.map((subcategory, index) => (
              <Link
                key={index}
                to={`/itempage?item=${categoryName}&sub=${subcategory.text}`}
                className="atag"
              >
                <div
                  className={`subtitle text-sm text-gray-400 my-1 w-fit py-0 pr-3 ${
                    subcategories.length > 1 &&
                    index !== subcategories.length - 1
                      ? "border-r"
                      : ""
                  }`}
                >
                  {subcategory.text}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileFooter;
