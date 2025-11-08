import React, { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import AOS from "aos";
import { usePagination } from "../../hooks/usePagination";
import { usePortfolioData } from "../../context/PortofolioDataContext";
import SeoHelmet from "../SEOHelmet";
import { transformCloudinaryUrl } from "../../utils/imageHelper";

const GallerySkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto hover:cursor-wait">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden"
      >
        <div className="skeleton aspect-square w-full"></div>
        <div className="card-body p-4 space-y-2">
          <div className="skeleton h-4 w-1/2"></div>
          <div className="skeleton h-3 w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

function Gallery() {
  const { projects, isProjectsLoading } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef(null);

  const shuffledProjects = useMemo(() => {
    const projectsCopy = [...projects];
    return shuffleArray(projectsCopy);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return shuffledProjects;
    const lower = searchTerm.toLowerCase();
    return shuffledProjects.filter(
      (proj) =>
        proj.title.toLowerCase().includes(lower) ||
        proj.description.toLowerCase().includes(lower) ||
        proj.tags?.toLowerCase().includes(lower)
    );
  }, [searchTerm, shuffledProjects]);

  const { currentItems, PaginationComponent } = usePagination(
    filteredProjects,
    {
      sm: 2,
      md: 4,
      lg: 6,
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) AOS.refresh();
  }, [loading]);

  // ⚠️ FIX: perbaiki scroll offset agar berhenti tepat di title (bukan di search bar)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#galeri" && sectionRef.current) {
      // 🟩 NEW: hitung offset berdasar header tinggi (lebih akurat untuk mobile)
      const header = document.querySelector("header");
      const headerOffset = header ? header.offsetHeight + 12 : 80; // tambahkan sedikit jarak ekstra
      const elementPosition =
        sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      requestAnimationFrame(() => {
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      });
    }
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-12 min-h-screen flex flex-col items-center justify-center text-base-content"
      id="galeri"
    >
      <SeoHelmet
        title="Galeri Proyek"
        description="Kumpulan proyek dan karya Mazda Nawallsyah dalam bidang web development."
        imageUrl={
          projects?.[0]?.imageUrl ||
          "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp"
        }
        url="/"
      />

      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold font-display mb-2">
            Galeri Proyek
          </h2>
          <p className="text-lg text-base-content/70">
            Beberapa proyek terakhir
          </p>
        </div>

        {!isProjectsLoading && !loading && (
          <div
            className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <div className="order-2 md:order-1 self-center md:self-auto">
              <PaginationComponent />
            </div>

            <div className="order-1 md:order-2 w-full max-w-sm mx-auto md:mx-0 md:w-72 lg:w-96">
              <input
                type="search"
                placeholder="Cari proyek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full shadow-lg"
              />
            </div>
          </div>
        )}

        {isProjectsLoading || loading ? (
          <GallerySkeleton count={projects.length || 3} />
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto"
            data-aos="fade-up"
          >
            {currentItems.map((project, index) => (
              <div
                key={project._id}
                className="card bg-base-100 shadow-md border border-base-300 overflow-hidden group focus-within:ring-2 focus-within:ring-primary transition-all"
                data-aos="zoom-in"
                data-aos-delay={100 + index * 100}
              >
                <figure
                  className="relative aspect-square focus:outline-none"
                  tabIndex={0}
                >
                  <img
                    src={transformCloudinaryUrl(project.imageUrl, 480, 480)}
                    alt={project.title}
                    width="320"
                    height="320"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 group-focus-within:scale-105"
                  />

                  {/* ⚠️ FIX: overlay sekarang menutupi penuh gambar di semua ukuran (touch + hover) */}
                  <div
                    className="absolute inset-0 bg-neutral bg-opacity-80 backdrop-blur-sm opacity-0 
                               group-hover:opacity-100 group-focus-within:opacity-100
                               transition-opacity duration-300 ease-in-out 
                               flex flex-col items-center justify-center text-justify p-4 text-neutral-content"
                  >
                    <h3 className="text-xl font-bold font-display mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {project.tags?.split(",").map((tag) => (
                        <div key={tag} className="badge badge-accent text-xs">
                          {tag}
                        </div>
                      ))}
                    </div>

                    <div className="card-actions justify-center">
                      {project.demoUrl && project.demoUrl !== "#" && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <Icon icon="mdi:web" className="w-4 h-4 mr-1" />
                          Kunjungi
                        </a>
                      )}
                      {project.sourceUrl && project.sourceUrl !== "#" && (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          <Icon icon="mdi:github" className="w-4 h-4 mr-1" />
                          Source Code
                        </a>
                      )}
                      {!project.demoUrl && !project.sourceUrl && (
                        <div
                          className="tooltip"
                          data-tip="Sedang dalam pengembangan"
                        >
                          <div className="btn btn-info btn-sm opacity-65 cursor-not-allowed">
                            <Icon
                              icon="mdi:web-clock"
                              className="w-4 h-4 mr-1"
                            />
                            Ongoing
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </figure>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
