console.log(
  "--- BACKEND BERJALAN PADA ... " + new Date().toISOString() + " ---",
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

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3500,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ KONEKSI DATABASE SERVERLESS BERHASIL!");
  } catch (error) {
    console.error("❌ KONEKSI DATABASE GAGAL:", error);
  }
};

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://fewebdev-mazdanwllsyah.vercel.app",
  "https://mazdaweb.bejalen.com",
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
  }),
);

app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(Object.assign({}, req.query));
  next();
});

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Server | Mazda Nawallsyah</title>
      
      <link rel="icon" type="image/png" href="https://static.wikia.nocookie.net/logopedia/images/a/a7/Vercel_favicon.svg/revision/latest?cb=20221026155821" />
      
      <meta property="og:title" content="Backend API - Mazda Nawallsyah" />
      <meta property="og:description" content="Server API & Database Portofolio Mazda Nawallsyah. Status: ONLINE 🟢" />
      <meta property="og:image" content="https://res.cloudinary.com/dk0yjrhvx/image/upload/v1759605657/member_photos/jbsfiyuahppa3nrckdk4.webp" />
      <link
      rel="icon"
      type="image/png"
      href="https://res.cloudinary.com/dr7olcn4r/image/upload/w_96,h_96,c_fill/v1761388118/croppedsebelumgembuldanmenjadijawir_cdep6a.png"
    />
    <link
      rel="apple-touch-icon"
      href="https://res.cloudinary.com/dr7olcn4r/image/upload/v1761989348/portfolio_profile/portfolio_profile/MazdaN_Profile_Image_1761989345137.png"
    />
      <meta property="og:type" content="website" />
      <meta name="theme-color" content="#10b981" />
      
      <style>
        :root {
          --bg-color: #0f172a;
          --card-bg: #1e293b;
          --primary: #10b981;
          --text-main: #e2e8f0;
          --text-dim: #94a3b8;
        }

        body { 
          font-family: "SF UI Display", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--bg-color);
          color: var(--text-main);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          overflow: hidden;
        }

        .container {
          text-align: center;
          padding: 3.5rem;
          border-radius: 2.5rem;
          background-color: var(--card-bg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          max-width: 450px;
          width: 90%;
        }

        .spinner {
          height: 3.5rem;
          width: 3.5rem;
          border-radius: 50%;
          background-color: var(--primary);
          margin: 0 auto 2rem;
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        h1 { 
          font-size: 1.75rem; 
          font-weight: 800; 
          margin: 0 0 0.75rem; 
          letter-spacing: -0.025em; 
        }

        p { 
          color: var(--text-dim); 
          font-size: 1rem; 
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--primary);
          border-radius: 9999px;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .dot {
          height: 8px;
          width: 8px;
          background-color: var(--primary);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 10px var(--primary);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="spinner"></div>
        <h1>API Server Active</h1>
        <p>This is the central engine for Mazda Nawallsyah's Portfolio. Monitoring data streams in real-time.</p>
        <div class="status-pill">
          <span class="dot"></span>
          System Online
        </div>
      </div>
    </body>
    </html>
  `);
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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`app.js Berjalan di port ${PORT}`);
  });
}

export default app;
