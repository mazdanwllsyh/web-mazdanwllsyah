// src/components/LandingPage/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import ThemeSwitcher from "../ThemeSwitcher";
import { Icon } from "@iconify/react";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "../../context/UserContext";

function Header() {
  const { siteData } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, handleSignOut } = useUser();

  const isAdmin = user && (user.role === "admin" || user.role === "superAdmin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 125);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { to: "/#home", text: "Beranda", icon: "mdi:home" },
    { to: "/#skills", text: "Kemampuan", icon: "mdi:tools" },
    { to: "/#galeri", text: "Galeri", icon: "mdi:image-multiple" },
    { to: "/#kontak", text: "Kontak Saya", icon: "mdi:email" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-shadow duration-300 ease-in-out bg-base-100/70 backdrop-blur-md ${
        isScrolled ? "shadow-md" : "border-b-1 border-base-300 shadow-none"
      }`}
    >
      <div className="navbar container mx-auto md:px-6 lg:px-12">
        <div className="navbar-start">
          <Link
            to="/"
            className="btn btn-ghost text-xl font-display normal-case px-0 hover:bg-transparent"
          >
            {siteData.brandName}
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <div className="flex items-center space-x-2">
            {navLinks.map((link) => (
              <HashLink
                key={link.to}
                to={link.to}
                smooth
                className={`font-base px-3 py-2 flex items-center gap-1 relative rounded-md hover:bg-transparent
                           after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full
                           after:origin-bottom-left after:scale-x-0 after:bg-neutral
                           after:transition-transform after:duration-400 after:ease-out
                           hover:after:scale-x-100`}
              >
                <Icon icon={link.icon} className="w-4 h-4" />
                {link.text}
              </HashLink>
            ))}
          </div>
        </div>
        <div className="navbar-end flex items-center">
          <div className="mx-4">
            <ThemeSwitcher />
          </div>

          {/* JIKA SUDAH LOGIN (user ada) */}
          {user && (
            <div className="dropdown dropdown-end ml-1">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Foto Profil" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-base-300">
                      <Icon icon="mdi:account" className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 items-center"
              >
                {/* 1. Tombol Profil (Style disamakan) */}
                <li className="w-full">
                  <Link
                    to="/profil"
                    className="font-semibold flex items-center justify-center gap-2 py-2 w-full"
                  >
                    <Icon icon="mdi:user-circle-outline" className="w-4 h-4" />
                    Profil
                  </Link>
                </li>

                {/* 2. Tombol Dashboard (Style disamakan) */}
                {isAdmin && (
                  <li className="w-full">
                    <Link
                      to="/dashboard"
                      className="font-semibold flex items-center justify-center gap-2 py-2 w-full"
                    >
                      <Icon
                        icon="mdi:view-dashboard-outline"
                        className="w-4 h-4"
                      />
                      Dashboard
                    </Link>
                  </li>
                )}

                <div className="divider my-1 px-2"></div>

                {/* 4. Tombol Logout (Style disamakan + text-error) */}
                <li className="w-full">
                  <button
                    onClick={handleSignOut}
                    className="font-semibold flex items-center justify-center gap-2 py-2 w-full text-error"
                  >
                    <Icon icon="mdi:logout" className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Hamburger Menu (Hanya di mobile) */}
          <div className="dropdown dropdown-end lg:hidden ml-1">
            <label tabIndex={0} className="btn btn-ghost px-2">
              <Icon icon="solar:hamburger-menu-bold" className="w-6 h-6" />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 items-center"
            >
              {navLinks.map((link) => (
                <li key={link.to} className="w-full">
                  <HashLink
                    to={link.to}
                    smooth
                    className={`flex items-center justify-center gap-2 py-2 w-full`}
                  >
                    <Icon icon={link.icon} className="w-4 h-4" />
                    {link.text}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
