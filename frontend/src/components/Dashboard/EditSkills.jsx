import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore, initialHardSkills } from "../../stores/portfolioStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import FloatingLabelInput, { FloatingLabelTextarea } from "../FloatingLabelInput";
import { TableContainer, THead, TRow, TCell } from "../StylingTable";

const skillLevels = [
  { value: "Dasar", label: "1 - Dasar" },
  { value: "Pemula", label: "2 - Pemula" },
  { value: "Menengah", label: "3 - Menengah" },
  { value: "Mahir", label: "4 - Mahir" },
  { value: "Pakar", label: "5 - Pakar" },
];

const categoryIcons = {
  "Markup": "mdi:language-html5",
  "Bahasa Pemrograman": "mdi:code-braces",
  "Framework & Library": "mdi:react",
  "Styling & UI": "mdi:palette",
  "State Management": "mdi:database-sync",
  "Database": "mdi:database",
  "Tools & Lainnya": "mdi:toolbox",
  "Cloud & Deploy": "mdi:cloud-upload",
  "IDE & Office": "mdi:microsoft-visual-studio-code"
};

const hardSkillTabs = [
  { id: "lang", label: "Languages", categories: ["Markup", "Bahasa Pemrograman"] },
  { id: "framework", label: "Framework", categories: ["Framework & Library"] },
  { id: "styling", label: "Styling", categories: ["Styling & UI"] },
  { id: "data", label: "State & DB", categories: ["State Management", "Database"] },
  { id: "tools", label: "Tools", categories: ["Tools & Lainnya"] },
  { id: "workspace", label: "Deploy & IDE", categories: ["Cloud & Deploy", "IDE & Office"] },
];

function EditSkills() {
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const updateSoftSkills = usePortfolioStore((state) => state.updateSoftSkills);
  const updateHardSkills = usePortfolioStore((state) => state.updateHardSkills);

  const { success: customToast, error: errorToast } = useCustomToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [localHardSkills, setLocalHardSkills] = useState([]);
  const [localSoftSkills, setLocalSoftSkills] = useState([]);
  const [activeHardTab, setActiveHardTab] = useState("lang");

  const [newSoftName, setNewSoftName] = useState("");
  const [newSoftDesc, setNewSoftDesc] = useState("");
  const [editingSoftIndex, setEditingSoftIndex] = useState(null);

  const [isSavingSoftSkill, setIsSavingSoftSkill] = useState(false);
  const [isSavingHardSkill, setIsSavingHardSkill] = useState(false);

  useEffect(() => {
    if (!skillsData.hardSkills || skillsData.hardSkills.length === 0) {
      fetchSkillsData();
    }
  }, [fetchSkillsData, skillsData.hardSkills]);

  useEffect(() => {
    if (skillsData.hardSkills) setLocalHardSkills(skillsData.hardSkills);
    if (skillsData.softSkills) {
      const normalized = skillsData.softSkills.map(s => {
        let name = "";
        let desc = "";

        if (typeof s === 'string') {
          name = s;
        } else if (typeof s === 'object' && s !== null) {
          name = s.name || "";
          desc = s.description || "";
        }

        if (name === "[object Object]") {
          name = "Data Rusak (Hapus)";
        }

        return { name, description: desc };
      });
      setLocalSoftSkills(normalized);
    }
  }, [skillsData]);

  useEffect(() => {
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const match = initialHardSkills.find((s) => s.name.toLowerCase().includes(lowerSearch));
      if (match) {
        const targetTab = hardSkillTabs.find((t) => t.categories.includes(match.category));
        if (targetTab) setActiveHardTab(targetTab.id);
      }
    }
  }, [searchTerm]);

  const groupedSkills = useMemo(() => {
    const activeCategories = hardSkillTabs.find(t => t.id === activeHardTab)?.categories || [];

    const filteredMasterList = initialHardSkills.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      activeCategories.includes(skill.category)
    );

    const groups = {};
    filteredMasterList.forEach((masterSkill) => {
      const userSkill = localHardSkills.find((s) => s.name === masterSkill.name);
      const mappedSkill = {
        ...masterSkill,
        level: userSkill ? userSkill.level : "Dasar",
        isDisplayed: !!userSkill,
      };

      if (!groups[masterSkill.category]) groups[masterSkill.category] = [];
      groups[masterSkill.category].push(mappedSkill);
    });

    return groups;
  }, [localHardSkills, searchTerm, activeHardTab]);

  const resetSoftForm = () => {
    setNewSoftName("");
    setNewSoftDesc("");
    setEditingSoftIndex(null);
  };

  const handleAddOrUpdateSoftSkill = () => {
    if (!newSoftName.trim()) return;

    if (editingSoftIndex !== null) {
      const updated = [...localSoftSkills];
      updated[editingSoftIndex] = { name: newSoftName.trim(), description: newSoftDesc.trim() };
      setLocalSoftSkills(updated);
    } else {
      setLocalSoftSkills([...localSoftSkills, { name: newSoftName.trim(), description: newSoftDesc.trim() }]);
    }
    resetSoftForm();
  };

  const handleEditSoftClick = (index, skill) => {
    setNewSoftName(skill.name);
    setNewSoftDesc(skill.description);
    setEditingSoftIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLocalSoftSkill = (index) => {
    const updated = localSoftSkills.filter((_, i) => i !== index);
    setLocalSoftSkills(updated);
    if (editingSoftIndex === index) resetSoftForm();
  };

  const handleSaveSoftSkillsToDB = async () => {
    setIsSavingSoftSkill(true);
    try {
      await updateSoftSkills(localSoftSkills);
      customToast("Perubahan Soft Skills berhasil disimpan!");
    } catch (error) {
      errorToast("Gagal", error.response?.data?.message || "Error server");
    } finally {
      setIsSavingSoftSkill(false);
    }
  };

  const handleDisplayChange = (skillName, isChecked) => {
    if (isChecked) {
      const skillToAdd = initialHardSkills.find((s) => s.name === skillName);
      setLocalHardSkills((prev) => [...prev, { ...skillToAdd, level: "Dasar" }]);
    } else {
      setLocalHardSkills((prev) => prev.filter((s) => s.name !== skillName));
    }
  };

  const handleLevelChange = (skillName, newLevel) => {
    setLocalHardSkills((prev) =>
      prev.map((skill) =>
        skill.name === skillName ? { ...skill, level: newLevel } : skill
      )
    );
  };

  const handleSaveHardSkills = async () => {
    setIsSavingHardSkill(true);
    try {
      await updateHardSkills(localHardSkills);
      customToast("Hard skills berhasil diperbarui!");
    } catch (error) {
      errorToast("Gagal", error.response?.data?.message || "Error server");
    } finally {
      setIsSavingHardSkill(false);
    }
  };

  if (isSkillsLoading) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-content/20">
        <div className="card-body flex items-center justify-center h-96">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

      <div className="xl:col-span-4 space-y-6">
        <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden xl:sticky xl:top-6">
          <div className="card-body p-0 flex flex-col h-full xl:max-h-[calc(100vh-3rem)]">
            <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 text-info rounded-xl">
                  <Icon icon="mdi:brain" className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black font-display">Soft Skills</h2>
              </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto no-scrollbar space-y-6">

              <div className="flex flex-col gap-3 p-5 bg-base-200/50 rounded-2xl border border-base-content/10 transition-all">
                <FloatingLabelInput
                  id="softName"
                  name="softName"
                  label="Nama Skill"
                  value={newSoftName}
                  onChange={(e) => setNewSoftName(e.target.value)}
                />
                <FloatingLabelTextarea
                  id="softDesc"
                  name="softDesc"
                  label="Deskripsi (Opsional)"
                  value={newSoftDesc}
                  onChange={(e) => setNewSoftDesc(e.target.value)}
                  rows={3}
                />

                <div className="flex gap-2 mt-2">
                  {editingSoftIndex !== null && (
                    <button onClick={resetSoftForm} className="btn btn-ghost rounded-xl flex-1">Batal</button>
                  )}
                  <button
                    onClick={handleAddOrUpdateSoftSkill}
                    className="btn btn-primary rounded-xl flex-[2]"
                    disabled={!newSoftName}
                  >
                    <Icon icon={editingSoftIndex !== null ? "mdi:content-save-edit" : "mdi:plus-circle"} className="w-5 h-5" />
                    {editingSoftIndex !== null ? "Update Skill" : "Tambah Baru"}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pb-4">
                {localSoftSkills.length > 0 ? (
                  localSoftSkills.map((skill, index) => (
                    <div
                      key={index}
                      className={`flex flex-col p-4 bg-base-100 border rounded-2xl relative group transition-all duration-300 hover:shadow-md ${skill.name === "Data Rusak (Hapus)" ? "border-error/50 bg-error/5" : "border-base-content/20 hover:border-primary"
                        }`}
                    >
                      <div className="absolute top-3 right-3 flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditSoftClick(index, skill)}
                          className="btn btn-xs btn-circle btn-ghost text-warning hover:bg-warning/20"
                        >
                          <Icon icon="solar:pen-bold" className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocalSoftSkill(index)}
                          className="btn btn-xs btn-circle btn-ghost text-error hover:bg-error/20"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className={`font-bold pr-14 ${skill.name === "Data Rusak (Hapus)" ? "text-error" : "text-base-content"}`}>
                        {skill.name}
                      </h4>
                      {skill.description && (
                        <p className="text-xs opacity-70 mt-1.5 leading-relaxed line-clamp-3">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-xs italic opacity-40 block text-center py-4">Belum ada soft skill.</span>
                )}
              </div>
            </div>

            <div className="p-6 pt-0 shrink-0">
              <button
                onClick={handleSaveSoftSkillsToDB}
                className="btn btn-secondary w-full rounded-xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-transform"
                disabled={isSavingSoftSkill}
              >
                {isSavingSoftSkill ? <span className="loading loading-ring"></span> : <Icon icon="mdi:content-save-all" className="w-5 h-5" />}
                {isSavingSoftSkill ? "Menyimpan..." : "Simpan Soft Skills"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-8">
        <div className="card bg-base-100 shadow-sm border rounded-[2.5rem] border-base-content/20 overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 bg-success/10 text-success rounded-xl">
                  <Icon icon="mdi:code-tags" className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black font-display">Katalog Hard Skills</h2>
              </div>
              <div className="w-full sm:max-w-xs relative">
                <input
                  type="search"
                  placeholder="Cari skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered input-sm w-full rounded-full pl-8 h-10 bg-base-100 border-base-content/20"
                />
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 w-5 h-5" />
              </div>
            </div>

            <div className="px-6 pt-4 pb-2 border-b border-base-content/5 overflow-x-auto no-scrollbar flex gap-2">
              {hardSkillTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveHardTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${activeHardTab === tab.id
                    ? "bg-primary text-primary-content shadow-md shadow-primary/20"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-8 min-h-[400px]">
              {Object.keys(groupedSkills).length === 0 ? (
                <div className="text-center py-10 text-base-content/40 italic">
                  Skill tidak ditemukan di kategori ini.
                </div>
              ) : (
                Object.entries(groupedSkills).map(([category, skills]) => (
                  <div key={category} className="space-y-3 animate-fade-in-up">
                    <div className="flex items-center gap-2 px-1">
                      <Icon icon={categoryIcons[category] || "mdi:folder-outline"} className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-sm uppercase tracking-widest opacity-70">{category}</h3>
                      <div className="flex-1 h-px bg-base-content/10 ml-2"></div>
                    </div>

                    <div className="shadow-sm border border-base-content/20 rounded-2xl overflow-hidden">
                      <TableContainer maxHeight="none">
                        <THead>
                          <th className="w-12 text-center">No</th>
                          <th>Teknologi</th>
                          <th className="w-48 text-center">Level</th>
                          <th className="w-24 text-center">Tampil</th>
                        </THead>
                        <tbody>
                          {skills.map((skill, index) => (
                            <TRow key={`edit-skill-${skill.name}-${index}`}>
                              <TCell className="text-center font-mono opacity-50 text-xs">
                                {index + 1}
                              </TCell>
                              <TCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-base-200 flex items-center justify-center border border-base-content/10 shrink-0">
                                    <Icon icon={skill.icon} className="w-5 h-5 text-base-content" />
                                  </div>
                                  <span className="font-bold whitespace-nowrap text-sm">{skill.name}</span>
                                </div>
                              </TCell>
                              <TCell>
                                <select
                                  className="select select-bordered select-sm w-full font-bold bg-base-100 text-xs"
                                  value={skill.level}
                                  onChange={(e) => handleLevelChange(skill.name, e.target.value)}
                                  disabled={!skill.isDisplayed}
                                >
                                  {skillLevels.map((lvl) => (
                                    <option className="bg-base-100 text-base-content" key={lvl.value} value={lvl.value}>
                                      {lvl.label}
                                    </option>
                                  ))}
                                </select>
                              </TCell>
                              <TCell className="text-center">
                                <label className="cursor-pointer label justify-center">
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-success"
                                    checked={skill.isDisplayed}
                                    onChange={(e) => handleDisplayChange(skill.name, e.target.checked)}
                                  />
                                </label>
                              </TCell>
                            </TRow>
                          ))}
                        </tbody>
                      </TableContainer>
                    </div>
                  </div>
                ))
              )}

              <div className="flex justify-end mt-8 pt-4 border-t border-base-content/10 sticky bottom-0 bg-base-100 py-4 z-10">
                <button
                  onClick={handleSaveHardSkills}
                  className="btn btn-primary rounded-xl md:w-80 w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                  disabled={isSavingHardSkill}
                >
                  {isSavingHardSkill ? <span className="loading loading-ring loading-md"></span> : <Icon icon="mdi:content-save-check" className="w-5 h-5" />}
                  Simpan Perubahan Hard Skills
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSkills;