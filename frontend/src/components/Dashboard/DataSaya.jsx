import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useSiteStore } from "../../stores/siteStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import FloatingLabelInput, { FloatingLabelTextarea } from "../FloatingLabelInput";

function DataSaya() {
  const siteData = useSiteStore((state) => state.siteData);
  const updateSiteData = useSiteStore((state) => state.updateSiteData);
  const uploadProfileImage = useSiteStore((state) => state.uploadProfileImage);
  const deleteProfileImage = useSiteStore((state) => state.deleteProfileImage);

  const { success: successToast, error: errorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

  const [formData, setFormData] = useState(siteData);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTypeSeq, setNewTypeSeq] = useState("");

  useEffect(() => {
    setFormData(siteData);
  }, [siteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const typeSequences = useMemo(() =>
    formData.typeAnimationSequenceString
      ? formData.typeAnimationSequenceString.split(",").filter(s => s.trim() !== "")
      : []
    , [formData.typeAnimationSequenceString]);

  const addTypeSeq = () => {
    if (!newTypeSeq.trim()) return;
    const updated = [...typeSequences, newTypeSeq.trim()].join(",");
    setFormData(prev => ({ ...prev, typeAnimationSequenceString: updated }));
    setNewTypeSeq("");
  };

  const removeTypeSeq = (index) => {
    const updated = typeSequences.filter((_, i) => i !== index).join(",");
    setFormData(prev => ({ ...prev, typeAnimationSequenceString: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSiteData(formData);
      showSuccessSwal("Data Berhasil Disimpan!", "Informasi dasar dan tautan kontak telah diperbarui.");
    } catch (error) {
      errorToast("Gagal memperbarui data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUpdating("uploading");
    const imageFormData = new FormData();
    imageFormData.append("profileImage", file);
    try {
      await uploadProfileImage(imageFormData);
      successToast("Gambar profil berhasil ditambahkan!");
    } catch (error) {
      errorToast("Gagal upload gambar.");
    } finally {
      setIsUpdating(null);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (index, imageUrl) => {
    const isConfirmed = await showConfirmSwal("Hapus Gambar?", "Gambar profil ini akan dihapus secara permanen.");
    if (isConfirmed) {
      setIsDeleting(index);
      try {
        await deleteProfileImage(imageUrl);
        successToast("Gambar berhasil dihapus.");
      } catch (error) {
        errorToast("Gagal menghapus gambar.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 grid grid-cols-1 gap-6">
          <div className="card bg-base-100 border border-base-content/20 shadow-sm rounded-[2.5rem] overflow-hidden">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300 bg-base-200/50 flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <Icon icon="solar:user-id-bold-duotone" className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black font-display">Informasi Utama</h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FloatingLabelInput label="Nama Brand" name="brandName" value={formData.brandName} onChange={handleChange} required />
                  <FloatingLabelInput label="Nama Lengkap / Pendek" name="brandNameShort" value={formData.brandNameShort} onChange={handleChange} required />
                </div>

                <FloatingLabelInput label="Jabatan Saat Ini" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <FloatingLabelInput
                      label="Tambah Typing Sequence"
                      value={newTypeSeq}
                      onChange={(e) => setNewTypeSeq(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTypeSeq())}
                    />
                    <button type="button" onClick={addTypeSeq} className="btn btn-primary h-14 w-14 rounded-xl">
                      <Icon icon="solar:add-circle-bold" className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 border border-base-300 rounded-xl bg-base-200/30 min-h-14 items-center">
                    {typeSequences.length > 0 ? (
                      typeSequences.map((text, i) => (
                        <div key={i} className="badge badge-lg py-4 px-4 bg-base-100 border-primary/30 gap-2 font-bold text-xs tracking-wider animate-in fade-in zoom-in duration-300">
                          {text}
                          <Icon icon="solar:close-circle-bold" className="w-4 h-4 cursor-pointer text-error hover:scale-110 transition-transform" onClick={() => removeTypeSeq(i)} />
                        </div>
                      ))
                    ) : (
                      <span className="text-xs italic opacity-40 ml-2">Belum ada sequence, ketik lalu tekan Enter atau klik ikon +</span>
                    )}
                  </div>
                </div>

                <FloatingLabelTextarea label="Tentang Saya" name="aboutParagraph" value={formData.aboutParagraph} onChange={handleChange} rows={4} />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-content/20 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300 bg-base-200/50 flex items-center gap-3">
                <div className="p-2 bg-secondary/10 text-secondary rounded-xl">
                  <Icon icon="solar:link-round-angle-bold-duotone" className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black font-display">Tautan Sosial & Kontak</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <FloatingLabelInput label="Email" name="contactLinks.email" value={formData.contactLinks?.email} onChange={handleChange} />
                <FloatingLabelInput label="WhatsApp" name="contactLinks.whatsapp" value={formData.contactLinks?.whatsapp} onChange={handleChange} />
                <FloatingLabelInput label="Telegram" name="contactLinks.telegram" value={formData.contactLinks?.telegram} onChange={handleChange} />
                <FloatingLabelInput label="LinkedIn" name="contactLinks.linkedin" value={formData.contactLinks?.linkedin} onChange={handleChange} />
                <FloatingLabelInput label="Instagram" name="contactLinks.instagram" value={formData.contactLinks?.instagram} onChange={handleChange} />
                <FloatingLabelInput label="GitHub" name="contactLinks.github" value={formData.contactLinks?.github} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button type="submit" className="btn btn-primary btn-lg w-full md:w-80 rounded-2xl shadow-lg shadow-primary/20" disabled={isSaving}>
              {isSaving ? <span className="loading loading-ring loading-md"></span> : <Icon icon="solar:diskette-bold-duotone" className="w-6 h-6" />}
              {isSaving ? "Menyimpan..." : "Simpan Semua Data"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="card bg-base-100 border border-base-content/20 shadow-sm rounded-[2.5rem] overflow-hidden sticky top-6">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300 bg-base-200/50 flex items-center gap-3">
                <div className="p-2 bg-accent/10 text-accent rounded-xl">
                  <Icon icon="solar:gallery-bold-duotone" className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black font-display">Foto Profil</h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="form-control">
                  <label className="label cursor-pointer p-4 border-2 border-dashed border-base-300 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group">
                    <div className="flex flex-col items-center w-full gap-2">
                      <Icon icon="solar:cloud-upload-bold-duotone" className="w-10 h-10 text-base-content/20 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-base-content/40 group-hover:text-base-content">Klik untuk Upload Gambar</span>
                    </div>
                    <input type="file" className="hidden" onChange={handleImageUpload} disabled={isUpdating !== null} accept="image/*" />
                  </label>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.profileImages.map((imageUrl, index) => (
                    <div key={index} className="group relative rounded-2xl border border-base-300 overflow-hidden bg-base-200/50 p-2 flex items-center gap-4 hover:border-error/30 transition-all">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-xl ring ring-base-300 ring-offset-base-100 ring-offset-2">
                          <img src={imageUrl} alt={`Profile ${index}`} className="object-cover" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-mono opacity-40 truncate">{imageUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index, imageUrl)}
                        className="btn btn-square btn-error btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isDeleting !== null}
                      >
                        {isDeleting === index ? <span className="loading loading-spinner loading-xs"></span> : <Icon icon="solar:trash-bin-trash-bold" />}
                      </button>
                    </div>
                  ))}

                  {formData.profileImages.length === 0 && (
                    <div className="text-center py-10 opacity-30 italic text-sm">Belum ada gambar profil.</div>
                  )}
                </div>

                <div className="p-4 bg-info/10 text-info rounded-xl flex items-start gap-3">
                  <Icon icon="solar:info-circle-bold" className="w-5 h-5 shrink-0" />
                  <p className="text-[10px] leading-relaxed font-medium">
                    Gambar ini akan muncul secara bergantian di bagian <strong>About</strong> dan <strong>Hero Section</strong> sebagai slideshow dinamis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

export default DataSaya;