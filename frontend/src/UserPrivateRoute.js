import React from "react";
import { Navigate } from "react-router-dom";
import { getDecodedToken } from "./utils/auth";

const UserPrivateRoute = ({ children }) => {
  try {
    const decodedToken = getDecodedToken();
    const isUser = decodedToken?.role === "USER";

    return isUser ? children : <Navigate to="/" />;
  } catch (error) {
    console.error("Token doğrulanamadı:", error);
    return <Navigate to="/" />;
  }
};

export default UserPrivateRoute;
