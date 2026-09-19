import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import ThemeSwitcher from "../ThemeSwitcher";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { useSiteStore } from "../../stores/siteStore";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";

function Header() {
  const location = useLocation();
  const siteData = useSiteStore((state) => state.siteData);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(location.hash || "#home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, handleSignOut } = useAuth();
  const isAdmin = user && (user.role === "admin" || user.role === "superAdmin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["#home", "#histori", "#skills", "#galeri", "#kontak"];
      let currentActive = activeSection;

      for (const section of sections) {
        const element = document.querySelector(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentActive = section;
          }
        }
      }

      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollWithOffset = (el) => {
    const headerOffset = 55;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/#home", text: "Beranda", icon: "mdi:home" },
    { to: "/#histori", text: "Histori", icon: "mdi:history" },
    { to: "/#skills", text: "Kemampuan", icon: "mdi:tools" },
    { to: "/#galeri", text: "Galeri", icon: "mdi:image-multiple" },
    { to: "/#kontak", text: "Kontak Saya", icon: "mdi:email" },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        layout
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-[100]"
      >
        <m.header
          layout
          initial={false}
          animate={{
            paddingTop: isScrolled ? "0.5rem" : "1rem",
            paddingBottom: isScrolled ? "0.5rem" : "1rem",
            paddingLeft: isScrolled ? "1.5rem" : "0.5rem",
            paddingRight: isScrolled ? "1.5rem" : "0.5rem",
            marginTop: isScrolled ? "0.75rem" : "0rem",
            backgroundColor: isScrolled ? "var(--fallback-b1,oklch(var(--b1)/0.7))" : "transparent",
            borderColor: isScrolled ? "var(--fallback-bc,oklch(var(--bc)/0.1))" : "transparent",
            borderRadius: isScrolled ? "9999px" : "0px",
            boxShadow: isScrolled ? "0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 0 10px -2px rgba(0,0,0,0.05)" : "none",
            backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
            width: isScrolled ? "92%" : "92%",
            maxWidth: "72rem",
            borderBottom: isScrolled ? "1px solid var(--fallback-p,oklch(var(--p)/0.2))" : "1px solid transparent"
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto border-t-0 border-l-0 border-r-0"
        >
          <div className="flex items-center justify-between relative">
            <div className="flex-1">
              <a href="/" className="flex items-center gap-2 group w-fit overflow-hidden">
                <m.div
                  layout
                  initial={false}
                  animate={{
                    width: isScrolled ? "2.25rem" : "2.75rem",
                    height: isScrolled ? "2.25rem" : "2.75rem",
                    fontSize: isScrolled ? "0.875rem" : "1.125rem",
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl bg-gradient-to-br from-accent to-primary text-base-100 flex items-center justify-center font-black shrink-0"
                >
                  {siteData?.brandName?.charAt(0) || "M"}
                </m.div>
                <m.span
                  layout
                  initial={false}
                  animate={{
                    fontSize: isScrolled ? "1.125rem" : "1.25rem",
                    opacity: isScrolled ? 0.9 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display font-black tracking-tighter whitespace-nowrap"
                >
                  {siteData?.brandName || "Mazda"}
                </m.span>
              </a>
            </div>

            <nav className="hidden xl:flex items-center gap-1 bg-base-200/50 p-1 rounded-full border border-base-content/5 relative shadow-inner">
              {navLinks.map((link) => {
                const isAtHome = location.pathname === "/";
                const isActive = isAtHome && (
                  activeSection === link.to.replace("/", "") ||
                  (activeSection === "#home" && link.to === "/#home")
                );

                return (
                  <HashLink
                    key={link.to}
                    to={link.to}
                    scroll={(el) => scrollWithOffset(el)}
                    className="relative px-5 py-2 rounded-full text-sm font-bold z-10"
                  >
                    <span className={`relative z-20 ${isActive ? "text-primary-content" : "text-base-content hover:text-primary transition-colors"}`}>
                      {link.text}
                    </span>
                    {isActive && (
                      <m.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-full shadow-[0_0_12px_rgba(var(--p),0.4)] z-10"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </HashLink>
                );
              })}
            </nav>

            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              <ThemeSwitcher />

              {user && (
                <div className="relative">
                  <m.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="btn btn-ghost btn-circle avatar border-2 border-primary/20 hover:border-primary transition-colors"
                  >
                    <div className="w-9 rounded-full overflow-hidden bg-base-200">
                      {user.profilePicture && user.profilePicture !== "null" && user.profilePicture.trim() !== "" ? (
                        <img src={user.profilePicture} alt={user.fullName} className="object-cover w-full h-full" />
                      ) : (
                        <div className="bg-primary text-primary-content flex items-center justify-center h-full w-full text-xs font-bold">
                          {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </m.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <m.ul
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className="absolute right-0 mt-4 z-50 p-2 shadow-2xl menu menu-md bg-base-100 rounded-2xl w-64 border border-base-content/10 origin-top-right backdrop-blur-md bg-opacity-95"
                        >
                          <li className="menu-title px-4 py-3 border-b border-base-content/30 mb-2 text-xs opacity-50 uppercase font-bold text-base-content text-end">
                            {user?.fullName || "Akun Saya"}
                          </li>
                          <li>
                            <Link
                              to="/profil"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 py-3 rounded-xl hover:bg-primary/10 font-bold"
                            >
                              <Icon
                                icon="solar:user-circle-bold-duotone"
                                className="w-5 h-5 text-primary"
                              />
                              Profil
                            </Link>
                          </li>
                          {isAdmin && (
                            <li>
                              <Link
                                to="/dashboard"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 py-3 rounded-xl hover:bg-secondary/10 font-bold text-secondary"
                              >
                                <Icon
                                  icon="solar:widget-5-bold-duotone"
                                  className="w-5 h-5 text-secondary"
                                />
                                Dashboard
                              </Link>
                            </li>
                          )}
                          <div className="h-[1px] bg-base-content/10 my-1 mx-2"></div>
                          <li>
                            <button
                              onClick={() => {
                                handleSignOut();
                                setIsDropdownOpen(false);
                              }}
                              className="flex items-center gap-3 py-3 rounded-xl text-error hover:bg-error/10 font-bold"
                            >
                              <Icon
                                icon="solar:logout-3-bold-duotone"
                                className="w-5 h-5"
                              />
                              Logout
                            </button>
                          </li>
                        </m.ul>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="relative xl:hidden">
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="btn btn-ghost btn-circle border border-base-content/10"
                >
                  <Icon icon="solar:hamburger-menu-linear" className="w-6 h-6" />
                </m.button>

                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                      <m.ul
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute right-0 mt-4 z-50 p-3 shadow-2xl bg-base-100/95 backdrop-blur-md rounded-2xl w-60 border border-base-content/10 origin-top-right menu menu-md"
                      >
                        {navLinks.map((link) => {
                          const isAtHome = location.pathname === "/";
                          const isActive = isAtHome && activeSection === link.to.replace("/", "");
                          return (
                            <li key={link.to}>
                              <HashLink
                                to={link.to}
                                scroll={(el) => scrollWithOffset(el)}
                                className={`font-bold py-3 rounded-xl ${isActive ? "bg-primary/10 text-primary" : "hover:bg-base-200"}`}
                              >
                                <Icon
                                  icon={link.icon}
                                  className={`w-5 h-5 ${isActive ? "text-primary" : "opacity-60"}`}
                                />
                                {link.text}
                              </HashLink>
                            </li>
                          );
                        })}
                      </m.ul>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </m.header>
      </m.div>
    </LazyMotion>
  );
}

export default Header;