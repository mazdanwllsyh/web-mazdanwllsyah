import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true }, 
    cloudinaryId: { type: String, required: true }, 
    demoUrl: { type: String, default: "#" },
    sourceUrl: { type: String, default: "#" },
    tags: { type: String }, 
  },
  {
    timestamps: true, 
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
