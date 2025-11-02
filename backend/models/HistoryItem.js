import mongoose from "mongoose";

const historyItemSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Institusi/Perusahaan wajib diisi."],
    },
    detail: {
      type: String,
    },
    years: {
      type: String,
      required: [true, "Durasi (tahun) wajib diisi."],
    },
    logoUrl: {
      type: String,
      default: "",
    },
    cloudinaryId: {
      type: String, 
    },
    type: {
      type: String,
      enum: ["education", "experience"],
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const HistoryItem = mongoose.model("HistoryItem", historyItemSchema);
export default HistoryItem;
