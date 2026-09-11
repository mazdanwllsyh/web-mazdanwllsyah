import React, { Suspense, lazy, useEffect, useState, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
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
  const siteData = useSiteStore((state) => state.siteData);
  const { handleSignOut } = useAuth();
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);

  const currentTitle = useMemo(() => {
    const item = menuItems.find((item) => item.path === location.pathname);
    return item ? item.name : "Beranda";
  }, [location.pathname]);

  return (
    <div className="w-full h-screen overflow-hidden bg-base-200/40 flex select-none font-text relative">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 h-full flex flex-col overflow-hidden relative z-10">
        <header className="w-full h-16 md:h-18 bg-base-100/90 backdrop-blur-md border-b border-base-content/10 px-4 md:px-8 flex items-center justify-between shrink-0 z-30 shadow-sm shadow-base-content/5">
          <div className="flex items-center gap-3.5">
            <a
              href="/"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all duration-300"
              title="Kembali ke Beranda Utama"
            >
              <span className="font-display font-bold text-[17px] text-white">
                {siteData?.brandName ? siteData.brandName.charAt(0).toUpperCase() : "M"}
              </span>
            </a>

            <h1 className="text-lg md:text-xl font-semibold font-display tracking-tight flex items-center gap-2.5">
              <Icon icon="solar:widget-2-bold-duotone" className="text-primary w-5 h-5 hidden lg:block" />
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className={`lg:hidden ${isMobileNavVisible ? 'aura aura-dual rounded-3xl duration-[2800ms]' : ''}`}>
              <button
                type="button"
                onClick={() => setIsMobileNavVisible(!isMobileNavVisible)}
                className={`btn btn-sm btn-circle bg-gradient-to-br from-accent to-primary shadow-lg transition-all duration-300 ${isMobileNavVisible ? 'text-primary-content' : 'text-primary-content/80 hover:bg-base-200 hover:text-primary'}`}
                title="Toggle Menu Navigasi"
              >
                <Icon icon={isMobileNavVisible ? "mdi:eye-outline" : "mdi:eye-off-outline"} className="w-5 h-5" />
              </button>
            </div>

            <ThemeSwitcher />

            <button
              type="button"
              onClick={handleSignOut}
              className="lg:hidden btn btn-sm btn-circle btn-error text-error-content hover:bg-error hover:text-white transition-all duration-300"
              title="Logout Sistem"
            >
              <Icon icon="lucide:log-out" className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-base-200/30 flex flex-col justify-between custom-scrollbar lg:pb-0 relative">
          <div className="p-5 md:p-8 flex-1 w-full max-w-7xl mx-auto">
            <Suspense fallback={<Transition isLoading={true} />}>
              <Routes>
                <Route index element={<><PageTitle title={currentTitle} /><DashboardBeranda /></>} />
                <Route path="sitedata" element={<><PageTitle title={currentTitle} /><DataSaya /></>} />
                <Route path="configuration" element={<><PageTitle title={currentTitle} /><KelolaKonten /></>} />
                <Route path="galeriedit" element={<><PageTitle title={currentTitle} /><EditGallery /></>} />
                <Route path="sertifikatsaya" element={<><PageTitle title={currentTitle} /><EditSertifikat /></>} />
                <Route path="adminuser" element={<><PageTitle title={currentTitle} /><UserDashboard /></>} />
              </Routes>
            </Suspense>
          </div>

          <footer className="w-full py-4 bg-transparent text-center text-[11px] font-mono tracking-tight text-base-content/50 shrink-0 md:mb-2">
            &copy; {new Date().getFullYear()} {siteData?.brandNameShort || "Mazda Nawallsyah"}. Core Management Console v2.0.
          </footer>
        </main>
      </div>

      <MobileBottomNav isVisible={isMobileNavVisible} />
    </div>
  );
}

export default AppDashboard;