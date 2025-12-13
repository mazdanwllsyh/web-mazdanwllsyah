import React, { useState, useEffect, useMemo } from "react";
import { HashLink } from "react-router-hash-link";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useSiteStore } from "../../stores/siteStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import AOS from "aos";

function About() {
  const [loading, setLoading] = useState(true);

  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const fetchProjects = usePortfolioStore((state) => state.fetchProjects);
  const fetchSertifikat = usePortfolioStore((state) => state.fetchSertifikat);

  const siteData = useSiteStore((state) => state.siteData);
  const historyData = usePortfolioStore((state) => state.historyData);
  const projects = usePortfolioStore((state) => state.projects);
  const sertifikatData = usePortfolioStore((state) => state.sertifikatData);

  const profileImages = siteData?.profileImages || [];
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const isHistoryEmpty = (!historyData.education || historyData.education.length === 0) &&
      (!historyData.experience || historyData.experience.length === 0);
    if (isHistoryEmpty) fetchHistoryData();

    if (!projects || projects.length === 0) fetchProjects();

    if (!sertifikatData || sertifikatData.length === 0) fetchSertifikat();

  }, [fetchHistoryData, fetchProjects, fetchSertifikat, historyData, projects, sertifikatData]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) AOS.refresh();
  }, [loading]);

  useEffect(() => {
    if (profileImages.length > 1 && !loading) {
      const intervalId = setInterval(() => {
        setCurrentIndices((prev) => [
          (prev[0] + 1) % profileImages.length,
          (prev[1] + 1) % profileImages.length,
          (prev[2] + 1) % profileImages.length,
        ]);
      }, 7700);
      return () => clearInterval(intervalId);
    }
  }, [profileImages.length, loading]);

  const PhotoSkeleton = () => (
    <div className="flex flex-col items-center lg:items-center w-full hover:cursor-wait">
      <div className="skeleton w-64 h-80 md:w-80 md:h-96 rounded-lg shadow-lg mb-4"></div>
    </div>
  );
  const ButtonSkeleton = () => (
    <div className="skeleton h-12 w-48 rounded-lg mx-auto lg:mx-0 hover:cursor-wait"></div>
  );
  const TextSkeleton = () => (
    <div className="space-y-4 mb-6">
      <div className="skeleton h-8 w-1/2 mx-auto lg:mx-0 hover:cursor-wait"></div>
    </div>
  );
  const ParagraphSkeleton = () => (
    <div className="space-y-2 py-6 hover:cursor-wait">
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-full"></div>
      <div className="skeleton h-4 w-5/6"></div>
    </div>
  );
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="card bg-base-100 shadow-md border border-base-300 p-4 text-center"
        >
          <div className="space-y-2 flex flex-col items-center hover:cursor-wait">
            <div className="skeleton h-8 w-8 rounded-full"></div>
            <div className="skeleton h-5 w-1/2"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const stats = useMemo(() => {
    return [
      {
        icon: "mdi:briefcase-check",
        value: `${historyData.experience?.length || 0}`,
        label: "Pengalaman",
        link: "/#histori",
        tooltip: "Lihat riwayat pengalaman saya" 
      },
      {
        icon: "mdi:flask",
        value: `${projects?.length || 0}`,
        label: "Proyek",
        link: "/#galeri",
        tooltip: "Jelajahi galeri proyek saya" 
      },
      {
        icon: "mdi:certificate",
        value: `${sertifikatData?.length || 0}`,
        label: "Sertifikat",
        link: "/sertifikasi",
        tooltip: "Cek koleksi sertifikat & lisensi" 
      },
    ];
  }, [historyData, projects, sertifikatData]);

  const handleStatClick = (label) => {
    if (label === "Pengalaman") {
      localStorage.setItem("activeHistoryTab", "pengalaman");
      window.dispatchEvent(new Event("changeHistoryTab"));
    }
  };

  return (
    <div className="py-16 bg-base-100 text-base-content" id="tentang">
      <SeoHelmet />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-6 lg:items-center">
          <div
            className="w-full order-1 lg:order-none lg:col-start-2 text-center lg:text-left max-w-lg"
            data-aos="fade-left"
          >
            {loading ? (
              <TextSkeleton />
            ) : (
              <div
                className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"
                  }`}
              >
                <h2 className="text-4xl font-bold font-display mb-4">
                  Tentang Saya
                </h2>
              </div>
            )}
          </div>

          <div className="py-8 flex flex-col items-center lg:items-center order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-3">
            {loading ? (
              <PhotoSkeleton />
            ) : (
              <div
                className={`relative w-64 h-80 md:w-80 md:h-96 transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"
                  }`}
              >
                {profileImages.length > 2 && (
                  <div
                    className="card absolute inset-0 bg-base-300 shadow-xl transform -rotate-9 translate-x-1 translate-y-2 overflow-hidden"
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    <figure className="h-full w-full">
                      <img
                        src={profileImages[currentIndices[2]]}
                        alt="bg3"
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  </div>
                )}
                {profileImages.length > 1 && (
                  <div
                    className="card absolute inset-0 bg-base-200 shadow-xl transform rotate-12 -translate-x-1 overflow-hidden"
                    data-aos="fade-up-right"
                    data-aos-delay="520"
                  >
                    <figure className="h-full w-full">
                      <img
                        src={profileImages[currentIndices[1]]}
                        alt="bg2"
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  </div>
                )}
                {profileImages.length > 0 && (
                  <div
                    className="card absolute inset-0 bg-base-100 shadow-xl z-10 overflow-hidden"
                    data-aos="fade-down-left"
                    data-aos-delay="1880"
                  >
                    <figure className="h-full w-full">
                      <img
                        src={profileImages[currentIndices[0]]}
                        alt="main"
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="w-full order-3 lg:order-none lg:col-start-2 text-center lg:text-left max-w-lg"
            data-aos="zoom-in-up"
            data-aos-delay="300"
          >
            {loading ? (
              <ParagraphSkeleton />
            ) : (
              <p
                className="py-6 text-base md:text-md text-base-content/80 text-justify"
                data-aos="zoom-out-down"
                data-aos-delay="250"
              >
                {siteData.aboutParagraph ||
                  "Paragraf tentang Saya akan muncul di sini."}
              </p>
            )}
          </div>

          <div className="flex justify-center items-center order-4 lg:hidden mt-6">
            {loading ? (
              <ButtonSkeleton />
            ) : (
              <HashLink
                to="/sertifikasi"
                className={`btn btn-secondary group flex lg:hidden`}
              >
                Sertifikasi Saya
                <Icon
                  icon="mdi:arrow-right"
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                />
              </HashLink>
            )}
          </div>

          <div className="w-full order-5 lg:order-none lg:col-start-2 max-w-lg" data-aos="fade-left" data-aos-delay="200">
            {loading ? <StatsSkeleton /> : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6" tabIndex={0}>
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="tooltip tooltip-bottom w-full"
                    data-tip={stat.tooltip}
                  >
                    <HashLink
                      to={stat.link}
                      smooth={stat.link.startsWith("/#")}
                      onClick={() => handleStatClick(stat.label)}
                      data-aos="fade-up"
                      data-aos-delay={100 + index * 100}
                      className="card bg-base-100 shadow-md border border-base-300 p-4 text-center hover:shadow-lg transition-all duration-300 hover:bg-base-200 hover:scale-[1.03] transform hover:cursor-pointer no-underline group focus:outline-none focus-within:scale-102 w-full h-full block"
                    >
                      <div className={`transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"}`}>
                        <Icon icon={stat.icon} className="w-8 h-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold font-display">{stat.value}</div>
                        <div className="text-base-content/70">{stat.label}</div>
                      </div>
                    </HashLink>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
