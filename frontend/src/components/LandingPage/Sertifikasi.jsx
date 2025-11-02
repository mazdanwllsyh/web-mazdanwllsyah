import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import AOS from "aos";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { useAppContext } from "../../context/AppContext.jsx";
import SeoHelmet from "../SEOHelmet.jsx";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { usePagination } from "../../hooks/usePagination";
import { usePortfolioData } from "../../context/PortofolioDataContext.jsx";

const SertifikasiSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="card bg-base-100 shadow-xl border border-base-300 overflow-hidden"
      >
        <div className="skeleton h-auto aspect-[849/600] w-full hover:cursor-wait"></div>
      </div>
    ))}
  </div>
);

function Sertifikasi() {
  const { sertifikatData, categories, isSertifikatLoading } =
    usePortfolioData();
  const { themeMode } = useAppContext();
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

  const paginationConfig = {
    sm: 3,
    md: 4,
    lg: 6,
  };

  const { currentItems, PaginationComponent } = usePagination(
    filteredSertifikat,
    paginationConfig
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const workerUrl = "workers/pdf.worker.min.js";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
      console.log("AOS refreshed in Sertifikasi");
    }
  }, [loading]);

  const handleOpenModal = (sertifikat) => {
    setSelectedCert(sertifikat);
    if (document.getElementById("sertifikasi_modal")) {
      document.getElementById("sertifikasi_modal").showModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedCert(null);
  };

  return (
    <>
      <SeoHelmet
        title="Sertifikasi"
        description="Lihat koleksi sertifikat profesional dan pencapaian akademis saya di bidang pengembangan web dan teknologi."
        url="/sertifikasi"
      />
      <div
        className="py-12 min-h-screen flex flex-col text-base-content"
        id="sertifikasi"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" data-aos="zoom-in-up">
            <h2 className="text-4xl font-bold font-display mb-2">
              Sertifikasi
            </h2>
            <p className="text-sm text-base-content/70">
              Beberapa sertifikat yang telah diperoleh
            </p>
          </div>

          {!isSertifikatLoading && !loading && (
            <div
              className="w-full max-w-5xl mx-auto flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-4 mb-8"
              data-aos="flip-down"
              data-aos-delay="100"
            >
              <div className="order-1 md:col-span-1 md:justify-self-start self-center">
                <PaginationComponent />
              </div>

              <div className="order-2 md:col-span-1 md:justify-self-center">
                <div className="relative w-full md:w-auto">
                  <Icon
                    icon="mdi:filter"
                    className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none z-10"
                  />
                  <select
                    className="select select-bordered w-full md:w-auto shadow-md pl-10 cursor-pointer"
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
              </div>

              <div className="order-3 md:col-span-1 w-full md:w-auto md:justify-self-end">
                <input
                  type="search"
                  placeholder="Cari sertifikat..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="input input-bordered w-full md:w-72 shadow-md"
                />
              </div>
            </div>
          )}

          {isSertifikatLoading || loading ? (
            <SertifikasiSkeleton count={sertifikatData.length || 3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
              {currentItems.map((cert, index) => (
                <div
                  key={index}
                  className="card bg-base-100 shadow-md overflow-hidden group border border-base-300 hover:shadow-lg transition-shadow duration-300"
                  data-aos="fade-down"
                  data-aos-delay={100 + index * 100}
                >
                  <figure className="relative aspect-[849/600]" tabIndex={0}>
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 group-focus-within:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-neutral bg-opacity-80 backdrop-blur-sm 
                                 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 ease-in-out 
                                 flex flex-col items-center justify-center text-center p-4 text-neutral-content hover:cursor-pointer hover:border-2 hover:border-primary"
                    >
                      <h3 className="text-xl font-bold font-display mb-1">
                        {cert.title}
                      </h3>
                      <div className="divider"></div>
                      <p className="text-sm mb-4">{cert.issuer}</p>
                      <button
                        onClick={() => handleOpenModal(cert)}
                        className="btn btn-accent btn-sm"
                      >
                        <Icon icon="mdi:eye" className="w-4 h-4 mr-1" />
                        Lihat Sertifikat
                      </button>
                    </div>
                  </figure>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <dialog
        id="sertifikasi_modal"
        className="modal modal-middle"
        onClose={handleCloseModal}
      >
        <div className="modal-box w-11/12 max-w-4xl h-auto">
          <form method="dialog" className="absolute right-4 top-4 z-10">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
          {selectedCert && (
            <h3 className="font-bold text-lg mb-4">{selectedCert.title}</h3>
          )}
          <div className="h-[75vh] overflow-y-auto">
            {selectedCert && selectedCert.type === "image" && (
              <img
                src={selectedCert.fileUrl}
                alt={selectedCert.title}
                className="w-full h-auto rounded-lg"
              />
            )}
            {selectedCert && selectedCert.type === "pdf" && (
              <Worker workerUrl={workerUrl}>
                <div style={{ height: "100%", width: "100%" }}>
                  <Viewer
                    fileUrl={selectedCert.fileUrl}
                    plugins={[defaultLayoutPluginInstance]}
                    theme={themeMode}
                  />
                </div>
              </Worker>
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
