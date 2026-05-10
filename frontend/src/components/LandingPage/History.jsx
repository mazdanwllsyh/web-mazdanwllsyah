import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useSiteStore } from "../../stores/siteStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper.js";

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
    const isEducationEmpty = !historyData.education || historyData.education.length === 0;
    const isExperienceEmpty = !historyData.experience || historyData.experience.length === 0;

    if (isEducationEmpty && isExperienceEmpty) {
      fetchHistoryData();
    }
  }, [fetchHistoryData, historyData.education, historyData.experience]);

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

  const activeData = activeTab === "pendidikan"
    ? (historyData.education || [])
    : (historyData.experience || []);

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
      (a, b) => getEndYear(b.years) - getEndYear(a.years)
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
      className="bg-base-100 min-h-[auto] lg:min-h-screen flex flex-col items-center justify-center py-16 lg:py-0 scroll-mt-16 lg:scroll-mt-24"
      id="histori"
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="w-full max-w-6xl mx-auto px-0 lg:px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">History</h2>
          <p className="text-base md:text-lg text-base-content/60">
            Perjalanan {activeTab} saya
          </p>
        </motion.div>

        <motion.div
          className="tabs justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <button
            className={`tab tab-lg tab-bordered bg-base-200 border-primary mx-2 rounded-lg font-bold ${activeTab === "pendidikan" ? "tab-active text-primary" : ""
              }`}
            onClick={() => {
              setActiveTab("pendidikan");
              localStorage.setItem("activeHistoryTab", "pendidikan");
            }}
          >
            <Icon icon="mdi:school" className="w-6 h-6 mr-2" />
            Pendidikan
          </button>
          <button
            className={`tab tab-lg tab-bordered bg-base-200 border-primary mx-2 rounded-lg font-bold ${activeTab === "pengalaman" ? "tab-active text-primary" : ""
              }`}
            onClick={() => {
              setActiveTab("pengalaman");
              localStorage.setItem("activeHistoryTab", "pengalaman");
            }}
          >
            <Icon icon="mdi:briefcase" className="w-6 h-6 mr-2" />
            Pengalaman
          </button>
        </motion.div>

        {loading || isHistoryLoading ? (
          <TimelineSkeleton count={activeData.length || 3} />
        ) : (
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-4">
            {sortedData.map((item, index) => (
              <li key={item._id}>
                {index !== 0 && <hr className="bg-primary" />}
                <div className="timeline-middle">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content z-10 relative">
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
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`mb-10 flex items-start gap-5 lg:gap-8 ${index % 2 === 0
                    ? "timeline-start md:text-end flex-row-reverse md:flex-row-reverse"
                    : "timeline-end md:text-start flex-row md:flex-row"
                    }`}
                >
                  {item.logoUrl && (
                    <div className="avatar hidden lg:block">
                      <div className="w-20 h-20 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                        <img
                          src={transformCloudinaryUrl(item.logoUrl, 128, 128)}
                          alt={`${item.institution} logo`}
                          width="80"
                          height="80"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className={`mb-3 group ${index % 2 === 0
                      ? "timeline-start md:text-end"
                      : "timeline-end md:text-start"
                      }`}
                  >
                    <div
                      tabIndex={0}
                      className="card w-[18rem] md:w-[20rem] lg:w-[28rem] bg-base-100 shadow-md border border-base-content/20 cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:border-primary hover:bg-base-200 hover:shadow-xl focus:outline-none focus-within:-translate-y-2 focus-within:border-primary focus-within:bg-base-200 focus-within:shadow-xl"
                    >
                      <div className="card-body p-6 md:p-8">
                        <h3 className="card-title text-xl lg:text-2xl font-bold font-display">
                          {item.institution}
                        </h3>
                        {item.detail && (
                          <p className="text-sm md:text-base text-base-content/70 text-justify mt-2">
                            {item.detail}
                          </p>
                        )}
                        <div className="flex items-center text-sm mt-4 text-primary font-bold">
                          <Icon
                            icon="mdi:calendar-blank-outline"
                            className="w-5 h-5 mr-1"
                          />
                          <span>{item.years}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {index !== sortedData.length - 1 && (
                  <hr className="bg-primary" />
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