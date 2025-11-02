import mongoose from "mongoose";

const hardSkillSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  icon: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, required: true, default: "Dasar" },
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
      type: [String],
      default: [
        "Komunikasi",
        "Kerja Tim (Teamwork)",
        "Problem Solving",
        "Manajemen Waktu",
        "Adaptif",
      ], 
    },
  },
  {
    timestamps: true,
  }
);

const SkillsData = mongoose.model("SkillsData", skillsDataSchema);
export default SkillsData;