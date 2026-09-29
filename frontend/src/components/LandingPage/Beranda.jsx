import React, { Suspense, lazy, useMemo } from "react";
import SEO from "../../components/SEO";
import Hero from "../../components/LandingPage/Hero";
import History from "../../components/LandingPage/History";
import Skills from "../../components/LandingPage/Skills";
import { isBot } from "../../App";
import { useSiteStore } from "../../stores/siteStore";

const Gallery = lazy(() => import("../../components/LandingPage/Gallery"));
const Kontak = lazy(() => import("../../components/LandingPage/Kontak"));

function Beranda() {
  const siteData = useSiteStore((state) => state.siteData);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Portofolio Mazda Nawallsyah",
    "url": "https://mazdaweb.bejalen.com/",
    "publisher": {
      "@type": "Person",
      "name": siteData?.fullName || "Mazda Nawallsyah",
      "jobTitle": siteData?.jobTitle || "Frontend Web Developer",
      "image": siteData?.profileImages?.[0] || ""
    },
    "description": "Portofolio pribadi Mazda Nawallsyah seorang Frontend Web Developer yang berbasis di Ambarawa, Jawa Tengah. Berfokus pada pembuatan website profesional, modern, intuitif, dan responsif.",
    "inLanguage": "id-ID",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mazdaweb.bejalen.com/?s={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }), [siteData]);

  return (
    <>
      <SEO
        title="Beranda"
        description="Portofolio pribadi Mazda Nawallsyah seorang Frontend Web Developer yang berbasis di Ambarawa, Jawa Tengah, Indonesia. Menyediakan website profesional, modern, intuitif, dan responsif."
        url="/"
        structuredData={structuredData}
      />
      <Hero />
      <History />
      <Skills />
      {isBot ? (
        <>
          <Gallery />
          <Kontak />
        </>
      ) : (
        <Suspense fallback={null}>
          <Gallery />
          <Kontak />
        </Suspense>
      )}
    </>
  );
}

export default Beranda;