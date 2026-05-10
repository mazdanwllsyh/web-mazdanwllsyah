import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { usePagination } from "../../hooks/usePagination";
import { useSiteStore } from "../../stores/siteStore";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { transformCloudinaryUrl } from "../../utils/imageHelper.js";
import SeoHelmet from "../SEOHelmet.jsx";

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

const SertifikasiSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto hover:cursor-wait">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="card bg-base-200 border border-base-content/10 shadow-xl overflow-hidden rounded-3xl">
        <div className="skeleton h-auto aspect-[849/600] w-full rounded-none"></div>
        <div className="card-body p-6 space-y-3">
          <div className="skeleton h-6 w-3/4"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

function Sertifikasi() {
  const fetchSertifikat = usePortfolioStore((state) => state.fetchSertifikat);
  const sertifikatData = usePortfolioStore((state) => state.sertifikatData);
  const isSertifikatLoading = usePortfolioStore((state) => state.isSertifikatLoading);

  useEffect(() => {
    import("@react-pdf-viewer/core/lib/styles/index.css");
    import("@react-pdf-viewer/default-layout/lib/styles/index.css");
  }, []);

  useEffect(() => {
    if (!sertifikatData || sertifikatData.length === 0) {
      fetchSertifikat();
    }
  }, [fetchSertifikat, sertifikatData.length]);

  const themeMode = useSiteStore((state) => state.getThemeMode());
  const categories = ["Semua", "Universitas", "Online Course", "Bootcamp", "Nasional", "Internasional"];
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCert, setSelectedCert] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredSertifikat = useMemo(() => {
    const byCategory = sertifikatData.filter((cert) => {
      if (activeCategory === "Semua") return true;
      return cert.category === activeCategory;
    });

    if (!searchTerm) {
      return byCategory;
    }
    return byCategory.filter(
      (cert) =>
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, activeCategory, sertifikatData]);

  const paginationConfig = { sm: 3, md: 4, lg: 6 };

  const { currentItems, PaginationComponent, currentPage } = usePagination(
    filteredSertifikat,
    paginationConfig
  );

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // FIX: Memanggil worker dari CDN dengan versi spesifik 3.11.174
  const workerUrl = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (sertifikat) => {
    setSelectedCert(sertifikat);
    if (document.getElementById("sertifikasi_modal")) {
      document.getElementById("sertifikasi_modal").showModal();
    }
  };

  const handleCloseModal = () => setSelectedCert(null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sertifikasi & Penghargaan",
    description: "Koleksi sertifikat profesional dan pencapaian akademis Mazda Nawallsyah",
    itemListElement: sertifikatData.map((cert, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        name: cert.title,
        credentialCategory: "Certificate",
        recognizedBy: {
          "@type": "Organization",
          name: cert.issuer,
        },
        image: cert.imageUrl,
        url: window.location.href,
      },
    })),
  };

  return (
    <>
      <SeoHelmet
        title="Sertifikat yang Diperoleh | Mazda Nawallsyah"
        description="Lihat koleksi sertifikat profesional dan pencapaian akademis Mazda Nawallsyah di bidang pengembangan web, React, dan teknologi."
        url="/sertifikasi"
      />

      <div
        className="bg-base-100 min-h-[auto] lg:min-h-screen flex flex-col items-center justify-center py-20 lg:py-16 text-base-content"
        id="sertifikasi"
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-2 tracking-tight">
              Sertifikasi
            </h2>
            <p className="text-base md:text-lg text-base-content/60">
              Beberapa sertifikat dan lisensi yang telah saya peroleh
            </p>
          </motion.div>

          {!isSertifikatLoading && !loading && (
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

              <div className="order-1 md:order-2 flex flex-col sm:flex-row gap-3 w-full md:w-auto ml-auto">
                <div className="relative w-full sm:w-48">
                  <Icon
                    icon="mdi:filter"
                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none z-10"
                  />
                  <select
                    className="select select-bordered w-full pl-10 rounded-2xl bg-base-200/50 cursor-pointer focus:bg-base-100 transition-colors"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    aria-label="Filter Kategori"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full sm:w-64 md:w-72">
                  <input
                    type="search"
                    placeholder="Cari sertifikat..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="input input-bordered w-full rounded-2xl bg-base-200/50 pl-10 focus:bg-base-100 transition-colors"
                  />
                  <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )}

          {isSertifikatLoading || loading ? (
            <SertifikasiSkeleton count={sertifikatData.length || 3} />
          ) : (
            <motion.div
              key={`cert-grid-${searchTerm}-${activeCategory}-${currentItems[0]?._id || 'empty'}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {currentItems.map((cert) => (
                <motion.div
                  key={cert._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  tabIndex={0}
                  className="card bg-base-200 border border-base-content/10 shadow-lg overflow-hidden group transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/5 rounded-3xl cursor-pointer focus:outline-none focus:border-primary"
                  onClick={() => handleOpenModal(cert)}
                >
                  <figure className="relative aspect-[849/600] w-full overflow-hidden border-b border-base-content/10 bg-base-300">
                    <img
                      src={transformCloudinaryUrl(cert.imageUrl, 700, 495)}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-focus:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base-200/90 via-base-200/20 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="btn btn-primary rounded-full shadow-lg scale-90 group-hover:scale-100 group-focus:scale-100 transition-transform duration-300">
                        <Icon icon="mdi:eye" className="w-5 h-5 mr-1" /> Lihat Detail
                      </button>
                    </div>
                  </figure>

                  <div className="card-body p-6 pt-5 space-y-1">
                    <h3 className="card-title text-lg font-display font-bold text-base-content line-clamp-2 leading-tight">
                      {cert.title}
                    </h3>
                    <p className="text-sm font-bold text-primary">{cert.issuer}</p>

                    <div className="mt-2 pt-4 border-t border-base-content/5">
                      <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1.5 bg-base-300 text-base-content border border-base-content/20 rounded-md inline-block">
                        {cert.category}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <dialog
        id="sertifikasi_modal"
        className="modal modal-bottom sm:modal-middle"
        onClose={handleCloseModal}
      >
        <div className="modal-box w-full sm:w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100 rounded-t-3xl sm:rounded-3xl relative">
          <div className="flex justify-between items-center p-4 bg-base-200 sticky top-0 z-20 shadow-sm border-b border-base-content/10">
            <h3 className="font-bold text-md sm:text-lg line-clamp-1 flex-1 mr-4 text-base-content">
              {selectedCert?.title || "Detail Sertifikat"}
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost bg-base-300 hover:bg-error hover:text-white">✕</button>
            </form>
          </div>

          <div className="w-full bg-base-300/20 flex items-center justify-center p-4 sm:p-6 min-h-[40vh]">
            {selectedCert && selectedCert.type === "image" && (
              <img
                src={selectedCert.fileUrl}
                alt={selectedCert.title}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-xl shadow-lg border border-base-content/10 bg-white"
              />
            )}

            {selectedCert && selectedCert.type === "pdf" && (
              <div className="w-full h-[60vh] sm:h-[75vh] bg-white rounded-xl overflow-hidden shadow-lg border border-base-content/10">
                <Worker workerUrl={workerUrl}>
                  <div style={{ height: "100%", width: "100%" }}>
                    <Viewer
                      fileUrl={selectedCert.fileUrl}
                      plugins={[defaultLayoutPluginInstance]}
                      theme={themeMode}
                      defaultScale={1}
                    />
                  </div>
                </Worker>
              </div>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default Sertifikasi;