import React from "react";
import { Icon } from "@iconify/react";
import { NavLink, Link } from "react-router-dom";
import { useSiteStore } from "../../stores/siteStore";
import { useAuth } from "../../hooks/useAuth";

export const menuItems = [
  { name: "Beranda", icon: "mdi:home-outline", path: "/dashboard" },
  { name: "Data Saya", icon: "mdi:database-edit-outline", path: "/dashboard/sitedata" },
  { name: "Landing Page", icon: "material-symbols:page-menu-ios-rounded", path: "/dashboard/configuration" },
  { name: "Edit Galeri", icon: "mdi:image-multiple-outline", path: "/dashboard/galeriedit" },
  { name: "Edit Sertifikat", icon: "ph:certificate", path: "/dashboard/sertifikatsaya" },
  { name: "Data Pengguna dan Editor", icon: "solar:shield-user-bold-duotone", path: "/dashboard/adminuser", role: "superAdmin" },
];

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        `flex items-center gap-4 px-4 py-3.5 rounded-2xl font-headings font-bold text-sm tracking-tight transition-all duration-300 group ${isActive
          ? "bg-gradient-to-br from-accent to-primary text-base-100/85 shadow-md shadow-primary/20 scale-[1.01]"
          : "text-base-content/70 hover:bg-base-200 hover:text-base-content hover:translate-x-1"
        }`
      }
    >
      <Icon icon={icon} className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
      <span>{label}</span>
    </NavLink>
  );
};

function Sidebar() {
  const siteData = useSiteStore((state) => state.siteData);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const allowedMenuItems = menuItems.filter((item) => {
    if (!item.role) return true;
    return user?.role === item.role;
  });

  return (
    <div className="w-80 h-full min-h-screen lg:h-screen bg-base-100 border-r border-base-content/10 flex flex-col justify-between p-6 overflow-hidden select-none shrink-0">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-3.5 px-2 pb-6 border-b border-base-content/5 shrink-0">
          <div className="avatar">
            <a href="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-md shadow-primary/20">
              <div>
                <span className="font-display font-semibold text-lg text-black dark:text-white">
                  {siteData?.brandName ? siteData.brandName.charAt(0).toUpperCase() : "Vx"}
                </span>
              </div>
            </a>
          </div>
          <div>
            <span className="font-display font-semibold text-lg tracking-tight block leading-none">
              {siteData?.brandName || "webMazda.N"}
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-primary uppercase mt-1 block">
              Panel Kontrol
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-2 mt-6 overflow-y-auto custom-scrollbar px-2 flex-1">
          {allowedMenuItems.map((item) => (
            <NavItem key={item.path} to={item.path} icon={item.icon} label={item.name} />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-base-content/5 shrink-0 bg-base-100">
        <Link
          to="/profil"
          className="flex items-center gap-4 p-3 bg-base-200/50 hover:bg-base-200 rounded-2xl border border-base-content/5 transition-all duration-300 group"
        >
          <div className="avatar placeholder group-hover:scale-105 transition-transform">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-base-300 border border-base-content/10 flex items-center justify-center">
              {user?.avatarUrl || user?.profilePicture || user?.avatar || user?.image ? (
                <img
                  src={user?.avatarUrl || user?.profilePicture || user?.avatar || user?.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-black font-display text-lg">
                  <span>{user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}</span>
                </div>
              )}
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
          className="btn btn-error w-full text-base-100 rounded-2xl shadow-sm hover:shadow-md hover:shadow-error/20 transition-all duration-300 flex items-center justify-center gap-2"
          onClick={handleSignOut}
          title="Logout"
        >
          <Icon icon="lucide:log-out" className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wide">Logout Sistem</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;