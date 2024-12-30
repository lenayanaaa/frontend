import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); // Retrieve the token
  const role = localStorage.getItem("role"); // Retrieve the user role

  if (!token) {
    alert("You must be logged in to view this page.");
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    alert("You are not authorized to view this page.");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
