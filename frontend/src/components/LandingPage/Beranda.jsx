import React from "react";
import SeoHelmet from "../../components/SEOHelmet"; 
import Hero from "../../components/LandingPage/Hero";
import History from "../../components/LandingPage/History";
import Skills from "../../components/LandingPage/Skills";
import Gallery from "../../components/LandingPage/Gallery";
import Kontak from "../../components/LandingPage/Kontak";

function Beranda() {
  return (
    <>
      <SeoHelmet
        title="Utama - Mazda N" 
        description="Portofolio pribadi Mazda Nawallsyah, seorang Mahasiswa Fresh Graduate Universitas Prodi S1 - Teknik Informatika, yang berminat dan berfokus di Bidang Front-End Web Developer."
        url="/" 
      />

      <Hero />
      <History />
      <Skills />
      <Gallery />
      <Kontak />
    </>
  );
}

export default Beranda;
