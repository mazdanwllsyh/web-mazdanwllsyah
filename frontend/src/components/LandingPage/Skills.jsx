import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import { usePortfolioStore } from "../../stores/portfolioStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
      delayChildren: 0.2     
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  }
};

const getLevelPercentage = (level) => {
  const l = level?.toLowerCase() || "";
  if (l.includes("expert") || l.includes("advanced") || l.includes("lanjut") || l.includes("mahir")) return "90%";
  if (l.includes("intermediate") || l.includes("menengah")) return "70%";
  if (l.includes("beginner") || l.includes("dasar") || l.includes("pemula")) return "45%";
  return "60%";
};

function Skills() {
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);

  useEffect(() => {
    const isHardEmpty = !skillsData?.hardSkills || skillsData.hardSkills.length === 0;
    const isSoftEmpty = !skillsData?.softSkills || skillsData.softSkills.length === 0;
    if (isHardEmpty && isSoftEmpty) {
      fetchSkillsData();
    }
  }, [fetchSkillsData, skillsData]);

  const displayedHardSkills = useMemo(() => skillsData?.hardSkills || [], [skillsData]);
  const displayedSoftSkills = useMemo(() => skillsData?.softSkills || [], [skillsData]);

  if (isSkillsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="loading loading-ring w-16 h-16 text-primary"></span>
        <p className="font-bold opacity-60 animate-pulse tracking-widest text-sm uppercase">Sinkronisasi Keahlian...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-base-100 min-h-[auto] lg:min-h-screen flex flex-col items-center justify-center py-16 lg:py-0 scroll-mt-8 lg:scroll-mt-12"
      id="skills"
    >
      <div className="w-full max-w-6xl mx-auto px-0 lg:px-4">
        <m.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">Skills</h2>
          <p className="text-base md:text-lg text-base-content/60">Teknologi dan kompetensi profesional saya</p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <m.div
            className="lg:col-span-8 space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 px-2 lg:px-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon icon="solar:code-bold-duotone" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-base-content/80">Hard Skills</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 px-2 lg:px-0">
              {displayedHardSkills.map((skill) => (
                <m.div
                  key={skill.name}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                  className="p-4 rounded-2xl bg-base-200 border border-base-content/10 flex items-center gap-4 hover:border-primary hover:bg-base-100 focus:border-primary focus:bg-base-100 cursor-pointer group shadow-sm"
                >
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-base-300 group-hover:bg-primary/5 group-focus:bg-primary/5 transition-colors">
                    <Icon icon={skill.icon} className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold font-headings text-sm leading-tight break-words">{skill.name}</span>
                    <span className="text-[13px] font-black opacity-40 mt-1 tracking-tighter">{skill.level || "Expert"}</span>
                  </div>
                </m.div>
              ))}
            </div>
          </m.div>

          <m.div
            className="lg:col-span-4 space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 px-2 lg:px-0">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Icon icon="vscode-icons:file-type-skill" className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-base-content/80">Soft Skills</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 px-2 lg:px-0">
              {displayedSoftSkills.map((skill, index) => (
                <m.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                  className="flex items-center gap-2 p-4 rounded-2xl bg-base-200 border border-base-content/10 hover:border-secondary focus:border-secondary transition-all duration-300 shadow-sm cursor-pointer group"
                >
                  <Icon
                    icon="line-md:check-all"
                    className="w-0 h-6 opacity-0 text-secondary flex-shrink-0 group-hover:w-6 group-hover:opacity-100 group-focus:w-6 group-focus:opacity-100 transition-all duration-300"
                  />
                  <span className="font-bold text-sm md:text-base leading-tight break-words transition-colors duration-300 group-hover:text-secondary group-focus:text-secondary">{skill}</span>
                </m.div>
              ))}
            </div>
          </m.div>

        </div>
      </div>
    </div>
  );
}

export default Skills;