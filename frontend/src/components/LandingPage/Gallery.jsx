import React, { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { usePagination } from "../../hooks/usePagination";
import { useProjectStore } from "../../stores/projectStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const GallerySkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto hover:cursor-wait">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="card bg-base-200 border border-base-content/40 shadow-xl overflow-hidden">
        <div className="skeleton h-56 w-full rounded-none"></div>
        <div className="flex justify-center -mt-5 relative z-10 gap-3">
          <div className="skeleton h-10 w-24 rounded-full"></div>
          <div className="skeleton h-10 w-24 rounded-full"></div>
        </div>
        <div className="card-body p-6 space-y-3">
          <div className="skeleton h-6 w-3/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-5/6"></div>
          <div className="skeleton h-4 w-4/6"></div>
        </div>
      </div>
    ))}
  </div>
);

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

function Gallery() {
  const projects = useProjectStore((state) => state.projects);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [fetchProjects, projects.length]);

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

  const { currentItems, PaginationComponent } = usePagination(filteredProjects, { sm: 2, md: 4, lg: 6 });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: currentItems.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        image: project.imageUrl,
        url: project.demoUrl !== "#" ? project.demoUrl : window.location.href,
      },
    })),
  };

  return (
    <div
      ref={sectionRef}
      className="bg-base-100 min-h-[auto] my-12 lg:min-h-screen flex flex-col items-center justify-center py-16 lg:py-20 scroll-mt-8 lg:scroll-mt-12 text-base-content"
      id="galeri"
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      <div className="w-full max-w-6xl mx-auto px-4 lg:px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">Galeri Proyek</h2>
          <p className="text-base md:text-lg text-base-content/60">Mahakarya dan studi kasus terbaru saya</p>
        </motion.div>

        {!isProjectsLoading && !loading && (
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 w-full"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="order-2 md:order-1 flex justify-center md:justify-start w-full md:w-auto">
              <PaginationComponent />
            </div>

            <div className="order-1 md:order-2 w-full max-w-md mx-auto md:mx-0 relative">
              <input
                type="search"
                placeholder="Cari proyek..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full rounded-2xl bg-base-200/50 pl-10 focus:bg-base-100 transition-colors"
              />
              <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 w-5 h-5" />
            </div>
          </motion.div>
        )}

        {isProjectsLoading || loading ? (
          <GallerySkeleton count={projects.length || 3} />
        ) : (
          <motion.div
            key={`grid-${searchTerm}-${currentItems[0]?._id || 'empty'}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {currentItems.map((project) => (
              <motion.div
                key={project._id}
                variants={itemVariants}
                className="card bg-base-200 border border-base-content/40 shadow-lg overflow-visible group hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 rounded-3xl"
              >
                <figure className="relative h-56 w-full overflow-hidden rounded-t-3xl border-b border-base-content/10 bg-base-300">
                  <img
                    src={transformCloudinaryUrl(project.imageUrl, 600, 400)}
                    alt={`Preview ${project.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-200/80 to-transparent opacity-50 group-hover:opacity-10 transition-opacity"></div>
                </figure>

                <div className="flex justify-center gap-3 -mt-5 relative z-10 px-2">
                  {(!project.demoUrl || project.demoUrl === "#") && (!project.sourceUrl || project.sourceUrl === "#") ? (
                    <div className="tooltip tooltip-bottom tooltip-warning cursor-help" data-tip="Proyek masih tahap pengembangan">
                      <div className="badge badge-warning shadow-md py-3 px-4 font-bold gap-2 text-xs border border-base-content/40">
                        <Icon icon="mdi:progress-wrench" className="w-4 h-4" /> Pengembangan
                      </div>
                    </div>
                  ) : (
                    <>
                      {project.demoUrl && project.demoUrl !== "#" && (
                        <div className="tooltip tooltip-bottom tooltip-primary" data-tip="Lihat Live Demo">
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm bg-base-100 text-base-content hover:bg-primary hover:text-primary-content hover:border-primary shadow-md rounded-full border border-base-content/20 px-4 transition-all"
                          >
                            <Icon icon="mdi:external-link" className="w-4 h-4" /> Demo
                          </a>
                        </div>
                      )}
                      {project.sourceUrl && project.sourceUrl !== "#" && (
                        <div className="tooltip tooltip-bottom tooltip-secondary" data-tip="Lihat Source Code">
                          <a
                            href={project.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm bg-base-100 text-base-content hover:bg-secondary hover:text-secondary-content hover:border-secondary shadow-md rounded-full border border-base-content/20 px-4 transition-all"
                          >
                            <Icon icon="mdi:github" className="w-4 h-4" /> Source
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="card-body p-6 pt-4 space-y-2">
                  <h3 className="card-title text-xl font-display font-bold text-base-content">
                    {project.title}
                  </h3>

                  <p className="text-sm text-base-content/70 text-justify leading-relaxed break-words">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-base-content/5">
                    {project.tags?.split(",").map((tag) => (
                      <span key={tag} className="text-[11px] font-black tracking-wider px-2 py-1 bg-base-300 text-base-content border border-base-content/40 rounded-md">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Gallery;