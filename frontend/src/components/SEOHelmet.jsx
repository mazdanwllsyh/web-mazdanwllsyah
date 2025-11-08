import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const defaultImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const siteUrl = "https://mazdaweb.bejalen.com";

const sectionTitles = {
  "#home": "Beranda",
  "#histori": "History Mazda Nawallsyah",
  "#skills": "Kemampuan yang Dimiliki Mazda Nawalllsyah",
  "#galeri": "Galeri Proyek",
  "#kontak": "Kontak Mazda Nawallsyah",
};

function SeoHelmet({ title, description, imageUrl, url }) {
  const { siteData } = useAppContext();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("");
  const hash = location.hash?.toLowerCase();

  useEffect(() => {
    if (hash && sectionTitles[hash]) {
      setActiveSection(sectionTitles[hash]);
    } else {
      setActiveSection("");
    }
  }, [hash]);

  const canonicalUrl = `${siteUrl}/`;

  const pageTitle =
    activeSection || title
      ? `${activeSection || title} | ${siteData.brandNameShort}`
      : siteData.brandName;

  const pageDescription =
    description ||
    (activeSection
      ? `Halaman ${activeSection} dari portofolio ${siteData.brandName}.`
      : `Portofolio pribadi ${siteData.brandName}. ${siteData.jobTitle}.`);

  const pageImage = imageUrl || defaultImageUrl;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      <link rel="canonical" href={canonicalUrl} />

      <meta name="robots" content="index, follow" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteData.brandNameShort} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteData.brandNameShort,
          url: siteUrl,
          description: pageDescription,
        })}
      </script>
    </Helmet>
  );
}

export default SeoHelmet;
