import React, {
  useState,
  useEffect,
  useLayoutEffect,
  Suspense,
  lazy,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Transition from "./components/Transition";
import GlobalModal from "./components/GlobalModal";
import AdminRoute from "./routes/AdminRoute";
import { useSiteStore } from "./stores/siteStore";
import { useAuth } from "./hooks/useAuth";

const AppLandingPage = lazy(() => import("./components/AppLandingPage"));
const AppDashboard = lazy(() => import("./components/AppDashboard"));

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-accent to-primary z-[99999] pointer-events-none origin-left"
      style={{ scaleX, opacity }}
    />
  );
};

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
    }, 1000); 

    return () => clearTimeout(timer);
  }, [location.pathname, isDashboard]);

  const isLoadingOverlay = isSiteDataLoading || isUserLoading || (isVisualLoading && !isDashboard);

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
          }

          ::-webkit-scrollbar:vertical {
            width: 0px;
            display: none;
          }
          
          ::-webkit-scrollbar:horizontal {
            height: 6px;
          }
          ::-webkit-scrollbar-thumb:horizontal {
            background-color: oklch(var(--p)); 
            border-radius: 9999px;
          }
          ::-webkit-scrollbar-track:horizontal {
            background-color: transparent;
          }
        `}
      </style>

      <ScrollProgressBar />
      <GlobalModal />

      <Transition isLoading={isLoadingOverlay} />

      <main
        className={`transition-opacity duration-700 ease-in-out ${isLoadingOverlay ? "opacity-0 overflow-hidden" : "opacity-100"
          }`}
      >
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-base-100 z-[9999] flex items-center justify-center">
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
      </main>
    </>
  );
}

export default App;