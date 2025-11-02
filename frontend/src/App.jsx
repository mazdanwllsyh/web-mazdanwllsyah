import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Transition from "./components/Transition";
import AppLandingPage from "./components/AppLandingPage";
import AppDashboard from "./components/AppDashboard";
import AdminRoute from "./routes/AdminRoute";

function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Transition isLoading={isPreloading} />
      <main
        className={`transition-opacity duration-500 ${
          isPreloading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Routes>
          <Route path="/*" element={<AppLandingPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/dashboard/*" element={<AppDashboard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
