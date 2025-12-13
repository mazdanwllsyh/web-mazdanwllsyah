import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useCustomToast } from "../../hooks/useCustomToast";

const FloatingLabelInput = ({
  id,
  label,
  value,
  onChange,
  name,
  type = "text",
  onKeyPress,
  minLength,
}) => (
  <div className="relative form-control">
    <input
      type={type}
      id={id}
      name={name}
      value={value || ""}
      onChange={onChange}
      onKeyPress={onKeyPress}
      minLength={minLength}
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

const skillLevels = [
  { value: "Dasar", label: "1 - Dasar" },
  { value: "Pemula", label: "2 - Pemula" },
  { value: "Menengah", label: "3 - Menengah" },
  { value: "Mahir", label: "4 - Mahir" },
  { value: "Pakar", label: "5 - Pakar" },
];

function EditSkills() {
  const skillsData = usePortfolioStore((state) => state.skillsData);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);
  const addSoftSkill = usePortfolioStore((state) => state.addSoftSkill);
  const deleteSoftSkill = usePortfolioStore((state) => state.deleteSoftSkill);
  const updateHardSkills = usePortfolioStore((state) => state.updateHardSkills);

  const { success: customToast, error: errorToast } = useCustomToast();

  useEffect(() => {
    if (!skillsData.hardSkills || skillsData.hardSkills.length === 0) {
      fetchSkillsData();
    }
  }, [fetchSkillsData, skillsData.hardSkills]);

  const [isSavingSoftSkill, setIsSavingSoftSkill] = useState(false);
  const [isSavingHardSkill, setIsSavingHardSkill] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const [newSoftSkill, setNewSoftSkill] = useState("");

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

  const [localHardSkills, setLocalHardSkills] = useState(
    skillsData.hardSkills || []
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (skillsData.hardSkills) setLocalHardSkills(skillsData.hardSkills);
  }, [skillsData.hardSkills]);

  const masterSkillList = skillsData.masterHardSkills || [];

  const skillTableData = useMemo(() => {
    const filteredMasterList = masterSkillList.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filteredMasterList.map((masterSkill) => {
      const userSkill = localHardSkills.find(
        (s) => s.name === masterSkill.name
      );
      return {
        ...masterSkill,
        level: userSkill ? userSkill.level : "Dasar",
        isDisplayed: !!userSkill,
      };
    });
  }, [masterSkillList, localHardSkills, searchTerm]);

  const handleDisplayChange = (skillName, isChecked) => {
    if (isChecked) {
      const skillToAdd = masterSkillList.find((s) => s.name === skillName);
      setLocalHardSkills((prev) => [
        ...prev,
        { ...skillToAdd, level: "Dasar" },
      ]);
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
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body flex items-center justify-center h-96">
          <span className="loading loading-lg loading-bars"></span>
          <p className="mt-4">Memuat data skills ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl font-display justify-center">
            Edit Soft Skills
          </h2>
          <div className="divider"></div>

          <div className="overflow-x-auto my-4 border border-base-300 rounded-lg">
            <table className="table table-zebra w-full table-hover">
              <thead className="bg-neutral text-neutral-content text-sm border-b-2 border-base-300">
                <tr>
                  <th className="px-4 py-3 text-center">Nama Soft Skill</th>
                  <th className="text-center px-4 py-3 border-l border-base-300 w-28 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {skillsData.softSkills.map((skill, index) => (
                  <tr
                    key={index}
                    className="border-b border-base-300 last:border-b-0 hover"
                  >
                    <td className="px-4 py-2">{skill}</td>
                    <td className="text-center px-4 py-2 border-l border-base-300">
                      <button
                        onClick={() => handleDeleteSoftSkill(index)}
                        className="btn btn-xs btn-error btn-outline"
                        disabled={isDeleting === index}
                      >
                        {isDeleting === index ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Hapus"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divider">Input Soft Skill kamu</div>
          <div className="form-control flex-row gap-2 justify-center">
            <FloatingLabelInput
              id="softSkill"
              name="softSkill"
              label="Contoh: Komunikasi Efektif"
              value={newSoftSkill}
              onChange={(e) => setNewSoftSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSoftSkill()}
              minLength={5}
            />
            <button
              onClick={handleAddSoftSkill}
              className="btn btn-primary md:w-55 lg:w-full my-4"
            >
              Tambah
            </button>
          </div>
        </div>
      </div>

      {/* --- Card 2: Edit Hard Skills --- */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl font-display justify-center">
            Edit Hard Skills
          </h2>
          <div className="divider"></div>

          <div className="flex justify-end mb-4">
            <div className="w-full max-w-xs">
              <input
                type="search"
                placeholder="Cari teknologi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table table-zebra w-full table-hover">
              <thead className="bg-neutral text-neutral-content text-center text-sm border-b-2 border-base-300">
                <tr>
                  <th className="px-4 py-3">Ikon</th>
                  <th className="px-4 py-3 border-l border-base-300">
                    Teknologi
                  </th>
                  <th className="px-4 py-3 border-l border-base-300">
                    Kemampuan (Level)
                  </th>
                  <th className="text-center px-4 py-3 border-l border-base-300">
                    Tampilkan
                  </th>
                </tr>
              </thead>
              <tbody>
                {skillTableData.map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-b border-base-300 last:border-b-0 hover"
                  >
                    <td className="px-4 py-2 border-l border-base-300">
                      <div className="flex justify-center">
                        <Icon icon={skill.icon} className="w-8 h-8" />
                      </div>
                    </td>
                    <td className="px-4 text-center py-2 border-l border-base-300">
                      {skill.name}
                    </td>
                    <td className="px-4 py-2 border-l border-base-300 justify-center items-center flex">
                      <select
                        className="select select-bordered select-sm w-full max-w-xs"
                        value={skill.level}
                        onChange={(e) =>
                          handleLevelChange(skill.name, e.target.value)
                        }
                        disabled={!skill.isDisplayed}
                      >
                        {skillLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center px-4 py-2 border-l border-base-300">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={skill.isDisplayed}
                        onChange={(e) =>
                          handleDisplayChange(skill.name, e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-actions justify-end mt-6">
            <button
              onClick={handleSaveHardSkills}
              className="btn btn-primary"
              disabled={isSavingHardSkill}
            >
              <Icon icon="mdi:content-save" /> Simpan Perubahan Hard Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditSkills;
