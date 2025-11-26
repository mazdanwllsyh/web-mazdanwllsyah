import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const defaultImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const siteUrl = "https://mazdaweb.bejalen.com";

const pageTitles = {
  "/": "Website Portofolio",
  "/tentang": "Tentang Saya",
  "/sertifikasi": "Sertifikat yang dimiliki",
  "/donasi": "Donasi Yuk",
};

const sectionTitles = {
  "#home": "Beranda",
  "#histori": "Riwayat Hidup",
  "#skills": "Kemampuan yang dimiliki",
  "#galeri": "Galeri Proyek",
  "#kontak": "Kontak Saya",
};

function SeoHelmet({ title, description, imageUrl, url }) {
  const { siteData } = useAppContext();
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
      ? `${activeSection || title} | ${siteData.brandNameShort} (Newbie Front-End Developer)`
      : `${siteData.brandNameShort} - MERN Stack Developer Enthusiast`;

  const dynamicDescription = useMemo(() => {
    if (description) return description;

    const fullAbout = siteData?.aboutParagraph || "";

    let baseDesc = "";
    if (pathname === "/tentang") {
      baseDesc = fullAbout.substring(0, 250);
    } else {
      const firstSentence = fullAbout.split(".")[0];
      baseDesc = firstSentence ? firstSentence + "." : `Portofolio ${siteData.brandName}.`;
    }

    return `${baseDesc} Fresh Graduate S1 - Teknik Informatika USM. Dikenal sebagai Mazda Nawallsyah or Milord de Rafford a.k.a Mazda Bejalen.`;
  }, [description, siteData, pathname]);

  const pageImage = imageUrl || defaultImageUrl;

  const keywordsList = [
    "Mazda Nawallsyah",
    "Nawallsyah",
    "MERN Stack Enthusiast",
    "G.211.21.0082",
    "G211210082",
    "Milord de Rafford",
    "Mas mas Ambarawa",
    "Mazda Bejalen",
    "MERN Mazda",
    "Frontend Developer",
    "Fresh Graduate Universitas Semarang",
    "Teknik Informatika USM"
  ].join(", ");

  const schemaPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": siteData.brandNameShort,
    "alternateName": ["Nawallsyah", "Milord de Rafford", "Mas mas Ambarawa", "Mazda Bejalen"],
    "identifier": "G.211.21.0082",
    "jobTitle": siteData.jobTitle,
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Universitas Semarang (USM)"
    },
    "url": siteUrl,
    "description": dynamicDescription
  };

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={dynamicDescription} />

      <meta name="keywords" content={keywordsList} />

      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteData.brandNameShort} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={pageImage} />

      <script type="application/ld+json">
        {JSON.stringify(schemaPerson)}
      </script>
    </Helmet>
  );
}

export default SeoHelmet;