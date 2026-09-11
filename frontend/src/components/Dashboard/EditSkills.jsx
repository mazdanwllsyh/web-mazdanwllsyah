import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore, initialHardSkills } from "../../stores/portfolioStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import FloatingLabelInput from "../FloatingLabelInput";
import { TableContainer, THead, TRow, TCell } from "../StylingTable";

const skillLevels = [
  { value: "Dasar", label: "1 - Dasar" },
  { value: "Pemula", label: "2 - Pemula" },
  { value: "Menengah", label: "3 - Menengah" },
  { value: "Mahir", label: "4 - Mahir" },
  { value: "Pakar", label: "5 - Pakar" },
];

// Mapping Ikon Kategori Biar Makin Cakep
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

function EditSkills() {
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const addSoftSkill = usePortfolioStore((state) => state.addSoftSkill);
  const deleteSoftSkill = usePortfolioStore((state) => state.deleteSoftSkill);
  const updateHardSkills = usePortfolioStore((state) => state.updateHardSkills);

  const { success: customToast, error: errorToast } = useCustomToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [localHardSkills, setLocalHardSkills] = useState(skillsData.hardSkills || []);
  const [newSoftSkill, setNewSoftSkill] = useState("");

  const [isSavingSoftSkill, setIsSavingSoftSkill] = useState(false);
  const [isSavingHardSkill, setIsSavingHardSkill] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if (!skillsData.hardSkills || skillsData.hardSkills.length === 0) {
      fetchSkillsData();
    }
  }, [fetchSkillsData, skillsData.hardSkills]);

  useEffect(() => {
    if (skillsData.hardSkills) setLocalHardSkills(skillsData.hardSkills);
  }, [skillsData.hardSkills]);

  const masterSkillList = initialHardSkills;

  // Logika Grouping berdasarkan Category
  const groupedSkills = useMemo(() => {
    const filteredMasterList = masterSkillList.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groups = {};
    filteredMasterList.forEach((masterSkill) => {
      const userSkill = localHardSkills.find((s) => s.name === masterSkill.name);
      const mappedSkill = {
        ...masterSkill,
        level: userSkill ? userSkill.level : "Dasar",
        isDisplayed: !!userSkill,
      };

      if (!groups[masterSkill.category]) {
        groups[masterSkill.category] = [];
      }
      groups[masterSkill.category].push(mappedSkill);
    });

    return groups;
  }, [masterSkillList, localHardSkills, searchTerm]);

  const handleAddSoftSkill = async () => {
    if (!newSoftSkill.trim()) return;
    setIsSavingSoftSkill(true);
    try {
      await addSoftSkill(newSoftSkill.trim());
      setNewSoftSkill("");
      customToast("Soft skill ditambahkan!");
    } catch (error) {
      errorToast("Gagal", error.response?.data?.message || "Error server");
    } finally {
      setIsSavingSoftSkill(false);
    }
  };

  const handleDeleteSoftSkill = async (index) => {
    setIsDeleting(index);
    try {
      await deleteSoftSkill(index);
      customToast("Soft skill dihapus.");
    } catch (error) {
      errorToast("Gagal", error.response?.data?.message || "Error server");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDisplayChange = (skillName, isChecked) => {
    if (isChecked) {
      const skillToAdd = masterSkillList.find((s) => s.name === skillName);
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-6">
        <div className="card bg-base-100 shadow-sm border border-base-content/20 rounded-[2.5rem] overflow-hidden sticky top-6">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex items-center gap-3">
              <div className="p-2 bg-info/10 text-info rounded-xl">
                <Icon icon="mdi:brain" className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black font-display">Soft Skills</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex gap-2 items-center">
                <FloatingLabelInput
                  id="softSkill"
                  name="softSkill"
                  label="Contoh: Komunikasi Efektif"
                  value={newSoftSkill}
                  onChange={(e) => setNewSoftSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSoftSkill()}
                  minLength={3}
                />
                <button
                  onClick={handleAddSoftSkill}
                  className="btn btn-primary h-14 w-14 rounded-xl shrink-0"
                  disabled={isSavingSoftSkill}
                >
                  {isSavingSoftSkill ? <span className="loading loading-ring"></span> : <Icon icon="mdi:plus-circle" className="w-6 h-6" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 p-4 border border-base-content/20 rounded-2xl bg-base-200/30 min-h-32 content-start">
                {skillsData.softSkills.length > 0 ? (
                  skillsData.softSkills.map((skill, index) => (
                    <div key={index} className="badge badge-lg py-4 px-4 bg-base-100 border-base-content/20 gap-2 font-bold text-xs tracking-wider group">
                      {skill}
                      <button
                        onClick={() => handleDeleteSoftSkill(index)}
                        disabled={isDeleting === index}
                        className="hover:scale-125 transition-transform"
                      >
                        {isDeleting === index ? (
                          <span className="loading loading-ring loading-xs"></span>
                        ) : (
                          <Icon icon="solar:close-circle-bold" className="w-4 h-4 text-error" />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs italic opacity-40 mx-auto self-center">Belum ada soft skill ditambahkan.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="card bg-base-100 shadow-sm border rounded-[2.5rem] border-base-content/20 overflow-hidden">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
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
                  className="input input-bordered input-sm w-full rounded-full pl-8 h-10"
                />
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 w-5 h-5" />
              </div>
            </div>

            <div className="p-6 space-y-8">
              {Object.keys(groupedSkills).length === 0 ? (
                <div className="text-center py-10 text-base-content/40 italic">
                  Skill tidak ditemukan.
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
                  {isSavingHardSkill ? "Menyimpan..." : "Simpan Perubahan Hard Skills"}
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