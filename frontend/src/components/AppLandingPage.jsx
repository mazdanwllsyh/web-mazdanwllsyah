import React, { useEffect, useState, useMemo } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { LazyMotion, domAnimation, AnimatePresence, m } from "framer-motion";
import { isBot } from "../App";
import { useAuth } from "../hooks/useAuth";
import ProtectedRoute from "../routes/ProtectedRoute";
import Header from "../components/LandingPage/Header";
import Beranda from "../components/LandingPage/Beranda";

const HexagonBackground = React.lazy(() => import("../components/HexagonBackground"));
const FABDonate = React.lazy(() => import("../components/FABDonate"));
const ScrollToTop = React.lazy(() => import("../components/ScrollToTop"));
const About = React.lazy(() => import("../components/LandingPage/About"));
const Sertifikasi = React.lazy(() => import("../components/LandingPage/Sertifikasi"));
const Profile = React.lazy(() => import("../components/LandingPage/Profile"));
const LoginPage = React.lazy(() => import("../components/LandingPage/LoginPage"));
const RegisterPage = React.lazy(() => import("../components/LandingPage/RegisterPage"));
const VerificationPage = React.lazy(() => import("./LandingPage/VerificationPage"));
const Donasi = React.lazy(() => import("./LandingPage/Donasi"));
const Footer = React.lazy(() => import("./LandingPage/Footer"));

function NotFoundRedirect() {
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

function AppLandingPage({ isTransitionComplete }) {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 769px)");
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (isBot) return;
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) {
          window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (!location.state?.preventScroll) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  const routingContent = useMemo(() => (
    <Routes location={location}>
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
  ), [location]);

  const appContent = (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      {!isBot && isDesktop && (
        <React.Suspense fallback={null}>
          <HexagonBackground />
        </React.Suspense>
      )}
      <Header />
      <main className="flex-grow pt-18 xl:pb-8 w-full flex flex-col items-center">
        <div className="w-[92%] md:w-[88%] lg:w-[85%] max-w-7xl">
          <React.Suspense fallback={<div className="min-h-[60vh] w-full" />}>
            {isBot ? routingContent : (
              <AnimatePresence mode="wait">
                {isTransitionComplete && (
                  <m.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    {routingContent}
                  </m.div>
                )}
              </AnimatePresence>
            )}
          </React.Suspense>
        </div>
      </main>
      <React.Suspense fallback={null}>
        <FABDonate />
        <ScrollToTop />
        <Footer />
      </React.Suspense>
    </div>
  );

  return isBot ? appContent : <LazyMotion features={domAnimation}>{appContent}</LazyMotion>;
}

export default AppLandingPage;