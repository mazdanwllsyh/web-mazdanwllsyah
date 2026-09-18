import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Header from "../components/LandingPage/Header";
import ProtectedRoute from "../routes/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import { LazyMotion, domAnimation } from "framer-motion";
import Beranda from "../components/LandingPage/Beranda";
import HexagonBackground from "../components/HexagonBackground";
import { isBot } from "../App";

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
  const location = useLocation();
  return <Navigate to="/" replace />;
}

const PublicOnlyWrapper = () => {
  const { user, isUserLoading } = useAuth();
  const location = useLocation();

  if (isUserLoading) return null;
  if (user) {
    const isAdmin = user.role === "admin" || user.role === "superAdmin";
    const from = location.state?.from || (isAdmin ? "/dashboard" : "/profil");
    return <Navigate to={from} replace />;
  }
  return <Outlet />;
};

function AppLandingPage() {
  const location = useLocation();

  useEffect(() => {
    if (isBot) return;

    if (location.hash) {
      const timer = setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 55;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

  const appContent = (
    <>
      <Header />
      <main className="flex-grow pt-18 xl:pb-8 w-full flex flex-col items-center">
        <div className="w-[92%] md:w-[88%] lg:w-[85%] max-w-7xl">
          <React.Suspense fallback={null}>
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
          </React.Suspense>
        </div>
      </main>
      <React.Suspense fallback={null}>
        <FABDonate />
        <ScrollToTop />
      </React.Suspense>
      <Footer />
    </>
  );

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      <HexagonBackground />
      {isBot ? appContent : <LazyMotion features={domAnimation}>{appContent}</LazyMotion>}
    </div>
  );
}

export default AppLandingPage;