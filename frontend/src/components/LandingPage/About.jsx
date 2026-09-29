import React, { useState, useEffect, useMemo } from "react";
import { HashLink } from "react-router-hash-link";
import { Icon } from "@iconify/react";
import { m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import SEO from "../../components/SEO";
import { useSiteStore } from "../../stores/siteStore";
import { useProjectStore } from "../../stores/projectStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper";
import { isBot } from "../../App.jsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const slideVariants = {
  initial: { opacity: 0, filter: "blur(5px)" },
  animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6 } },
  exit: { opacity: 0, filter: "blur(5px)", transition: { duration: 0.6 } }
};

function About() {
  const { fetchHistoryData, fetchSertifikat, fetchSkillsData, historyData, sertifikatData, skillsData } = usePortfolioStore();
  const { fetchProjects, projects = [] } = useProjectStore();
  const siteData = useSiteStore((state) => state.siteData);

  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);
  const [hoveredStat, setHoveredStat] = useState(null);

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

  const triggerHistoryTab = () => {
    localStorage.setItem("activeHistoryTab", "pengalaman");
    window.dispatchEvent(new Event("changeHistoryTab"));
  };

  const totalSkillsCount = skillsData?.hardSkills?.length || 0;
  const projectCount = projects?.length || 0;
  const certCount = sertifikatData?.length || 0;
  const expCount = historyData?.experience?.length || 0;

  const stats = useMemo(() => [
    { icon: "ph:folder-open-duotone", value: projectCount, label: "Proyek", link: "/#galeri", tooltip: "Total Proyek yang telah dikerjakan" },
    { icon: "ph:certificate-duotone", value: certCount, label: "Sertifikat", link: "/sertifikasi", tooltip: "Sertifikasi Profesional" },
    { icon: "ph:briefcase-metal-duotone", value: expCount, label: "Pengalaman", link: "/#histori", tooltip: "Pengalaman Kerja/Organisasi", onClick: triggerHistoryTab },
    { icon: "ph:code-block-duotone", value: totalSkillsCount, label: "Keahlian", link: "/#skills", tooltip: "Total Teknologi yang Dikuasai" }
  ], [projectCount, certCount, expCount, totalSkillsCount]);

  const dynamicDescription = `Frontend Developer MERN Stack. Berhasil menyelesaikan ${projectCount} proyek portofolio, memiliki ${expCount} pengalaman kerja/organisasi, menguasai ${totalSkillsCount} teknologi, dan meraih ${certCount} sertifikasi profesional. ${siteData?.aboutParagraph ? siteData.aboutParagraph.replace(/<[^>]*>?/gm, '').substring(0, 100) + "..." : ""}`;

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": siteData?.brandNameShort || "Mazda Nawallsyah",
      "jobTitle": siteData?.jobTitle || "Front-End Developer",
      "description": dynamicDescription,
      "image": profileImages?.[0] || "",
      "knowsAbout": ["React", "MERN Stack", "Frontend Development", "Tailwind CSS"],
      "interactionStatistic": [
        { "@type": "InteractionCounter", "interactionType": "https://schema.org/WriteAction", "userInteractionCount": projectCount },
        { "@type": "InteractionCounter", "interactionType": "https://schema.org/EducationEvent", "userInteractionCount": certCount }
      ]
    }
  }), [siteData, dynamicDescription, profileImages, projectCount, certCount]);

  return (
    <div className="min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-16 lg:py-20 scroll-mt-12 lg:scroll-mt-18 text-base-content relative overflow-hidden" id="tentang">
      <SEO
        title="Tentang Saya"
        description={dynamicDescription}
        url="/tentang"
        type="profile"
        structuredData={structuredData}
      />
      <LazyMotion features={domAnimation}>
        <div className="w-full max-w-6xl mx-auto px-4 z-10">
          <m.div
            variants={containerVariants}
            initial={isBot ? "visible" : "hidden"}
            whileInView="visible"
            viewport={isBot ? { once: true } : { once: true, amount: 0.1 }}
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center"
            style={{ willChange: "transform, opacity" }}
          >
            <m.div variants={itemVariants} className="w-full lg:w-5/12 flex justify-center relative" style={{ willChange: "transform, opacity" }}>
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] lg:w-[22rem] lg:h-[30rem] xl:w-[24rem] xl:h-[34rem] group cursor-pointer">
                {profileImages.length > 2 && (
                  <div className="absolute inset-0 bg-base-300 shadow-xl transform -rotate-6 translate-x-4 translate-y-4 overflow-hidden border border-base-content/20 rounded-[2.5rem] transition-all duration-700 group-hover:-rotate-12 group-hover:translate-x-6 group-hover:translate-y-6">
                    <img src={transformCloudinaryUrl(profileImages[currentIndices[2]], 600, 800)} className="w-full h-full object-cover grayscale opacity-40" alt="bg3" />
                  </div>
                )}
                {profileImages.length > 1 && (
                  <div className="absolute inset-0 bg-base-200 shadow-xl transform rotate-6 -translate-x-3 translate-y-2 overflow-hidden border border-base-content/20 rounded-[2.5rem] transition-all duration-700 group-hover:rotate-12 group-hover:-translate-x-5 group-hover:translate-y-4">
                    <img src={transformCloudinaryUrl(profileImages[currentIndices[1]], 600, 800)} className="w-full h-full object-cover grayscale opacity-70" alt="bg2" />
                  </div>
                )}
                <div className="absolute inset-0 bg-base-100 shadow-2xl z-10 overflow-hidden border border-base-content/20 rounded-[2.5rem] transition-transform duration-500 group-hover:scale-105">
                  {profileImages.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <m.img
                        key={currentIndices[0]}
                        src={transformCloudinaryUrl(profileImages[currentIndices[0]], 600, 800)}
                        variants={isBot ? {} : slideVariants}
                        initial={isBot ? false : "initial"}
                        animate={isBot ? false : "animate"}
                        exit={isBot ? false : "exit"}
                        className="w-full h-full object-cover"
                        alt="Tentang Mazda Nawallsyah"
                        style={{ willChange: "opacity, filter" }}
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/50"><Icon icon="mdi:image-off-outline" className="w-16 h-16 opacity-50" /></div>
                  )}
                </div>
              </div>
            </m.div>

            <div className="w-full lg:w-7/12 flex flex-col">
              <m.div variants={itemVariants} className="mb-6 lg:mb-8 text-center lg:text-left" style={{ willChange: "transform, opacity" }}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display text-base-content leading-tight">
                  Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Saya</span>
                </h2>
              </m.div>

              <m.div variants={itemVariants} className="prose prose-base md:prose-lg max-w-none text-base-content/80 text-justify mb-10 leading-relaxed font-medium" style={{ willChange: "transform, opacity" }}>
                {siteData?.aboutParagraph ? <div dangerouslySetInnerHTML={{ __html: siteData.aboutParagraph }} /> : <p className="italic opacity-60">Memuat profil...</p>}
              </m.div>

              <m.div variants={itemVariants} className="mt-auto" style={{ willChange: "transform, opacity" }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full h-full">
                  {stats.map((stat) => (
                    <m.div
                      key={stat.label}
                      whileHover={isBot ? {} : { y: -5 }}
                      whileTap={isBot ? {} : { scale: 0.95 }}
                      className="tooltip tooltip-bottom w-full h-full cursor-pointer flex"
                      data-tip={stat.tooltip}
                      onClick={stat.onClick}
                      onMouseEnter={() => setHoveredStat(stat.label)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <div className={`w-full h-full rounded-3xl transition-all duration-[3500ms] ${hoveredStat === stat.label ? "aura aura-dual text-primary" : ""}`}>
                        <HashLink to={stat.link} smooth={stat.link.startsWith("/#")} className="w-full h-full card bg-base-100 shadow-sm border border-base-content/20 p-5 rounded-3xl text-center flex flex-col justify-center items-center outline-none">
                          <Icon icon={stat.icon} className="w-8 h-8 md:w-10 md:h-10 text-primary mb-3" />
                          <div className="text-2xl md:text-3xl font-bold font-display">{stat.value}</div>
                          <div className="text-xs text-base-content/70 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
                        </HashLink>
                      </div>
                    </m.div>
                  ))}
                </div>
              </m.div>
            </div>
          </m.div>
        </div>
      </LazyMotion>
    </div>
  );
}

export default About;