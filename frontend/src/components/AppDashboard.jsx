import React, { Suspense, lazy, useEffect } from "react";
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

  const getTitle = (path) => {
    const item = menuItems.find((item) => item.path === path);
    return item ? item.name : "Beranda";
  };

  const currentTitle = getTitle(location.pathname);

  return (
    <div className="w-full h-screen overflow-hidden bg-base-200/40 flex select-none font-text relative">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <header className="w-full h-16 md:h-18 bg-base-100 border-b border-base-content/20 px-4 md:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3.5">
            <a
              href="/"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-primary/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
              title="Kembali ke Beranda Utama"
            >
              <span className="font-display font-bold text-[17px] text-white">
                {siteData?.brandName ? siteData.brandName.charAt(0).toUpperCase() : "Vx"}
              </span>
            </a>

            <h1 className="text-lg md:text-xl font-semibold font-display tracking-tight flex items-center gap-2.5">
              <Icon icon="solar:widget-2-bold-duotone" className="text-primary w-5 h-5 hidden lg:block" />
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 md:gap-4">
            <ThemeSwitcher />

            <button
              type="button"
              onClick={handleSignOut}
              className="lg:hidden btn btn-sm rounded-3xl btn-error text-error-content/80 hover:bg-error/10 hover:text-error transition-all duration-300 ml-1"
              title="Logout Sistem"
            >
              <Icon icon="lucide:log-out" className="w-[1.25rem] h-[1.25rem]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-base-200/30 flex flex-col justify-between custom-scrollbar pb-24 lg:pb-0">
          <div className="p-5 md:p-8 flex-1">
            <Suspense fallback={<Transition isLoading={true} />}>
              <Routes>
                <Route index element={<><PageTitle title={getTitle("/dashboard")} /><DashboardBeranda /></>} />
                <Route path="sitedata" element={<><PageTitle title={getTitle("/dashboard/sitedata")} /><DataSaya /></>} />
                <Route path="configuration" element={<><PageTitle title={getTitle("/dashboard/configuration")} /><KelolaKonten /></>} />
                <Route path="galeriedit" element={<><PageTitle title={getTitle("/dashboard/galeriedit")} /><EditGallery /></>} />
                <Route path="sertifikatsaya" element={<><PageTitle title={getTitle("/dashboard/sertifikatsaya")} /><EditSertifikat /></>} />
                <Route path="adminuser" element={<><PageTitle title={getTitle("/dashboard/adminuser")} /><UserDashboard /></>} />
              </Routes>
            </Suspense>
          </div>

          <footer className="w-full py-4 bg-base-100 border-t border-base-content/5 text-center text-[11px] font-mono tracking-tight text-base-content/50 shrink-0">
            &copy; {new Date().getFullYear()} {siteData?.brandNameShort || "Mazda Nawallsyah"}. Core Management Console v2.0.
          </footer>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default AppDashboard;