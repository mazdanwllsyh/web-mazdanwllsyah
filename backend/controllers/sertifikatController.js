import asyncHandler from "express-async-handler";
import Sertifikat from "../models/Sertifikat.js";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { Readable } from "stream";
import path from "path";

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Berhasil hapus ${publicId} (tipe: ${resourceType})`);
  } catch (err) {
    console.error(`Gagal hapus ${publicId} (tipe: ${resourceType}):`, err);
  }
};

const uploadThumbnail = (fileBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await sharp(fileBuffer)
        .resize(849, 600, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 85 })
        .toBuffer();

      const publicId = `sertifikat_thumbnails/thumb_${Date.now()}`;
      const stream = Readable.from(buffer);
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        { public_id: publicId },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.pipe(cloudinaryStream);
    } catch (err) {
      reject(err);
    }
  });
};

const uploadMainFile = (fileBuffer, type, originalname) => {
  return new Promise((resolve, reject) => {
    const extension = path.extname(originalname);
    const publicId = `sertifikat_files/file_${Date.now()}${extension}`;
    const stream = Readable.from(fileBuffer);

    const options = {
      public_id: publicId,
      resource_type: "image",
      quality: "auto:good",
    };

    const cloudinaryStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.pipe(cloudinaryStream);
  });
};

export const getSertifikat = asyncHandler(async (req, res) => {
  const sertifikat = await Sertifikat.find({}).sort({ createdAt: -1 });
  res.status(200).json(sertifikat);
});

export const addSertifikat = asyncHandler(async (req, res) => {
  const { title, issuer, category } = req.body;

  if (!title || !issuer || !category) {
    res.status(400);
    throw new Error("Field title, issuer, dan category wajib diisi.");
  }
  if (!req.files || !req.files.thumbnail || !req.files.mainFile) {
    res.status(400);
    throw new Error("Thumbnail dan File Utama wajib di-upload.");
  }

  const mainFile = req.files.mainFile[0];
  const mainFileType =
    mainFile.mimetype === "application/pdf" ? "pdf" : "image";

  const thumbBuffer = req.files.thumbnail[0].buffer;
  const thumbResult = await uploadThumbnail(thumbBuffer);

  const mainResult = await uploadMainFile(
    mainFile.buffer,
    mainFileType,
    mainFile.originalname
  );

  const newSertifikat = await Sertifikat.create({
    title,
    issuer,
    category,
    type: mainFileType,
    imageUrl: thumbResult.secure_url,
    imageCloudinaryId: thumbResult.public_id,
    fileUrl: mainResult.secure_url,
    fileCloudinaryId: mainResult.public_id,
  });

  res.status(201).json(newSertifikat);
});

export const updateSertifikat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, issuer, category } = req.body;

  const sertifikat = await Sertifikat.findById(id);
  if (!sertifikat) {
    res.status(404);
    throw new Error("Sertifikat tidak ditemukan.");
  }

  if (title) sertifikat.title = title;
  if (issuer) sertifikat.issuer = issuer;
  if (category) sertifikat.category = category;

  const files = req.files;

  if (files && files.thumbnail) {
    console.log("Mengganti thumbnail...");
    await deleteFromCloudinary(sertifikat.imageCloudinaryId, "image");
    const thumbResult = await uploadThumbnail(files.thumbnail[0].buffer);
    sertifikat.imageUrl = thumbResult.secure_url;
    sertifikat.imageCloudinaryId = thumbResult.public_id;
  }

  if (files && files.mainFile) {
    console.log("Mengganti file utama...");

    const newFile = files.mainFile[0];
    const newFileType =
      newFile.mimetype === "application/pdf" ? "pdf" : "image";

    const oldResourceType = "image";
    await deleteFromCloudinary(sertifikat.fileCloudinaryId, oldResourceType);

    const mainResult = await uploadMainFile(
      newFile.buffer,
      newFileType,
      newFile.originalname
    );

    sertifikat.fileUrl = mainResult.secure_url;
    sertifikat.fileCloudinaryId = mainResult.public_id;
    sertifikat.type = newFileType;
  }

  const updatedSertifikat = await sertifikat.save();
  res.status(200).json(updatedSertifikat);
});

export const deleteSertifikat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sertifikat = await Sertifikat.findById(id);

  if (!sertifikat) {
    res.status(404);
    throw new Error("Sertifikat tidak ditemukan.");
  }

  await deleteFromCloudinary(sertifikat.imageCloudinaryId, "image");

  const resourceType = "image";
  await deleteFromCloudinary(sertifikat.fileCloudinaryId, resourceType);

  await sertifikat.deleteOne();
  res.status(200).json({ message: "Sertifikat berhasil dihapus." });
});
