import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const defaultImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const siteUrl = "https://mazdaweb.bejalen.com";

const pageTitles = {
  "/": "Beranda",
  "/tentang": "Tentang Saya",
  "/sertifikasi": "Sertifikasi",
  "/donasi": "Donasi",
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
    }
    else if (pageTitles[pathname]) {
      setActiveSection(pageTitles[pathname]);
    } else {
      setActiveSection("");
    }
  }, [hash, pathname]);

  const canonicalUrl = `${siteUrl}${pathname}`;

  const pageTitle =
    activeSection || title
      ? `${activeSection || title} | ${siteData.brandNameShort}`
      : `${siteData.brandNameShort} - ${siteData.jobTitle}`;

  const dynamicDescription = useMemo(() => {
    if (description) return description;

    const fullAbout = siteData?.aboutParagraph || "";

    if (pathname === "/tentang") {
      return fullAbout.substring(0, 300); 
    }

    const firstSentence = fullAbout.split(".")[0];
    const shortDesc = firstSentence
      ? firstSentence + "."
      : `Portofolio ${siteData.brandName}.`;

    return `${shortDesc} ${
      siteData.jobTitle
    } berbasis di ${siteData.location.replace("Powered by ", "")}.`;
  }, [description, siteData, pathname]);

  const pageImage = imageUrl || defaultImageUrl;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={dynamicDescription} />

      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index, follow" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteData.brandNameShort} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Schema WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteData.brandNameShort,
          url: siteUrl,
          description: dynamicDescription,
          author: {
            "@type": "Person",
            name: siteData.brandNameShort,
          },
        })}
      </script>
    </Helmet>
  );
}

export default SeoHelmet;
