import mongoose from "mongoose";

const hardSkillSchema = new mongoose.Schema({
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
        "Kerja Tim (Teamwork)",
        "Problem Solving",
        "Adaptif",
      ],
    },
  },
  {
    timestamps: true,
  },
);

const SkillsData = mongoose.model("SkillsData", skillsDataSchema);
export default SkillsData;
