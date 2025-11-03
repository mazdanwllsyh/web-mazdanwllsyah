import React, { useState, Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Sidebar, { menuItems } from "../components/Dashboard/Sidebar";
import Transition from "./Transition";
import { useUser } from "../context/UserContext";

const DashboardBeranda = lazy(() =>
  import(
    /* webpackChunkName: "chunk-dashboard-charts" */ "../components/Dashboard/DashboardBeranda"
  )
);
const DataSaya = lazy(() => import("../components/Dashboard/DataSaya"));
const KelolaKonten = lazy(() => import("../components/Dashboard/KelolaKonten"));
const EditGallery = lazy(() => import("../components/Dashboard/EditGallery"));
const EditSertifikat = lazy(() =>
  import(
    /* webpackChunkName: "chunk-dashboard-pdf" */ "../components/Dashboard/EditSertifikasi"
  )
);
const UserDashboard = lazy(() =>
  import("../components/Dashboard/UserDashboard")
);

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | Dashboard Mazda Nawallsyah`;
  }, [title]);
  return null;
};

function AppDashboard() {
  const [isExpanded, setIsExpanded] = useState(true);

  const location = useLocation();
  const { handleSignOut } = useUser();

  const expandedWidth = "w-60";
  const collapsedWidth = "lg:w-20";
  const expandedPadding = "lg:px-0";
  const collapsedPadding = "lg:px-5";

  const getTitle = (path) => {
    const item = menuItems.find((item) => item.path === path);
    return item ? item.name : "Beranda";
  };

  const currentTitle = getTitle(location.pathname);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div
        className={`drawer-content flex flex-col transition-all duration-300 ${
          isExpanded ? expandedPadding : collapsedPadding
        }`}
      >
        <div className="lg:hidden navbar fixed top-0 z-30 bg-base-100 shadow-md">
          {/* Tombol Hamburger (tidak berubah) */}
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary btn-square drawer-button"
            >
              <Icon icon="mdi:menu" className="h-6 w-6" />
            </label>
          </div>

          {/* Judul Dinamis */}
          <div className="flex-1 px-4">
            <h1 className="text-lg font-bold">{currentTitle}</h1>
          </div>

          <div className="flex-none">
            <button
              className="btn btn-error btn-square"
              onClick={handleSignOut}
              aria-label="Logout"
            >
              <Icon icon="mdi:logout" className="h-6 w-6" />
            </button>
          </div>
        </div>

        <main className="flex-1 p-6 pt-20 lg:pt-6">
          <Suspense fallback={<Transition isLoading={true} />}>
            <Routes>
              <Route
                index
                element={
                  <>
                    <PageTitle title={getTitle("/dashboard")} />
                    <DashboardBeranda />
                  </>
                }
              />
              <Route
                path="sitedata"
                element={
                  <>
                    <PageTitle title={getTitle("/dashboard/sitedata")} />
                    <DataSaya />
                  </>
                }
              />
              <Route
                path="configuration"
                element={
                  <>
                    <PageTitle title={getTitle("/dashboard/configuration")} />
                    <KelolaKonten />
                  </>
                }
              />
              <Route
                path="galeriedit"
                element={
                  <>
                    <PageTitle title={getTitle("/dashboard/galeriedit")} />
                    <EditGallery />
                  </>
                }
              />
              <Route
                path="sertifikatsaya"
                element={
                  <>
                    <PageTitle title={getTitle("/dashboard/sertifikatsaya")} />
                    <EditSertifikat />
                  </>
                }
              />
              <Route
                path="adminuser"
                element={
                  <>
                    <PageTitle title={getTitle("/dashboard/adminuser")} />
                    <UserDashboard />
                  </>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>

      <div className="drawer-side z-40">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div
          className={`bg-base-100 h-full overflow-y-auto transition-all duration-300 ${
            isExpanded ? expandedWidth : collapsedWidth
          }`}
        >
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>
      </div>
    </div>
  );
}

export default AppDashboard;
