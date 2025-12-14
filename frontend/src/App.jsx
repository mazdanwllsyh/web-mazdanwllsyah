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
  const { isUserLoading } = useAuth();

  const [isVisualLoading, setIsVisualLoading] = useState(false);

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

  const shouldShowTransition =
    isSiteDataLoading ||
    isUserLoading ||
    (isVisualLoading && !isDashboard);

  return (
    <div>
      <GlobalModal />

      <Transition isLoading={shouldShowTransition} />

      <main
        className={`transition-opacity duration-700 ease-in-out ${shouldShowTransition ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
      >
        <Suspense fallback={null}>
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