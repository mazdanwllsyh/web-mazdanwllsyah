import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Transition from "./components/Transition";

import AdminRoute from "./routes/AdminRoute";

const AppLandingPage = lazy(() => import("./components/AppLandingPage"));
const AppDashboard = lazy(() => import("./components/AppDashboard"));

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
        <Suspense fallback={<Transition isLoading={true} />}>
          <Routes>
            <Route path="/*" element={<AppLandingPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/*" element={<AppDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
