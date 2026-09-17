// src/components/LandingPage/Skills.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";
import { usePortfolioStore, initialHardSkills } from "../../stores/portfolioStore";
import { isBot } from "../../App.jsx";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 }
  }
};

const categoryOrder = [
  "Bahasa Pemrograman",
  "Framework & Library",
  "Styling & UI",
  "State Management",
  "Cloud & Deploy",
  "Tools & Lainnya",
  "IDE & Office",
  "Database"
];

function Skills() {
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);

  const [activeTab, setActiveTab] = useState("hard");
  const [isSoftHovered, setIsSoftHovered] = useState(false);

  useEffect(() => {
    fetchSkillsData();
  }, [fetchSkillsData]);

  const displayedHardSkills = useMemo(() => {
    return (skillsData?.hardSkills || []).map((dbSkill) => {
      const masterSkill = initialHardSkills.find((s) => s.name === dbSkill.name);
      return masterSkill ? { ...dbSkill, icon: masterSkill.icon, category: masterSkill.category || "Lainnya" } : { ...dbSkill, category: "Lainnya" };
    });
  }, [skillsData]);

  const groupedHardSkills = useMemo(() => {
    const groups = {};
    displayedHardSkills.forEach(skill => {
      if (!groups[skill.category]) groups[skill.category] = [];
      groups[skill.category].push(skill);
    });
    return groups;
  }, [displayedHardSkills]);

  const displayedSoftSkills = useMemo(() => {
    const rawSkills = skillsData?.softSkills || [];
    return rawSkills.map(skill => {
      if (typeof skill === 'string') {
        return { name: skill, description: "Mampu beradaptasi dan berkolaborasi secara efektif dalam lingkungan kerja profesional." };
      }
      if (typeof skill === 'object' && skill !== null) {
        return {
          name: skill.name ? String(skill.name) : "Skill Tidak Diketahui",
          description: skill.description ? String(skill.description) : "Mampu beradaptasi dan berkolaborasi secara efektif dalam lingkungan kerja profesional."
        };
      }
      return { name: "Soft Skill", description: "" };
    });
  }, [skillsData]);

  const structuredData = useMemo(() => {
    const allSkills = categoryOrder.flatMap(cat => groupedHardSkills[cat] || []);
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Keahlian Mazda Nawallsyah",
      "itemListElement": allSkills.map((skill, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": skill.name || skill
      }))
    };
  }, [groupedHardSkills]);

  useEffect(() => {
    let script = document.getElementById("structured-data-skills");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data-skills";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(structuredData);
    return () => { if (script) script.remove(); };
  }, [structuredData]);

  if (isSkillsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <span className="loading loading-ring w-16 h-16 text-primary"></span>
        <p className="font-bold text-base-content/80 animate-pulse tracking-widest text-sm uppercase">Sinkronisasi Keahlian...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-11 lg:py-18 relative z-10" id="skills">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">

        <m.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 tracking-tight">Skills</h2>

          <div className="h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <m.p
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm md:text-base text-base-content/80 font-medium max-w-2xl mx-auto"
              >
                {activeTab === 'hard'
                  ? "Teknologi, framework, dan perkakas teknis yang saya gunakan untuk membangun ekosistem web."
                  : "Kemampuan interpersonal dan manajemen diri untuk kolaborasi profesional yang efektif."}
              </m.p>
            </AnimatePresence>
          </div>
        </m.div>

        <div className="flex justify-center mb-12">
          <div className="bg-base-200/60 backdrop-blur-sm p-1.5 rounded-2xl flex gap-2 w-full max-w-md border border-base-content/5 shadow-sm relative z-20">
            <button
              onClick={() => setActiveTab('hard')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'hard'
                  ? 'bg-primary text-primary-content shadow-md shadow-primary/20 scale-100'
                  : 'bg-transparent text-base-content/70 hover:text-base-content hover:bg-base-100/50 scale-95 hover:scale-[0.98]'
                }`}
              aria-selected={activeTab === 'hard'}
              role="tab"
            >
              <Icon icon="solar:code-square-bold-duotone" className="w-5 h-5 shrink-0" />
              <span className="text-sm sm:text-base">Hard Skills</span>
            </button>
            <button
              onClick={() => setActiveTab('soft')}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'soft'
                  ? 'bg-secondary text-secondary-content shadow-md shadow-secondary/20 scale-100'
                  : 'bg-transparent text-base-content/70 hover:text-base-content hover:bg-base-100/50 scale-95 hover:scale-[0.98]'
                }`}
              aria-selected={activeTab === 'soft'}
              role="tab"
            >
              <Icon icon="solar:medal-star-bold-duotone" className="w-5 h-5 shrink-0" />
              <span className="text-sm sm:text-base">Soft Skills</span>
            </button>
          </div>
        </div>

        <div className="w-full min-h-[450px]">
          <AnimatePresence mode="wait">
            {activeTab === 'hard' && (
              <m.div
                key="hard-skills"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {Object.keys(groupedHardSkills).length > 0 ? (
                  <m.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10"
                    variants={containerVariants}
                    initial={isBot ? "visible" : "hidden"}
                    animate="visible"
                  >
                    {categoryOrder.map((category) => {
                      const skills = groupedHardSkills[category];
                      if (!skills || skills.length === 0) return null;

                      return (
                        <div key={category} className="space-y-4">
                          <div className="flex items-center gap-3">
                            <h3 className="font-bold text-[11px] md:text-xs tracking-widest uppercase text-base-content/80 whitespace-nowrap">{category}</h3>
                            <div className="flex-1 h-[1px] bg-base-content/20"></div>
                          </div>

                          <div className="flex flex-wrap gap-2.5">
                            {skills.map((skill, index) => (
                              <m.div key={`hard-skill-${index}`} variants={itemVariants} className="relative group w-fit">
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity aura text-primary bg-accent pointer-events-none -z-10"></div>

                                <div
                                  tabIndex={0}
                                  className="relative h-12 md:h-14 w-max max-w-[3.2rem] hover:max-w-[16rem] focus-within:max-w-[16rem] rounded-2xl bg-base-200/90 flex items-center overflow-hidden cursor-pointer transition-[max-width,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-base-100 hover:shadow-lg focus-within:bg-base-100 focus-within:shadow-lg focus:outline-none z-10"
                                >
                                  <div className="w-[3.2rem] h-full flex items-center justify-center shrink-0 relative z-10">
                                    <Icon icon={skill.icon} className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 group-focus-within:scale-110 transition-transform duration-300 drop-shadow-sm" />
                                  </div>

                                  <div className="flex flex-col whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 delay-100 pr-5">
                                    <span className="font-bold font-headings text-[13px] md:text-sm text-base-content leading-tight group-hover:text-primary group-focus-within:text-primary transition-colors">
                                      {skill.name}
                                    </span>
                                    <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-primary text-opacity-80">
                                      {skill.level || "Intermediate"}
                                    </span>
                                  </div>
                                </div>
                              </m.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </m.div>
                ) : (
                  <div className="text-center py-20 italic text-base-content/50 text-sm">Belum ada hard skills.</div>
                )}
              </m.div>
            )}

            {activeTab === 'soft' && (
              <m.div
                key="soft-skills"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-6xl mx-auto"
                onMouseEnter={() => setIsSoftHovered(true)}
                onMouseLeave={() => setIsSoftHovered(false)}
                onFocus={() => setIsSoftHovered(true)}
                onBlur={() => setIsSoftHovered(false)}
              >
                <m.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial={isBot ? "visible" : "hidden"}
                  animate="visible"
                >
                  {displayedSoftSkills.length > 0 ? (
                    displayedSoftSkills.map((skill, index) => (
                      <m.div key={`soft-skill-${index}`} variants={itemVariants} className="relative group/item w-full">
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity aura aura-silver pointer-events-none -z-10"></div>

                        <div
                          tabIndex={0}
                          className="relative w-full p-5 md:p-6 rounded-2xl bg-base-200/90 border border-base-content/10 outline-none text-left flex flex-col justify-start cursor-pointer transition-colors duration-300 hover:bg-base-100 focus-within:bg-base-100 z-10"
                        >
                          <div className="flex items-center gap-4 relative z-10 w-full">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(var(--s),0.5)] bg-secondary/50 group-hover/item:bg-secondary group-focus-within/item:bg-secondary group-hover/item:scale-150 group-focus-within/item:scale-150 transition-[background-color,transform] duration-300" />
                            <span className="font-bold text-base md:text-lg leading-tight text-base-content group-hover/item:text-secondary group-focus-within/item:text-secondary transition-colors">
                              {skill.name}
                            </span>
                          </div>

                          <AnimatePresence>
                            <m.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: isSoftHovered ? "auto" : 0, opacity: isSoftHovered ? 1 : 0 }}
                              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                              className="overflow-hidden relative z-10 w-full"
                            >
                              <p className="text-sm text-base-content/80 pl-[26px] text-justify leading-relaxed border-l-2 border-secondary/20 ml-[5px] mt-3">
                                {skill.description}
                              </p>
                            </m.div>
                          </AnimatePresence>
                        </div>
                      </m.div>
                    ))
                  ) : (
                    <div className="col-span-1 md:col-span-2 text-center py-20 italic text-base-content/50 text-sm">Belum ada soft skills.</div>
                  )}
                </m.div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Skills;