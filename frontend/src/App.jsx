import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Transition from "./components/Transition";
import GlobalModal from "./components/GlobalModal";
import AdminRoute from "./routes/AdminRoute";
import { useSiteStore } from "./stores/siteStore";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";

const AppLandingPage = lazy(() => import("./components/AppLandingPage"));
const AppDashboard = lazy(() => import("./components/AppDashboard"));

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const isSiteDataLoading = useSiteStore((state) => state.isSiteDataLoading);
  const fetchSiteData = useSiteStore((state) => state.fetchSiteData);
  const { isUserLoading, checkUserSession } = useAuth();

  const [isVisualLoading, setIsVisualLoading] = useState(false);
  const [canRenderRoutes, setCanRenderRoutes] = useState(false);

  useEffect(() => {
    fetchSiteData();
    if (checkUserSession) checkUserSession();
  }, [fetchSiteData, checkUserSession]);

  useLayoutEffect(() => {
    if (isDashboard) {
      setIsVisualLoading(false);
      setCanRenderRoutes(true);
      return;
    }

    setIsVisualLoading(true);
    setCanRenderRoutes(false);

    const transitionTimer = setTimeout(() => {
      setIsVisualLoading(false);
    }, 1500);

    return () => clearTimeout(transitionTimer);
  }, [location.pathname, isDashboard]);

  const isAppInitializing = isSiteDataLoading || isUserLoading;
  const showTransition = isAppInitializing || isVisualLoading;

  useEffect(() => {
    if (!showTransition) {
      const safetyTimer = setTimeout(() => {
        setCanRenderRoutes(true);
      }, 850);
      return () => clearTimeout(safetyTimer);
    } else {
      setCanRenderRoutes(false);
    }
  }, [showTransition]);

  return (
    <>
      <style>
        {`
          :root {
            --hexagon-cursor: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cG9seWdvbiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjY1MzQiIHN0cm9rZS13aWR0aD0iMiIgcG9pbnRzPSIxNiwyIDMwLDEwIDMwLDIyIDE2LDMwIDIsMjIgMiwxMCIvPjwvc3ZnPg==') 16 16, auto;
          }
          html, body {
            cursor: var(--hexagon-cursor);
            scrollbar-width: none; 
            overflow-x: hidden;
          }

          ::-webkit-scrollbar:vertical { width: 0px; display: none; }
          ::-webkit-scrollbar:horizontal { height: 6px; }
          ::-webkit-scrollbar-thumb:horizontal { background-color: oklch(var(--p)); border-radius: 9999px; }
          ::-webkit-scrollbar-track:horizontal { background-color: transparent; }
        `}
      </style>

      <CustomCursor />
      <GlobalModal />

      <Transition isLoading={showTransition} />

      {canRenderRoutes && (
        <main className="w-full min-h-screen">
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="fixed inset-0 bg-base-100 z-[9997] flex items-center justify-center">
                  <span className="loading loading-ring loading-lg text-primary"></span>
                </div>
              }
            >
              <Routes>
                <Route path="/*" element={<AppLandingPage />} />
                <Route element={<AdminRoute />}>
                  <Route path="/dashboard/*" element={<AppDashboard />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      )}
    </>
  );
}

export default App;