import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import ThemeSwitcher from "../ThemeSwitcher";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { useSiteStore } from "../../stores/siteStore";

function Header() {
  const location = useLocation();
  const siteData = useSiteStore((state) => state.siteData);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, handleSignOut } = useAuth();

  const isAdmin = user && (user.role === "admin" || user.role === "superAdmin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/#home", text: "Beranda", icon: "mdi:home" },
    { to: "/#histori", text: "Histori", icon: "mdi:history" },
    { to: "/#skills", text: "Kemampuan", icon: "mdi:tools" },
    { to: "/#galeri", text: "Galeri", icon: "mdi:image-multiple" },
    { to: "/#kontak", text: "Kontak Saya", icon: "mdi:email" },
  ];

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${isScrolled ? "py-4" : "py-0"
      }`}>
      <header
        className={`mx-auto transition-all duration-500 ease-in-out ${isScrolled
          ? "w-[92%] md:w-[88%] lg:w-[85%] max-w-7xl rounded-full border border-base-content/10 bg-base-100/70 backdrop-blur-md shadow-lg py-2 px-6 mt-3"
          : "w-[92%] md:w-[88%] lg:w-[85%] max-w-7xl bg-transparent py-4 px-2"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <a href="/" className="flex items-center gap-2 group w-fit">
              <div className={`rounded-2xl bg-gradient-to-br from-accent to-primary text-primary-content flex items-center justify-center font-black transition-all duration-500 ${isScrolled ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg"
                }`}>
                {siteData?.brandName?.charAt(0) || "M"}
              </div>
              <span className={`font-display font-black tracking-tighter transition-all duration-500 ${isScrolled ? "text-base" : "text-xl"
                }`}>
                {siteData?.brandName || "Mazda"}
              </span>
            </a>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-base-200/50 p-1 rounded-full border border-base-content/5">
            {navLinks.map((link) => {
              const isAtHome = location.pathname === "/";
              const isActive = isAtHome && (
                location.hash === link.to.replace("/", "") ||
                (location.hash === "" && link.to === "/#home")
              );

              return (
                <HashLink
                  key={link.to}
                  to={link.to}
                  smooth
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                    ? "bg-primary text-primary-content shadow-md shadow-primary/20 scale-105"
                    : "text-base-content hover:bg-primary/10 hover:text-primary"
                    }`}
                >
                  {link.text}
                </HashLink>
              );
            })}
          </nav>

          <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
            <ThemeSwitcher />

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-2 border-primary/20 hover:border-primary transition-colors">
                  <div className="w-9 rounded-full">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.fullName} />
                    ) : (
                      <div className="bg-primary text-primary-content flex items-center justify-center h-full text-xs font-bold">
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </label>
                <ul tabIndex={0} className="mt-4 z-[1] p-2 shadow-2xl menu menu-md dropdown-content bg-base-100 rounded-2xl w-64 border border-base-content/10 animate-fade-in-up">
                  <li className="menu-title px-4 py-3 border-b border-base-content/5 mb-2 text-xs opacity-50 uppercase font-bold text-base-content">Akun Saya</li>
                  <li>
                    <Link to="/profil" className="flex items-center gap-3 py-3 rounded-xl hover:bg-primary/10 font-bold">
                      <Icon icon="solar:user-circle-bold-duotone" className="w-5 h-5 text-primary" />
                      Profil
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/dashboard" className="flex items-center gap-3 py-3 rounded-xl hover:bg-secondary/10 font-bold text-secondary">
                        <Icon icon="solar:widget-5-bold-duotone" className="w-5 h-5 text-secondary" />
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <div className="divider my-1 opacity-10"></div>
                  <li>
                    <button onClick={handleSignOut} className="flex items-center gap-3 py-3 rounded-xl text-error hover:bg-error/10 font-bold">
                      <Icon icon="solar:logout-3-bold-duotone" className="w-5 h-5" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : null}

            <div className="dropdown dropdown-end lg:hidden">
              <label tabIndex={0} className="btn btn-ghost btn-circle border border-base-content/10">
                <Icon icon="solar:hamburger-menu-linear" className="w-6 h-6" />
              </label>
              <ul tabIndex={0} className="menu menu-md dropdown-content mt-4 z-[1] p-3 shadow-2xl bg-base-100 rounded-2xl w-60 border border-base-content/10">
                {navLinks.map((link) => {
                  const isAtHome = location.pathname === "/";
                  const isActive = isAtHome && (
                    location.hash === link.to.replace("/", "") ||
                    (location.hash === "" && link.to === "/#home")
                  );
                  return (
                    <li key={link.to}>
                      <HashLink to={link.to} smooth className={`font-bold py-3 ${isActive ? "bg-primary/10 text-primary" : ""}`}>
                        <Icon icon={link.icon} className={`w-5 h-5 ${isActive ? "text-primary" : "opacity-60"}`} />
                        {link.text}
                      </HashLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;