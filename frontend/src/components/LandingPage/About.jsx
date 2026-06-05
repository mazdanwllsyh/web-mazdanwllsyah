import React, { useState, useEffect, useMemo } from "react";
import { HashLink } from "react-router-hash-link";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";
import SeoHelmet from "../SEOHelmet";
import { useSiteStore } from "../../stores/siteStore";
import { useProjectStore } from "../../stores/projectStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper";

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

const slideVariants = {
  initial: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    filter: "blur(8px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

function About() {
  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const fetchSertifikat = usePortfolioStore((state) => state.fetchSertifikat);
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const fetchProjects = useProjectStore((state) => state?.fetchProjects);

  const siteData = useSiteStore((state) => state.siteData);
  const historyData = usePortfolioStore((state) => state.historyData);
  const sertifikatData = usePortfolioStore((state) => state.sertifikatData);
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const projects = useProjectStore((state) => state?.projects) || [];

  const isHistoryLoading = usePortfolioStore((state) => state.isHistoryLoading);
  const isSertifikatLoading = usePortfolioStore((state) => state.isSertifikatLoading);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);
  const isProjectsLoading = useProjectStore((state) => state?.isProjectsLoading);

  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);

  useEffect(() => {
    fetchHistoryData();
    fetchSertifikat();
    fetchSkillsData();
    if (fetchProjects) fetchProjects();
  }, [fetchHistoryData, fetchSertifikat, fetchSkillsData, fetchProjects]);

  const profileImages = siteData?.profileImages || [];

  useEffect(() => {
    if (profileImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndices((prev) => [
          (prev[0] + 1) % profileImages.length,
          (prev[1] + 1) % profileImages.length,
          (prev[2] + 1) % profileImages.length,
        ]);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [profileImages.length]);

  const totalSkillsCount = useMemo(() => {
    return Object.values(skillsData || {}).flat().length;
  }, [skillsData]);

  const stats = useMemo(() => [
    { icon: "solar:folder-bold-duotone", value: isProjectsLoading ? "..." : projects.length, label: "Proyek", link: "/#galeri", tooltip: "Total Proyek yang telah dikerjakan" },
    { icon: "solar:diploma-bold-duotone", value: isSertifikatLoading ? "..." : sertifikatData.length, label: "Sertifikat", link: "/sertifikasi", tooltip: "Sertifikasi Profesional" },
    { icon: "solar:case-bold-duotone", value: isHistoryLoading ? "..." : historyData?.experience?.length || 0, label: "Pengalaman", link: "/#histori", tooltip: "Pengalaman Kerja/Organisasi" },
    { icon: "solar:star-ring-bold-duotone", value: isSkillsLoading ? "..." : totalSkillsCount, label: "Keahlian", link: "/#skills", tooltip: "Total Teknologi yang Dikuasai" }
  ], [projects.length, sertifikatData.length, historyData, totalSkillsCount, isProjectsLoading, isSertifikatLoading, isHistoryLoading, isSkillsLoading]);

  const cleanDescription = siteData?.aboutParagraph
    ? siteData.aboutParagraph.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
    : "Kenali lebih dekat Mazda Nawallsyah, seorang Front-End Developer MERN Stack yang berfokus pada pembuatan antarmuka responsif dan optimal.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": siteData?.brandNameShort || "Mazda Nawallsyah",
      "jobTitle": siteData?.jobTitle || "Front-End Developer",
      "description": cleanDescription,
      "image": profileImages?.[0] || ""
    }
  };

  useEffect(() => {
    let script = document.getElementById("structured-data-about");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data-about";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(structuredData);

    return () => {
      if (script) script.remove();
    };
  }, [structuredData]);

  return (
    <div className="bg-base-100 min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-16 lg:py-20 scroll-mt-12 lg:scroll-mt-18 text-base-content relative overflow-hidden" id="tentang">
      <SeoHelmet
        title="Tentang Saya"
        description={cleanDescription}
        url="/tentang"
      />

      <div className="w-full max-w-6xl mx-auto px-4 z-10">
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
        >
          <m.div variants={itemVariants} className="w-full lg:w-5/12 flex justify-center relative">
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] lg:w-[22rem] lg:h-[30rem] xl:w-[24rem] xl:h-[34rem] group cursor-pointer">
              {profileImages.length > 2 && (
                <div className="absolute inset-0 bg-base-300 shadow-xl transform -rotate-6 translate-x-4 translate-y-4 overflow-hidden border border-base-content/20 rounded-[2.5rem] transition-all duration-1000 group-hover:-rotate-12 group-hover:translate-x-6 group-hover:translate-y-6">
                  <img src={transformCloudinaryUrl(profileImages[currentIndices[2]], 600, 800)} className="w-full h-full object-cover grayscale opacity-40" alt="bg3" />
                </div>
              )}
              {profileImages.length > 1 && (
                <div className="absolute inset-0 bg-base-200 shadow-xl transform rotate-6 -translate-x-3 translate-y-2 overflow-hidden border border-base-content/20 rounded-[2.5rem] transition-all duration-1000 group-hover:rotate-12 group-hover:-translate-x-5 group-hover:translate-y-4">
                  <img src={transformCloudinaryUrl(profileImages[currentIndices[1]], 600, 800)} className="w-full h-full object-cover grayscale opacity-70" alt="bg2" />
                </div>
              )}
              <div className="absolute inset-0 bg-base-100 shadow-2xl z-10 overflow-hidden border border-base-content/20 rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105">
                {profileImages.length > 0 ? (
                  <AnimatePresence mode="wait">
                    <m.img
                      key={currentIndices[0]}
                      src={transformCloudinaryUrl(profileImages[currentIndices[0]], 600, 800)}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="w-full h-full object-cover"
                      alt="Tentang Mazda Nawallsyah"
                    />
                  </AnimatePresence>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/50">
                    <Icon icon="mdi:image-off-outline" className="w-16 h-16 opacity-50" />
                  </div>
                )}
              </div>
            </div>
          </m.div>

          <div className="w-full lg:w-7/12 flex flex-col">
            <m.div variants={itemVariants} className="mb-6 lg:mb-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-base-content leading-tight">
                Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Saya</span>
              </h2>
            </m.div>

            <m.div variants={itemVariants} className="prose prose-base md:prose-lg max-w-none text-base-content/80 text-justify mb-10 leading-relaxed font-medium">
              {siteData?.aboutParagraph ? (
                <div dangerouslySetInnerHTML={{ __html: siteData.aboutParagraph }} />
              ) : (
                <p className="italic opacity-60">Sedang memuat informasi tentang saya...</p>
              )}
            </m.div>

            <m.div variants={itemVariants} className="mt-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {stats.map((stat) => (
                  <m.div
                    key={stat.label}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="tooltip tooltip-bottom w-full cursor-pointer"
                    data-tip={stat.tooltip}
                  >
                    <HashLink
                      to={stat.link}
                      smooth={stat.link.startsWith("/#")}
                      className="card bg-base-100 shadow-sm border border-base-content/20 p-5 rounded-3xl text-center flex flex-col justify-center items-center w-full h-full"
                    >
                      <Icon icon={stat.icon} className="w-8 h-8 md:w-10 md:h-10 text-primary mb-3" />
                      <div className="text-2xl md:text-3xl font-bold font-display">{stat.value}</div>
                      <div className="text-xs text-base-content/70 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
                    </HashLink>
                  </m.div>
                ))}
              </div>
            </m.div>
          </div>
        </m.div>
      </div>
    </div>
  );
}

export default About;