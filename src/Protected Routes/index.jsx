import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../Module/Admin/LayOut";
import { API_URL } from "../../API";
import { Navigate } from "react-router-dom";

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
      {isAdmin ? <AdminLayout /> : <Navigate to="/login" />}
      <AdminLayout />
    </>
  );
};

export default ProtectedRoute;
