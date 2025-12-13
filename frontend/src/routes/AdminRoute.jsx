import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import Transition from "../components/Transition";

function AdminRoute() {
  const { user, isUserLoading } = useAuth();

  if (isUserLoading) {
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