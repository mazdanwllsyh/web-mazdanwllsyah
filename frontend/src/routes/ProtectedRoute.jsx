import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import Transition from "../components/Transition";

function ProtectedRoute() {
  const { user, isUserLoading } = useAuth(); 

  if (isUserLoading) {
    return <Transition isLoading={true} />;
  }

  if (!user) {
    return <Navigate to="/#kontak" replace />; 
  }

  return <Outlet />;
}

export default ProtectedRoute;