import React, { useEffect, useState, useMemo } from "react";
import { useSiteStore } from "../stores/siteStore";
import { useLocation } from "react-router-dom";

const defaultImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const siteUrl = "https://mazdaweb.bejalen.com";

const pageTitles = {
  "/": "",
  "/tentang": "Tentang",
  "/sertifikasi": "Sertifikasi",
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

  const pageTitle =
    activeSection || title
      ? `${activeSection || title} — ${siteData.brandName} | Frontend Developer`
      : `Mazda Nawallsyah — Frontend Developer`;

  const dynamicDescription = useMemo(() => {
    if (description) return description;

    const fullAbout = siteData?.aboutParagraph || "";
    let baseDesc = "";

    if (pathname === "/tentang") {
      baseDesc = fullAbout.substring(0, 200);
    } else {
      const firstSentence = fullAbout.split(".")[0];
      baseDesc = firstSentence ? firstSentence + "." : `Portofolio resmi ${siteData.brandName}.`;
    }

    return `${baseDesc} Menghadirkan pengalaman pengguna (UX) yang optimal dan antarmuka (UI) modern menggunakan teknologi React.js dan ekosistem MERN Stack.`;
  }, [description, siteData, pathname]);

  const pageImage = imageUrl || defaultImageUrl;

  const keywordsList = [
    "Mazda Nawallsyah",
    "Nawallsyah",
    "Mazda Bejalen",
    "Frontend Developer",
    "React.js Developer",
    "Portofolio Mazda",
    "MERN Stack",
    "Web Developer Ambarawa",
    "Frontend Engineer"
  ].join(", ");

  const schemaPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mazda Nawallsyah",
    "alternateName": "Nawallsyah",
    "jobTitle": "Frontend Web Developer",
    "image": pageImage,
    "url": siteUrl,
    "description": "Seorang Frontend Web Developer yang berfokus pada pengembangan aplikasi modern dengan React.js."
  };

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={dynamicDescription} />
      <meta name="keywords" content={keywordsList} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />

      <meta property="og:type" content="profile" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Mazda Nawallsyah Portfolio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={pageImage} />

      <script type="application/ld+json">
        {JSON.stringify(schemaPerson)}
      </script>
    </>
  );
}

export default SeoHelmet;