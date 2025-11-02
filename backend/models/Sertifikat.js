import mongoose from "mongoose";

const sertifikatSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    category: { type: String, required: true },

    imageUrl: { type: String, required: true },
    imageCloudinaryId: { type: String, required: true },

    fileUrl: { type: String, required: true },
    fileCloudinaryId: { type: String, required: true },

    type: {
      type: String,
      enum: ["pdf", "image"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sertifikat = mongoose.model("Sertifikat", sertifikatSchema);
export default Sertifikat;
