import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Header from "../components/LandingPage/Header";
import ProtectedRoute from "../routes/ProtectedRoute";
import { useSiteStore } from "../stores/siteStore";
import { useAuth } from "../hooks/useAuth";

import Beranda from "../components/LandingPage/Beranda";

const About = lazy(() => import("../components/LandingPage/About"));
const Sertifikasi = lazy(() => import("../components/LandingPage/Sertifikasi"));
const Profile = lazy(() => import("../components/LandingPage/Profile"));
const LoginPage = lazy(() => import("../components/LandingPage/LoginPage"));
const RegisterPage = lazy(() => import("../components/LandingPage/RegisterPage"));
const VerificationPage = lazy(() => import("./LandingPage/VerificationPage"));
const Donasi = lazy(() => import("./LandingPage/Donasi"));
const Footer = lazy(() => import("./LandingPage/Footer"));

function NotFoundRedirect() {
  const location = useLocation();
  useEffect(() => { console.warn(`404: ${location.pathname}`); }, [location]);
  return <Navigate to="/" replace />;
}

const PublicOnlyWrapper = () => {
  const { user, isUserLoading } = useAuth();
  if (isUserLoading) return null;
  if (user) {
    const isAdmin = user.role === "admin" || user.role === "superAdmin";
    return <Navigate to={isAdmin ? "/dashboard" : "/profil"} replace />;
  }
  return <Outlet />;
};

function AppLandingPage() {
  const location = useLocation();
  const fetchSiteData = useSiteStore((state) => state.fetchSiteData);
  const isSiteDataLoading = useSiteStore((state) => state.isSiteDataLoading);
  const { checkUserSession, isUserLoading } = useAuth();

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    fetchSiteData();
    checkUserSession();
  }, [fetchSiteData, checkUserSession]);

  useEffect(() => {
    if (!isSiteDataLoading && !isUserLoading) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isSiteDataLoading, isUserLoading]);

  useEffect(() => {
    if (!showContent) return;
    const hash = location.hash;

    if (hash) {
      const scrollTimer = setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
      return () => clearTimeout(scrollTimer);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.hash, location.pathname, showContent]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {showContent && (
        <>
          <Header />

          <main className="flex-grow pt-24 lg:pb-12 w-full flex flex-col items-center">
            <div className="w-[92%] md:w-[88%] lg:w-[85%] max-w-7xl">
              <Suspense fallback={null}>
                <Routes key={location.pathname}>
                  <Route element={<PublicOnlyWrapper />}>
                    <Route path="signin" element={<LoginPage />} />
                    <Route path="signup" element={<RegisterPage />} />
                    <Route path="verifikasi" element={<VerificationPage />} />
                  </Route>

                  <Route index element={<Beranda />} />
                  <Route path="tentang" element={<About />} />
                  <Route path="sertifikasi" element={<Sertifikasi />} />
                  <Route path="donasi" element={<Donasi />} />
                  <Route path="*" element={<NotFoundRedirect />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="profil" element={<Profile />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}

export default AppLandingPage;