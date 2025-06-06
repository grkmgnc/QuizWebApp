import React from "react";
import { Navigate } from "react-router-dom";
import { getDecodedToken } from "./utils/auth";

const AdminPrivateRoute = ({ children }) => {
  try {
    const decodedToken = getDecodedToken();
    const isAdmin = decodedToken?.role === "ADMIN";
    return isAdmin ? children : <Navigate to="/" />;
  } catch (e) {
    console.error("Token parse error:", e);
    return <Navigate to="/" />;
  }
};

export default AdminPrivateRoute;
