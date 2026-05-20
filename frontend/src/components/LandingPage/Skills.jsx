import React, { useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import { usePortfolioStore, initialHardSkills } from "../../stores/portfolioStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const categoryOrder = [
  "Bahasa Pemrograman",
  "Framework & Library",
  "Styling & UI",
  "State Management",
  "Database",
  "Cloud & Deploy",
  "Tools & Lainnya",
  "IDE & Office"
];

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

  const displayedHardSkills = useMemo(() => {
    return (skillsData?.hardSkills || []).map((dbSkill) => {
      const masterSkill = initialHardSkills.find((s) => s.name === dbSkill.name);
      return masterSkill ? { ...dbSkill, icon: masterSkill.icon, category: masterSkill.category || "Lainnya" } : { ...dbSkill, category: "Lainnya" };
    });
  }, [skillsData]);

  const groupedHardSkills = useMemo(() => {
    const groups = {};
    displayedHardSkills.forEach(skill => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    });
    return groups;
  }, [displayedHardSkills]);

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
      className="bg-base-100 min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-16 scroll-mt-15 lg:scroll-mt-22"
      id="skills"
    >
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        <m.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">Skills</h2>
          <p className="text-base md:text-lg text-base-content/60">Teknologi dan kompetensi profesional saya</p>
        </m.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

          <m.div
            className="lg:col-span-8 space-y-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon icon="solar:code-bold-duotone" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-base-content/80">Hard Skills</h3>
            </div>

            {Object.keys(groupedHardSkills).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {categoryOrder.map((category) => {
                  const skills = groupedHardSkills[category];
                  if (!skills || skills.length === 0) return null;

                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-4">
                        <h4 className="font-bold text-[11px] md:text-xs tracking-widest uppercase opacity-50 whitespace-nowrap">{category}</h4>
                        <div className="flex-1 h-[1px] bg-base-content/10"></div>
                      </div>

                      <div className="flex items-center gap-2 md:gap-3">
                        {skills.map((skill) => (
                          <m.div
                            key={skill.name}
                            variants={itemVariants}
                            tabIndex={0}
                            className="relative h-12 w-12 md:h-14 md:w-14 hover:w-44 focus:w-44 md:hover:w-48 md:focus:w-48 rounded-2xl bg-base-200 border border-base-content/10 flex items-center overflow-hidden cursor-pointer shadow-sm group transition-[width,background-color,border-color] duration-300 ease-in-out hover:border-primary hover:bg-base-100 focus:border-primary"
                          >
                            <div className="min-w-[3rem] md:min-w-[3.5rem] h-full flex items-center justify-center shrink-0">
                              <Icon icon={skill.icon} className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                            </div>

                            <div className="flex flex-col whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 delay-100 pr-3">
                              <span className="font-bold font-headings text-[13px] md:text-sm text-base-content leading-tight">
                                {skill.name}
                              </span>
                              <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-primary">
                                {skill.level || "Expert"}
                              </span>
                            </div>
                          </m.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="italic opacity-40 text-sm">Belum ada hard skills.</div>
            )}
          </m.div>

          <m.div
            className="lg:col-span-4 space-y-6 lg:sticky lg:top-32"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Icon icon="vscode-icons:file-type-skill" className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold font-display uppercase tracking-wider text-base-content/80">Soft Skills</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {displayedSoftSkills.length > 0 ? (
                displayedSoftSkills.map((skill, index) => (
                  <m.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    tabIndex={0}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-base-200 border border-base-content/10 hover:border-secondary focus:border-secondary transition-colors duration-300 shadow-sm cursor-pointer group"
                  >
                    <Icon
                      icon="line-md:check-all"
                      className="w-0 h-6 opacity-0 text-secondary flex-shrink-0 group-hover:w-6 group-hover:opacity-100 transition-[width,opacity] duration-300"
                    />
                    <span className="font-bold text-sm md:text-base leading-tight break-words group-hover:text-secondary transition-colors duration-300">
                      {skill}
                    </span>
                  </m.div>
                ))
              ) : (
                <div className="italic opacity-40 text-sm">Belum ada soft skills.</div>
              )}
            </div>
          </m.div>

        </div>
      </div>
    </div>
  );
}

export default Skills;