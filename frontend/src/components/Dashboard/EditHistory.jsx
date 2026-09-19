import React, { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore, experienceBadges } from "../../stores/portfolioStore";
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

  const currentYear = new Date().getFullYear();

  const { error: errorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

  const [type, setType] = useState("");
  const [institution, setInstitution] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndStatus] = useState("");
  const [detail, setDetail] = useState("");
  const [badge, setBadge] = useState("");
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
    setBadge("");
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
    setBadge(item.badge || "");
    setEditingItemId(item._id);
    setImagePreview(item.logoUrl || "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    if (type === "experience" && badge) {
      formData.append("badge", badge);
    }

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
    <div className="flex flex-col xl:flex-row gap-8 items-start w-full animate-fade-in">
      <div className="w-full xl:w-5/12 h-fit xl:sticky xl:top-24 card bg-base-100 border border-base-content/20 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-[2.5rem] overflow-hidden z-10">
        <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Icon icon="mdi:timeline-plus-outline" className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black font-display">{editingItemId ? "Edit Riwayat" : "Tambah Riwayat"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className={`grid gap-4 ${type === 'experience' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            <FloatingLabelSelect
              label="Tipe Riwayat"
              name="type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value !== "experience") setBadge("");
              }}
              required
            >
              <option value="" disabled hidden>Pilih Tipe</option>
              <option value="education" className="bg-base-100 text-base-content">Pendidikan</option>
              <option value="experience" className="bg-base-100 text-base-content">Pengalaman</option>
            </FloatingLabelSelect>

            {type === 'experience' && (
              <FloatingLabelSelect
                label="Kategori Badge"
                name="badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                required
              >
                <option value="" disabled hidden>Pilih Kategori</option>
                {experienceBadges.map((b) => (
                  <option key={b} value={b} className="bg-base-100 text-base-content">{b}</option>
                ))}
              </FloatingLabelSelect>
            )}
          </div>

          <FloatingLabelInput label="Institusi / Perusahaan" value={institution} onChange={(e) => setInstitution(e.target.value)} required />

          <div className="grid md:grid-cols-2 gap-4">
            <FloatingLabelInput label="Mulai (Cth: 2021)" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <FloatingLabelInput label={`Sampai (Cth: ${currentYear})`} value={isCurrent ? "" : endDate} onChange={(e) => setEndStatus(e.target.value)} disabled={isCurrent} />
          </div>

          <label className="label cursor-pointer justify-center gap-3 p-4 border border-base-content/20 rounded-xl hover:bg-base-200/50 transition-colors h-14">
            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={isCurrent} onChange={(e) => setIsCurrent(e.target.checked)} />
            <span className="label-text font-bold">Masih Disini (Sekarang)</span>
          </label>

          <FloatingLabelTextarea label="Detail Pekerjaan / Studi" value={detail} onChange={(e) => setDetail(e.target.value)} rows={3} />

          <div className="p-4 border border-base-content/20 rounded-2xl bg-base-100/50">
            <label className="label-text font-bold mb-2 block opacity-60">Logo Instansi</label>
            <input id="logo_upload" type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-sm file-input-bordered w-full" />
            {(imagePreview || (typeof imageFile === 'string' && imageFile)) && (
              <div className="mt-4 w-full h-32 rounded-xl border border-base-content/10 overflow-hidden bg-base-200 flex items-center justify-center p-2">
                <img src={imagePreview || imageFile} alt="Preview Logo" className="max-h-full max-w-full object-contain" />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {editingItemId && <button type="button" className="btn btn-ghost rounded-xl" onClick={resetForm}>Batal</button>}
            <button type="submit" className="btn btn-primary rounded-xl flex-1 shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-transform" disabled={isSaving}>
              {isSaving ? <span className="loading loading-ring loading-md"></span> : <Icon icon="mdi:content-save" className="w-5 h-5" />}
              {isSaving ? "Menyimpan..." : (editingItemId ? "Simpan Perubahan" : "Simpan Riwayat")}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full xl:w-7/12 space-y-12">
        {["education", "experience"].map((section) => {
          const items = sortedHistory[section];
          if (!items || items.length === 0) return null;

          return (
            <div key={section} className="flex flex-col">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className={`p-2 rounded-xl ${section === 'education' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'}`}>
                  <Icon icon={section === "education" ? "mdi:school" : "mdi:briefcase"} className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black font-display capitalize">{section === "education" ? "Pendidikan" : "Pengalaman"}</h3>
              </div>

              <div className="columns-1 md:columns-2 gap-5 space-y-5">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="relative group p-6 bg-base-100 border border-base-content/10 rounded-[2rem] hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col gap-4 break-inside-avoid"
                  >
                    <div className="flex gap-4 items-start">
                      {item.logoUrl ? (
                        <img src={item.logoUrl} className="w-14 h-14 rounded-2xl object-contain bg-base-200 p-2 border border-base-content/10 shrink-0" alt="logo" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center border border-base-content/10 shrink-0 opacity-50">
                          <Icon icon="mdi:image-off-outline" className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="font-bold text-base leading-tight line-clamp-2" title={item.institution}>{item.institution}</h4>
                        <span className="text-xs font-black text-primary mt-1.5 block">{item.years}</span>
                      </div>
                    </div>

                    {item.detail && (
                      <p className="text-xs opacity-70 bg-base-200/50 p-4 rounded-2xl font-medium leading-relaxed mt-2 border border-base-content/5">
                        {item.detail}
                      </p>
                    )}

                    {section === "experience" && item.badge && (
                      <div className="flex justify-start mt-1">
                        <span className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-accent/10 text-accent border border-accent/20 truncate max-w-full">
                          {item.badge}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-base-100/90 p-1 rounded-xl shadow-sm backdrop-blur-sm border border-base-content/10">
                      <button className="btn btn-square btn-xs btn-ghost text-warning hover:bg-warning/20" onClick={() => handleEdit(item, section)}>
                        <Icon icon="solar:pen-bold" className="w-3.5 h-3.5" />
                      </button>
                      <button className="btn btn-square btn-xs btn-ghost text-error hover:bg-error/20" onClick={() => handleDelete(item._id, section)}>
                        <Icon icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EditHistory;