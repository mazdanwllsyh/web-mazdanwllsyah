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
    <div className="drawer lg:drawer-open min-h-screen font-text text-base-content selection:bg-primary/20 selection:text-primary">
      <input id="dashboard-sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-200/40">
        <header className="navbar bg-base-100/80 backdrop-blur-md shadow-sm px-4 md:px-6 lg:px-8 border-b border-base-content/5 sticky top-0 z-30 transition-all">
          <div className="flex-1 gap-2">
            <label htmlFor="dashboard-sidebar-drawer" className="btn btn-ghost btn-circle lg:hidden">
              <Icon icon="lucide:menu" className="w-6 h-6" />
            </label>
            <span className="font-display font-black text-lg md:text-xl text-base-content tracking-tight">
              {currentTitle}
            </span>
          </div>
          <div className="flex-none gap-2">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in-up">
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
        </main>

        <footer className="footer footer-center p-6 bg-base-100/50 border-t border-base-content/5 text-base-content/60 text-xs font-medium">
          <div>&copy; 2025 - {new Date().getFullYear()} - {siteData?.brandNameShort || "Mazda Nawallsyah"}. All Rights Reserved.</div>
        </footer>
      </div>

      <div className="drawer-side z-50">
        <label htmlFor="dashboard-sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>
    </div>
  );
}

export default AppDashboard;