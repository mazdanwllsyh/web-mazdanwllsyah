import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioData } from "../../context/PortofolioDataContext";
import AOS from "aos";

const SkillsSkeleton = () => (
  // Diubah menjadi flex-col untuk mencerminkan layout baru
  <div className="flex flex-col items-center gap-8 md:gap-12 max-w-4xl mx-auto hover:cursor-wait">
    {/* Skeleton Kolom Kanan (Soft Skills) - SEKARANG DI ATAS */}
    <div className="card bg-base-200 shadow-xl p-4 w-full">
      <div className="skeleton h-6 w-1/3 mb-4 mx-auto"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="skeleton h-5 w-5 rounded-full shrink-0"></div>{" "}
            <div className="skeleton h-4 w-4/5"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Skeleton Kolom Kiri (Hard Skills) - SEKARANG DI BAWAH */}
    <div className="card bg-base-200 shadow-xl p-4 w-full">
      <div className="skeleton h-6 w-1/3 mb-4 mx-auto"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-base-100 rounded-lg shadow flex items-center space-x-3 border border-base-300"
          >
            <div className="skeleton h-8 w-8 rounded-full shrink-0"></div>{" "}
            <div className="w-full space-y-2">
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-3 w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function Skills() {
  const { skillsData, isSkillsLoading } = usePortfolioData();
  const [loading, setLoading] = useState(true);

  const displayedHardSkills = skillsData.hardSkills || [];
  const displayedSoftSkills = skillsData.softSkills || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);

  return (
    <div
      className="bg-base-100 text-base-content min-h-screen flex flex-col items-center justify-center"
      id="skills"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold font-display mb-2">Kemampuan</h2>
        </div>

        {isSkillsLoading ? (
          <SkillsSkeleton />
        ) : (
          <div className="flex flex-col items-center gap-8 md:gap-12 max-w-4xl mx-auto">
            <div
              className="card shadow-md p-4 border border-base-300 w-full"
              data-aos="zoom-out-up"
            >
              <h3 className="text-lg font-bold font-display mb-4 text-center">
                Soft Skills
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8">
                {displayedSoftSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-5 h-5 text-success flex-shrink-0"
                    />
                    <p className="text-sm">{skill}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="card shadow-md p-4 border border-base-300 w-full"
              data-aos="zoom-in-up"
              data-aos-delay="100"
            >
              <h3 className="text-lg font-bold font-display mb-4 text-center">
                Hard Skills
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {displayedHardSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 rounded-lg shadow flex items-center space-x-3 border border-base-300 cursor-pointer transition-all duration-300 ease-in-out hover:scale-102 hover:bg-base-200 hover:shadow-lg hover:border-primary"
                  >
                    <Icon icon={skill.icon} className="w-8 h-8 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{skill.name}</p>
                      <p className="text-sm text-base-content/70">
                        {skill.level}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Skills;
