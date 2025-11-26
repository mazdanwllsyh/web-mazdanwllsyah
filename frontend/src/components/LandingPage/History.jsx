import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import AOS from "aos";
import { Helmet } from "react-helmet-async"; 
import { usePortfolioData } from "../../context/PortofolioDataContext"; 
import { transformCloudinaryUrl } from "../../utils/imageHelper.js"; 
import { useAppContext } from "../../context/AppContext"; 

function History() {
  const { historyData, isHistoryLoading } = usePortfolioData();
  const { siteData } = useAppContext();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeHistoryTab") || "pendidikan";
  });

  const [loading, setLoading] = useState(true);

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
    if (!loading) {
      setTimeout(() => AOS.refresh(), 100);
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const activeData =
    activeTab === "pendidikan" ? historyData.education : historyData.experience;

  const sortedData = useMemo(() => {
    const getEndYear = (yearsString) => {
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
            className={`mb-10 ${
              index % 2 === 0
                ? "timeline-start md:text-end"
                : "timeline-end md:text-start"
            }`}
          >
            <div className="card w-full md:w-[18rem] bg-base-100 shadow p-6">
              <div className="skeleton h-4 w-1/2 mb-2"></div>
              <div className="skeleton h-3 w-3/4"></div>
            </div>
          </div>
          {index !== count - 1 && <hr className="bg-base-300" />}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="bg-base-100 min-h-screen flex flex-col items-center justify-center"
      id="histori"
    >
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold font-display mb-2">History</h2>
          <p className="text-sm text-base-content/50">
            Perjalanan {activeTab} saya
          </p>
        </div>

        <div
          className="tabs justify-center mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <button
            className={`tab tab-lg tab-bordered bg-base-200 border-primary mx-2 rounded-lg ${
              activeTab === "pendidikan" ? "tab-active" : ""
            }`}
            onClick={() => {
              setActiveTab("pendidikan");
              localStorage.setItem("activeHistoryTab", "pendidikan");
            }}
          >
            <Icon icon="mdi:school" className="w-5 h-5 mr-2" />
            Pendidikan
          </button>
          <button
            className={`tab tab-lg tab-bordered bg-base-200 border-primary mx-2 rounded-lg ${
              activeTab === "pengalaman" ? "tab-active" : ""
            }`}
            onClick={() => {
              setActiveTab("pengalaman");
              localStorage.setItem("activeHistoryTab", "pengalaman");
            }}
          >
            <Icon icon="mdi:briefcase" className="w-5 h-5 mr-2" />
            Pengalaman
          </button>
        </div>

        {loading || isHistoryLoading ? (
          <TimelineSkeleton count={activeData.length || 3} />
        ) : (
          <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical px-4">
            {sortedData.map((item, index) => (
              <li key={item._id}>
                {index !== 0 && <hr className="bg-primary" />}
                <div className="timeline-middle">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-content">
                    <Icon
                      icon={
                        activeTab === "pendidikan"
                          ? "mdi:school-outline"
                          : "mdi:briefcase-outline"
                      }
                      className="w-4 h-4"
                    />
                  </div>
                </div>
                <div
                  data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
                  data-aos-delay="200"
                  className={`mb-10 flex items-start gap-4 ${
                    index % 2 === 0
                      ? "timeline-start md:text-end flex-row-reverse md:flex-row-reverse"
                      : "timeline-end md:text-start flex-row md:flex-row"
                  }`}
                >
                  {item.logoUrl ? (
                    <div className="avatar hidden lg:block">
                      <div className="w-16 h-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                        <img
                          src={transformCloudinaryUrl(item.logoUrl, 128, 128)}
                          alt={`${item.institution} logo`}
                          width="64"
                          height="64"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="hidden w-16 h-16 shrink-0"></div>
                  )}

                  <div
                    className={`mb-3 group ${
                      index % 2 === 0
                        ? "timeline-start md:text-end"
                        : "timeline-end md:text-start"
                    }`}
                  >
                    <div
                      tabIndex={0}
                      className="card w-[17rem] md:w-[20rem] lg:w-[24rem] bg-base-100 shadow-md border border-base-300 cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:border-primary hover:bg-base-200 hover:shadow-lg focus:outline-none focus-within:-translate-y-2 focus-within:border-primary focus-within:bg-base-200 focus-within:shadow-lg"
                    >
                      <div className="card-body p-6">
                        <h3 className="card-title text-lg font-bold font-display">
                          {item.institution}
                        </h3>
                        {item.detail && (
                          <p className="text-sm text-base-content/70 text-justify">
                            {item.detail}
                          </p>
                        )}
                        <div className="flex items-center text-xs mt-2 text-base-content/60">
                          <Icon
                            icon="mdi:calendar-blank-outline"
                            className="w-4 h-4 mr-1"
                          />
                          <span>{item.years}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
