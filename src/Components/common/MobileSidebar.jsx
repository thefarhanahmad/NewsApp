import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Ensure this is correctly imported
import { BiChevronUp, BiChevronDown } from "react-icons/bi"; // Install this package if not already done
import { API_URL } from "../../../API";

const MobileSidebar = ({ setHambergClicked }) => {
  const [mainObject, setMainObject] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null); // Track expanded category
  const [showAllCategories, setShowAllCategories] = useState(false); // Track "Show More" state

  useEffect(() => {
    // Fetch categories and subcategories
    axios
      .get(`${API_URL}/content?type=category`)
      .then((response) => {
        const categories = response?.data || [];
        const tempMainObject = {};
        const requests = categories.map((category) =>
          axios.get(`${API_URL}/subcategory?category=${category.text}`)
        );

        Promise.all(requests)
          .then((subcategoriesResponses) => {
            subcategoriesResponses.forEach((subcategoriesResponse, index) => {
              const categoryName = categories[index].text;
              const subcategories = subcategoriesResponse?.data || [];
              tempMainObject[categoryName] = subcategories;
            });
            setMainObject(tempMainObject);
          })
          .catch((error) =>
            console.error("Error fetching subcategories:", error)
          );
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const toggleCategory = (categoryName) => {
    setExpandedCategory((prev) =>
      prev === categoryName ? null : categoryName
    );
  };

  const handleShowMore = () => {
    setShowAllCategories(true);
  };

  const categoriesToDisplay = showAllCategories
    ? Object.entries(mainObject)
    : Object.entries(mainObject).slice(0, 10);

  return (
    <div className="w-full p-2 h-full overflow-y-scroll">
      {categoriesToDisplay.map(([categoryName, subcategories]) => (
        <div
          key={categoryName}
          className="  py-2 text-lg border-b-2 border-gray-400 w-11/12"
        >
          {/* Category Header */}
          {subcategories.length > 0 ? (
            // Dropdown for categories with subcategories
            <div
              className=" flex gap-3 items-center"
              onClick={() => toggleCategory(categoryName)}
            >
              <span className="">{categoryName}</span>
              {expandedCategory === categoryName ? (
                <BiChevronUp className="text-xl" />
              ) : (
                <BiChevronDown className="text-xl" />
              )}
            </div>
          ) : (
            // Static link for categories without subcategories
            <Link
              onClick={() => setHambergClicked(false)}
              to={`/itempage?item=${categoryName}`}
              className="mobile-footer-header "
            >
              {categoryName}
            </Link>
          )}

          {/* Subcategories */}
          {expandedCategory === categoryName && subcategories.length > 0 && (
            <div className="">
              {subcategories.map((subcategory) => (
                <Link
                  onClick={() => setHambergClicked(false)}
                  key={subcategory._id}
                  to={`/itempage?item=${categoryName}&sub=${subcategory.text}`}
                  className=" text-gray-800"
                >
                  {subcategory.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Show More Button */}
      {!showAllCategories && Object.entries(mainObject).length > 10 && (
        <button className="show-more-btn" onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default MobileSidebar;