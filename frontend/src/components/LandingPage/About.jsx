import React, { useState, useEffect, useMemo } from "react";
import { HashLink } from "react-router-hash-link";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import SeoHelmet from "../SEOHelmet";
import { useSiteStore } from "../../stores/siteStore";
import { useProjectStore } from "../../stores/projectStore";
import { usePortfolioStore } from "../../stores/portfolioStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

function About() {
  const [loading, setLoading] = useState(true);

  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const fetchSertifikat = usePortfolioStore((state) => state.fetchSertifikat);
  const fetchProjects = useProjectStore((state) => state?.fetchProjects);

  const siteData = useSiteStore((state) => state.siteData);
  const historyData = usePortfolioStore((state) => state.historyData);
  const sertifikatData = usePortfolioStore((state) => state.sertifikatData);
  const projects = useProjectStore((state) => state?.projects || []);

  const profileImages = siteData?.profileImages || [];
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const isHistoryEmpty = (!historyData.education || historyData.education.length === 0) &&
      (!historyData.experience || historyData.experience.length === 0);
    if (isHistoryEmpty) fetchHistoryData();
    if (!projects || projects.length === 0) fetchProjects();
    if (!sertifikatData || sertifikatData.length === 0) fetchSertifikat();
  }, [fetchHistoryData, fetchProjects, fetchSertifikat, historyData, projects, sertifikatData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (profileImages.length > 1 && !loading) {
      const intervalId = setInterval(() => {
        setCurrentIndices((prev) => [
          (prev[0] + 1) % profileImages.length,
          (prev[1] + 1) % profileImages.length,
          (prev[2] + 1) % profileImages.length,
        ]);
      }, 7700);
      return () => clearInterval(intervalId);
    }
  }, [profileImages.length, loading]);

  const PhotoSkeleton = () => (
    <div className="flex flex-col items-center lg:items-center w-full hover:cursor-wait">
      <div className="skeleton w-64 h-80 md:w-80 md:h-96 rounded-2xl shadow-lg mb-4"></div>
    </div>
  );
  const ButtonSkeleton = () => (
    <div className="skeleton h-12 w-48 rounded-2xl mx-auto lg:mx-0 hover:cursor-wait"></div>
  );
  const TextSkeleton = () => (
    <div className="space-y-4 mb-6 w-full">
      <div className="skeleton h-10 w-3/4 mx-auto lg:mx-0 hover:cursor-wait"></div>
    </div>
  );
  const ParagraphSkeleton = () => (
    <div className="space-y-3 py-6 w-full hover:cursor-wait">
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-5/6 mx-auto lg:mx-0"></div>
    </div>
  );
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 w-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-md border border-base-content/20 p-4 rounded-3xl text-center">
          <div className="space-y-3 flex flex-col items-center hover:cursor-wait">
            <div className="skeleton h-10 w-10 rounded-full"></div>
            <div className="skeleton h-6 w-1/2"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const stats = useMemo(() => {
    return [
      {
        icon: "mdi:briefcase-check",
        value: `${historyData.experience?.length || 0}`,
        label: "Pengalaman",
        link: "/#histori",
        tooltip: "Lihat riwayat pengalaman saya"
      },
      {
        icon: "mdi:flask",
        value: `${projects?.length || 0}`,
        label: "Proyek",
        link: "/#galeri",
        tooltip: "Jelajahi galeri proyek saya"
      },
      {
        icon: "mdi:certificate",
        value: `${sertifikatData?.length || 0}`,
        label: "Sertifikat",
        link: "/sertifikasi",
        tooltip: "Cek koleksi sertifikat & lisensi"
      },
    ];
  }, [historyData, projects, sertifikatData]);

  const handleStatClick = (label) => {
    if (label === "Pengalaman") {
      localStorage.setItem("activeHistoryTab", "pengalaman");
      window.dispatchEvent(new Event("changeHistoryTab"));
    }
  };

  return (
    <div className="bg-base-100 min-h-[auto] lg:min-h-screen flex flex-col items-center justify-center py-12 lg:py-0 scroll-mt-8 lg:scroll-mt-12 text-base-content" id="tentang">
      <SeoHelmet />

      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        {loading ? (
          <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center w-full">
            <div className="py-8 flex flex-col items-center lg:items-start order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-3 w-full"><PhotoSkeleton /></div>
            <div className="w-full order-1 lg:order-none lg:col-start-2 text-center lg:text-left"><TextSkeleton /></div>
            <div className="w-full order-3 lg:order-none lg:col-start-2 text-center lg:text-left"><ParagraphSkeleton /></div>
            <div className="flex justify-center items-center order-4 lg:hidden mt-2 w-full"><ButtonSkeleton /></div>
            <div className="w-full order-5 lg:order-none lg:col-start-2 mt-2"><StatsSkeleton /></div>
          </div>
        ) : (
          <m.div
            className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <m.div variants={itemVariants} className="py-8 flex flex-col items-center lg:items-start order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-3">
              <div className="relative w-64 h-80 md:w-80 md:h-96">
                {profileImages.length > 2 && (
                  <div className="card absolute inset-0 bg-base-300 shadow-xl transform -rotate-6 translate-x-2 translate-y-4 overflow-hidden border border-base-content/30 rounded-2xl transition-transform duration-700 hover:-rotate-12">
                    <figure className="h-full w-full">
                      <img src={profileImages[currentIndices[2]]} alt="bg3" className="w-full h-full object-cover grayscale opacity-60" />
                    </figure>
                  </div>
                )}
                {profileImages.length > 1 && (
                  <div className="card absolute inset-0 bg-base-200 shadow-xl transform rotate-6 -translate-x-2 translate-y-2 overflow-hidden border border-base-content/30 rounded-2xl transition-transform duration-700 hover:rotate-12">
                    <figure className="h-full w-full">
                      <img src={profileImages[currentIndices[1]]} alt="bg2" className="w-full h-full object-cover grayscale opacity-80" />
                    </figure>
                  </div>
                )}
                {profileImages.length > 0 && (
                  <div className="card absolute inset-0 bg-base-100 shadow-2xl z-10 overflow-hidden border border-base-content/30 rounded-2xl group transition-transform duration-500 hover:scale-105">
                    <figure className="h-full w-full">
                      <img src={profileImages[currentIndices[0]]} alt="main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </figure>
                  </div>
                )}
              </div>
            </m.div>

            <m.div variants={itemVariants} className="w-full order-1 lg:order-none lg:col-start-2 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-2">
                Tentang Saya
              </h2>
            </m.div>

            <m.div variants={itemVariants} className="w-full order-3 lg:order-none lg:col-start-2 text-center lg:text-left">
              <p className="py-4 lg:py-6 text-base md:text-lg text-base-content/80 text-justify leading-relaxed break-words">
                {siteData.aboutParagraph || "Paragraf tentang Saya akan muncul di sini."}
              </p>
            </m.div>

            <m.div variants={itemVariants} className="flex justify-center items-center order-4 lg:hidden mt-2">
              <HashLink to="/sertifikasi" className="btn btn-secondary rounded-2xl shadow-lg group flex lg:hidden px-8">
                Sertifikasi Saya
                <Icon icon="mdi:arrow-right" className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </HashLink>
            </m.div>

            <m.div variants={itemVariants} className="w-full order-5 lg:order-none lg:col-start-2 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {stats.map((stat) => (
                  <m.div
                    key={stat.label}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="tooltip tooltip-bottom w-full cursor-pointer"
                    data-tip={stat.tooltip}
                  >
                    <HashLink
                      to={stat.link}
                      smooth={stat.link.startsWith("/#")}
                      onClick={() => handleStatClick(stat.label)}
                      className="card bg-base-100 shadow-sm border border-base-content/30 p-5 rounded-3xl text-center hover:shadow-xl transition-all duration-300 hover:bg-base-200 hover:border-primary group focus:outline-none w-full h-full flex flex-col justify-center items-center"
                    >
                      <Icon icon={stat.icon} className="w-8 h-8 md:w-10 md:h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                      <div className="text-2xl md:text-3xl font-bold font-display">{stat.value}</div>
                      <div className="text-sm text-base-content/70 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
                    </HashLink>
                  </m.div>
                ))}
              </div>
            </m.div>

          </m.div>
        )}
      </div>
    </div>
  );
}

export default About;