import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "../Module/Admin/LayOut";
import { API_URL } from "../../API";

const ProtectedRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    axios
      .get(`${API_URL}/user?id=${localStorage.getItem("id")}`)
      .then((user) => {
        console.log(user.data);
        if (user.data[0].role != "user") {
          setIsAdmin(true);
        }
      });
  }, []);
  return (
    <>
      {/* {isAdmin ? (
        <AdminLayout />
      ) : (
        <div
          style={{ fontSize: "30px", textAlign: "center", margin: "20px 0" }}
        >
          Not Found
        </div>
      )} */}
      <AdminLayout />
    </>
  );
};

export default ProtectedRoute;
