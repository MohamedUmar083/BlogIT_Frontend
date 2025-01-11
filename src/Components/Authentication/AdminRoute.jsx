import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser.result.isAdmin ? <Outlet /> : <Navigate to="*" />;
};

export default AdminRoute;
