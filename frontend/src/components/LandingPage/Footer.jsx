import React from "react";
import { Icon } from "@iconify/react";
import { useSiteStore } from "../../stores/siteStore";
import { Link } from "react-router-dom";

const socialLinkConfig = [
  {
    key: "instagram",
    label: "Instagram",
    icon: "mdi:instagram",
    baseUrl: "https://instagram.com/",
  },
  {
    key: "github",
    label: "GitHub",
    icon: "mdi:github",
    baseUrl: "https://github.com/",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "mdi:linkedin",
    baseUrl: "https://linkedin.com/in/",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "mdi:whatsapp",
    baseUrl: "https://wa.me/",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: "mdi:telegram",
    baseUrl: "https://t.me/",
  },
];

function Footer() {
  const siteData = useSiteStore((state) => state.siteData);
  const currentYear = new Date().getFullYear();

  const availableLinks = siteData?.contactLinks || {};

  return (
    <>
      <footer className="py-10 bg-base-200 text-base-content rounded-t-4xl border-t-2 border-base-300 w-full">
        <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 xl:grid-cols-3 gap-8 place-items-center xl:place-items-start items-start">
          <aside className="flex flex-col items-center xl:items-start w-full">
            <p className="text-2xl font-bold font-display text-center xl:text-start mb-2">
              {siteData.brandNameShort}
            </p>
            <a
              href="https://bejalen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary hover:underline transition-colors text-center xl:text-left"
            >
              {siteData.location}
            </a>
          </aside>

          <nav className="flex flex-col items-center space-y-4 w-full">
            <p className="font-bold text-center">Contact Me</p>
            <div className="flex justify-center gap-4 w-full">
              {socialLinkConfig
                .filter((link) => availableLinks[link.key])
                .map((link) => {
                  const handle = availableLinks[link.key];
                  const fullUrl = link.baseUrl + handle;
                  return (
                    <a
                      key={link.key}
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      className="hover:text-primary transition-colors duration-200"
                    >
                      <Icon icon={link.icon} className="w-6 h-6" />
                    </a>
                  );
                })}
            </div>
          </nav>

          <nav className="flex flex-col items-center xl:items-end w-full space-y-2">
            <Link to="/tentang" className="link link-hover font-medium">
              Tentang Saya
            </Link>
            <Link to="/sertifikasi" className="link link-hover font-medium">
              Sertifikasi
            </Link>
            <Link to="/donasi" className="link link-hover font-medium">
              Donasi
            </Link>
          </nav>
        </div>
      </footer>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <h3 className="font-bold text-sm text-center">
            © 2025 - {currentYear} All right reserved by Mazda Nawallsyah.
          </h3>
        </aside>
      </footer>
    </>
  );
}

export default Footer;
