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
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

const categoryMap = {
  "Bahasa Pemrograman": "Bahasa Pemrograman & Framework",
  "Framework & Library": "Bahasa Pemrograman & Framework",
  "Styling & UI": "UI & Styling",
  "State Management": "State & Database",
  "Database": "State & Database",
  "Cloud & Deploy": "Cloud, Tools & Deploy",
  "Tools & Lainnya": "Cloud, Tools & Deploy",
  "IDE & Office": "Cloud, Tools & Deploy"
};

const categoryOrder = [
  "Bahasa Pemrograman & Framework",
  "UI & Styling",
  "State & Database",
  "Cloud, Tools & Deploy"
];

const categoryIcons = {
  "Bahasa Pemrograman & Framework": "solar:code-square-bold-duotone",
  "UI & Styling": "solar:pallete-2-bold-duotone",
  "State & Database": "solar:database-bold-duotone",
  "Cloud, Tools & Deploy": "solar:server-square-update-bold-duotone"
};

function Skills() {
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);

  const [activeTab, setActiveTab] = useState("hard");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  useEffect(() => {
    fetchSkillsData();
  }, [fetchSkillsData]);

  const displayedHardSkills = useMemo(() => {
    return (skillsData?.hardSkills || []).map((dbSkill) => {
      const masterSkill = initialHardSkills.find((s) => s.name === dbSkill.name);
      const mappedCategory = masterSkill ? (categoryMap[masterSkill.category] || "Lainnya") : "Lainnya";
      return masterSkill
        ? { ...dbSkill, icon: masterSkill.icon, category: mappedCategory }
        : { ...dbSkill, category: mappedCategory };
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4" aria-live="polite" aria-busy="true">
        <span className="loading loading-ring w-16 h-16 text-primary"></span>
        <p className="font-bold text-base-content animate-pulse tracking-widest text-sm uppercase">Sinkronisasi Keahlian...</p>
      </div>
    );
  }

  const activeCategory = categoryOrder[currentCategoryIndex];
  const activeSkills = groupedHardSkills[activeCategory] || [];

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
                className="text-sm md:text-base text-base-content/85 font-medium max-w-2xl mx-auto"
              >
                {activeTab === 'hard'
                  ? "Teknologi, framework, dan perkakas teknis yang dikuasai."
                  : "Kemampuan interpersonal dan manajemen diri."}
              </m.p>
            </AnimatePresence>
          </div>
        </m.div>

        <div className="flex justify-center mb-12">
          <div role="tablist" aria-label="Kategori Keahlian" className="bg-base-200 p-1.5 rounded-2xl flex gap-2 w-full max-w-md border border-base-content/10 shadow-sm relative z-20">
            <m.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('hard')}
              role="tab"
              aria-selected={activeTab === 'hard'}
              aria-controls="panel-hard-skills"
              id="tab-hard"
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'hard' ? 'bg-primary text-primary-content shadow-md' : 'bg-transparent text-base-content hover:bg-base-100/50'}`}
            >
              <Icon icon="solar:code-square-bold-duotone" className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base">Hard Skills</span>
            </m.button>
            <m.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('soft')}
              role="tab"
              aria-selected={activeTab === 'soft'}
              aria-controls="panel-soft-skills"
              id="tab-soft"
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'soft' ? 'bg-secondary text-secondary-content shadow-md' : 'bg-transparent text-base-content hover:bg-base-100/50'}`}
            >
              <Icon icon="solar:medal-star-bold-duotone" className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span className="text-sm sm:text-base">Soft Skills</span>
            </m.button>
          </div>
        </div>

        <div className="w-full min-h-[450px]">
          <AnimatePresence mode="wait">
            {activeTab === 'hard' && (
              <m.div
                key="hard-skills"
                id="panel-hard-skills"
                role="tabpanel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full flex flex-col md:flex-row gap-6 md:gap-10"
              >
                <m.div
                  className="flex flex-row md:flex-col gap-2.5 overflow-x-auto custom-scrollbar md:w-1/4 lg:w-[26%] p-2 -mx-2 md:p-0 md:m-0 shrink-0"
                  variants={containerVariants}
                  initial={isBot ? "visible" : "hidden"}
                  animate="visible"
                >
                  {categoryOrder.map((category, idx) => {
                    const count = groupedHardSkills[category]?.length || 0;
                    const isActive = currentCategoryIndex === idx;
                    return (
                      <m.div key={category} variants={itemVariants} className={`relative shrink-0 rounded-2xl ${isActive ? 'aura aura-dual z-20' : 'z-10'}`}>
                        <button
                          onClick={() => setCurrentCategoryIndex(idx)}
                          className={`w-full relative px-5 py-3.5 rounded-2xl text-[13px] md:text-sm font-bold transition-colors duration-300 whitespace-nowrap md:whitespace-normal flex items-center gap-3 overflow-hidden outline-none ${isActive
                            ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
                            : 'bg-base-200/50 hover:bg-base-200 text-base-content/60 hover:text-base-content'
                            }`}
                        >
                          <Icon icon={categoryIcons[category] || "solar:folder-bold-duotone"} className="w-5 h-5 shrink-0 relative z-10" />
                          <span className="leading-tight flex-1 text-left relative z-10">{category}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 relative z-10 transition-colors duration-300 ${isActive ? 'bg-base-100/20 text-primary-content' : 'bg-base-300 text-base-content/70'
                            }`}>
                            {count}
                          </span>
                        </button>
                      </m.div>
                    )
                  })}
                </m.div>

                <div className="flex-1 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <m.div
                      key={activeCategory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <div className="flex items-center gap-4 mb-6 md:mb-8">
                        <h3 className="font-black text-lg md:text-xl tracking-tight text-base-content whitespace-nowrap">{activeCategory}</h3>
                        <div className="flex-1 h-[2px] bg-base-content/10 rounded-full"></div>
                      </div>

                      {activeSkills.length > 0 ? (
                        <m.div
                          className="flex flex-wrap gap-4 w-full"
                          variants={containerVariants}
                          initial={isBot ? "visible" : "hidden"}
                          animate="visible"
                        >
                          {activeSkills.map((skill, index) => (
                            <m.div
                              key={`hard-skill-${index}`}
                              variants={itemVariants}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="relative group flex-auto min-w-[12rem] max-w-full sm:max-w-[calc(50%-0.5rem)] lg:max-w-[calc(33.333%-0.75rem)] xl:max-w-[24rem]"
                            >
                              <div className="absolute inset-0 rounded-2xl transition-opacity aura text-primary bg-accent pointer-events-none -z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"></div>

                              <div
                                tabIndex={0}
                                className="relative h-16 md:h-[4.5rem] w-full p-4 rounded-2xl flex items-center gap-4 overflow-hidden cursor-pointer focus:outline-none z-10 bg-base-200/90 border border-base-content/10 hover:bg-base-100 focus-within:bg-base-100 transition-[background-color,border-color,box-shadow] duration-300"
                              >
                                <div className="w-10 h-10 flex items-center justify-center shrink-0 relative z-10 bg-base-300/50 rounded-xl group-hover:bg-primary/10 transition-colors duration-300">
                                  <Icon icon={skill.icon} className="w-6 h-6 md:w-7 md:h-7 drop-shadow-sm text-base-content group-hover:text-primary transition-colors duration-300" />
                                </div>

                                <div className="flex flex-col whitespace-nowrap overflow-hidden">
                                  <span className="font-bold font-headings text-sm md:text-[15px] text-base-content group-hover:text-primary transition-colors duration-300 leading-tight truncate">
                                    {skill.name}
                                  </span>
                                  <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase text-primary/80 group-hover:text-primary mt-1 truncate transition-colors duration-300">
                                    {skill.level || "Expert"}
                                  </span>
                                </div>
                              </div>
                            </m.div>
                          ))}
                        </m.div>
                      ) : (
                        <div className="py-20 italic text-base-content/40 text-sm flex items-center justify-center gap-2">
                          <Icon icon="solar:ghost-bold-duotone" className="w-5 h-5" />
                          Data keahlian belum ditambahkan.
                        </div>
                      )}
                    </m.div>
                  </AnimatePresence>
                </div>
              </m.div>
            )}

            {activeTab === 'soft' && (
              <m.div
                key="soft-skills"
                id="panel-soft-skills"
                role="tabpanel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-6xl mx-auto"
              >
                <m.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 group/softlist"
                  variants={containerVariants}
                  initial={isBot ? "visible" : "hidden"}
                  animate="visible"
                >
                  {displayedSoftSkills.length > 0 ? (
                    displayedSoftSkills.map((skill, index) => (
                      <m.div
                        key={`soft-skill-${index}`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="relative group/item w-full"
                      >
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 group-focus-within/item:opacity-100 transition-opacity duration-300 aura aura-glow pointer-events-none -z-10"></div>

                        <div
                          tabIndex={0}
                          className="relative w-full p-5 md:p-6 rounded-2xl bg-base-200/90 border border-base-content/10 outline-none text-left flex flex-col justify-start cursor-pointer transition-[background-color,border-color,box-shadow] duration-300 hover:bg-base-100 focus-within:bg-base-100 z-10"
                        >
                          <div className="flex items-center gap-4 relative z-10 w-full">
                            <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(var(--s),0.5)] bg-secondary/50 group-hover/item:bg-secondary group-focus-within/item:bg-secondary transition-colors duration-300" />
                            <h3 className="font-bold text-base md:text-lg leading-tight text-base-content group-hover/item:text-secondary group-focus-within/item:text-secondary transition-colors duration-300">
                              {skill.name}
                            </h3>
                          </div>

                          <div className="grid grid-rows-[0fr] group-hover/item:grid-rows-[1fr] group-focus-within/item:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out relative z-10 w-full">
                            <div className="overflow-hidden">
                              <p className="text-sm text-base-content/80 pl-[26px] text-justify leading-relaxed border-l-2 border-secondary/20 ml-[5px] mt-3">
                                {skill.description}
                              </p>
                            </div>
                          </div>
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