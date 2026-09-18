import React, { useEffect, useState, useMemo } from "react";
import { useSiteStore } from "../stores/siteStore";
import { useLocation } from "react-router-dom";

const defaultImageUrl = "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";
const siteUrl = "https://mazdaweb.bejalen.com";

const pageTitles = {
  "/tentang": "Tentang",
  "/sertifikasi": "Sertifikat yang didapat",
  "/donasi": "Donasi",
};

const sectionTitles = {
  "#home": "Beranda",
  "#histori": "Riwayat Karir",
  "#skills": "Keahlian",
  "#galeri": "Portofolio",
  "#kontak": "Kontak",
};

function SeoHelmet({ title, description, imageUrl, url }) {
  const siteData = useSiteStore((state) => state.siteData);
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("");
  const hash = location.hash?.toLowerCase();
  const pathname = location.pathname;

  useEffect(() => {
    if (hash && sectionTitles[hash]) {
      setActiveSection(sectionTitles[hash]);
    } else if (pageTitles[pathname]) {
      setActiveSection(pageTitles[pathname]);
    } else {
      setActiveSection("");
    }
  }, [hash, pathname]);

  const canonicalUrl = `${siteUrl}${pathname}`;
  const pageTitle = `${activeSection || title || "Beranda"} — ${siteData?.brandNameShort || "Mazda N."} | Frontend Developer`;

  const dynamicDescription = useMemo(() => {
    if (description) return description;
    const fullAbout = siteData?.aboutParagraph || "";
    const firstSentence = fullAbout.split(".")[0];
    return pathname === "/tentang"
      ? fullAbout.substring(0, 160)
      : `${firstSentence ? firstSentence + "." : `Portofolio resmi ${siteData?.brandName || "Mazda"}.`} Menghadirkan pengalaman pengguna (UX) yang optimal dengan MERN Stack.`;
  }, [description, siteData, pathname]);

  const pageImage = imageUrl || defaultImageUrl;
  const isRootPage = pathname === "/";

  const schemaMarkup = useMemo(() => {
    if (isRootPage) {
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteData?.brandNameShort || "Mazda Nawallsyah",
        "alternateName": [
          "Portofolio Mazda",
          "Nawallsyah",
          "Shahclyffe",
          "Rafford",
          "VOXELIX"
        ],
        "url": siteUrl
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": "Mazda Nawallsyah",
        "jobTitle": "Frontend Web Developer",
        "image": pageImage,
        "url": canonicalUrl,
      }
    };
  }, [isRootPage, pageImage, canonicalUrl, siteData]);

  return (
    <>
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />

      {!isRootPage && (
        <>
          <title>{pageTitle}</title>
          <meta name="description" content={dynamicDescription} />
        </>
      )}

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={isRootPage ? "website" : "profile"} />
      <meta property="og:title" content={isRootPage ? "Mazda Nawallsyah — Frontend Developer" : pageTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteData?.brandName || "Mazda Nawallsyah"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={isRootPage ? "Mazda Nawallsyah — Frontend Developer" : pageTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={pageImage} />

      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    </>
  );
}

export default SeoHelmet;