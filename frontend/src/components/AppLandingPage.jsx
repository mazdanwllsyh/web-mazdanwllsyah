import React, { useEffect, useState, useRef, Suspense, lazy } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Transition from "./Transition";
import Header from "../components/LandingPage/Header";
import Footer from "../components/LandingPage/Footer";
import ProtectedRoute from "../routes/ProtectedRoute";
import { useAppContext } from "../context/AppContext";
import { useUser } from "../context/UserContext";
import AOS from "aos";

const Beranda = lazy(() => import("../components/LandingPage/Beranda"));
const About = lazy(() => import("../components/LandingPage/About"));
const Sertifikasi = lazy(() =>
  import(
    /* webpackChunkName: "chunk-sertifikasi-pdf" */ "../components/LandingPage/Sertifikasi"
  )
);
const Profile = lazy(() => import("../components/LandingPage/Profile"));
const LoginPage = lazy(() => import("../components/LandingPage/LoginPage"));
const RegisterPage = lazy(() =>
  import("../components/LandingPage/RegisterPage")
);
const VerificationPage = lazy(() => import("./LandingPage/VerificationPage"));
const Donasi = lazy(() => import("./LandingPage/Donasi"));

function NotFoundRedirect() {
  const location = useLocation();
  useEffect(() => {
    console.warn(
      `Fallback: Tidak ada rute yang cocok untuk "${location.pathname}".`
    );
  }, [location]);

  return <Navigate to="/" replace />;
}

const PublicOnlyWrapper = () => {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <Transition isLoading={true} />;
  }

  if (user) {
    const isAdmin = user.role === "admin" || user.role === "superAdmin";
    return <Navigate to={isAdmin ? "/dashboard" : "/profil"} replace />;
  }

  return <Outlet />;
};

function AppLandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const { isSiteDataLoading } = useAppContext();
  const { isUserLoading } = useUser();

  const aosInitCalled = useRef(false);

  useEffect(() => {
    const hash = location.hash;
    if (!hash || isLoading) {
      return;
    }
    const id = hash.replace("#", "");

    let attempts = 0;
    const maxAttempts = 20;
    const intervalDelay = 200;

    const scrollInterval = setInterval(() => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        clearInterval(scrollInterval);
      } else {
        attempts++;
        if (attempts > maxAttempts) {
          console.warn(
            `Gagal scroll: Elemen '#${id}' tidak ditemukan setelah ${
              (maxAttempts * intervalDelay) / 1000
            } detik.`
          );
          clearInterval(scrollInterval);
        }
      }
    }, intervalDelay);

    return () => {
      clearInterval(scrollInterval);
    };
  }, [location.hash, isLoading]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1650);
    return () => {
      clearTimeout(timer);
      setIsLoading(true);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && !aosInitCalled.current) {
      aosInitCalled.current = true;
      AOS.init({
        duration: 800,
        once: true,
      });
      AOS.refresh();
    }
  }, [isLoading]);

  const isAppLoading = isLoading || isSiteDataLoading || isUserLoading;

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Transition isLoading={isAppLoading} />

      <div className="flex flex-col flex-grow">
        <Header />
        {!isAppLoading && (
          <>
            <main className="flex-grow pt-16">
              <Suspense
                fallback={<Transition isLoading={true} />}
                key={location.pathname}
              >
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
          </>
        )}
      </div>
    </div>
  );
}

export default AppLandingPage;
