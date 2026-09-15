import React, { Suspense, lazy } from "react";
import SeoHelmet from "../../components/SEOHelmet";
import Hero from "../../components/LandingPage/Hero";
import History from "../../components/LandingPage/History";
import Skills from "../../components/LandingPage/Skills";
import { isBot } from "../../App";

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
      <SeoHelmet url="/" />
      <Hero />
      <History />
      <Skills />

      {isBot ? (
        <>
          <Gallery />
          <Kontak />
        </>
      ) : (
        <>
          <Suspense fallback={<SectionLoader />}>
            <Gallery />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Kontak />
          </Suspense>
        </>
      )}
    </>
  );
}

export default Beranda;