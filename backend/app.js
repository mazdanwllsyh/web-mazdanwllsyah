console.log(
  "--- BACKEND BERJALAN PADA ... " + new Date().toISOString() + " ---"
);
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { MulterError } from "multer";

const PORT = process.env.PORT || 3000;

import userRouter from "./routers/userRouter.js";
import siteDataRouter from "./routers/siteDataRouter.js";
import historyRouter from "./routers/historyRouter.js";
import skillsRouter from "./routers/skillsRouter.js";
import projectRouter from "./routers/projectRouter.js";
import sertifikatRouter from "./routers/sertifikatRouter.js";

import { noCache } from "./middleware/noCacheMiddleware.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

console.log("MEMULAI KONEKSI KE DATABASE...");

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("KONEKSI DATABASE BERHASIL!");
  })
  .catch((err) => console.error("KONEKSI DATABASE GAGAL:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://fewebdev-mazdanwllsyah.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Asal (Origin) ini tidak diizinkan oleh CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(Object.assign({}, req.query));
  next();
});

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "API Server Portofolio Mazda Aktif!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", noCache);
app.use("/api/users", userRouter);
app.use("/api/sitedata", siteDataRouter);
app.use("/api/history", historyRouter);
app.use("/api/skills", skillsRouter);
app.use("/api/projects", projectRouter);
app.use("/api/sertifikat", sertifikatRouter);

app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Ukuran file terlalu besar, pastikan Maks. 6MB!" });
    }
  }
  next(err);
});
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`app.js Berjalan di port ${PORT}`);
  });
}

export default app;
