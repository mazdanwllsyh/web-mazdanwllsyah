import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import { Readable } from "stream";

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Berhasil hapus dari Cloudinary: ${publicId}`);
  } catch (err) {
    console.error(`Gagal hapus ${publicId} dari Cloudinary:`, err);
  }
};

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({}).sort({ createdAt: -1 });
  res.status(200).json(projects);
});

const uploadThumbnailToCloudinary = (fileBuffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = await sharp(fileBuffer)
        .resize(750, 750, { fit: "cover" })
        .webp({ quality: 85 })
        .toBuffer();

      const publicId = `project_thumbnails/project_${Date.now()}`;
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

export const addProject = asyncHandler(async (req, res) => {
  const { title, description, demoUrl, sourceUrl, tags } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Judul proyek wajib diisi.");
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Thumbnail proyek wajib di-upload.");
  }

  const uploadResult = await uploadThumbnailToCloudinary(req.file.buffer);

  const newProject = await Project.create({
    title,
    description,
    demoUrl,
    sourceUrl,
    tags,
    imageUrl: uploadResult.secure_url,
    cloudinaryId: uploadResult.public_id,
  });

  res.status(201).json(newProject);
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, demoUrl, sourceUrl, tags } = req.body;

  const project = await Project.findById(id);
  if (!project) {
    res.status(404);
    throw new Error("Proyek tidak ditemukan.");
  }

  project.title = title || project.title;
  project.description =
    description !== undefined ? description : project.description;
  project.demoUrl = demoUrl !== undefined ? demoUrl : project.demoUrl;
  project.sourceUrl = sourceUrl !== undefined ? sourceUrl : project.sourceUrl;
  project.tags = tags !== undefined ? tags : project.tags;

  if (req.file) {
    if (project.cloudinaryId) {
      await deleteFromCloudinary(project.cloudinaryId);
    }
    const uploadResult = await uploadThumbnailToCloudinary(req.file.buffer);
    project.imageUrl = uploadResult.secure_url;
    project.cloudinaryId = uploadResult.public_id;
  }

  const updatedProject = await project.save();
  res.status(200).json(updatedProject);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    res.status(404);
    throw new Error("Proyek tidak ditemukan.");
  }

  if (project.cloudinaryId) {
    await deleteFromCloudinary(project.cloudinaryId);
  }

  await project.deleteOne();

  res.status(200).json({ message: "Proyek berhasil dihapus." });
});
