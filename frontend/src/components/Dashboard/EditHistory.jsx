import React, { useEffect, useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  name,
  type = "text",
  required = false,
  minLength,
  disabled = false,
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
      required={required}
      disabled={disabled}
    />
    <label
      htmlFor={id}
      className={`absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10 ${disabled ? "font-base-100" : ""
        }`}
    >
      {label}
    </label>
  </div>
);

const skillLevels = [
  { value: "Dasar", label: "1 - Dasar" },
  { value: "Pemula", label: "2 - Pemula" },
  { value: "Menengah", label: "3 - Menengah" },
  { value: "Mahir", label: "4 - Mahir" },
  { value: "Pakar", label: "5 - Pakar" },
];

function EditHistory() {
  const historyData = usePortfolioStore((state) => state.historyData);
  const isHistoryLoading = usePortfolioStore((state) => state.isHistoryLoading);
  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const addHistoryItem = usePortfolioStore((state) => state.addHistoryItem);
  const updateHistoryItem = usePortfolioStore((state) => state.updateHistoryItem);
  const deleteHistoryItem = usePortfolioStore((state) => state.deleteHistoryItem);

  const { success: customToast, error: errorToast } = useCustomToast();
  const { showConfirmSwal } = useCustomSwals();

  useEffect(() => {
    if ((!historyData.education || historyData.education.length === 0) && 
        (!historyData.experience || historyData.experience.length === 0)) {
        fetchHistoryData();
    }
  }, [fetchHistoryData, historyData.education, historyData.experience]);

  const [activeTab, setActiveTab] = useState("education");
  const [editingItemId, setEditingItemId] = useState(null);
  const [institution, setInstitution] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const [detail, setDetail] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);

  const activeData =
    activeTab === "education" ? historyData.education : historyData.experience;

  const sortedData = useMemo(() => {
    const getEndYear = (yearsString) => {
      const parts = yearsString.split(" - ");
      const endPart = parts[1] ? parts[1].trim() : "0";
      if (endPart.toLowerCase() === "sekarang") return 9999;
      const yearMatch = endPart.match(/\d{4}/);
      return yearMatch ? parseInt(yearMatch[0], 10) : 0;
    };
    return [...activeData].sort((a, b) => {
      const endYearA = getEndYear(a.years);
      const endYearB = getEndYear(b.years);
      return endYearB - endYearA;
    });
  }, [activeData]);

  const resetForm = () => {
    setInstitution("");
    setDetail("");
    setLogoFile(null);
    setLogoPreview("");
    setStartMonth("");
    setStartYear("");
    setEndMonth("");
    setEndYear("");
    setIsCurrent(false);
    setEditingItemId(null);
    const fileInput = document.getElementById("logoFileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleStartEdit = (item) => {
    setEditingItemId(item._id);
    setActiveTab(item.type);
    setInstitution(item.institution);
    setDetail(item.detail);

    setLogoFile(null);
    setLogoPreview(item.logoUrl);

    const [start, end] = item.years.split(" - ");
    const startParts = start.split(" ");
    setStartMonth(startParts.length > 1 ? startParts[0] : "");
    setStartYear(startParts.length > 1 ? startParts[1] : startParts[0]);

    if (end.toLowerCase() === "sekarang") {
      setIsCurrent(true);
      setEndMonth("");
      setEndYear("");
    } else {
      setIsCurrent(false);
      const endParts = end.split(" ");
      setEndMonth(endParts.length > 1 ? endParts[0] : "");
      setEndYear(endParts.length > 1 ? endParts[1] : endParts[0]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!institution || !startYear) {
      errorToast("Institusi dan Tahun Mulai wajib diisi!");
      return;
    }

    setIsSaving(true);
    const endString = isCurrent
      ? "Sekarang"
      : [endMonth, endYear].filter(Boolean).join(" ");
    const years =
      [startMonth, startYear].filter(Boolean).join(" ") + " - " + endString;

    const formData = new FormData();
    formData.append("institution", institution);
    formData.append("detail", detail);
    formData.append("years", years);
    formData.append("type", activeTab);
    if (logoFile) {
      formData.append("logoFile", logoFile);
    }
    try {
      if (editingItemId) {
        await updateHistoryItem(editingItemId, formData);
        customToast("History berhasil diperbarui!");
      } else {
        await addHistoryItem(formData);
        customToast(
          `${activeTab === "education" ? "Pendidikan" : "Pengalaman"
          } berhasil ditambahkan!`
        );
      }
      resetForm();
    } catch (error) {
      console.error("Gagal menyimpan history:", error);
      errorToast(
        editingItemId ? "Update Gagal" : "Tambah Gagal",
        error.response?.data?.message || "Error server"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    } else {
      setLogoFile(null);
      setLogoPreview("");
      if (file) errorToast("File harus berupa gambar!");
    }
  };

  const handleDelete = async (itemId) => {
    const isConfirmed = await showConfirmSwal(
      "Hapus Data Ini?",
      "Data yang sudah dihapus tidak bisa dikembalikan."
    );
    if (isConfirmed) {
      setIsDeleting(itemId);
      try {
        await deleteHistoryItem(itemId, activeTab);
        customToast("Data berhasil dihapus.");
      } catch (error) {
        console.error("Gagal hapus history:", error);
        errorToast(
          "Hapus Gagal",
          error.response?.data?.message || "Error server"
        );
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (isHistoryLoading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body flex items-center justify-center h-96">
          <span className="loading loading-lg loading-bars"></span>
          <p className="mt-4">Memuat data history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <h2 className="card-title text-2xl font-display flex text-center justify-center">
          Edit History
        </h2>
        <div className="divider my-2"></div>

        {/* Tabel Data Saat Ini */}
        <h3 className="text-lg font-semibold mb-4">
          Daftar {activeTab === "education" ? "Pendidikan" : "Pengalaman"}
        </h3>
        <div className="overflow-x-auto border border-base-300 rounded-lg">
          <table className="table table-zebra table-hover w-full">
            <thead className="bg-neutral text-neutral-content text-center text-sm border-b-2 border-base-300">
              <tr>
                <th className="px-4 py-3 border-l border-base-300">Logo</th>
                <th className="px-4 py-3 border-l border-base-300">
                  Institusi
                </th>
                <th className="px-4 py-3 border-l border-base-300">Detail</th>
                <th className="px-4 py-3 border-l border-base-300">Durasi</th>
                <th className="px-4 py-3 border-l border-base-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b border-base-300 last:border-b-0 hover"
                >
                  <td className="px-4 py-2 border-l border-base-300">
                    <div className="avatar flex justify-center">
                      <div className="w-12 rounded">
                        <img
                          src={item.logoUrl || "/default-avatar.png"}
                          alt={item.institution}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-l border-base-300 font-semibold">
                    {item.institution}
                  </td>
                  <td className="px-4 py-2 border-l border-base-300">
                    {item.detail}
                  </td>
                  <td className="px-4 py-2 border-l border-base-300 text-xs">
                    {item.years}
                  </td>
                  <td className="text-center px-4 py-2 border-l border-base-300">
                    <div className="flex flex-col md:flex-row justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="btn btn-xs btn-warning"
                        disabled={isDeleting !== null || isSaving}
                      >
                        <Icon icon="mdi:pencil" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn btn-xs btn-error"
                        disabled={isDeleting !== null || isSaving}
                      >
                        {isDeleting === item._id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <Icon icon="mdi:delete-outline" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="divider"></div>

        <div className="tabs my-2">
          <a
            className={`tab tab-lifted h-12 flex-1 transition-all ${activeTab === "education"
                ? "tab-active bg-primary text-primary-content font-semibold rounded-md"
                : "text-base-content hover:bg-base-200 rounded-md border border-base-300"
              }`}
            onClick={() => setActiveTab("education")}
          >
            <Icon icon="mdi:school" className="mr-2" />
            Pendidikan
          </a>
          <a
            className={`tab tab-lifted h-12 flex-1 transition-all ${activeTab === "experience"
                ? "tab-active bg-primary text-primary-content font-semibold rounded-md"
                : "text-base-content hover:bg-base-200 rounded-md border border-base-300"
              }`}
            onClick={() => setActiveTab("experience")}
          >
            <Icon icon="mdi:briefcase" className="mr-2" />
            Pengalaman
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">
            Tambah Data{" "}
            {activeTab === "education" ? "Pendidikan" : "Pengalaman"} Baru
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FloatingLabelInput
              id="institution"
              name="institution"
              label="Nama Institusi / Perusahaan (Wajib)"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
              minLength={8}
            />
            <FloatingLabelInput
              id="detail"
              name="detail"
              label="Detail (cth: Teknik Informatika / Sie IT)"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              minLength={10}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text py-2 font-semibold">
                Logo Instansi (Opsional)
              </span>
            </label>
            <input
              id="logoFileInput"
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <h4 className="text-sm font-semibold col-span-2 md:col-span-4">
              Durasi:
            </h4>
            <FloatingLabelInput
              id="startMonth"
              name="startMonth"
              label="Bulan Mulai"
              value={startMonth}
              onChange={(e) => setStartMonth(e.target.value)}
            />
            <FloatingLabelInput
              id="startYear"
              name="startYear"
              label="Tahun Mulai (Wajib)"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              required
            />
            <FloatingLabelInput
              id="endMonth"
              name="endMonth"
              label="Bulan Selesai"
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
              disabled={isCurrent}
            />
            <FloatingLabelInput
              id="endYear"
              name="endYear"
              label="Tahun Selesai"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              disabled={isCurrent}
            />

            <div className="hidden md:block md:col-span-2"></div>

            <div className="form-control w-fit md:col-span-2 md:justify-self-end">
              <label className="label cursor-pointer gap-2">
                <span className="label-text">
                  Masih Berlangsung <strong>(Sekarang)</strong>
                </span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Icon icon={editingItemId ? "mdi:content-save" : "mdi:plus"} />
              )}
              {isSaving
                ? "Menyimpan..."
                : editingItemId
                  ? "Simpan Perubahan"
                  : "Tambahkan"}
            </button>

            {editingItemId && (
              <button
                type="button"
                className="btn btn-neutral"
                onClick={resetForm}
                disabled={isSaving}
              >
                <Icon icon="mdi:cancel" />
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditHistory;
