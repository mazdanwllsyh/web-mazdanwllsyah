import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/UserModels.js"; //

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Terhubung: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  await connectDB();

  try {
    await User.deleteMany({ email: process.env.SUPERADMIN_EMAIL });

    const superAdmin = await User.create({
      fullName: "Joko", 
      email: process.env.SUPERADMIN_EMAIL,
      password: process.env.SUPERADMIN_PASSWORD,
      role: "superAdmin",
      isVerified: true, 
    });

    console.log("========================================");
    console.log("✅ Super Admin Berhasil Dibuat!");
    console.log(`   Email: ${superAdmin.email}`);
    console.log("   Password: (Password yang Anda atur di .env)");
    console.log("========================================");
    process.exit(0);
  } catch (error) {
    console.error("Error membuat super admin:", error);
    process.exit(1);
  }
};

createSuperAdmin();
