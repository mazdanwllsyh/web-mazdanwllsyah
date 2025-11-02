import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import Transition from "../components/Transition"; 

function AdminRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Transition isLoading={true} />;
  }

  if (!user) {
    return <Navigate to="/donasi" replace />;
  }

  const isAdmin = user.role === "admin" || user.role === "superAdmin";

  if (isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to="/profil" replace />;
  }
}

export default AdminRoute;
