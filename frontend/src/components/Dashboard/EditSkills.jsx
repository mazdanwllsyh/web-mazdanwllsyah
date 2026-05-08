import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useCustomToast } from "../../hooks/useCustomToast";
import FloatingLabelInput from "../FloatingLabelInput";

const skillLevels = [
  { value: "Dasar", label: "Dasar (Beginner)" },
  { value: "Menengah", label: "Menengah (Intermediate)" },
  { value: "Mahir", label: "Mahir (Advanced)" },
];

function EditSkills() {
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const updateHardSkills = usePortfolioStore((state) => state.updateHardSkills);
  const addSoftSkill = usePortfolioStore((state) => state.addSoftSkill);
  const deleteSoftSkill = usePortfolioStore((state) => state.deleteSoftSkill);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);

  const { success: successToast, error: errorToast } = useCustomToast();

  const [newSoftSkill, setNewSoftSkill] = useState("");
  const [localHardSkills, setLocalHardSkills] = useState([]);
  const [isSavingHard, setIsSavingHard] = useState(false);

  useEffect(() => {
    if (!skillsData.hardSkills.length && !skillsData.softSkills.length) {
      fetchSkillsData();
    }
  }, [fetchSkillsData, skillsData]);

  useEffect(() => {
    if (skillsData.hardSkills.length > 0) {
      const merged = skillsData.masterHardSkills.map(master => {
        const userSkill = skillsData.hardSkills.find(h => h.name === master.name);
        return userSkill ? { ...master, ...userSkill } : { ...master, level: "Dasar", isDisplayed: false };
      });
      setLocalHardSkills(merged);
    }
  }, [skillsData.hardSkills, skillsData.masterHardSkills]);

  const handleLevelChange = (name, level) => {
    setLocalHardSkills(prev => prev.map(s => s.name === name ? { ...s, level } : s));
  };

  const handleDisplayChange = (name, isDisplayed) => {
    setLocalHardSkills(prev => prev.map(s => s.name === name ? { ...s, isDisplayed } : s));
  };

  const handleSaveHardSkills = async () => {
    setIsSavingHard(true);
    const toSave = localHardSkills.filter(s => s.isDisplayed).map(({ name, level, isDisplayed }) => ({ name, level, isDisplayed }));
    try {
      await updateHardSkills(toSave);
      successToast("Hard Skills disimpan!");
    } catch (e) {
      errorToast("Gagal menyimpan.");
    } finally {
      setIsSavingHard(false);
    }
  };

  const handleAddSoftSkill = async () => {
    if (!newSoftSkill.trim()) return;
    try {
      await addSoftSkill(newSoftSkill);
      setNewSoftSkill("");
      successToast("Soft Skill ditambah!");
    } catch (e) { errorToast("Gagal."); }
  };

  if (isSkillsLoading) return <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 space-y-6">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title font-display"><Icon icon="mdi:brain" className="text-primary" /> Soft Skills</h2>
            <div className="divider my-2"></div>
            <div className="flex gap-2">
              <FloatingLabelInput label="Tambah Soft Skill" value={newSoftSkill} onChange={(e) => setNewSoftSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddSoftSkill()} />
              <button className="btn btn-primary" onClick={handleAddSoftSkill}><Icon icon="mdi:plus" /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {skillsData.softSkills.map((skill, i) => (
                <div key={i} className="badge badge-lg badge-neutral gap-2 py-4">
                  {skill}
                  <Icon icon="mdi:close-circle" className="cursor-pointer hover:text-error" onClick={() => deleteSoftSkill(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <h2 className="card-title font-display"><Icon icon="mdi:code-tags" className="text-primary" /> Master Hard Skills</h2>
            <div className="divider my-2"></div>
            <div className="overflow-x-auto border border-base-300 rounded-xl">
              <table className="table table-zebra table-sm">
                <thead className="bg-base-200">
                  <tr>
                    <th className="w-12">#</th>
                    <th>Skill</th>
                    <th className="w-40">Level</th>
                    <th className="w-20 text-center">Tampil</th>
                  </tr>
                </thead>
                <tbody>
                  {localHardSkills.map((skill, index) => (
                    <tr key={skill.name}>
                      <td>{index + 1}</td>
                      <td className="flex items-center gap-2"><Icon icon={skill.icon} className="w-5 h-5" /> {skill.name}</td>
                      <td>
                        <select className="select select-bordered select-xs w-full" value={skill.level} onChange={(e) => handleLevelChange(skill.name, e.target.value)} disabled={!skill.isDisplayed}>
                          {skillLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                        </select>
                      </td>
                      <td className="text-center">
                        <input type="checkbox" className="checkbox checkbox-primary checkbox-xs" checked={skill.isDisplayed} onChange={(e) => handleDisplayChange(skill.name, e.target.checked)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary" onClick={handleSaveHardSkills} disabled={isSavingHard}>
                {isSavingHard ? <span className="loading loading-spinner loading-xs"></span> : <Icon icon="mdi:content-save" />}
                Simpan Hard Skills
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSkills;