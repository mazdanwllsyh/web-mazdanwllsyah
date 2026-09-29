import React, { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { m, LazyMotion, domMax, AnimatePresence } from "framer-motion";
import Sidebar, { menuItems, MobileBottomNav } from "../components/Dashboard/Sidebar";
import Transition from "./Transition";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useSiteStore } from "../stores/siteStore";
import { useAuth } from "../hooks/useAuth";

const DashboardBeranda = lazy(() => import("../components/Dashboard/DashboardBeranda"));
const DataSaya = lazy(() => import("../components/Dashboard/DataSaya"));
const KelolaKonten = lazy(() => import("../components/Dashboard/KelolaKonten"));
const EditGallery = lazy(() => import("../components/Dashboard/EditGallery"));
const EditSertifikat = lazy(() => import("../components/Dashboard/EditSertifikasi"));
const UserDashboard = lazy(() => import("../components/Dashboard/UserDashboard"));

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | Dashboard Mazda Nawallsyah`;
  }, [title]);
  return null;
};

function AppDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const siteData = useSiteStore((state) => state.siteData);
  const { handleSignOut, user } = useAuth();
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const [animDirection, setAnimDirection] = useState(1);
  const [isMobileView, setIsMobileView] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobileView(window.innerWidth < 1024);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const allowedMenuItems = useMemo(() => {
    return menuItems.filter((item) => !item.role || user?.role === item.role);
  }, [user?.role]);

  const currentTitle = useMemo(() => {
    const item = allowedMenuItems.find((item) => item.path === location.pathname);
    return item ? item.name : "Beranda";
  }, [location.pathname, allowedMenuItems]);

  useEffect(() => {
    setAnimDirection(Math.random() > 0.5 ? 1 : -1);
  }, [location.pathname]);

  const handleDragEnd = (event, info) => {
    if (!isMobileView) return;

    const swipeThreshold = window.innerWidth * 0.65;
    const currentIndex = allowedMenuItems.findIndex(item => item.path === location.pathname);

    if (currentIndex === -1) return;

    if (info.offset.x < -swipeThreshold && currentIndex < allowedMenuItems.length - 1) {
      navigate(allowedMenuItems[currentIndex + 1].path);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      navigate(allowedMenuItems[currentIndex - 1].path);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: animDirection * 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: animDirection * -20 }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-base-200/40 flex select-none font-text relative">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 h-full flex flex-col overflow-hidden relative z-10">
        <header className="w-full h-16 md:h-18 bg-base-100/90 backdrop-blur-md border-b border-base-content/10 px-4 md:px-8 flex items-center justify-between shrink-0 z-30 shadow-sm shadow-base-content/5">
          <div className="flex items-center gap-3.5">
            <a href="/" className="lg:hidden flex items-center justify-center w-9 h-9 mask mask-hexagon bg-gradient-to-br from-accent to-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300">
              <span className="font-display font-bold text-[17px] text-white">{siteData?.brandName ? siteData.brandName.charAt(0).toUpperCase() : "M"}</span>
            </a>
            <h1 className="text-lg md:text-xl font-semibold font-display tracking-tight flex items-center gap-2.5">
              <Icon icon="solar:widget-2-bold-duotone" className="text-primary w-5 h-5 hidden lg:block" />
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className={`lg:hidden ${isMobileNavVisible ? 'aura aura-dual rounded-3xl duration-[2800ms]' : ''}`}>
              <button type="button" onClick={() => setIsMobileNavVisible(!isMobileNavVisible)} className={`btn btn-sm btn-circle bg-gradient-to-br from-accent to-primary shadow-lg transition-all duration-300 ${isMobileNavVisible ? 'text-primary-content' : 'text-primary-content/80 hover:bg-base-200 hover:text-primary'}`}>
                <Icon icon={isMobileNavVisible ? "mdi:eye-outline" : "mdi:eye-off-outline"} className="w-5 h-5" />
              </button>
            </div>
            <ThemeSwitcher />
            <button type="button" onClick={handleSignOut} className="lg:hidden btn btn-sm btn-circle btn-error text-error-content hover:bg-error hover:text-white transition-all duration-300">
              <Icon icon="lucide:log-out" className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden bg-base-200/30 flex flex-col justify-between relative">
          {/* GUNAKAN domMax DI SINI AGAR FITUR DRAG TERBACA */}
          <LazyMotion features={domMax}>
            <m.div
              className="p-5 md:p-8 flex-1 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar lg:pb-0"
              drag="x"
              dragListener={isMobileView}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
            >
              <Suspense fallback={<Transition isLoading={true} />}>
                <AnimatePresence mode="wait">
                  <m.div
                    key={location.pathname}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <Routes location={location}>
                      <Route index element={<><PageTitle title={currentTitle} /><DashboardBeranda /></>} />
                      <Route path="sitedata" element={<><PageTitle title={currentTitle} /><DataSaya /></>} />
                      <Route path="configuration" element={<><PageTitle title={currentTitle} /><KelolaKonten /></>} />
                      <Route path="galeriedit" element={<><PageTitle title={currentTitle} /><EditGallery /></>} />
                      <Route path="sertifikatsaya" element={<><PageTitle title={currentTitle} /><EditSertifikat /></>} />
                      <Route path="adminuser" element={<><PageTitle title={currentTitle} /><UserDashboard /></>} />
                    </Routes>
                  </m.div>
                </AnimatePresence>
              </Suspense>
            </m.div>
          </LazyMotion>

          <footer className="w-full py-4 bg-transparent text-center text-[11px] font-mono tracking-tight text-base-content/50 shrink-0 md:mb-2 pointer-events-none">
            &copy; {new Date().getFullYear()} {siteData?.brandNameShort || "Mazda Nawallsyah"}. Core Management Console v2.5.
          </footer>
        </main>
      </div>

      <MobileBottomNav isVisible={isMobileNavVisible} />
    </div>
  );
}

export default AppDashboard;