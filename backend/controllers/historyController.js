import asyncHandler from "express-async-handler";
import HistoryItem from "../models/HistoryItem.js";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { Readable } from "stream";

export const getHistoryItems = asyncHandler(async (req, res) => {
  const allItems = await HistoryItem.find({}).sort({ createdAt: -1 });

  const education = allItems.filter((item) => item.type === "education");
  const experience = allItems.filter((item) => item.type === "experience");

  res.status(200).json({ education, experience });
});

export const addHistoryItem = asyncHandler(async (req, res) => {
  const { institution, detail, years, type } = req.body;

  if (!institution || !years || !type) {
    res.status(400);
    throw new Error("Field institusi, tahun, dan tipe wajib diisi.");
  }

  let logoUrl = "";
  let cloudinaryId = "";

  if (req.file) {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize(600, 600, {
          fit: "cover",
          position: "attention",
        })
        .webp({ quality: 80 })
        .toBuffer();

      const publicId = `history_logos/${type}_${Date.now()}`;

      const uploadPromise = new Promise((resolve, reject) => {
        const stream = Readable.from(buffer);
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: "history_logos",
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
      logoUrl = uploadResult.secure_url;
      cloudinaryId = uploadResult.public_id;
    } catch (err) {
      console.error("Gagal memproses atau meng-upload logo history:", err);
    }
  }

  const newHistoryItem = await HistoryItem.create({
    institution,
    detail,
    years,
    type,
    logoUrl,
    cloudinaryId,
  });

  res.status(201).json(newHistoryItem);
});

export const updateHistoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { institution, detail, years, type } = req.body;

  const item = await HistoryItem.findById(id);
  if (!item) {
    res.status(404);
    throw new Error("Item history tidak ditemukan.");
  }

  item.institution = institution || item.institution;
  item.detail = detail || item.detail;
  item.years = years || item.years;
  item.type = type || item.type;

  if (req.file) {
    console.log("File baru terdeteksi, memproses update logo...");

    if (item.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(item.cloudinaryId);
        console.log(`Berhasil hapus logo lama: ${item.cloudinaryId}`);
      } catch (err) {
        console.error("Gagal hapus logo lama:", err);
      }
    }

    try {
      const buffer = await sharp(req.file.buffer)
        .resize(128, 128, { fit: "cover", position: "attention" })
        .webp({ quality: 80 })
        .toBuffer();

      const publicId = `history_logos/${type}_${Date.now()}`;

      const uploadPromise = new Promise((resolve, reject) => {
        const stream = Readable.from(buffer);
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: "history_logos",
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
      item.logoUrl = uploadResult.secure_url;
      item.cloudinaryId = uploadResult.public_id;
    } catch (err) {
      console.error("Gagal memproses/upload logo baru:", err);
    }
  }

  const updatedItem = await item.save();
  res.status(200).json(updatedItem);
});

export const deleteHistoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await HistoryItem.findById(id);

  if (!item) {
    res.status(404);
    throw new Error("Item history tidak ditemukan.");
  }

  if (item.cloudinaryId) {
    try {
      await cloudinary.uploader.destroy(item.cloudinaryId);
      console.log(`Berhasil hapus dari Cloudinary: ${item.cloudinaryId}`);
    } catch (err) {
      console.error(
        "Gagal hapus dari Cloudinary (mungkin sudah terhapus):",
        err
      );
    }
  }

  await item.deleteOne();

  res.status(200).json({ message: "Item history berhasil dihapus." });
});
