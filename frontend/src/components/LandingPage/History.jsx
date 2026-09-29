import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";
import { usePortfolioStore, experienceBadges } from "../../stores/portfolioStore";
import { useSiteStore } from "../../stores/siteStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper.js";
import { isBot } from "../../App.jsx";

function History() {
  const { fetchHistoryData, historyData } = usePortfolioStore();
  const siteData = useSiteStore((state) => state.siteData);

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeHistoryTab") || "pendidikan");

  useEffect(() => {
    fetchHistoryData();
    const handleTabChange = () => setActiveTab(localStorage.getItem("activeHistoryTab") || "pendidikan");
    window.addEventListener("changeHistoryTab", handleTabChange);
    return () => window.removeEventListener("changeHistoryTab", handleTabChange);
  }, [fetchHistoryData]);

  const activeData = activeTab === "pendidikan" ? historyData.education || [] : historyData.experience || [];

  const sortedData = useMemo(() => {
    const getEndYear = (yearsString) => {
      if (!yearsString) return 0;
      const parts = yearsString.split(" - ");
      const endPart = parts[1] ? parts[1].trim() : "0";
      if (endPart.toLowerCase() === "sekarang") return 9999;
      const yearMatch = endPart.match(/\d{4}/);
      return yearMatch ? parseInt(yearMatch[0], 10) : 0;
    };
    return [...activeData].sort((a, b) => getEndYear(b.years) - getEndYear(a.years));
  }, [activeData]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteData.brandNameShort,
    jobTitle: siteData.jobTitle,
    url: "https://mazdaweb.bejalen.com",
    alumniOf: historyData.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      logo: edu.logoUrl,
      description: edu.detail,
    })),
    worksFor: historyData.experience.map((exp) => ({
      "@type": "Organization",
      name: exp.institution,
      logo: exp.logoUrl,
      employee: { "@type": "Person", name: siteData.brandNameShort, jobTitle: exp.detail },
    })),
  };

  return (
    <div className="min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-11 lg:py-18 text-base-content relative z-10" id="histori">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        <m.div
          className="text-center mb-10"
          initial={isBot ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          style={{ willChange: "transform, opacity" }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 tracking-tight">History</h2>
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <m.p
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm md:text-base text-base-content/80 font-medium max-w-2xl mx-auto"
              >
                {activeTab === "pendidikan" ? "Latar belakang pendidikan formal dan akademik saya." : "Rekam jejak pengalaman profesional dan organisasi saya."}
              </m.p>
            </AnimatePresence>
          </div>
        </m.div>

        <div className="flex justify-center mb-12">
          <div role="tablist" className="bg-base-200/60 backdrop-blur-sm p-1.5 rounded-2xl flex gap-2 w-full max-w-md border border-base-content/5 shadow-sm relative z-20">
            <button
              onClick={() => { setActiveTab("pendidikan"); localStorage.setItem("activeHistoryTab", "pendidikan"); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-[background-color,color,transform,box-shadow] duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'pendidikan' ? 'bg-primary text-primary-content shadow-md scale-100' : 'bg-transparent text-base-content/70 hover:bg-base-100/50 scale-95 hover:scale-[0.98]'}`}
            >
              <Icon icon="mdi:school" className="w-5 h-5 shrink-0" />
              <span className="text-sm sm:text-base">Pendidikan</span>
            </button>
            <button
              onClick={() => { setActiveTab("pengalaman"); localStorage.setItem("activeHistoryTab", "pengalaman"); }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-[background-color,color,transform,box-shadow] duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'pengalaman' ? 'bg-secondary text-secondary-content shadow-md scale-100' : 'bg-transparent text-base-content/70 hover:bg-base-100/50 scale-95 hover:scale-[0.98]'}`}
            >
              <Icon icon="mdi:briefcase" className="w-5 h-5 shrink-0" />
              <span className="text-sm sm:text-base">Pengalaman</span>
            </button>
          </div>
        </div>

        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-4">
          {sortedData.map((item, index) => (
            <li key={item._id}>
              {index !== 0 && <hr className={activeTab === "pendidikan" ? "bg-primary" : "bg-secondary"} />}
              <div className="timeline-middle">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative shadow-md ${activeTab === "pendidikan" ? "bg-primary text-primary-content" : "bg-secondary text-secondary-content"}`}>
                  <Icon icon={activeTab === "pendidikan" ? "mdi:school-outline" : "mdi:briefcase-outline"} className="w-5 h-5" />
                </div>
              </div>

              <m.div
                initial={isBot ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: isBot ? 0 : index * 0.1 }}
                style={{ willChange: "transform, opacity" }}
                className={`mb-10 flex items-start gap-4 xl:gap-8 w-full ${index % 2 === 0 ? "timeline-start md:text-end md:flex-row-reverse" : "timeline-end md:text-start flex-row"}`}
              >
                {item.logoUrl && (
                  <div className="avatar hidden xl:block shrink-0 self-start mt-3">
                    <div className={`w-20 h-20 rounded-full ring ring-offset-base-100 ring-offset-2 ${activeTab === "pendidikan" ? "ring-primary" : "ring-secondary"}`}>
                      <img src={transformCloudinaryUrl(item.logoUrl, 128, 128)} alt={`${item.institution} logo`} width="80" height="80" loading="lazy" className="w-full h-full rounded-full" />
                    </div>
                  </div>
                )}

                <div className="w-full flex flex-col items-stretch max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem] xl:max-w-[28rem]">
                  <div className="relative group w-full rounded-[1rem] transition-transform duration-300 hover:-translate-y-2 cursor-pointer">
                    {activeTab === "pengalaman" && (
                      <div className={`absolute -top-3 ${index % 2 === 0 ? "right-4 md:right-auto md:left-6" : "right-4 md:right-6"} z-20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-md uppercase bg-secondary text-secondary-content`}>
                        {item.badge || experienceBadges[index % experienceBadges.length]}
                      </div>
                    )}

                    <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity aura aura-dual z-0 pointer-events-none"></div>

                    <div className={`card w-full h-full bg-base-100 shadow-md border border-base-content/20 transition-[border-color,box-shadow] duration-300 relative z-10 group-hover:shadow-xl ${activeTab === "pendidikan" ? "group-hover:border-primary" : "group-hover:border-secondary"}`}>
                      <div className="card-body p-6 md:p-8">
                        <h3 className={`card-title text-xl lg:text-2xl font-bold font-display transition-colors duration-300 ${activeTab === "pendidikan" ? "group-hover:text-primary" : "group-hover:text-secondary"}`}>{item.institution}</h3>
                        {item.detail && <p className="text-sm md:text-base text-base-content/80 font-medium text-justify mt-2">{item.detail}</p>}
                        <div className="flex items-center text-sm mt-4 justify-start font-bold text-base-content/70">
                          <Icon icon="mdi:calendar-blank-outline" className="w-5 h-5 mr-1" />
                          <span>{item.years}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>

              {index !== sortedData.length - 1 && <hr className={activeTab === "pendidikan" ? "bg-primary" : "bg-secondary"} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;