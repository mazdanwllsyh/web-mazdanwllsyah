import React, { useEffect, useState, useMemo } from "react";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndStatus] = useState("");
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

  const sortedHistory = useMemo(() => {
    const sortFn = (a, b) => {
      const getYear = (str) => {
        const match = str.match(/\d{4}/);
        return match ? parseInt(match[0]) : 0;
      };
      const isAActive = a.years.toLowerCase().includes("sekarang");
      const isBActive = b.years.toLowerCase().includes("sekarang");

      if (isAActive && !isBActive) return -1;
      if (!isAActive && isBActive) return 1;

      return getYear(b.years) - getYear(a.years);
    };

    return {
      education: [...(historyData.education || [])].sort(sortFn),
      experience: [...(historyData.experience || [])].sort(sortFn),
    };
  }, [historyData]);

  const resetForm = () => {
    setType("");
    setInstitution("");
    setStartDate("");
    setEndStatus("");
    setDetail("");
    setIsCurrent(false);
    setEditingItemId(null);
    setImageFile(null);
    setImagePreview("");
    const fileInput = document.getElementById("logo_upload");
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (item, itemType) => {
    setType(itemType);
    setInstitution(item.institution);

    let displayYears = item.years || "";
    let currentCheck = false;
    let start = displayYears;
    let end = "";

    if (displayYears.toLowerCase().includes("sekarang")) {
      currentCheck = true;
      start = displayYears.replace(/\s*-\s*sekarang/i, "").trim();
    } else if (displayYears.includes("-")) {
      const parts = displayYears.split("-");
      start = parts[0].trim();
      end = parts.slice(1).join("-").trim();
    }

    setStartDate(start);
    setEndStatus(end);
    setIsCurrent(currentCheck);
    setDetail(item.detail || "");
    setEditingItemId(item._id);
    setImagePreview(item.logoUrl || "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) return errorToast("Kategori Riwayat wajib dipilih!");
    setIsSaving(true);

    let finalYears = startDate.trim();
    if (isCurrent) finalYears += " - Sekarang";
    else if (endDate.trim()) finalYears += ` - ${endDate.trim()}`;

    const formData = new FormData();
    formData.append("type", type);
    formData.append("institution", institution);
    formData.append("years", finalYears);
    formData.append("detail", detail);
    if (imageFile) formData.append("logoFile", imageFile);

    try {
      if (editingItemId) await updateHistoryItem(editingItemId, formData);
      else await addHistoryItem(formData);
      showSuccessSwal("Berhasil disimpan!");
      resetForm();
    } catch (err) {
      errorToast("Gagal", err.response?.data?.message || "Terjadi kesalahan.");
    } finally { setIsSaving(false); }
  };

  const handleDelete = async (id, itemType) => {
    if (await showConfirmSwal("Hapus Data?", "Data ini akan dihapus selamanya.")) {
      try {
        await deleteHistoryItem(id, itemType);
        showSuccessSwal("Data dihapus!");
      } catch (err) { errorToast("Gagal menghapus."); }
    }
  };

  if (isHistoryLoading) return <div className="text-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>;

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 border border-base-content/20 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl"><Icon icon="mdi:timeline-plus-outline" className="w-6 h-6" /></div>
            <h2 className="text-xl font-black font-display">{editingItemId ? "Edit Riwayat" : "Tambah Riwayat"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FloatingLabelSelect label="Kategori Riwayat" value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="" disabled hidden className="bg-base-100 text-base-content">-- Pilih Kategori --</option>
                <option value="education" className="bg-base-100 text-base-content">Pendidikan</option>
                <option value="experience" className="bg-base-100 text-base-content">Pengalaman Kerja</option>
              </FloatingLabelSelect>
              <FloatingLabelInput label="Institusi / Perusahaan" value={institution} onChange={(e) => setInstitution(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
              <FloatingLabelInput label="Mulai (Cth: Januari 2025)" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <FloatingLabelInput label="Sampai (Cth: Desember 2026)" value={isCurrent ? "" : endDate} onChange={(e) => setEndStatus(e.target.value)} disabled={isCurrent} />
              <label className="label cursor-pointer justify-center gap-3 p-4 border border-base-content/20 rounded-xl hover:bg-base-200/50 transition-colors h-14">
                <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
                <span className="label-text font-bold">Masih Disini</span>
              </label>
            </div>

            <FloatingLabelTextarea label="Detail / Penjelasan (Apa yang kamu lakukan di sini?)" value={detail} onChange={(e) => setDetail(e.target.value)} rows={3} />

            <div className="flex justify-end gap-3 pt-2">
              {editingItemId && <button type="button" className="btn btn-neutral rounded-xl" onClick={resetForm}>Batal</button>}
              <button type="submit" className="btn btn-primary rounded-xl md:w-64" disabled={isSaving}>
                {isSaving ? <span className="loading loading-ring loading-md"></span> : <Icon icon="mdi:content-save" className="w-5 h-5" />}
                {isSaving ? "Menyimpan..." : "Simpan Riwayat"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {["education", "experience"].map((section) => (
          <div key={section} className="card bg-base-100 border border-base-content/20 shadow-sm rounded-[2.5rem] overflow-hidden">
            <div className="card-body p-0">
              <div className="p-4 border-b border-base-content/10 bg-base-200/30 flex items-center gap-2">
                <Icon icon={section === "education" ? "mdi:school" : "mdi:briefcase"} className="w-5 h-5 text-primary" />
                <h3 className="card-title capitalize font-display">{section === "education" ? "Pendidikan" : "Pengalaman"}</h3>
              </div>
              <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                {sortedHistory[section]?.map((item) => (
                  <div key={item._id} className="p-4 border border-base-content/20 rounded-xl flex flex-col gap-2 hover:bg-base-200/50 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        {item.logoUrl && <img src={item.logoUrl} className="w-10 h-10 rounded-lg object-cover border border-base-content/50" alt="logo" />}
                        <div>
                          <div className="font-bold">{item.institution}</div>
                          <div className="text-xs font-bold text-primary">{item.years}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 align-top opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity mt-2 lg:mt-0">
                        <button className="btn btn-square btn-xs btn-warning" onClick={() => handleEdit(item, section)}><Icon icon="mdi:pencil" /></button>
                        <button className="btn btn-square btn-xs btn-error" onClick={() => handleDelete(item._id, section)}><Icon icon="mdi:delete" /></button>
                      </div>
                    </div>
                    {item.detail && (
                      <div className="text-xs opacity-70 bg-base-200/50 p-2 rounded-lg font-headings font-bold">
                        {item.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditHistory;