import mongoose from "mongoose";

const contactLinksSchema = new mongoose.Schema({
  email: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  telegram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  instagram: { type: String, default: "" },
  github: { type: String, default: "" },
});

const siteDataSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      required: true,
    },

    brandName: { type: String, required: true },
    brandNameShort: { type: String, required: true },
    jobTitle: { type: String, required: true },
    location: { type: String, required: true },
    contactLinks: contactLinksSchema,
    profileImages: {
      type: [String], 
      validate: [(v) => v.length <= 3, "Maksimal 3 gambar profil."], //
    },
    aboutParagraph: { type: String, required: true },
    typeAnimationSequenceString: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const SiteData = mongoose.model("SiteData", siteDataSchema);
export default SiteData;
