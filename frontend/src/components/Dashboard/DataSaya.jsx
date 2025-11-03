import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "../../context/AppContext";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";

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

const FloatingLabelTextarea = ({
  id,
  label,
  value,
  onChange,
  name,
  rows = 3,
}) => (
  <div className="relative form-control">
    <textarea
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder=" "
      className="textarea textarea-bordered text-justify w-full pt-4 peer text-base"
      rows={rows}
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-1 text-xs text-base-content/70 transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:text-primary pointer-events-none z-10"
    >
      {label}
    </label>
  </div>
);

function DataSaya() {
  const {
    siteData,
    updateSiteData,
    isSiteDataLoading,
    uploadProfileImage,
    updateProfileImage,
    deleteProfileImage,
  } = useAppContext();

  const { success: customToast, error: errorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

  const [formData, setFormData] = useState(siteData);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [editingImageIndex, setEditingImageIndex] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  const [isDeleting, setIsDeleting] = useState(null);

  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!isSaving) {
      setFormData(siteData);
    }
  }, [siteData]);

  useEffect(() => {
    const currentPreview = imagePreview;
    return () => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
        console.log("Revoked Object URL:", currentPreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    let { name, value } = e.target;
    if (name === "whatsapp" && value.startsWith("0")) {
      value = "62" + value.substring(1);
    }
    setFormData((prev) => ({
      ...prev,
      contactLinks: {
        ...prev.contactLinks,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        errorToast("File harus berupa gambar!");
        setNewImageFile(null);
        setImagePreview("");
        e.target.value = null;
        return;
      }
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      console.log("Created Object URL:", previewUrl);
    } else {
      setNewImageFile(null);
      setImagePreview("");
    }
  };

  const handleEditFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        errorToast("File harus berupa gambar!");
        e.target.value = null;
        return;
      }
      setEditImageFile(file);
      setEditingImageIndex(index);
    } else {
      setEditImageFile(null);
    }
  };

  const handleAddImageToList = async () => {
    if (!newImageFile) {
      errorToast("Pilih file gambar terlebih dahulu.");
      return;
    }
    if (formData.profileImages.length >= 3) {
      errorToast("Maksimal 3 gambar profil.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("profileImage", newImageFile);

      await uploadProfileImage(uploadData);

      showSuccessSwal("Gambar berhasil di-upload dan ditambahkan!");

      setNewImageFile(null);
      setImagePreview("");
      const fileInput = document.getElementById("profileImageUpload");
      if (fileInput) fileInput.value = null;
    } catch (error) {
      console.error("Gagal upload gambar:", error);
      errorToast(
        "Upload Gagal",
        error.response?.data?.message || "Terjadi kesalahan server."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (indexToDelete, imageUrl) => {
    const isConfirmed = await showConfirmSwal(
      "Hapus Gambar?",
      "Gambar ini akan dihapus permanen dari server. Yakin?"
    );
    if (isConfirmed) {
      setIsDeleting(indexToDelete);
      try {
        await deleteProfileImage(imageUrl);
        customToast("Gambar berhasil dihapus.");
      } catch (error) {
        console.error("Gagal hapus gambar:", error);
        errorToast(
          "Hapus Gagal",
          error.response?.data?.message || "Terjadi kesalahan server."
        );
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSaveEdit = async (index, oldImageUrl) => {
    if (!editImageFile) {
      errorToast("Pilih file gambar baru terlebih dahulu.");
      return;
    }

    setIsUpdating(index); // Set loading untuk baris ini

    try {
      const uploadData = new FormData();
      uploadData.append("profileImage", editImageFile);
      uploadData.append("oldImageUrl", oldImageUrl);

      await updateProfileImage(uploadData);

      customToast("Gambar berhasil diperbarui!");

      setEditingImageIndex(null);
      setEditImageFile(null);
    } catch (error) {
      console.error("Gagal update gambar:", error);
      errorToast(
        "Update Gagal",
        error.response?.data?.message || "Terjadi kesalahan server."
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateSiteData(formData);
      customToast("Data situs berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal simpan data:", error);
      errorToast(
        "Simpan Gagal",
        error.response?.data?.message || "Terjadi kesalahan server."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isSiteDataLoading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body flex items-center justify-center h-96">
          <span className="loading loading-lg loading-bars"></span>
          <p className="mt-4">Memuat data situs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <form className="card-body" onSubmit={handleSave}>
        <h2 className="card-title text-2xl font-display text-center justify-center">
          Data Situs
        </h2>
        <div className="divider my-2"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <FloatingLabelInput
            id="brandName"
            name="brandName"
            label="Nama Brand (cth: webMazda.N)"
            value={formData.brandName}
            onChange={handleInputChange}
          />
          <FloatingLabelInput
            id="brandNameShort"
            name="brandNameShort"
            label="Nama Pendek (cth: MazdaN)"
            value={formData.brandNameShort}
            onChange={handleInputChange}
          />
          <FloatingLabelInput
            id="jobTitle"
            name="jobTitle"
            label="Pekerjaan (cth: Front-End Developer)"
            value={formData.jobTitle}
            onChange={handleInputChange}
          />
          <FloatingLabelInput
            id="location"
            name="location"
            label="Lokasi (cth: Ambarawa, Kab. Semarang)"
            value={formData.location}
            onChange={handleInputChange}
          />
          <FloatingLabelInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={formData.contactLinks.email}
            onChange={handleContactChange}
          />
          <FloatingLabelInput
            id="whatsapp"
            name="whatsapp"
            label="WhatsApp (cth: 628...)"
            value={formData.contactLinks.whatsapp}
            onChange={handleContactChange}
            type="tel"
          />

          <FloatingLabelInput
            id="telegram"
            name="telegram"
            label="Telegram Kamu"
            value={formData.contactLinks.telegram}
            onChange={handleContactChange}
          />
          <FloatingLabelInput
            id="instagram"
            name="instagram"
            label="Instagram Kamu"
            value={formData.contactLinks.instagram}
            onChange={handleContactChange}
          />
          <FloatingLabelInput
            id="github"
            name="github"
            label="GitHub Kamu"
            value={formData.contactLinks.github}
            onChange={handleContactChange}
          />
          <FloatingLabelInput
            id="linkedin"
            name="linkedin"
            label="LinkedIn Kamu"
            value={formData.contactLinks.linkedin}
            onChange={handleContactChange}
          />
          {/* <FloatingLabelInput
            id="typeAnimationSequenceString"
            name="typeAnimationSequenceString"
            label="Teks Animasi Hero (pisah koma)" 
            value={formData.typeAnimationSequenceString}
            onChange={handleInputChange} 
          /> */}
        </div>

        <div className="mt-4">
          <FloatingLabelInput
            id="typeAnimationSequenceString"
            name="typeAnimationSequenceString"
            label="Teks Animasi Hero (pisah koma)"
            value={formData.typeAnimationSequenceString}
            onChange={handleInputChange}
          />
        </div>

        <div className="divider mt-8 font-bold">
          Pengaturan Tentang dan Gambar
        </div>
        <div className="my-2">
          <FloatingLabelTextarea
            id="aboutParagraph"
            name="aboutParagraph"
            label="Tentang Saya (Paragraf)"
            value={formData.aboutParagraph}
            onChange={handleInputChange}
            rows={5} // Tinggikan sedikit
          />
        </div>

        {/* --- Bagian Upload Gambar --- */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">
              Upload Gambar Profil Baru (Maks. 3 Total)
            </span>
          </label>
          <input
            id="profileImageUpload" // ID untuk reset
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
            accept="image/*" // Terima semua jenis gambar
          />
        </div>

        {/* --- Area Pratinjau Gambar Baru --- */}
        {imagePreview && (
          <div className="mt-4 p-4 border border-dashed border-base-300 rounded-lg flex flex-col items-center gap-4">
            <p className="text-sm font-semibold text-center">
              Pratinjau Gambar Baru:
            </p>
            <img
              src={imagePreview}
              alt="Pratinjau gambar baru"
              className="w-48 h-48 rounded-lg object-cover shadow"
            />
            <button
              type="button"
              onClick={handleAddImageToList}
              className="btn btn-md btn-secondary"
              disabled={formData.profileImages.length >= 3 || isUploading}
            >
              {isUploading ? (
                <span className="loading loading-dots loading-xs"></span>
              ) : (
                <Icon icon="mdi:plus-circle-outline" className="mr-1" />
              )}
              {isUploading ? "Mengupload..." : "Tambahkan ke Daftar"}
            </button>
          </div>
        )}

        <div className="card-actions justify-center mt-2">
          <button
            type="submit"
            className="btn btn-primary sm:w-45 md:w-lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Icon icon="mdi:content-save" className="mr-2" />
            )}
            Simpan Perubahan
          </button>
        </div>

        {/* --- Tabel Daftar Gambar --- */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Daftar Gambar Profil ({formData.profileImages.length}/3)
          </h3>
          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table table-zebra table-hover w-full">
              <thead className="bg-neutral text-neutral-content text-center">
                <tr>
                  <th className="w-12 px-4 py-3">#</th>
                  <th className="w-32 px-4 py-3 border-l border-base-300">
                    Pratinjau
                  </th>
                  <th className="px-4 py-3 border-l border-base-300">
                    URL Gambar
                  </th>
                  <th className="w-28 px-4 py-3 border-l border-base-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.profileImages.map((imageUrl, index) => (
                  <tr
                    key={index}
                    className="border-b border-base-300 last:border-b-0 hover"
                  >
                    <th className="text-center px-4 py-2">{index + 1}</th>
                    <td className="px-4 py-2 border-l border-base-300">
                      {editingImageIndex === index ? (
                        <div className="space-y-4">
                          <label className="label-text text-xs text-base-content/70">
                            Pilih file baru:
                          </label>
                          <input
                            type="file"
                            className="file-input file-input-bordered file-input-sm w-full"
                            onChange={(e) => handleEditFileChange(e, index)}
                            accept="image/*"
                          />
                        </div>
                      ) : (
                        <div className="avatar flex justify-center">
                          <div className="w-48 rounded shadow">
                            <img
                              src={imageUrl}
                              alt={`Gambar profil ${index + 1}`}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="text-xs break-all max-w-xs px-4 py-2 border-l border-base-300">
                      {imageUrl}
                    </td>
                    <td className="text-center px-4 py-2 border-l border-base-300">
                      {editingImageIndex === index ? (
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            className="btn btn-xs btn-success w-full"
                            onClick={() => handleSaveEdit(index, imageUrl)}
                            disabled={isUpdating === index || !editImageFile}
                          >
                            <Icon icon="mdi:content-save" className="mr-1" />
                            {isUpdating === index ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Simpan"
                            )}
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs btn-danger w-full"
                            onClick={() => setEditingImageIndex(null)}
                          >
                            <Icon icon="mdi:cancel" className="mr-1" />
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingImageIndex(index);
                              setEditImageFile(null);
                            }}
                            className="btn btn-sm btn-warning w-full"
                            disabled={
                              isDeleting !== null || isUpdating !== null
                            }
                          >
                            <Icon icon="mdi:pencil" className="mr-1" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index, imageUrl)}
                            className="btn btn-sm btn-error w-full"
                            disabled={
                              isDeleting !== null || isUpdating !== null
                            }
                          >
                            {isDeleting === index ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <Icon
                                icon="mdi:delete-outline"
                                className="mr-1"
                              />
                            )}
                            {isDeleting === index ? "..." : "Hapus"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {formData.profileImages.length === 0 && (
                  <tr className="border-b border-base-300 last:border-b-0">
                    <td
                      colSpan="4"
                      className="text-center text-base-content/60 italic py-4"
                    >
                      Belum ada gambar profil.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DataSaya;
