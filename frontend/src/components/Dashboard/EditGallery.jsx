import React, { useState, useEffect, useMemo, useRef } from "react";
import { Icon } from "@iconify/react";
import { useProjectStore } from "../../stores/projectStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import FloatingLabelInput, { FloatingLabelTextarea } from "../FloatingLabelInput";
import { TableContainer, THead, TRow, TCell, TableFooter } from "../StylingTable";

const initialProjectForm = {
  title: "",
  description: "",
  imageUrl: "",
  demoUrl: "",
  sourceUrl: "",
  tags: "",
};

function EditGallery() {
  const projects = useProjectStore((state) => state.projects);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const addProject = useProjectStore((state) => state.addProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const { success: successToast, error: errorToast } = useCustomToast();
  const { showConfirmSwal } = useCustomSwals();

  const formRef = useRef(null);

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
  }, [fetchProjects, projects.length]);

  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [tagInput, setTagInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const filteredProjects = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return projects.filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower) ||
      p.tags?.toLowerCase().includes(lower)
    );
  }, [projects, searchTerm]);

  const totalData = filteredProjects.length;
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;
    return filteredProjects.slice(startIndex, startIndex + limit);
  }, [filteredProjects, currentPage, limit]);

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
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        errorToast("Format Salah", "File yang diunggah harus berupa gambar!");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const currentTags = projectForm.tags ? projectForm.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    if (!currentTags.includes(tagInput.trim())) {
      const newTags = [...currentTags, tagInput.trim()].join(", ");
      setProjectForm(prev => ({ ...prev, tags: newTags }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = projectForm.tags.split(",").map(t => t.trim()).filter(Boolean);
    const newTags = currentTags.filter(t => t !== tagToRemove).join(", ");
    setProjectForm(prev => ({ ...prev, tags: newTags }));
  };

  const handleEditClick = (project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      imageUrl: project.imageUrl || "",
      demoUrl: project.demoUrl || "",
      sourceUrl: project.sourceUrl || "",
      tags: project.tags || "",
    });
    setImagePreview(project.imageUrl || "");
    setImageFile(null);
    setTagInput("");

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectForm(initialProjectForm);
    setImagePreview("");
    setImageFile(null);
    setTagInput("");
  };

  const handleProjectSubmit = async () => {
    if (!projectForm.title.trim()) {
      return errorToast("Validasi Gagal", "Judul proyek wajib diisi.");
    }
    if (!editingProjectId && !imageFile) {
      return errorToast("Validasi Gagal", "Thumbnail proyek wajib di-upload untuk proyek baru.");
    }

    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", projectForm.title);
    formData.append("description", projectForm.description || "");
    formData.append("demoUrl", projectForm.demoUrl || "");
    formData.append("sourceUrl", projectForm.sourceUrl || "");
    formData.append("tags", projectForm.tags || "");

    if (imageFile) {
      formData.append("thumbnail", imageFile);
    }

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, formData);
        successToast("Proyek berhasil diperbarui!");
      } else {
        await addProject(formData);
        successToast("Proyek baru berhasil ditambahkan!");
      }
      handleCancelEdit(); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Gagal menyimpan data.";
      errorToast("Gagal Menyimpan", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProjectDelete = async (project) => {
    if (await showConfirmSwal("Hapus Proyek?", `Apakah Anda yakin ingin menghapus proyek: ${project.title}?`)) {
      try {
        await deleteProject(project._id);
        successToast("Proyek berhasil dihapus.");
      } catch (e) {
        errorToast("Gagal Menghapus", e.response?.data?.message || "Terjadi kesalahan saat menghapus proyek.");
      }
    }
  };

  if (isProjectsLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <span className="loading loading-ring w-16 h-16 text-primary"></span>
      <p className="font-bold opacity-60 animate-pulse tracking-widest text-sm uppercase">Memuat Data...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6" ref={formRef}>
      <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden">
        <div className="card-body p-6 md:p-10 space-y-6">
          <div className="flex items-center justify-between border-b border-base-content/10 pb-4 mb-2">
            <h2 className="text-xl md:text-2xl font-black font-display flex items-center gap-3">
              <Icon icon={editingProjectId ? "mdi:pencil-circle" : "mdi:plus-circle"} className="text-primary w-8 h-8" />
              {editingProjectId ? "Edit Proyek" : "Tambah Proyek Baru"}
            </h2>
            {editingProjectId && (
              <button onClick={handleCancelEdit} className="btn btn-sm btn-ghost text-error hover:bg-error/10">
                <Icon icon="mdi:close" className="w-4 h-4" /> Batal Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FloatingLabelInput label="Judul Proyek" name="title" value={projectForm.title} onChange={handleInputChange} required />
              <FloatingLabelTextarea label="Deskripsi Singkat" name="description" value={projectForm.description} onChange={handleInputChange} rows={3} required />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingLabelInput label="URL Demo Web (opsional)" name="demoUrl" value={projectForm.demoUrl} onChange={handleInputChange} />
                <FloatingLabelInput label="URL Github/Source (opsional)" name="sourceUrl" value={projectForm.sourceUrl} onChange={handleInputChange} />
              </div>

              <div className="space-y-3 p-5 border border-base-content/20 rounded-2xl bg-base-200/20">
                <label className="label-text font-bold opacity-60 uppercase text-xs tracking-wider">Tags Proyek</label>
                <div className="flex gap-2 items-center">
                  <FloatingLabelInput
                    label="Ketik Tag (Cth: React) lalu tekan Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button type="button" onClick={handleAddTag} className="btn btn-primary h-14 w-14 rounded-xl shrink-0">
                    <Icon icon="mdi:plus-circle" className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 content-start">
                  {projectForm.tags ? projectForm.tags.split(",").map((tag, i) => tag.trim() && (
                    <div key={i} className="badge badge-lg py-4 px-4 bg-base-200 border-base-content/20 gap-2 font-bold text-xs uppercase tracking-wider group">
                      {tag.trim()}
                      <button type="button" className="hover:scale-125 transition-transform" onClick={() => handleRemoveTag(tag.trim())}>
                        <Icon icon="solar:close-circle-bold" className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  )) : (
                    <span className="text-xs italic opacity-40 ml-2">Belum ada tag ditambahkan.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border border-base-content/20 rounded-2xl bg-base-200/20 flex flex-col h-full">
              <label className="label-text font-bold mb-3 block opacity-60 uppercase text-xs tracking-wider">Thumbnail Proyek</label>
              <input type="file" className="file-input file-input-bordered file-input-primary w-full" onChange={handleImageChange} accept="image/*" />
              <div className="mt-4 p-2 border border-dashed border-base-content/20 rounded-xl flex-grow flex items-center justify-center bg-base-100 overflow-hidden min-h-[200px]">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-contain rounded-lg" alt="Preview Thumbnail" />
                ) : (
                  <div className="text-center opacity-40 flex flex-col items-center">
                    <Icon icon="mdi:image-outline" className="w-12 h-12 mb-2" />
                    <span className="text-sm">Belum ada gambar</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-base-content/10">
            <button
              onClick={handleProjectSubmit}
              disabled={isSaving}
              className="btn btn-primary rounded-2xl px-8 shadow-lg shadow-primary/20"
            >
              {isSaving ? <span className="loading loading-ring loading-md"></span> : <Icon icon="mdi:content-save" className="w-5 h-5" />}
              {isSaving ? "Menyimpan..." : "Simpan Proyek"}
            </button>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden">
        <div className="card-body p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h3 className="text-xl font-bold font-display opacity-80 flex items-center gap-2">
              <Icon icon="mdi:format-list-bulleted" /> Daftar Proyek
            </h3>
            <div className="w-full md:w-80 relative">
              <input type="search" placeholder="Cari proyek (judul, tag)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input input-bordered w-full rounded-2xl pl-10 bg-base-200/50 border-base-content/20 focus:bg-base-100 transition-colors" />
              <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            </div>
          </div>

          <div className="flex flex-col shadow-sm border border-base-content/20 rounded-2xl overflow-hidden">
            <TableContainer>
              <THead>
                <th className="w-16">No</th>
                <th className="w-32">Thumbnail</th>
                <th>Informasi Proyek</th>
                <th className="w-32 text-center">Tautan</th>
                <th className="w-48 text-center">Aksi</th>
              </THead>
              <tbody>
                {paginatedProjects.map((project, idx) => (
                  <TRow key={project._id}>
                    <TCell className="text-center font-mono opacity-50">{(currentPage - 1) * limit + idx + 1}</TCell>
                    <TCell>
                      <div className="avatar justify-center">
                        <div className="w-24 h-16 rounded-lg border border-base-content/10 overflow-hidden shadow-sm bg-base-200">
                          <img src={project.imageUrl} className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" alt={project.title} />
                        </div>
                      </div>
                    </TCell>
                    <TCell>
                      <div className="font-bold text-sm mb-1 text-base-content">{project.title}</div>
                      <div className="text-xs opacity-60 mb-2 max-w-sm break-words whitespace-normal leading-relaxed">{project.description}</div>
                      <div className="flex gap-1 flex-wrap">
                        {project.tags && project.tags.split(",").map((tag, i) => (
                          <span key={i} className="badge badge-primary badge-outline badge-xs font-bold">{tag.trim()}</span>
                        ))}
                      </div>
                    </TCell>
                    <TCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-xs btn-square btn-ghost text-info" title="Lihat Demo">
                            <Icon icon="mdi:web" className="w-5 h-5" />
                          </a>
                        )}
                        {project.sourceUrl && (
                          <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-xs btn-square btn-ghost text-accent" title="Lihat Source Code">
                            <Icon icon="mdi:github" className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </TCell>
                    <TCell className="text-center align-middle">
                      <div className="flex gap-2 justify-center">
                        <button className="btn btn-xs btn-outline btn-warning" onClick={() => handleEditClick(project)}>
                          <Icon icon="mdi:pencil" className="w-3 h-3 mr-1" /> Edit
                        </button>
                        <button className="btn btn-xs btn-outline btn-error" onClick={() => handleProjectDelete(project)}>
                          <Icon icon="mdi:delete" className="w-3 h-3 mr-1" /> Hapus
                        </button>
                      </div>
                    </TCell>
                  </TRow>
                ))}
                {paginatedProjects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-base-content/40 italic border-b border-base-content/5">
                      {searchTerm ? "Proyek tidak ditemukan." : "Belum ada proyek."}
                    </td>
                  </tr>
                )}
              </tbody>
            </TableContainer>
            <TableFooter limit={limit} setLimit={setLimit} totalData={totalData} currentDataCount={paginatedProjects.length} onNext={() => setCurrentPage(p => p + 1)} onPrev={() => setCurrentPage(p => p - 1)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGallery;