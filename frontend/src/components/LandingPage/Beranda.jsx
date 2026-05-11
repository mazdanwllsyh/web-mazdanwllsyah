import React, { Suspense, lazy } from "react";
import SeoHelmet from "../../components/SEOHelmet";

import Hero from "../../components/LandingPage/Hero"; 

const History = lazy(() => import("../../components/LandingPage/History"));
const Skills = lazy(() => import("../../components/LandingPage/Skills"));
const Gallery = lazy(() => import("../../components/LandingPage/Gallery"));
const Kontak = lazy(() => import("../../components/LandingPage/Kontak"));

const SectionLoader = () => (
  <div className="w-full h-96 flex items-center justify-center">
    <span className="loading loading-dots loading-lg text-base-content/20"></span>
  </div>
);

function Beranda() {
  return (
    <>
      <SeoHelmet
        title="Mazda Nawallsyah (Newbie Front-End Developer)"
        description="Portofolio Resmi pribadi Mazda Nawallsyah, seorang Wisudawan Universitas Semarang Prodi S1 - Teknik Informatika, yang berminat dan berfokus di Bidang Front-End Web Developer."
        url="/"
      />

      <Hero />

      <Suspense fallback={<SectionLoader />}>
        <History />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Skills />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Gallery />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Kontak />
      </Suspense>
    </>
  );
}

export default Beranda;