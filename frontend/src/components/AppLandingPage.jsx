import React, { useEffect, useRef, Suspense, lazy } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Header from "../components/LandingPage/Header";
import ProtectedRoute from "../routes/ProtectedRoute";
import { useSiteStore } from "../stores/siteStore";
import { useAuth } from "../hooks/useAuth";
import AOS from "aos";

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
  const { checkUserSession } = useAuth();
  const aosInitCalled = useRef(false);

  useEffect(() => {
    fetchSiteData();
    checkUserSession();
  }, []);

  useEffect(() => {
    const hash = location.hash;

    const scrollTimer = setTimeout(() => {
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }, 1600); 

    return () => clearTimeout(scrollTimer);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (!aosInitCalled.current) {
      aosInitCalled.current = true;
      AOS.init({ duration: 800, once: true, offset: 50 });
    }
    setTimeout(() => AOS.refresh(), 1600);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      <main className="flex-grow pt-16">
        <Suspense fallback={null}>
          <Routes>
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
      </main>

      <Footer />
    </div>
  );
}

export default AppLandingPage;