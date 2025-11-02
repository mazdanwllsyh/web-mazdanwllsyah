import React from "react";
import { Helmet } from "react-helmet-async";
import { useAppContext } from "../context/AppContext";

const defaultImageUrl =
  "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp";

const siteUrl = "https://mazdaweb.bejalen.com";

function SeoHelmet({ title, description, imageUrl, url }) {
  const { siteData } = useAppContext();

  const pageTitle = title
    ? `${title} | ${siteData.brandNameShort}`
    : siteData.brandName;

  const pageDescription =
    description ||
    `Portofolio pribadi ${siteData.brandName}. ${siteData.jobTitle}.`;
  const pageImage = imageUrl || defaultImageUrl;
  const canonicalUrl = `${siteUrl}${url || "/"}`;

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
    </Helmet>
  );
}

export default SeoHelmet;
