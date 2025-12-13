import React from "react";
import { Icon } from "@iconify/react";
import { NavLink, Link } from "react-router-dom";
import { useSiteStore } from "../../stores/siteStore";
import { useAuth } from "../../hooks/useAuth";
import ThemeSwitcher from "../ThemeSwitcher";

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
    icon: "fa7-solid:user-cog",
    path: "/dashboard/adminuser",
  },
];

function Sidebar({ isExpanded, setIsExpanded }) {
  const siteData = useSiteStore((state) => state.siteData); 
  const { handleSignOut, user } = useAuth();
  const getNavLinkClass = ({ isActive }) =>
    `flex items-center justify-center p-3 my-1 rounded-lg transition-colors duration-200 ${isActive
      ? "bg-accent text-accent-content hover:bg-accent-focus"
      : "bg-primary text-primary-content hover:bg-primary-focus"
    }`;

  return (
    <div className="flex bg-base-200 h-full flex-col justify-between">
      <div>
        <div
          className={`flex items-center p-4 ${isExpanded ? "justify-between" : "justify-center"
            }`}
        >
          {isExpanded && (
            <a
              href="/"
              className="btn btn-ghost text-xl font-display normal-case px-0 hover:bg-transparent"
            >
              {siteData.brandName}
            </a>
          )}

          <button
            className="btn btn-ghost btn-circle hidden lg:flex"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon
              icon={isExpanded ? "mdi:chevron-left" : "mdi:chevron-right"}
              className="h-6 w-6"
            />
          </button>
        </div>

        <div className={`flex px-3 pb-2 justify-center`}>
          <ThemeSwitcher />
        </div>

        <nav className="px-3 pt-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink to={item.path} className={getNavLinkClass} end>
                  <Icon icon={item.icon} className="h-6 w-6 shrink-0" />
                  {isExpanded && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-3">
        {user && (
          <Link
            to="/profil"
            className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 hover:bg-base-300 my-2 ${isExpanded ? "w-full" : "w-auto justify-center"
              }`}
            title={isExpanded ? "Ke Halaman Profil" : user.fullName}
          >
            <div className="avatar">
              <div className="w-15 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary text-primary-content">
                    <span className="text-xl font-display">
                      {user.fullName ? user.fullName.charAt(0) : "A"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="overflow-hidden whitespace-nowrap">
                <span className="truncate text-sm font-bold block">
                  {user.fullName}
                </span>
              </div>
            )}
          </Link>
        )}

        <button
          onClick={handleSignOut}
          className={`btn w-full ${isExpanded ? "btn-error" : "btn-error btn-square"
            }`}
        >
          <Icon icon="mdi:logout" className="h-6 w-6" />
          {isExpanded && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
