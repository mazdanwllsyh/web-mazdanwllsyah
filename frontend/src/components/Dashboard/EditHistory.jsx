import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import FloatingLabelInput, { FloatingLabelTextarea, FloatingLabelSelect } from "../FloatingLabelInput";

function EditHistory() {
  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const historyData = usePortfolioStore((state) => state.historyData);
  const addHistoryItem = usePortfolioStore((state) => state.addHistoryItem);
  const updateHistoryItem = usePortfolioStore((state) => state.updateHistoryItem);
  const deleteHistoryItem = usePortfolioStore((state) => state.deleteHistoryItem);
  const isHistoryLoading = usePortfolioStore((state) => state.isHistoryLoading);

  const { error: errorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

  const [type, setType] = useState("");
  const [institution, setInstitution] = useState("");
  const [years, setYears] = useState("");
  const [detail, setDetail] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingItemId, setEditingItemId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!historyData.education?.length && !historyData.experience?.length) {
      fetchHistoryData();
    }
  }, [fetchHistoryData, historyData]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetForm = () => {
    setType("");
    setInstitution("");
    setYears("");
    setDetail("");
    setIsCurrent(false);
    setEditingItemId(null);
    setImageFile(null);
    setImagePreview("");
    const fileInput = document.getElementById("logo_upload");
    if (fileInput) fileInput.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        errorToast("File harus berupa gambar!");
        setImageFile(null);
        setImagePreview("");
        e.target.value = null;
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const removeSelectedImage = () => {
    setImageFile(null);
    setImagePreview("");
    const fileInput = document.getElementById("logo_upload");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type) {
      errorToast("Kategori Riwayat wajib dipilih!");
      return;
    }

    setIsSaving(true);

    let finalYears = years;
    if (isCurrent && !finalYears.toLowerCase().includes("sekarang")) {
      finalYears = `${finalYears} - Sekarang`;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("institution", institution);
    formData.append("years", finalYears);
    formData.append("detail", detail);

    if (imageFile) {
      formData.append("logoFile", imageFile);
    }

    try {
      if (editingItemId) {
        await updateHistoryItem(editingItemId, formData);
        showSuccessSwal("Berhasil diperbarui!");
      } else {
        await addHistoryItem(formData);
        showSuccessSwal("Berhasil ditambahkan!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      errorToast("Gagal", err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item, itemType) => {
    setType(itemType);
    setInstitution(item.institution);

    let displayYears = item.years || "";
    let currentCheck = false;
    if (displayYears.toLowerCase().includes("sekarang")) {
      currentCheck = true;
      displayYears = displayYears.replace(/\s*-\s*sekarang/i, "").trim();
    }

    setYears(displayYears);
    setDetail(item.detail || "");
    setIsCurrent(currentCheck); 

    setEditingItemId(item._id);
    setImagePreview(item.logoUrl || "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, itemType) => {
    if (await showConfirmSwal("Hapus Data?", "Data ini akan dihapus selamanya.")) {
      try {
        await deleteHistoryItem(id, itemType);
        showSuccessSwal("Data dihapus!");
      } catch (err) {
        errorToast("Gagal menghapus.");
      }
    }
  };

  if (isHistoryLoading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-content/20">
        <div className="card-body flex justify-center items-center h-64">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 border border-base-content/20 shadow-sm overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Icon icon="mdi:timeline-plus-outline" className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black font-display">
              {editingItemId ? "Edit Riwayat" : "Tambah Riwayat Baru"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingLabelSelect label="Kategori Riwayat" value={type} onChange={(e) => setType(e.target.value)} required>
                {/* FIX: Default Kosong & Disabled & Hidden */}
                <option value="" disabled hidden className="bg-base-100 text-base-content">-- Pilih Kategori --</option>
                <option value="education" className="bg-base-100 text-base-content">Pendidikan</option>
                <option value="experience" className="bg-base-100 text-base-content">Pengalaman Kerja</option>
              </FloatingLabelSelect>
              <FloatingLabelInput label="Institusi / Perusahaan" value={institution} onChange={(e) => setInstitution(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
              <FloatingLabelInput label="Tahun (Cth: 2020 - 2024)" value={years} onChange={(e) => setYears(e.target.value)} required />
              <label className="label cursor-pointer justify-start gap-4 p-4 border border-base-content/20 rounded-xl hover:bg-base-200/50 transition-colors">
                <span className="label-text font-bold">Masih Berlangsung Saat Ini?</span>
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm md:checkbox-md" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
              </label>
            </div>

            <FloatingLabelTextarea label="Detail / Deskripsi (Opsional)" value={detail} onChange={(e) => setDetail(e.target.value)} rows={3} />

            <div className="form-control w-full p-4 border border-base-content/20 rounded-2xl bg-base-200/20">
              <label className="label pt-0">
                <span className="label-text font-bold">Logo Instansi / Perusahaan (Opsional)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {imagePreview ? (
                  <div className="relative group w-20 h-20 rounded-xl border border-base-content/20 overflow-hidden shrink-0 shadow-md">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={removeSelectedImage}
                    >
                      <Icon icon="mdi:trash-can" className="text-white w-6 h-6" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-base-content/20 flex items-center justify-center shrink-0 bg-base-100">
                    <Icon icon="mdi:image-outline" className="w-8 h-8 opacity-30" />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <input
                    id="logo_upload"
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full max-w-sm"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <p className="text-[10px] opacity-50 mt-2 font-medium">Format: JPG, PNG, WEBP. Biarkan kosong jika tidak ada logo.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {editingItemId && (
                <button type="button" className="btn btn-neutral rounded-xl" onClick={resetForm} disabled={isSaving}>
                  <Icon icon="mdi:close-circle" /> Batal
                </button>
              )}
              <button type="submit" className="btn btn-primary rounded-xl md:w-64" disabled={isSaving}>
                {isSaving ? <span className="loading loading-ring loading-md"></span> : <Icon icon={editingItemId ? "mdi:content-save" : "mdi:plus-circle"} className="w-5 h-5" />}
                {isSaving ? "Menyimpan..." : editingItemId ? "Simpan Perubahan" : "Tambahkan Riwayat"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {["education", "experience"].map((section) => (
          <div key={section} className="card bg-base-100 border border-base-content/20 shadow-sm">
            <div className="card-body p-0">
              <div className="p-4 border-b border-base-content/10 bg-base-200/30 flex items-center gap-2">
                <Icon icon={section === "education" ? "mdi:school" : "mdi:briefcase"} className={`w-5 h-5 ${section === "education" ? "text-info" : "text-success"}`} />
                <h3 className="card-title capitalize font-display text-lg">
                  {section === "education" ? "Riwayat Pendidikan" : "Riwayat Kerja"}
                </h3>
              </div>

              <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {historyData[section]?.length > 0 ? (
                  historyData[section].map((item) => (
                    <div key={item._id} className="p-4 border border-base-content/20 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-base-200/50 hover:border-primary/50 transition-all group">
                      <div className="flex items-center gap-4">
                        {/* Logo Thumbnail di List */}
                        {item.logoUrl ? (
                          <div className="w-12 h-12 rounded-lg border border-base-content/20 overflow-hidden shrink-0 shadow-sm">
                            <img src={item.logoUrl} alt="logo" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-base-content/10 flex items-center justify-center bg-base-200 shrink-0">
                            <Icon icon="mdi:domain" className="w-6 h-6 opacity-30" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-base">{item.institution}</div>
                          <div className="text-xs font-semibold opacity-70 mt-0.5 text-primary">
                            {item.years} {item.isCurrent && <span className="badge badge-primary badge-xs ml-1">Sekarang</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button className="btn btn-square btn-sm btn-warning btn-outline group-hover:btn-active transition-colors" onClick={() => handleEdit(item, section)}>
                          <Icon icon="mdi:pencil" className="w-4 h-4" />
                        </button>
                        <button className="btn btn-square btn-sm btn-error btn-outline group-hover:btn-active transition-colors" onClick={() => handleDelete(item._id, section)}>
                          <Icon icon="mdi:delete" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 opacity-40 italic text-sm">
                    Data {section === "education" ? "Pendidikan" : "Pengalaman"} masih kosong.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditHistory;