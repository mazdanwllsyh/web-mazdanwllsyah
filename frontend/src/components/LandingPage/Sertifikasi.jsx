import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import AOS from "aos";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { useAppContext } from "../../context/AppContext.jsx";
import { Helmet } from "react-helmet-async";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { usePagination } from "../../hooks/usePagination";
import { usePortfolioData } from "../../context/PortofolioDataContext.jsx";
import { transformCloudinaryUrl } from "../../utils/imageHelper.js";

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
  useEffect(() => {
    import("@react-pdf-viewer/core/lib/styles/index.css");
    import("@react-pdf-viewer/default-layout/lib/styles/index.css");
  }, []);

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

  const paginationConfig = { sm: 3, md: 4, lg: 6 };

  const { currentItems, PaginationComponent } = usePagination(
    filteredSertifikat,
    paginationConfig
  );

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const workerUrl = "workers/pdf.worker.min.js";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading]);

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
    description:
      "Koleksi sertifikat profesional dan pencapaian akademis Mazda Nawallsyah",
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
      <Helmet>
        <title>Sertifikat yang Diperoleh | Mazda Nawallsyah</title>
        <meta
          name="description"
          content="Lihat koleksi sertifikat profesional dan pencapaian akademis Mazda Nawallsyah di bidang pengembangan web, React, dan teknologi."
        />
        <meta property="og:title" content="Sertifikasi | Mazda Nawallsyah" />
        <meta
          property="og:description"
          content="Lihat koleksi sertifikat profesional dan pencapaian akademis saya."
        />

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

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
                      src={transformCloudinaryUrl(cert.imageUrl, 700, 495)}
                      alt={cert.title}
                      width="849"
                      height="600"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
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
        className="modal sm:modal-middle"
        onClose={handleCloseModal}
      >
        <div className="modal-box w-full sm:w-11/12 max-w-4xl p-0 overflow-hidden bg-base-100 rounded-t-2xl sm:rounded-2xl relative">
          <div className="flex justify-between items-center p-4 bg-base-200 sticky top-0 z-20 shadow-sm">
            <h3 className="font-bold text-md sm:text-lg line-clamp-1 flex-1 mr-4">
              {selectedCert?.title || "Detail Sertifikat"}
            </h3>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost">✕</button>
            </form>
          </div>

          <div className="w-full bg-base-300/10 flex items-center justify-center p-0 sm:p-4">
            {selectedCert && selectedCert.type === "image" && (
              <img
                src={selectedCert.fileUrl}
                alt={selectedCert.title}
                className="w-full h-auto max-h-[60vh] sm:max-h-[80vh] object-contain mx-auto rounded-none sm:rounded-lg"
              />
            )}

            {selectedCert && selectedCert.type === "pdf" && (
              <div className="w-full h-[350px] sm:h-[75vh] bg-white">
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
