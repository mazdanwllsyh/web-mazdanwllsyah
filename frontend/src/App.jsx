import React, { useState, useEffect, useLayoutEffect, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Transition from "./components/Transition";
import GlobalModal from "./components/GlobalModal";
import AdminRoute from "./routes/AdminRoute";
import { useSiteStore } from "./stores/siteStore";
import { useAuth } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";

import { useRegisterSW } from "virtual:pwa-register/react";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

const AppLandingPage = lazy(() => import("./components/AppLandingPage"));
const AppDashboard = lazy(() => import("./components/AppDashboard"));

export const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

const UpdateToast = ({ updateServiceWorker }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Icon icon="mdi:cloud-download" className="w-5 h-5 text-primary" />
      <span className="font-bold text-sm">Pembaruan Sistem Tersedia!</span>
    </div>
    <p className="text-xs opacity-80">Versi terbaru dari portofolio ini telah siap. Muat ulang untuk pengalaman terbaik.</p>
    <button
      onClick={() => updateServiceWorker(true)}
      className="btn btn-sm btn-primary w-full mt-1 font-bold"
    >
      Muat Ulang Sekarang
    </button>
  </div>
);

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const isSiteDataLoading = useSiteStore((state) => state.isSiteDataLoading);
  const fetchSiteData = useSiteStore((state) => state.fetchSiteData);
  const { isUserLoading, checkUserSession } = useAuth();

  const [isVisualLoading, setIsVisualLoading] = useState(false);
  const [canRenderRoutes, setCanRenderRoutes] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast(
        (t) => (
          <UpdateToast
            updateServiceWorker={() => {
              toast.dismiss(t.id);
              updateServiceWorker(true);
            }}
          />
        ),
        {
          duration: Infinity,
          position: "bottom-right",
          style: {
            background: 'var(--fallback-b1,oklch(var(--b1)/1))',
            color: 'var(--fallback-bc,oklch(var(--bc)/1))',
            border: '1px solid var(--fallback-p,oklch(var(--p)/0.2))',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            padding: '16px',
            borderRadius: '1rem',
          }
        }
      );
    }
  }, [needRefresh, updateServiceWorker]);


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

    if (isBot) {
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
    if (isBot) {
      setCanRenderRoutes(true);
      return;
    }

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