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
  const [isFormOpen, setIsFormOpen] = useState(false);
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
  const workerUrl = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  useEffect(() => {
    if (!sertifikatData || sertifikatData.length === 0) fetchSertifikat();
  }, [fetchSertifikat, sertifikatData.length]);

  useEffect(() => {
    import("@react-pdf-viewer/core/lib/styles/index.css");
    import("@react-pdf-viewer/default-layout/lib/styles/index.css");
  }, []);

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

  const toggleForm = (sertif = null) => {
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
    setIsFormOpen(!isFormOpen);
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
      setIsFormOpen(false);
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

  if (isSertifikatLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="loading loading-ring w-16 h-16 text-primary"></span>
      <p className="font-bold opacity-60 animate-pulse tracking-widest text-sm uppercase">Memuat Data...</p>
    </div>
  );

  return (
    <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden">
      <div className="card-body p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-2xl font-black font-display flex items-center gap-3">
            <Icon icon="ph:certificate-duotone" className="text-primary" /> Kelola Sertifikat
          </h1>
          <button className="btn btn-primary rounded-2xl shadow-lg" onClick={() => toggleForm()}>
            <Icon icon={isFormOpen ? "mdi:close" : "mdi:plus-circle"} /> {isFormOpen ? "Batal" : "Tambah Sertifikat"}
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-8 p-6 bg-base-200/50 rounded-3xl border border-base-content/10 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4">{editingSertifId ? "Edit Sertifikat" : "Tambah Baru"}</h2>
            <div className="space-y-6">
              <FloatingLabelInput label="Judul Sertifikat" name="title" value={sertifForm.title} onChange={handleInputChange} required />
              <FloatingLabelInput label="Penerbit" name="issuer" value={sertifForm.issuer} onChange={handleInputChange} required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-base-content/20 rounded-2xl bg-base-100/50">
                  <label className="label-text font-bold mb-2 block opacity-60">Thumbnail (Wajib)</label>
                  <input type="file" className="file-input file-input-sm file-input-bordered w-full" onChange={handleThumbFileChange} accept="image/*" />
                  {imageThumbPreview && (
                    <div className="mt-4 w-full h-32 rounded-xl border border-base-content/10 overflow-hidden bg-base-200">
                      <img src={imageThumbPreview} className="w-full h-full object-contain" alt="Thumbnail Preview" />
                    </div>
                  )}
                </div>

                <div className="p-4 border border-base-content/20 rounded-2xl bg-base-100/50">
                  <label className="label-text font-bold mb-2 block opacity-60">File Asli (Wajib)</label>
                  <input type="file" className="file-input file-input-sm file-input-bordered w-full" onChange={handleMainFileChange} accept="image/*,application/pdf" />
                  {mainFilePreview && sertifForm.type === "image" && (
                    <div className="mt-4 w-full h-32 rounded-xl border border-base-content/10 overflow-hidden bg-base-200">
                      <img src={mainFilePreview} className="w-full h-full object-contain" alt="Main File Preview" />
                    </div>
                  )}
                  {mainFilePreview && sertifForm.type === "pdf" && (
                    <div className="mt-4 w-full h-32 rounded-xl border border-base-content/10 overflow-hidden bg-base-200 flex items-center justify-center">
                      <Icon icon="mdi:file-pdf-box" className="w-12 h-12 text-error" />
                    </div>
                  )}
                </div>
              </div>

              {mainFilePreview && sertifForm.type === "pdf" && (
                <div className="p-4 border border-base-content/20 rounded-2xl">
                  <p className="label-text font-bold mb-3 opacity-60">Pratinjau PDF Utama</p>
                  <div className="h-[400px] rounded-xl overflow-hidden bg-base-200 border border-base-content/10">
                    <Worker workerUrl={workerUrl}>
                      <Viewer
                        fileUrl={mainFilePreview}
                        plugins={[defaultLayoutPluginInstance]}
                        theme={themeMode}
                      />
                    </Worker>
                  </div>
                </div>
              )}

              <FloatingLabelSelect
                label="Kategori"
                name="category"
                value={sertifForm.category}
                onChange={handleInputChange}
              >
                {categories.filter(c => c !== "Semua").map(c => (
                  <option key={c} value={c} className="bg-base-100">
                    {c}
                  </option>
                ))}
              </FloatingLabelSelect>

              <div className="flex gap-3 justify-end">
                <button className="btn btn-ghost" onClick={() => setIsFormOpen(false)}>Batal</button>
                <button className="btn btn-primary" onClick={handleSertifSubmit} disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </div>
          </div>
        )}

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
                  <TCell><div className="avatar justify-center"><div className="w-20 h-14 rounded-lg overflow-hidden"><img src={sertif.imageUrl} className="object-cover" /></div></div></TCell>
                  <TCell><div className="font-bold text-sm">{sertif.title}</div><div className="text-xs text-primary font-bold">{sertif.issuer}</div></TCell>
                  <TCell className="text-center"><span className="badge badge-accent font-bold text-[10px]">{sertif.category}</span></TCell>
                  <TCell className="text-center">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <button className="btn btn-xs btn-outline btn-warning" onClick={() => toggleForm(sertif)}><Icon icon="mdi:pencil" /> Edit</button>
                      <button className="btn btn-xs btn-outline btn-error" onClick={() => handleSertifDelete(sertif)}><Icon icon="mdi:delete" /> Hapus</button>
                    </div>
                  </TCell>
                </TRow>
              ))}
            </tbody>
          </TableContainer>
          <TableFooter limit={limit} setLimit={setLimit} totalData={totalData} currentDataCount={paginatedSertifikat.length} onNext={() => setCurrentPage(p => p + 1)} onPrev={() => setCurrentPage(p => p - 1)} />
        </div>
      </div>
    </div>
  );
}

export default EditSertifikat;