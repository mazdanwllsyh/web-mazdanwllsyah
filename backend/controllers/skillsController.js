import asyncHandler from "express-async-handler";
import SkillsData from "../models/SkillsData.js";

const initialSoftSkills = [
  "Komunikasi",
  "Kerja Tim (Teamwork)",
  "Problem Solving",
  "Manajemen Waktu",
  "Adaptif",
]; 

export const getSkillsData = asyncHandler(async (req, res) => {
  let skillsData = await SkillsData.findOne({ key: "main" });

  if (!skillsData) {
    console.log("Membuat dokumen SkillsData untuk pertama kali...");
    skillsData = await SkillsData.create({
      key: "main",
      hardSkills: [],
      softSkills: initialSoftSkills,
    });
  }

  res.status(200).json(skillsData);
});

/**
 * @desc    Update data skills (singleton)
 * @route   PUT /api/skills
 * @access  Private/Admin
 */
export const updateSkillsData = asyncHandler(async (req, res) => {
  const { hardSkills, softSkills } = req.body;

  const skillsData = await SkillsData.findOne({ key: "main" });

  if (!skillsData) {
    res.status(404);
    throw new Error("Dokumen SkillsData tidak ditemukan.");
  }

  if (hardSkills !== undefined) {
    skillsData.hardSkills = hardSkills;
  }
  if (softSkills !== undefined) {
    skillsData.softSkills = softSkills;
  }

  const updatedSkillsData = await skillsData.save();
  res.status(200).json(updatedSkillsData);
});
