import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useProjectStore } from "../../stores/projectStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import useCustomSwals from "../../hooks/useCustomSwals";
import FloatingLabelInput, { FloatingLabelTextarea } from "../FloatingLabelInput";
import { TableContainer, THead, TRow, TCell, TableFooter } from "../StylingTable";
import ModalDashboard from "../ModalDashboard";

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

  const { success: customToast, error: errorToast } = useCustomToast();
  const { showConfirmSwal, showSuccessSwal } = useCustomSwals();

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
  const [limit, setLimit] = useState(9);
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
        errorToast("Harus berupa gambar!");
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

  const handleOpenProjectModal = (project = null) => {
    if (project) {
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
    } else {
      setEditingProjectId(null);
      setProjectForm(initialProjectForm);
      setImagePreview("");
    }
    setImageFile(null);
    setTagInput("");
    document.getElementById("project_modal").showModal();
  };

  const handleCloseProjectModal = () => {
    document.getElementById("project_modal").close();
  };

  const handleProjectSubmit = async () => {
    if (!editingProjectId && !imageFile) {
      return errorToast("Gagal", "Gambar utama wajib di-upload untuk proyek baru.");
    }
    setIsSaving(true);
    const formData = new FormData();
    Object.keys(projectForm).forEach((key) => {
      if (!['imageUrl', '_id', 'createdAt', 'updatedAt', '__v'].includes(key)) {
        formData.append(key, projectForm[key]);
      }
    });
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      if (editingProjectId) await updateProject(editingProjectId, formData);
      else await addProject(formData);
      showSuccessSwal("Berhasil!");
      handleCloseProjectModal();
    } catch (error) {
      errorToast("Error", error.response?.data?.message || "Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProjectDelete = async (project) => {
    if (await showConfirmSwal("Hapus Proyek?", `Hapus proyek: ${project.title}?`)) {
      try {
        await deleteProject(project._id);
        showSuccessSwal("Dihapus!");
      } catch (e) {
        errorToast("Gagal hapus");
      }
    }
  };

  if (isProjectsLoading) return <div className="flex justify-center py-20"><span className="loading loading-ring loading-lg text-primary"></span></div>;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden">
      <div className="card-body p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black font-display flex items-center gap-3">
              <Icon icon="solar:gallery-bold-duotone" className="text-primary" /> Kelola Galeri
            </h1>
          </div>
          <button className="btn btn-primary rounded-2xl shadow-lg shadow-primary/20" onClick={() => handleOpenProjectModal()}>
            <Icon icon="mdi:plus-circle" className="w-5 h-5" /> Tambah Proyek
          </button>
        </div>

        <div className="flex justify-end mb-6">
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
                    <div className="text-xs opacity-60 line-clamp-2 mb-2 max-w-sm">{project.description}</div>
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
                      <button className="btn btn-xs btn-outline btn-warning" onClick={() => handleOpenProjectModal(project)}>
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

        <ModalDashboard
          id="project_modal"
          title={editingProjectId ? "Edit Proyek" : "Tambah Proyek Baru"}
          icon="solar:gallery-bold-duotone"
          isSaving={isSaving}
          onSave={handleProjectSubmit}
          onCancel={handleCloseProjectModal}
        >
          <div className="space-y-6 mt-2">
            <FloatingLabelInput label="Judul Proyek" name="title" value={projectForm.title} onChange={handleInputChange} required />

            <FloatingLabelTextarea label="Deskripsi Singkat" name="description" value={projectForm.description} onChange={handleInputChange} rows={3} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn btn-primary h-14 w-14 rounded-xl shrink-0"
                >
                  <Icon icon="mdi:plus-circle" className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-4 border border-base-content/10 rounded-xl bg-base-100 min-h-[4rem] content-start">
                {projectForm.tags ? projectForm.tags.split(",").map((tag, i) => tag.trim() && (
                  <div key={i} className="badge badge-lg py-4 px-4 bg-base-200 border-base-content/20 gap-2 font-bold text-xs uppercase tracking-wider group">
                    {tag.trim()}
                    <button
                      type="button"
                      className="hover:scale-125 transition-transform"
                      onClick={() => handleRemoveTag(tag.trim())}
                    >
                      <Icon icon="solar:close-circle-bold" className="w-4 h-4 text-error" />
                    </button>
                  </div>
                )) : (
                  <span className="text-xs italic opacity-40 ml-2 self-center">Belum ada tag ditambahkan.</span>
                )}
              </div>
            </div>

            <div className="p-5 border border-base-content/20 rounded-2xl bg-base-200/20">
              <label className="label-text font-bold mb-2 block opacity-60 uppercase text-xs tracking-wider">Thumbnail Proyek</label>
              <input type="file" className="file-input file-input-sm file-input-bordered file-input-primary w-full" onChange={handleImageChange} accept="image/*" />
              {imagePreview && (
                <div className="mt-4 p-2 border border-dashed border-base-content/20 rounded-xl flex justify-center bg-base-100 h-64 overflow-hidden">
                  <img src={imagePreview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                </div>
              )}
            </div>

          </div>
        </ModalDashboard>
      </div>
    </div>
  );
}

export default EditGallery;