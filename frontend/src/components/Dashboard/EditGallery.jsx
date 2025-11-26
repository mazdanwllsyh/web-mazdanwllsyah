import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioData } from "../../context/PortofolioDataContext";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import { usePagination } from "../../hooks/usePagination";

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
// --- Batas Floating Label ---

const initialProjectForm = {
  title: "",
  description: "",
  imageUrl: "",
  demoUrl: "",
  sourceUrl: "",
  tags: "",
};

function EditGallery() {
  const {
    projects,
    addProject,
    updateProject,
    isProjectsLoading,
    deleteProject,
  } = usePortfolioData();

  // Implementasi Hooks (Poin 4)
  const { error: errorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [editingProjectIndex, setEditingProjectIndex] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);

  // State untuk upload file (Poin 2)
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return projects.filter(
      (proj) =>
        proj.title.toLowerCase().includes(lowerCaseSearch) ||
        proj.description.toLowerCase().includes(lowerCaseSearch) ||
        (proj.tags && proj.tags.toLowerCase().includes(lowerCaseSearch))
    );
  }, [projects, searchTerm]);

  const paginationConfig = {
    md: 4,
    lg: 6,
  };

  const { currentItems, PaginationComponent } = usePagination(
    filteredProjects,
    paginationConfig
  );

  useEffect(() => {
    const currentPreview = imagePreview;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    if (file) {
      if (!file.type.startsWith("image/")) {
        showErrorToast("File harus berupa gambar!");
        setImageFile(null);
        setImagePreview("");
        e.target.value = null;
        return;
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleOpenProjectModal = (project = null) => {
    if (project) {
      setEditingProjectId(project._id);
      setProjectForm(project);
      setImagePreview(project.imageUrl || "");
      setEditingProjectIndex(null);
    } else {
      setEditingProjectId(null);
      setProjectForm(initialProjectForm);
      setImagePreview("");
    }
    setImageFile(null);
    document.getElementById("project_modal").showModal();
  };

  const handleCloseProjectModal = () => {
    document.getElementById("project_modal").close();
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData();
    formData.append("title", projectForm.title);
    formData.append("description", projectForm.description);
    formData.append("demoUrl", projectForm.demoUrl);
    formData.append("sourceUrl", projectForm.sourceUrl);
    formData.append("tags", projectForm.tags);

    if (imageFile) {
      formData.append("thumbnail", imageFile);
    }

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, formData);
        showSuccessSwal("Proyek berhasil diperbarui!");
      } else {
        await addProject(formData);
        showSuccessSwal("Proyek baru berhasil ditambahkan!");
      }
      handleCloseProjectModal();
    } catch (error) {
      console.error("Gagal simpan proyek:", error);
      errorToast(
        "Simpan Gagal",
        error.response?.data?.message || "Error server"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleProjectDelete = async (project) => {
    const isConfirmed = await showConfirmSwal(
      "Hapus Proyek?",
      `Anda yakin ingin menghapus proyek: "${project.title}"?`
    );
    if (isConfirmed) {
      try {
        await deleteProject(project._id);
        showSuccessSwal("Proyek berhasil dihapus.");
      } catch (error) {
        console.error("Gagal hapus proyek:", error);
        errorToast(
          "Hapus Gagal",
          error.response?.data?.message || "Error server"
        );
      }
    }
  };

  if (isProjectsLoading) {
    return (
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body flex items-center justify-center h-96">
          <span className="loading loading-lg loading-bars"></span>
          <p className="mt-4">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body">
        <h1 className="card-title text-2xl font-display text-center justify-center">
          Kelola Proyek Galeri
        </h1>
        <div className="divider my-2"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          {/* Kiri: Tombol Tambah */}
          <div className="w-full md:w-auto">
            <button
              className="btn btn-primary w-full"
              onClick={() => handleOpenProjectModal()}
            >
              <Icon icon="mdi:plus" className="w-5 h-5" />
              Tambah Proyek Baru
            </button>
          </div>
          {/* Tengah: Pagination */}
          <div className="w-full md:w-auto flex justify-center order-last md:order-none">
            <PaginationComponent />
          </div>
          {/* Kanan: Search Box */}
          <div className="w-full md:w-72">
            <input
              type="search"
              placeholder="Cari proyek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Styling Table (Poin 1) */}
        <div className="space-y-4">
          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table table-zebra table-hover w-full">
              <thead className="bg-neutral text-neutral-content text-center">
                <tr>
                  <th className="w-12 px-4 py-3">#</th>
                  <th className="w-24 px-4 py-3 border-l border-base-300">
                    Gambar
                  </th>
                  <th className="px-4 py-3 border-l border-base-300">Judul</th>
                  <th className="px-4 py-3 border-l border-base-300">Tags</th>
                  <th className="w-32 px-4 py-3 border-l border-base-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((proj) => (
                  <tr
                    key={proj._id}
                    className="border-b border-base-300 last:border-b-0 hover"
                  >
                    <th className="text-center px-4 py-2">
                      {projects.indexOf(proj) + 1}
                    </th>
                    <td className="px-4 py-2 border-l border-base-300">
                      <div className="avatar flex justify-center">
                        <div className="w-20 h-20 rounded shadow">
                          <img
                            src={proj.imageUrl}
                            alt={proj.title}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-l border-base-300 align-top">
                      <div className="font-bold">{proj.title}</div>
                      <div className="text-xs opacity-70 break-all">
                        {proj.description.substring(0, 70)}...
                      </div>
                    </td>
                    <td className="px-4 py-2 border-l border-base-300 align-top">
                      <div className="flex flex-wrap gap-1">
                        {proj.tags &&
                          proj.tags.split(",").map((tag) => (
                            <div
                              key={tag}
                              className="badge badge-accent text-xs h-auto py-1 whitespace-normal text-center"
                            >
                              {tag.trim()} 
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 border-l border-base-300 text-center align-middle">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleOpenProjectModal(proj)}
                        >
                          <Icon icon="mdi:pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => handleProjectDelete(proj)}
                        >
                          <Icon icon="mdi:delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr className="border-b border-base-300 last:border-b-0">
                    <td
                      colSpan="5"
                      className="text-center text-base-content/60 italic py-4"
                    >
                      {searchTerm
                        ? "Proyek tidak ditemukan."
                        : "Belum ada proyek galeri."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL PROYEK --- */}
        <dialog id="project_modal" className="modal modal-middle">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg font-display">
              {editingProjectIndex !== null ? "Edit Proyek" : "Tambah Proyek"}
            </h3>

            <form onSubmit={handleProjectSubmit} className="space-y-5 pt-4">
              {/* Floating Label Inputs (Poin 3) */}
              <FloatingLabelInput
                id="proj_title"
                name="title"
                label="Judul Proyek"
                value={projectForm.title}
                onChange={handleInputChange}
                required
              />
              <FloatingLabelTextarea
                id="proj_desc"
                name="description"
                label="Deskripsi"
                value={projectForm.description}
                onChange={handleInputChange}
                rows={4}
              />

              {/* File Upload (Poin 2) */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Upload Thumbnail Proyek
                  </span>
                </label>
                <input
                  id="projectImageUpload"
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {imagePreview && (
                <div className="p-2 border border-dashed border-base-300 rounded-lg flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Pratinjau thumbnail"
                    className="w-24 h-24 rounded-lg object-cover shadow"
                  />
                </div>
              )}

              <FloatingLabelInput
                id="proj_demo"
                name="demoUrl"
                label="URL Demo (diawali http:// atau #)"
                value={projectForm.demoUrl}
                onChange={handleInputChange}
              />
              <FloatingLabelInput
                id="proj_source"
                name="sourceUrl"
                label="URL Source Code (diawali http:// atau #)"
                value={projectForm.sourceUrl}
                onChange={handleInputChange}
              />
              <FloatingLabelInput
                id="proj_tags"
                name="tags"
                label="Tags (pisahkan koma, cth: React,Node,MUI)"
                value={projectForm.tags}
                onChange={handleInputChange}
              />

              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={handleCloseProjectModal}
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

export default EditGallery;
