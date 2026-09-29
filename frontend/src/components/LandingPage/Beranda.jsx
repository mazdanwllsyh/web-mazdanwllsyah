import React, { Suspense, lazy, useEffect, useMemo } from "react";
import SEO from "../../components/SEO";
import Hero from "../../components/LandingPage/Hero";
import History from "../../components/LandingPage/History";
import Skills from "../../components/LandingPage/Skills";
import { isBot } from "../../App";
import { useSiteStore } from "../../stores/siteStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useProjectStore } from "../../stores/projectStore";

const Gallery = lazy(() => import("../../components/LandingPage/Gallery"));
const Kontak = lazy(() => import("../../components/LandingPage/Kontak"));

function Beranda() {
  const siteData = useSiteStore((state) => state.siteData);
  const fetchSertifikat = usePortfolioStore((s) => s.fetchSertifikat);
  const fetchHistoryData = usePortfolioStore((s) => s.fetchHistoryData);
  const fetchSkillsData = usePortfolioStore((s) => s.fetchSkillsData);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);

  useEffect(() => {
    fetchSertifikat();
    fetchHistoryData();
    fetchSkillsData();
    if (fetchProjects) fetchProjects();
  }, [fetchSertifikat, fetchHistoryData, fetchSkillsData, fetchProjects]);

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
    "inLanguage": "id-ID"
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
      <Suspense fallback={<div className="min-h-[400px] w-full" />}>
        <Gallery />
        <Kontak />
      </Suspense>
    </>
  );
}

export default Beranda;