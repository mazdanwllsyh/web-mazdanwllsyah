import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import AOS from "aos";
import { usePagination } from "../../hooks/usePagination";
import { usePortfolioData } from "../../context/PortofolioDataContext";

const GallerySkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto hover:cursor-wait">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden"
      >
        <div className="skeleton h-auto aspect-square w-full"></div>
        <div className="card-body p-4 space-y-2">
          <div className="skeleton h-4 w-1/2"></div>
          <div className="skeleton h-3 w-3/4"></div>
        </div>
      </div>
    ))}
  </div>
);

function Gallery() {
  const { projects, isProjectsLoading } = usePortfolioData();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useMemo(() => {
    if (!searchTerm) {
      return projects;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();

    return projects.filter(
      (proj) =>
        proj.title.toLowerCase().includes(lowerCaseSearch) ||
        proj.description.toLowerCase().includes(lowerCaseSearch) ||
        (proj.tags && proj.tags.toLowerCase().includes(lowerCaseSearch))
    );
  }, [searchTerm, projects]);

  const paginationConfig = {
    sm: 3,
    md: 4,
    lg: 6,
  };

  const { currentItems, PaginationComponent } = usePagination(
    filteredProjects,
    paginationConfig
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
      console.log("AOS refreshed in Gallery");
    }
  }, [loading]);

  return (
    <div
      className="py-12 min-h-screen flex flex-col items-center justify-center text-base-content"
      id="galeri"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl font-bold font-display mb-2">
            Galeri Proyek
          </h2>
          <p className="text-lg text-base-content/70">
            Beberapa proyek terakhir saya
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

        {(isProjectsLoading || loading) ? (
          <GallerySkeleton count={projects.length || 3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {currentItems.map((project, index) => (
              <div
                key={project._id}
                className="card bg-base-100 shadow-md border border-base-300 overflow-hidden group"
                data-aos="zoom-in"
                data-aos-delay={100 + index * 100}
              >
                <figure className="relative aspect-square focus:outline-none" tabIndex={0}>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:shadow-lg group-hover:scale-105 group-focus-within:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-5/5 bg-neutral bg-opacity-80 backdrop-blur-sm translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 ease-in-out flex flex-col items-center justify-center text-justify p-4 text-neutral-content">
                    <h3 className="text-xl font-bold font-display mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {project.tags &&
                        project.tags.split(",").map((tag) => (
                          <div key={tag} className="badge badge-accent text-xs">
                            {tag}
                          </div>
                        ))}
                    </div>
                    <div className="card-actions justify-center">
                      {project.demoUrl && project.demoUrl !== "#" ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary btn-sm"
                        >
                          <Icon icon="mdi:web" className="w-4 h-4 mr-1" />
                          Kunjungi
                        </a>
                      ) : (
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
