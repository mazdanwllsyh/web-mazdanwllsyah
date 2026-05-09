import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import { usePortfolioStore, categories } from "../../stores/portfolioStore";
import { useSiteStore } from "../../stores/siteStore";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { TableContainer, THead, TRow, TCell, TableFooter } from "../StylingTable";
import FloatingLabelInput, { FloatingLabelSelect } from "../FloatingLabelInput";
import ModalDashboard from "../ModalDashboard";

const initialSertifForm = {
  title: "",
  issuer: "",
  imageUrl: "",
  fileUrl: "",
  type: "pdf",
  category: "Online Course",
};

function EditSertifikat() {
  const sertifikatData = usePortfolioStore((state) => state.sertifikatData);
  const isSertifikatLoading = usePortfolioStore((state) => state.isSertifikatLoading);
  const fetchSertifikat = usePortfolioStore((state) => state.fetchSertifikat);
  const addSertifikat = usePortfolioStore((state) => state.addSertifikat);
  const updateSertifikat = usePortfolioStore((state) => state.updateSertifikat);
  const deleteSertifikat = usePortfolioStore((state) => state.deleteSertifikat);

  const themeMode = useSiteStore((state) => state.getThemeMode());
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
  const [limit, setLimit] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const workerUrl = "/workers/pdf.worker.min.js";

  useEffect(() => {
    if (!sertifikatData || sertifikatData.length === 0) fetchSertifikat();
  }, [fetchSertifikat, sertifikatData.length]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const filteredSertifikat = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return sertifikatData.filter(s =>
      s.title.toLowerCase().includes(lowerCaseSearch) ||
      s.issuer.toLowerCase().includes(lowerCaseSearch)
    );
  }, [sertifikatData, searchTerm]);

  const totalData = filteredSertifikat.length;
  const paginatedSertifikat = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    return filteredSertifikat.slice(startIndex, startIndex + limit);
  }, [filteredSertifikat, currentPage, limit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSertifForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageThumbFile(file);
      setImageThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleMainFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainFile(file);
      setMainFilePreview(URL.createObjectURL(file));
      setSertifForm(p => ({ ...p, type: file.type.startsWith("image/") ? "image" : "pdf" }));
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

  const handleSertifSubmit = async () => {
    if (!editingSertifId && (!imageThumbFile || !mainFile)) {
      return showErrorToast("Gagal", "File thumbnail dan utama wajib di-upload.");
    }
    setIsSaving(true);
    const formData = new FormData();
    Object.keys(sertifForm).forEach(key => {
      if (!['imageUrl', 'fileUrl', '_id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
        formData.append(key, sertifForm[key]);
      }
    });
    if (imageThumbFile) formData.append("thumbnail", imageThumbFile);
    if (mainFile) formData.append("mainFile", mainFile);

    try {
      if (editingSertifId) await updateSertifikat(editingSertifId, formData);
      else await addSertifikat(formData);
      showSuccessSwal("Berhasil!");
      document.getElementById("sertif_modal").close();
    } catch (error) {
      showErrorToast("Error", error.response?.data?.message || "Gagal menyimpan data.");
    } finally { setIsSaving(false); }
  };

  const handleSertifDelete = async (sertif) => {
    if (await showConfirmSwal("Hapus?", `Hapus sertifikat: ${sertif.title}?`)) {
      try {
        await deleteSertifikat(sertif._id);
        showSuccessSwal("Dihapus!");
      } catch (e) { showErrorToast("Gagal hapus"); }
    }
  };

  if (isSertifikatLoading) return <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg"></span></div>;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden">
      <div className="card-body p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black font-display flex items-center gap-3">
              <Icon icon="ph:certificate-duotone" className="text-primary" /> Kelola Sertifikat
            </h1>
          </div>
          <button className="btn btn-primary rounded-2xl shadow-lg" onClick={() => handleOpenSertifModal()}>
            <Icon icon="mdi:plus-circle" /> Tambah Sertifikat
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-full md:w-80 relative">
            <input type="search" placeholder="Cari sertifikat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input input-bordered w-full rounded-2xl pl-10 bg-base-200/50" />
            <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
          </div>
        </div>

        <div className="flex flex-col border border-base-content/20 rounded-2xl overflow-hidden">
          <TableContainer>
            <THead>
              <th className="w-16">No</th>
              <th className="w-32">Thumbnail</th>
              <th>Informasi</th>
              <th className="w-40">Kategori</th>
              <th className="w-48 text-center">Aksi</th>
            </THead>
            <tbody>
              {paginatedSertifikat.map((sertif, idx) => (
                <TRow key={sertif._id}>
                  <TCell className="text-center font-mono opacity-50">{(currentPage - 1) * limit + idx + 1}</TCell>
                  <TCell>
                    <div className="avatar justify-center">
                      <div className="w-20 h-14 rounded-lg border border-base-content/10 overflow-hidden"><img src={sertif.imageUrl} className="object-cover" /></div>
                    </div>
                  </TCell>
                  <TCell>
                    <div className="font-bold text-sm">{sertif.title}</div>
                    <div className="text-xs text-primary font-bold">{sertif.issuer}</div>
                  </TCell>
                  <TCell className="text-center"><span className="badge badge-accent font-bold text-[10px]">{sertif.category}</span></TCell>
                  <TCell className="text-center align-middle">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        className="btn btn-xs btn-outline btn-warning hover:text-warning-content w-full sm:w-auto"
                        onClick={() => handleOpenSertifModal(sertif)}
                      >
                        <Icon icon="mdi:pencil" className="w-3 h-3 mr-1" /> Edit
                      </button>
                      <button
                        className="btn btn-xs btn-outline btn-error hover:text-error-content w-full sm:w-auto"
                        onClick={() => handleSertifDelete(sertif)}
                      >
                        <Icon icon="mdi:delete" className="w-3 h-3 mr-1" /> Hapus
                      </button>
                    </div>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </TableContainer>
          <TableFooter limit={limit} setLimit={setLimit} totalData={totalData} currentDataCount={paginatedSertifikat.length} onNext={() => setCurrentPage(p => p + 1)} onPrev={() => setCurrentPage(p => p - 1)} />
        </div>

        <ModalDashboard
          id="sertif_modal"
          title={editingSertifId ? "Edit Sertifikat" : "Tambah Sertifikat Baru"}
          icon="ph:certificate-duotone"
          isSaving={isSaving}
          onSave={handleSertifSubmit}
          onCancel={() => document.getElementById("sertif_modal").close()}
        >
          <div className="space-y-6">
            <FloatingLabelInput label="Judul Sertifikat" name="title" value={sertifForm.title} onChange={handleInputChange} required />
            <FloatingLabelInput label="Penerbit" name="issuer" value={sertifForm.issuer} onChange={handleInputChange} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-base-content/20 rounded-2xl bg-base-200/20">
                <label className="label-text font-bold mb-2 block opacity-60">Thumbnail (Image)</label>
                <input type="file" className="file-input file-input-sm file-input-bordered w-full" onChange={handleThumbFileChange} accept="image/*" />
                {imageThumbPreview && <img src={imageThumbPreview} className="mt-4 w-full h-24 object-cover rounded-xl border border-base-content/10 shadow-sm" />}
              </div>
              <div className="p-4 border border-base-content/20 rounded-2xl bg-base-200/20">
                <label className="label-text font-bold mb-2 block opacity-60">File Asli (Image/PDF)</label>
                <input type="file" className="file-input file-input-sm file-input-bordered w-full" onChange={handleMainFileChange} accept="image/*,application/pdf" />
                {mainFilePreview && <div className="mt-4 p-3 bg-base-100 rounded-xl text-[10px] font-mono opacity-50 truncate border border-base-content/10 italic">Tipe: {sertifForm.type.toUpperCase()}</div>}
              </div>
            </div>

            {mainFilePreview && (
              <div className="p-4 border border-base-content/20 rounded-2xl">
                <p className="label-text font-bold mb-3 opacity-60">Pratinjau File Utama</p>
                <div className="h-[300px] rounded-xl overflow-hidden bg-base-200 border border-base-content/10">
                  {sertifForm.type === "image" ? <img src={mainFilePreview} className="w-full h-full object-contain" /> : (
                    <Worker workerUrl={workerUrl}>
                      <Viewer fileUrl={mainFilePreview} plugins={[defaultLayoutPluginInstance]} theme={themeMode} />
                    </Worker>
                  )}
                </div>
              </div>
            )}

            <FloatingLabelSelect label="Kategori" name="category" value={sertifForm.category} onChange={handleInputChange}>
              {categories.filter(c => c !== "Semua").map(c => <option className="bg-base-100 text-base-content" key={c} value={c}>{c}</option>)}
            </FloatingLabelSelect>
          </div>
        </ModalDashboard>
      </div>
    </div>
  );
}

export default EditSertifikat;