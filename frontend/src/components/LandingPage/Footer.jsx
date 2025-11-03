import React from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../../context/AppContext";
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
  const { siteData } = useAppContext();
  const currentYear = new Date().getFullYear();

  const availableLinks = siteData.contactLinks;

  return (
    <>
      <footer className="footer py-5 footer-center bg-base-200 text-base-content rounded border-t-2 border-base-300">
        <aside>
          <p className="text-xl font-bold font-display">
            {siteData.brandNameShort}
          </p>
          <p className="font-semibold">{siteData.jobTitle}</p>
          <a
            href="https://bejalen.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary hover:underline transition-colors"
          >
            {siteData.location}
          </a>
        </aside>

        <nav>
          <p className="footer-title text-base-content font-bold">Contact Me</p>
          <div className="flex flex-wrap justify-center gap-4 w-35 md:w-auto md:flex-nowrap">
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

        <nav>
          <p className="footer-title text-base-content font-bold">Halaman</p>
          <Link to="/tentang" className="link link-hover">
            Tentang Saya
          </Link>
          <Link to="/sertifikasi" className="link link-hover">
            Sertifikasi
          </Link>
          <Link to="/donasi" className="link link-hover">
            Donasi
          </Link>
        </nav>
      </footer>

      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <h3 className="font-bold">
            © {currentYear} - All right reserved by Mazda Nawallsyah.
          </h3>
        </aside>
      </footer>
    </>
  );
}

export default Footer;
