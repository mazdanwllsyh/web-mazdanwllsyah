import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Sidebar, { menuItems } from "../components/Dashboard/Sidebar";
import Transition from "./Transition";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { useSiteStore } from "../stores/siteStore";

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

  const getTitle = (path) => {
    const item = menuItems.find((item) => item.path === path);
    return item ? item.name : "Beranda";
  };

  const currentTitle = getTitle(location.pathname);

  return (
    <div className="w-full h-screen overflow-hidden bg-base-200/40 flex select-none font-text">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 h-full flex flex-col overflow-hidden">
        <header className="w-full h-18 bg-base-100 border-b border-base-content/10 px-6 md:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <label htmlFor="dashboard-sidebar-drawer" className="btn btn-square btn-ghost drawer-button lg:hidden">
              <Icon icon="material-symbols:menu-rounded" className="w-6 h-6" />
            </label>
            <h1 className="text-lg font-semibold font-display tracking-tight flex items-center gap-2.5">
              <Icon icon="solar:widget-2-bold-duotone" className="text-primary w-5 h-5" />
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-base-200/30 flex flex-col justify-between custom-scrollbar">
          <div className="p-6 md:p-8 flex-1">
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

      <div className="drawer lg:hidden absolute z-50">
        <input id="dashboard-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label htmlFor="dashboard-sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default AppDashboard;