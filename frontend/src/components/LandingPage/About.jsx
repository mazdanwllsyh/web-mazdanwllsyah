import React, { useState, useEffect, useRef, useMemo } from "react";
import { HashLink } from "react-router-hash-link";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useAppContext } from "../../context/AppContext";
import { usePortfolioData } from "../../context/PortofolioDataContext";
import AOS from "aos";

function About() {
  const [loading, setLoading] = useState(true);
  const { siteData } = useAppContext();

  const { historyData, projects, sertifikatData } = usePortfolioData();

  const profileImages = siteData?.profileImages || [];
  useEffect(() => {}, [profileImages, loading]);

  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
      console.log("AOS refreshed in About");
    }
  }, [loading]);

  useEffect(() => {
    if (profileImages.length > 1 && !loading) {
      const intervalId = setInterval(() => {
        setCurrentIndices((prevIndices) => {
          const nextIndex0 = (prevIndices[0] + 1) % profileImages.length;
          const nextIndex1 = (prevIndices[1] + 1) % profileImages.length;
          const nextIndex2 = (prevIndices[2] + 1) % profileImages.length;
          return [nextIndex0, nextIndex1, nextIndex2];
        });
      }, 10000);

      return () => clearInterval(intervalId);
    }
  }, [profileImages.length, loading]);

  const stats = useMemo(() => {
    // Hitung jumlah data
    const experienceCount = historyData.experience?.length || 0;
    const projectCount = projects?.length || 0;
    const sertifikatCount = sertifikatData?.length || 0;

    return [
      {
        icon: "mdi:briefcase-check",
        value: `${experienceCount}`,
        label: "Pengalaman",
        link: "/#histori",
      },
      {
        icon: "mdi:flask",
        value: `${projectCount}`,
        label: "Proyek",
        link: "/#galeri",
      },
      {
        icon: "mdi:certificate",
        value: `${sertifikatCount}`,
        label: "Sertifikat",
        link: "/sertifikasi",
      },
    ];
  }, [historyData, projects, sertifikatData]);

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

  return (
    <div className="py-16 bg-base-100 text-base-content" id="tentang">
      <SeoHelmet
        title="Tentang Saya"
        description={
          siteData.aboutParagraph
            ? siteData.aboutParagraph.substring(0, 160)
            : "Pelajari lebih lanjut tentang saya, pengalaman, dan proyek."
        }
        url="/tentang"
      />
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center lg:grid lg:grid-cols-2 lg:gap-6 lg:items-center">
          {/* Elemen #1: Judul */}
          <div
            className="w-full order-1 lg:order-none lg:col-start-2 text-center lg:text-left max-w-lg"
            data-aos="fade-left"
          >
            {loading ? (
              <TextSkeleton />
            ) : (
              <div
                className={`transition-opacity duration-500 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              >
                <h2 className="text-4xl font-bold font-display mb-4">
                  Tentang Saya
                </h2>
              </div>
            )}
          </div>

          {/* Elemen #2: Foto */}
          <div
            className="py-8 flex flex-col items-center lg:items-center order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-3"
            data-aos="fade-right"
          >
            {loading ? (
              <PhotoSkeleton />
            ) : (
              <div
                className={`relative w-64 h-80 md:w-80 md:h-96 transition-opacity duration-500 ${
                  loading ? "opacity-0" : "opacity-100"
                }`}
              >
                {profileImages.length > 2 && (
                  <div
                    className="card absolute inset-0 bg-base-300 shadow-xl transform -rotate-9 translate-x-1 translate-y-2 overflow-hidden"
                    aria-hidden="true"
                  >
                    <figure className="h-full w-full">
                      <img
                        src={profileImages[currentIndices[2]]}
                        alt="Background image 3"
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  </div>
                )}
                {profileImages.length > 1 && (
                  <div
                    className="card absolute inset-0 bg-base-200 shadow-xl transform rotate-15 -translate-x-1 overflow-hidden"
                    aria-hidden="true"
                  >
                    <figure className="h-full w-full">
                      <img
                        src={profileImages[currentIndices[1]]}
                        alt="Background image 2"
                        className="w-full h-full object-cover"
                      />
                    </figure>
                  </div>
                )}
                {profileImages.length > 0 && (
                  <div className="card absolute inset-0 bg-base-100 shadow-xl z-10 overflow-hidden">
                    <figure className="h-full w-full">
                      <img
                        src={profileImages[currentIndices[0]]}
                        alt="Foto Mazda Nawallsyah"
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
                  "Paragraf tentang Anda akan muncul di sini."}
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

          <div
            className="w-full order-5 lg:order-none lg:col-start-2 max-w-lg"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {stats.map((stat, index) => (
                  <HashLink
                    to={stat.link}
                    key={stat.label}
                    smooth={stat.link.startsWith("#")}
                    data-aos="fade-up"
                    data-aos-delay={100 + index * 100}
                    className="card bg-base-100 shadow-md border border-base-300 p-4 text-center hover:shadow-lg transition-all duration-300 hover:bg-base-200 hover:scale-[1.03] transform hover:cursor-pointer no-underline group"
                  >
                    <div
                      className={`transition-opacity duration-500 ${
                        loading ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      <Icon
                        icon={stat.icon}
                        className="w-8 h-8 text-primary mx-auto mb-2"
                      />
                      <div className="text-2xl font-bold font-display">
                        {stat.value}
                      </div>
                      <div className="text-base-content/70">{stat.label}</div>
                    </div>
                  </HashLink>
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
