import React, { Suspense, lazy } from "react";
import SEO from "../../components/SEO";
import Hero from "../../components/LandingPage/Hero";
import History from "../../components/LandingPage/History";
import Skills from "../../components/LandingPage/Skills";
import { isBot } from "../../App";

const Gallery = lazy(() => import("../../components/LandingPage/Gallery"));
const Kontak = lazy(() => import("../../components/LandingPage/Kontak"));

function Beranda() {
  return (
    <>
      <SEO
        title="Beranda"
        description="Portofolio pribadi Mazda Nawallsyah seorang Frontend Web Developer yang berbasis di Ambarawa, Jawa Tengah, Indonesia. Menyediakan website profesional, modern, intuitif, dan responsif."
        url="/"
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