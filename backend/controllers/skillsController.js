import asyncHandler from "express-async-handler";
import SkillsData from "../models/SkillsData.js";

export const getSkillsData = asyncHandler(async (req, res) => {
  let skillsData = await SkillsData.findOne({ key: "main" });

  if (!skillsData) {
    skillsData = await SkillsData.create({
      key: "main",
      hardSkills: [],
      softSkills: [],
    });
  }

  res.status(200).json(skillsData);
});

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
