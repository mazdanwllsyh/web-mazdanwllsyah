import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useSiteStore } from "../../stores/siteStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper.js";
import { isBot } from "../../App.jsx";

function History() {
  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const historyData = usePortfolioStore((state) => state.historyData);
  const isHistoryLoading = usePortfolioStore((state) => state.isHistoryLoading);
  const siteData = useSiteStore((state) => state.siteData);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeHistoryTab") || "pendidikan";
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistoryData();
  }, [fetchHistoryData]);

  useEffect(() => {
    const handleTabChange = () => {
      const savedTab = localStorage.getItem("activeHistoryTab");
      if (savedTab) {
        setActiveTab(savedTab);
      }
    };

    window.addEventListener("changeHistoryTab", handleTabChange);
    return () => {
      window.removeEventListener("changeHistoryTab", handleTabChange);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const activeData =
    activeTab === "pendidikan"
      ? historyData.education || []
      : historyData.experience || [];

  const sortedData = useMemo(() => {
    const getEndYear = (yearsString) => {
      if (!yearsString) return 0;
      const parts = yearsString.split(" - ");
      const endPart = parts[1] ? parts[1].trim() : "0";
      if (endPart.toLowerCase() === "sekarang") return 9999;
      const yearMatch = endPart.match(/\d{4}/);
      return yearMatch ? parseInt(yearMatch[0], 10) : 0;
    };
    return [...activeData].sort(
      (a, b) => getEndYear(b.years) - getEndYear(a.years),
    );
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
      employee: {
        "@type": "Person",
        name: siteData.brandNameShort,
        jobTitle: exp.detail,
      },
    })),
  };

  const TimelineSkeleton = ({ count = 3 }) => (
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-4 hover:cursor-wait">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          {index !== 0 && <hr className="bg-base-300" />}
          <div className="timeline-middle">
            <div className="skeleton w-6 h-6 rounded-full shrink-0"></div>
          </div>
          <div
            className={`mb-10 ${index % 2 === 0
              ? "timeline-start md:text-end"
              : "timeline-end md:text-start"
              }`}
          >
            <div className="card w-[17rem] md:w-[20rem] lg:w-[24rem] bg-base-100 shadow p-6">
              <div className="skeleton h-6 w-3/4 mb-3"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
          </div>
          {index !== count - 1 && <hr className="bg-base-300" />}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="min-h-[auto] xl:min-h-screen flex flex-col items-center justify-center py-11 lg:py-18 text-base-content relative z-10"
      id="histori"
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        <m.div
          className="text-center mb-10"
          initial={isBot ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-4 tracking-tight">
            History
          </h2>
          <div className="h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <m.p
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm md:text-base text-base-content/60 max-w-2xl mx-auto"
              >
                {activeTab === "pendidikan"
                  ? "Latar belakang pendidikan formal dan akademik saya."
                  : "Rekam jejak pengalaman profesional dan organisasi saya."}
              </m.p>
            </AnimatePresence>
          </div>
        </m.div>

        <div className="flex justify-center mb-12">
          <div className="bg-base-200/60 backdrop-blur-sm p-1.5 rounded-2xl flex gap-2 w-full max-w-md border border-base-content/5 shadow-sm relative z-20">
            <button
              onClick={() => {
                setActiveTab("pendidikan");
                localStorage.setItem("activeHistoryTab", "pendidikan");
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'pendidikan'
                ? 'bg-primary text-primary-content shadow-md shadow-primary/20 scale-100'
                : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50 scale-95 hover:scale-[0.98]'
                }`}
            >
              <Icon icon="mdi:school" className="w-5 h-5 shrink-0" />
              <span className="text-sm sm:text-base">Pendidikan</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("pengalaman");
                localStorage.setItem("activeHistoryTab", "pengalaman");
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 outline-none ${activeTab === 'pengalaman'
                ? 'bg-accent text-accent-content shadow-md shadow-accent/20 scale-100'
                : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50 scale-95 hover:scale-[0.98]'
                }`}
            >
              <Icon icon="mdi:briefcase" className="w-5 h-5 shrink-0" />
              <span className="text-sm sm:text-base">Pengalaman</span>
            </button>
          </div>
        </div>

        {loading || isHistoryLoading ? (
          <TimelineSkeleton count={activeData.length || 3} />
        ) : (
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-4">
            {sortedData.map((item, index) => (
              <li key={item._id}>
                {index !== 0 && <hr className={activeTab === "pendidikan" ? "bg-primary" : "bg-accent"} />}

                <div className="timeline-middle">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative shadow-md ${activeTab === "pendidikan"
                      ? "bg-primary text-primary-content shadow-primary/20"
                      : "bg-accent text-accent-content shadow-accent/20"
                    }`}>
                    <Icon
                      icon={
                        activeTab === "pendidikan"
                          ? "mdi:school-outline"
                          : "mdi:briefcase-outline"
                      }
                      className="w-5 h-5"
                    />
                  </div>
                </div>

                <m.div
                  initial={isBot ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: isBot ? 0 : 0.4 + index * 0.2 }}
                  className={`mb-10 flex items-start gap-4 xl:gap-8 w-full ${index % 2 === 0
                    ? "timeline-start md:text-end md:flex-row-reverse"
                    : "timeline-end md:text-start flex-row"
                    }`}
                >
                  {/* AVATAR RING */}
                  {item.logoUrl && (
                    <div className="avatar hidden xl:block shrink-0 self-start mt-3">
                      <div className={`w-20 h-20 rounded-full ring ring-offset-base-100 ring-offset-2 ${activeTab === "pendidikan" ? "ring-primary" : "ring-accent"
                        }`}>
                        <img
                          src={transformCloudinaryUrl(item.logoUrl, 128, 128)}
                          alt={`${item.institution} logo`}
                          width="80"
                          height="80"
                          loading="lazy"
                          className="w-full hover:scale-110 transition-transform duration-300 h-full rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="w-full flex flex-col items-stretch max-w-[18rem] sm:max-w-[20rem] md:max-w-[22rem] xl:max-w-[28rem]">
                    <div className="relative group w-full rounded-[var(--rounded-box,1rem)] transition-all duration-300 hover:-translate-y-2 focus-within:-translate-y-2 cursor-pointer">

                      <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity aura aura-dual z-0 pointer-events-none"></div>

                      {/* CARD BORDER & HOVER */}
                      <div
                        tabIndex={0}
                        className={`card w-full h-full bg-base-100 shadow-md border border-base-content/20 transition-all duration-300 focus:outline-none relative z-10 group-hover:shadow-xl group-focus-within:shadow-xl ${activeTab === "pendidikan"
                            ? "group-hover:border-primary group-focus-within:border-primary"
                            : "group-hover:border-accent group-focus-within:border-accent"
                          }`}
                      >
                        <div className="card-body p-6 md:p-8">
                          {/* CARD TITLE TEXT COLOR */}
                          <h3 className={`card-title text-xl lg:text-2xl font-bold font-display transition-colors duration-300 ${activeTab === "pendidikan" ? "group-hover:text-primary" : "group-hover:text-accent"
                            }`}>
                            {item.institution}
                          </h3>
                          {item.detail && (
                            <p className="text-sm md:text-base text-base-content/80 font-semibold text-justify mt-2">
                              {item.detail}
                            </p>
                          )}

                          <div className="flex items-center text-sm mt-4 justify-start font-semibold opacity-70 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
                            <Icon
                              icon="mdi:calendar-blank-outline"
                              className="w-5 h-5 mr-1"
                            />
                            <span>{item.years}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </m.div>

                {/* TIMELINE LINE (BOTTOM) */}
                {index !== sortedData.length - 1 && (
                  <hr className={activeTab === "pendidikan" ? "bg-primary" : "bg-accent"} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default History;