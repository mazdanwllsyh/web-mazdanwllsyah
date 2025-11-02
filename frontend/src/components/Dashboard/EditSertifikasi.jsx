import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioData } from "../../context/PortofolioDataContext";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import { usePagination } from "../../hooks/usePagination";
import { useAppContext } from "../../context/AppContext.jsx";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  name,
  type = "text",
}) => (
  <div className="relative form-control">
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder=" "
      className="input input-bordered w-full pt-4 peer text-base"
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
    >
      {label}
    </label>
  </div>
);

const initialSertifForm = {
  title: "",
  issuer: "",
  imageUrl: "",
  fileUrl: "",
  type: "pdf",
  category: "Online Course",
};

function EditSertifikat() {
  const {
    sertifikatData,
    isSertifikatLoading,
    categories,
    addSertifikat,
    updateSertifikat,
    deleteSertifikat,
  } = usePortfolioData();

  const { themeMode } = useAppContext();
  const { error: showErrorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

  const [sertifForm, setSertifForm] = useState(initialSertifForm);
  const [editingSertifId, setEditingSertifId] = useState(null);

  const [imageThumbFile, setImageThumbFile] = useState(null);
  const [imageThumbPreview, setImageThumbPreview] = useState("");
  const [mainFile, setMainFile] = useState(null);
  const [mainFilePreview, setMainFilePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const workerUrl = "/workers/pdf.worker.min.js";

  const filteredSertifikat = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return sertifikatData.filter(
      (sertif) =>
        sertif.title.toLowerCase().includes(lowerCaseSearch) ||
        sertif.issuer.toLowerCase().includes(lowerCaseSearch)
    );
  }, [sertifikatData, searchTerm]);

  const paginationConfig = {
    sm: 3,
    md: 4,
    lg: 6,
  };

  const { currentItems, PaginationComponent } = usePagination(
    filteredSertifikat,
    paginationConfig
  );

  useEffect(() => {
    const currentThumb = imageThumbPreview;
    const currentMain = mainFilePreview;
    return () => {
      if (currentThumb && currentThumb.startsWith("blob:")) {
        URL.revokeObjectURL(currentThumb);
      }
      if (currentMain && currentMain.startsWith("blob:")) {
        URL.revokeObjectURL(currentMain);
      }
    };
  }, [imageThumbPreview, mainFilePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSertifForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (imageThumbPreview && imageThumbPreview.startsWith("blob:")) {
      URL.revokeObjectURL(imageThumbPreview);
    }
    if (file) {
      if (!file.type.startsWith("image/")) {
        showErrorToast("File thumbnail harus berupa gambar!");
        e.target.value = null;
        return;
      }
      setImageThumbFile(file);
      setImageThumbPreview(URL.createObjectURL(file));
    } else {
      setImageThumbFile(null);
      setImageThumbPreview("");
    }
  };

  const handleMainFileChange = (e) => {
    const file = e.target.files[0];
    if (mainFilePreview && mainFilePreview.startsWith("blob:")) {
      URL.revokeObjectURL(mainFilePreview);
    }
    if (file) {
      setMainFile(file);
      setMainFilePreview(URL.createObjectURL(file));

      if (file.type.startsWith("image/")) {
        setSertifForm((prev) => ({ ...prev, type: "image" }));
      } else if (file.type === "application/pdf") {
        setSertifForm((prev) => ({ ...prev, type: "pdf" }));
      }
    } else {
      setMainFile(null);
      setMainFilePreview("");
    }
  };

  const handleOpenSertifModal = (sertif = null) => {
    if (sertif) {
      setEditingSertifId(sertif._id);
      setSertifForm(sertif);
      setImageThumbPreview(sertif.imageUrl || "");
      setMainFilePreview(sertif.fileUrl || "");
    } else {
      setEditingSertifId(null);
      setSertifForm(initialSertifForm);
      setImageThumbPreview("");
      setMainFilePreview("");
    }
    setImageThumbFile(null);
    setMainFile(null);
    document.getElementById("sertif_modal").showModal();
  };

  const handleCloseSertifModal = () => {
    document.getElementById("sertif_modal").close();
  };

  const handleSertifSubmit = async (e) => {
    // <-- jadi async
    e.preventDefault();
    setIsSaving(true); // <-- Set loading

    // Validasi file (penting untuk mode 'Tambah')
    if (!editingSertifId && (!imageThumbFile || !mainFile)) {
      showErrorToast(
        "Gagal",
        "Thumbnail dan File Utama wajib di-upload saat menambah data baru."
      );
      setIsSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", sertifForm.title);
    formData.append("issuer", sertifForm.issuer);
    formData.append("category", sertifForm.category);
    formData.append("type", sertifForm.type);

    if (imageThumbFile) {
      formData.append("thumbnail", imageThumbFile);
    }
    if (mainFile) {
      formData.append("mainFile", mainFile);
    }

    try {
      if (editingSertifId) {
        await updateSertifikat(editingSertifId, formData);
        showSuccessSwal("Sertifikat berhasil diperbarui!");
      } else {
        await addSertifikat(formData);
        showSuccessSwal("Sertifikat baru berhasil ditambahkan!");
      }
      handleCloseSertifModal();
    } catch (error) {
      console.error("Gagal simpan sertifikat:", error);
      showErrorToast(
        "Simpan Gagal",
        error.response?.data?.message || "Error server"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSertifDelete = async (sertif) => {
    // <-- Ambil objek
    const isConfirmed = await showConfirmSwal(
      "Hapus Sertifikat?",
      `Anda yakin ingin menghapus: "${sertif.title}"?`
    );
    if (isConfirmed) {
      try {
        await deleteSertifikat(sertif._id);
        showSuccessSwal("Sertifikat berhasil dihapus.");
      } catch (error) {
        console.error("Gagal hapus sertifikat:", error);
        showErrorToast(
          "Hapus Gagal",
          error.response?.data?.message || "Error server"
        );
      }
    }
  };

  const mainPreviewUrl = mainFilePreview;

  if (isSertifikatLoading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body flex items-center justify-center h-96">
          <span className="loading loading-lg loading-bars"></span>
          <p className="mt-4">Memuat data sertifikat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <h1 className="card-title text-2xl font-display text-center justify-center">
          Kelola Sertifikat
        </h1>
        <div className="divider my-2"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div className="w-full md:w-auto">
            <button
              className="btn btn-primary w-full"
              onClick={() => handleOpenSertifModal()}
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
              Tambah Sertifikat Baru
            </button>
          </div>
          <div className="w-full md:w-auto flex justify-center order-last md:order-none">
            <PaginationComponent />
          </div>
          <div className="w-full md:w-72">
            <input
              type="search"
              placeholder="Cari (judul, penerbit)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="py-4">
          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table table-zebra table-hover w-full">
              <thead className="bg-neutral text-neutral-content text-center">
                <tr>
                  <th className="w-12 px-4 py-3">#</th>
                  <th className="w-24 px-4 py-3 border-l border-base-300">
                    Gambar
                  </th>
                  <th className="px-4 py-3 border-l border-base-300">Judul</th>
                  <th className="px-4 py-3 border-l border-base-300">
                    Kategori
                  </th>
                  <th className="px-4 py-3 border-l border-base-300">Tipe</th>
                  <th className="w-32 px-4 py-3 border-l border-base-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((sertif) => {
                  return (
                    <tr
                      key={sertif._id}
                      className="border-b border-base-300 last:border-b-0 hover"
                    >
                      <th className="text-center px-4 py-2">
                        {sertifikatData.indexOf(sertif) + 1}
                      </th>
                      <td className="px-4 py-2 border-l border-base-300">
                        <div className="avatar flex justify-center">
                          <div className="w-28 h-20 rounded shadow">
                            <img
                              src={sertif.imageUrl}
                              alt={sertif.title}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 align-top">
                        <div className="font-bold">{sertif.title}</div>
                        <div className="text-sm opacity-70">
                          {sertif.issuer}
                        </div>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <span className="badge badge-accent whitespace-normal h-auto">
                          {sertif.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <span
                          className={`badge ${
                            sertif.type === "pdf"
                              ? "badge-secondary"
                              : "badge-info"
                          }`}
                        >
                          {sertif.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleOpenSertifModal(sertif)}
                          >
                            <Icon icon="mdi:pencil" />
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleSertifDelete(sertif)}
                          >
                            <Icon icon="mdi:delete" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredSertifikat.length === 0 && (
                  <tr className="border-b border-base-300 last:border-b-0">
                    <td
                      colSpan="6"
                      className="text-center text-base-content/60 italic py-4"
                    >
                      {searchTerm
                        ? "Sertifikat tidak ditemukan."
                        : "Belum ada sertifikat."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL SERTIFIKAT (DI-UPGRADE) --- */}
        <dialog id="sertif_modal" className="modal modal-middle">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg font-display">
              {editingSertifId !== null
                ? "Edit Sertifikat"
                : "Tambah Sertifikat"}
            </h3>

            <form onSubmit={handleSertifSubmit} className="space-y-5 pt-4">
              <FloatingLabelInput
                id="sertif_title"
                name="title"
                label="Judul Sertifikat"
                value={sertifForm.title}
                onChange={handleInputChange}
                required
              />
              <FloatingLabelInput
                id="sertif_issuer"
                name="issuer"
                label="Penerbit (cth: Dicoding, Hacktiv8)"
                value={sertifForm.issuer}
                onChange={handleInputChange}
                required
              />

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Upload Thumbnail (Gambar Card)
                  </span>
                </label>
                <input
                  id="sertifImageUpload"
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleThumbFileChange}
                  accept="image/*"
                />
              </div>

              {imageThumbPreview && (
                <div className="p-2 border border-dashed border-base-300 rounded-lg flex justify-center">
                  <img
                    src={imageThumbPreview}
                    alt="Pratinjau thumbnail"
                    className="w-36 h-24 rounded-lg object-cover shadow"
                  />
                </div>
              )}

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Upload File Utama (PDF atau Gambar Asli)
                  </span>
                </label>
                <input
                  id="sertifMainFileUpload"
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleMainFileChange}
                  accept="image/*,application/pdf"
                />
              </div>

              {mainFile && (
                <p className="text-xs text-center">
                  File dipilih: {mainFile.name} (Tipe: {sertifForm.type})
                </p>
              )}

              {mainPreviewUrl && (
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Pratinjau File Utama:
                    </span>
                  </label>
                  <div className="p-2 border border-dashed border-base-300 rounded-lg flex justify-center h-108 overflow-y-auto">
                    {sertifForm.type === "image" ? (
                      <img
                        src={mainPreviewUrl}
                        alt="Pratinjau File Utama"
                        className="w-auto h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full">
                        <Worker workerUrl={workerUrl}>
                          <Viewer
                            fileUrl={mainPreviewUrl}
                            plugins={[defaultLayoutPluginInstance]}
                            theme={themeMode}
                          />
                        </Worker>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Kategori</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="category"
                  value={sertifForm.category}
                  onChange={handleInputChange}
                >
                  {categories
                    .filter((cat) => cat !== "Semua")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={handleCloseSertifModal}
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Icon icon="mdi:content-save" className="mr-1" />
                  )}
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default EditSertifikat;
