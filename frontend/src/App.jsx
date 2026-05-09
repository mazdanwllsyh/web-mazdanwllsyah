import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Transition from "./components/Transition";
import GlobalModal from "./components/GlobalModal";
import AdminRoute from "./routes/AdminRoute";
import { useSiteStore } from "./stores/siteStore";
import { useAuth } from "./hooks/useAuth";

const AppLandingPage = lazy(() => import("./components/AppLandingPage"));
const AppDashboard = lazy(() => import("./components/AppDashboard"));

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const isSiteDataLoading = useSiteStore((state) => state.isSiteDataLoading);
  const fetchSiteData = useSiteStore((state) => state.fetchSiteData);

  const { isUserLoading, checkUserSession } = useAuth();

  const [isVisualLoading, setIsVisualLoading] = useState(false);

  useEffect(() => {
    fetchSiteData();
    if (checkUserSession) {
      checkUserSession();
    }
  }, [fetchSiteData, checkUserSession]);

  useLayoutEffect(() => {
    if (isDashboard) {
      setIsVisualLoading(false);
      return;
    }

    setIsVisualLoading(true);
    const timer = setTimeout(() => {
      setIsVisualLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [location.pathname, isDashboard]);

  const isAppInitializing = isSiteDataLoading || isUserLoading;

  return (
    <>
      <GlobalModal />
      <Transition isLoading={isAppInitializing} />
      <Transition isLoading={isVisualLoading && !isDashboard} />

      <main
        className={`transition-opacity duration-700 ease-in-out ${isAppInitializing ? "opacity-0 overflow-hidden" : "opacity-100"
          }`}
      >
        <Suspense fallback={
          <div className="fixed inset-0 bg-base-100 z-[9999] flex items-center justify-center">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>
        }>
          <Routes>
            <Route path="/*" element={<AppLandingPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/dashboard/*" element={<AppDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default App;