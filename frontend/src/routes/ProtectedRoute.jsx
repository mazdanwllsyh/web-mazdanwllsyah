import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import Transition from "../components/Transition"; 

function ProtectedRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <Transition isLoading={true} />;
  }

  if (!user) {
    return <Navigate to="/#kontak" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
