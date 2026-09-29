import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Transition from "./components/Transition";
import GlobalModal from "./components/GlobalModal";
import AdminRoute from "./routes/AdminRoute";
import { useSiteStore } from "./stores/siteStore";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";

export const isBot = (typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling|lighthouse|Google-InspectionTool/i.test(navigator.userAgent)) || (typeof navigator !== 'undefined' && navigator.webdriver);
const isTouchOnly = typeof window !== "undefined" && window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const CustomCursor = (!isBot && !isTouchOnly) ? lazy(() => import("./components/CustomCursor")) : () => null;
const AppLandingPage = lazy(() => import("./components/AppLandingPage"));
const AppDashboard = lazy(() => import("./components/AppDashboard"));

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const { isSiteDataLoading, fetchSiteData } = useSiteStore();
  const { isUserLoading, checkUserSession } = useAuth();

  const [transitionFinished, setTransitionFinished] = useState(isBot || isDashboard);
  const [isLoading, setIsLoading] = useState(!isBot && !isDashboard);

  useEffect(() => {
    fetchSiteData();
    if (checkUserSession) checkUserSession();
  }, [fetchSiteData, checkUserSession]);

  useEffect(() => {
    if (isBot || isDashboard) return;
    if (isSiteDataLoading || isUserLoading) return;

    setIsLoading(true);
    setTransitionFinished(false);

    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    const finishTimer = setTimeout(() => {
      setTransitionFinished(true);
    }, 1250);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(finishTimer);
    };
  }, [location.pathname, isSiteDataLoading, isUserLoading, isBot, isDashboard]);

  return (
    <>
      <style>
        {`
          :root { --hexagon-cursor: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cG9seWdvbiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjY1MzQiIHN0cm9rZS13aWR0aD0iMiIgcG9pbnRzPSIxNiwyIDMwLDEwIDMwLDIyIDE2LDMwIDIsMjIgMiwxMCIvPjwvc3ZnPg==') 16 16, auto; }
          html, body { cursor: ${isTouchOnly ? 'auto' : 'var(--hexagon-cursor)'}; scrollbar-width: none; overflow-x: hidden; -webkit-tap-highlight-color: transparent; }
          ::-webkit-scrollbar:vertical { width: 0px; display: none; }
          ::-webkit-scrollbar:horizontal { height: 6px; }
          ::-webkit-scrollbar-thumb:horizontal { background-color: oklch(var(--p)); border-radius: 9999px; }
          ::-webkit-scrollbar-track:horizontal { background-color: transparent; }
          ${isBot ? `* { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; visibility: visible !important; } [style*="opacity: 0"] { opacity: 1 !important; }` : ""}
        `}
      </style>
      <Suspense fallback={null}>{!isBot && !isTouchOnly && <CustomCursor />}</Suspense>
      <GlobalModal />

      {!isBot && !isDashboard && (
        <Transition isLoading={isLoading} />
      )}

      <main className="w-full min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/*" element={<AppLandingPage isTransitionComplete={transitionFinished} />} />
              <Route element={<AdminRoute />}>
                <Route path="/dashboard/*" element={<AppDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}
export default App;