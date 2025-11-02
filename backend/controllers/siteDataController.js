import asyncHandler from "express-async-handler";
import SiteData from "../models/SiteData.js";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { Readable } from "stream";

const initialSiteData = {
  brandName: "webMazda.N",
  brandNameShort: "MazdaN",
  jobTitle: "Front-End Developer",
  location: "Bejalen Ambarawa, Kab. Semarang",
  contactLinks: {
    email: "mazdanawallsyahoddygolafe@gmail.com",
    whatsapp: "6285879587843",
    telegram: "mazda2601",
    linkedin: "",
    instagram: "mazda.nwllsyah_",
    github: "mazdanwllsyh",
  },
  profileImages: [
    "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761387810/tatapantajam_di_kotlam_vfbd70.jpg",
    "https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp",
    "https://res.cloudinary.com/dr7olcn4r/image/upload/v1761387812/KTM_G.211.21.0082_qnvwgt.jpg",
  ],
  aboutParagraph:
    "Saya merupakan seorang Mahasiswa Fresh Graduate dari Universitas Semarang Program Pendidikan Teknik Informatika yang berfokus di bidang Frontend Web Developer. Saya memiliki minat yang besar dalam mengembangkan antarmuka pengguna yang menarik dan responsif. Dengan keterampilan dalam HTML, CSS, dan JavaScript, saya berkomitmen untuk menciptakan pengalaman web yang optimal dan inovatif.",
  typeAnimationSequenceString:
    "Frontend Web Dev.,Milord de Rafford,Tech Enthusiast",
};

const getPublicIdFromUrl = (url) => {
  try {
    const regex = /\/v\d+\/(.+)\.\w{3,4}$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Gagal parsing public_id:", error);
    return null;
  }
};

export const getSiteData = asyncHandler(async (req, res) => {
  let siteData = await SiteData.findOne({ key: "main" });

  if (!siteData) {
    console.log("Membuat dokumen SiteData untuk pertama kali...");
    siteData = await SiteData.create({
      ...initialSiteData,
      key: "main",
    });
  }

  res.status(200).json(siteData);
});

export const updateSiteData = asyncHandler(async (req, res) => {
  const siteData = await SiteData.findOneAndUpdate({ key: "main" }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!siteData) {
    res.status(404);
    throw new Error("Dokumen SiteData tidak ditemukan.");
  }

  res.status(200).json(siteData);
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Tidak ada file yang di-upload.");
  }

  const siteData = await SiteData.findOne({ key: "main" });
  if (!siteData) {
    res.status(404);
    throw new Error("Dokumen SiteData tidak ditemukan.");
  }

  if (siteData.profileImages.length >= 3) {
    res.status(400);
    throw new Error("Maksimal 3 gambar profil.");
  }

  const newPublicId = `portfolio_profile/MazdaN_Profile_Image_${Date.now()}`;
  console.log(`Membuat public_id kustom: ${newPublicId}`);

  try {
    const buffer = await sharp(req.file.buffer)
      .resize(900, 900, {
        fit: "cover",
        position: "attention",
      })
      .webp({ quality: 85 })
      .toBuffer();

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = Readable.from(buffer);
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          public_id: newPublicId,
          folder: "portfolio_profile",
          resource_type: "image",
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(new Error("Gagal meng-upload gambar ke Cloudinary."));
          }
          resolve(result);
        }
      );
      stream.pipe(cloudinaryStream);
    });

    const uploadResult = await uploadPromise;
    const newImageUrl = uploadResult.secure_url;

    siteData.profileImages.push(newImageUrl);
    const updatedSiteData = await siteData.save();

    res.status(201).json(updatedSiteData);
  } catch (err) {
    console.error("Gagal memproses atau meng-upload gambar:", err);
    res.status(500).json({ message: err.message || "Gagal memproses gambar." });
  }
});

/**
 * @desc    Update (mengganti) gambar profil yang ada
 * @route   PUT /api/sitedata/update-image
 * @access  Private/Admin
 */
export const updateProfileImage = asyncHandler(async (req, res) => {
  const { oldImageUrl } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Tidak ada file gambar baru yang di-upload.");
  }
  if (!oldImageUrl) {
    res.status(400);
    throw new Error("URL gambar lama diperlukan untuk update.");
  }

  // 1. Hapus gambar LAMA dari Cloudinary (pakai fungsi yg sudah diperbaiki)
  const oldPublicId = getPublicIdFromUrl(oldImageUrl);
  if (oldPublicId) {
    try {
      await cloudinary.uploader.destroy(oldPublicId);
      console.log(`Berhasil hapus gambar lama: ${oldPublicId}`);
    } catch (err) {
      console.warn("Gagal hapus gambar lama di Cloudinary:", err.message);
    }
  }

  const newPublicId = `portfolio_profile/MazdaN_Profile_Image_Updated_${Date.now()}`;
  let newImageUrl;

  try {
    const buffer = await sharp(req.file.buffer)
      .resize(900, 900, { fit: "cover" })
      .webp({ quality: 85 })
      .toBuffer();

    const uploadPromise = new Promise((resolve, reject) => {
      const stream = Readable.from(buffer);
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          public_id: newPublicId,
          folder: "portfolio_profile",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.pipe(cloudinaryStream);
    });

    const uploadResult = await uploadPromise;
    newImageUrl = uploadResult.secure_url;
  } catch (err) {
    console.error("Gagal upload gambar baru:", err);
    res.status(500);
    throw new Error("Gagal memproses gambar baru.");
  }

  const siteData = await SiteData.findOne({ key: "main" });
  if (!siteData) {
    res.status(404);
    throw new Error("Dokumen SiteData tidak ditemukan.");
  }

  const oldImages = siteData.profileImages;
  const newImages = oldImages.map((url) =>
    url === oldImageUrl ? newImageUrl : url
  );
  siteData.profileImages = newImages;

  const updatedSiteData = await siteData.save();

  res.status(200).json(updatedSiteData);
});

export const deleteProfileImage = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    res.status(400);
    throw new Error("Image URL diperlukan.");
  }

  const publicId = getPublicIdFromUrl(imageUrl);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Berhasil hapus dari Cloudinary: ${publicId}`);
    } catch (err) {
      console.error("Gagal hapus dari Cloudinary:", err);
    }
  } else {
    console.warn(`Tidak dapat menemukan public_id untuk URL: ${imageUrl}`);
  }

  const siteData = await SiteData.findOneAndUpdate(
    { key: "main" },
    { $pull: { profileImages: imageUrl } },
    { new: true }
  );

  if (!siteData) {
    res.status(404);
    throw new Error("Dokumen SiteData tidak ditemukan.");
  }

  res.status(200).json(siteData);
});
