import React from "react";
import { Icon } from "@iconify/react";
import { NavLink, Link } from "react-router-dom";
import { useSiteStore } from "../../stores/siteStore";
import { useAuth } from "../../hooks/useAuth";

export const menuItems = [
  { name: "Beranda", icon: "mdi:home-outline", path: "/dashboard" },
  {
    name: "Data Saya",
    icon: "mdi:database-edit-outline",
    path: "/dashboard/sitedata",
  },
  {
    name: "Landing Page",
    icon: "material-symbols:page-menu-ios-rounded",
    path: "/dashboard/configuration",
  },
  {
    name: "Edit Galeri",
    icon: "mdi:image-multiple-outline",
    path: "/dashboard/galeriedit",
  },
  {
    name: "Edit Sertifikat",
    icon: "ph:certificate",
    path: "/dashboard/sertifikatsaya",
  },
  {
    name: "Data Pengguna dan Editor",
    icon: "solar:shield-user-bold-duotone",
    path: "/dashboard/adminuser",
    role: "superAdmin",
  },
];

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        `group flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ease-in-out font-medium
        ${isActive
          ? "bg-primary text-primary-content shadow-md shadow-primary/20"
          : "text-base-content hover:bg-primary/10 hover:text-primary"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex-none relative">
            <Icon
              icon={icon}
              className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-primary-content" : "opacity-70 group-hover:opacity-100"
                }`}
            />
          </div>
          <span className="font-display font-bold text-sm flex-1 truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
};

function Sidebar() {
  const siteData = useSiteStore((state) => state.siteData);
  const { handleSignOut, user } = useAuth();

  const filteredMenu = menuItems.filter((item) => {
    if (item.role === "superAdmin") return user?.role === "superAdmin";
    return true;
  });

  return (
    <div className="menu p-4 w-[280px] min-h-screen bg-base-100 border-r border-base-content/10 flex flex-col justify-between z-50 shadow-2xl lg:shadow-none">
      <div>
        <a href="/" className="flex justify-start items-center mb-8 px-2 gap-4 mt-2 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/30">
            {siteData?.brandNameShort ? siteData.brandNameShort.charAt(0).toUpperCase() : "M"}
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-xl font-display font-black text-base-content truncate w-full tracking-tight">
              {siteData?.brandNameShort || "Portfolio"}
            </span>
            <span className="text-primary font-bold text-[10px] tracking-widest uppercase mt-0.5">
              Admin Panel
            </span>
          </div>
        </a>

        <ul className="space-y-2">
          {filteredMenu.map((item) => (
            <li key={item.path}>
              <NavItem to={item.path} icon={item.icon} label={item.name} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4 space-y-3">
        <div className="border-t border-base-content/10 my-4"></div>
        <div className="flex flex-col gap-2 pb-2">

          <Link
            to="/profile"
            className="flex items-center gap-3 bg-base-200/50 hover:bg-base-200 px-3 py-3 rounded-2xl border border-base-content/5 transition-colors w-full group"
          >
            <div className="avatar placeholder">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black font-display text-lg shadow-sm group-hover:bg-primary group-hover:text-primary-content transition-colors">
                <span>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-bold font-display text-sm text-base-content truncate">
                {user?.fullName || "Admin User"}
              </div>
              <div className="text-[10px] text-primary font-extrabold truncate uppercase tracking-wider mt-0.5">
                {user?.role === "superAdmin" ? "Super Admin" : "Editor"}
              </div>
            </div>
          </Link>

          <button
            type="button"
            className="btn btn-error w-full text-white rounded-2xl shadow-sm hover:shadow-md hover:shadow-error/20 transition-all duration-300 flex items-center justify-center gap-2"
            onClick={handleSignOut} 
            title="Logout"
          >
            <Icon icon="lucide:log-out" className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">Keluar Sistem</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;