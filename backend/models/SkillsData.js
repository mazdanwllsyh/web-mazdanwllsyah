import mongoose from "mongoose";

const hardSkillSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, required: true, default: "Dasar" },
});

const softSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
});

const skillsDataSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      required: true,
    },
    hardSkills: [hardSkillSchema],
    softSkills: {
      type: [softSkillSchema],
      default: [
        {
          name: "Kerja Tim (Teamwork)",
          description: "Dapat berkolaborasi dengan baik.",
        },
        {
          name: "Problem Solving",
          description: "Mampu memecahkan masalah kompleks.",
        },
        { name: "Adaptif", description: "Cepat belajar dan beradaptasi." },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const SkillsData = mongoose.model("SkillsData", skillsDataSchema);
export default SkillsData;
