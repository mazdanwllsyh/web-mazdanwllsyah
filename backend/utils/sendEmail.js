// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendEmailVerify = async (email, verificationCode) => {
  const mailOptions = {
    from: `"Portofolio Mazda" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Kode Verifikasi Akun Anda: ${verificationCode}`,
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px;">
        <table role="presentation" style="width:100%; max-width:600px; margin: 0 auto; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 30px; text-align: center;">
              <h1 style="color: #333; font-size: 24px;">Verifikasi Email Anda</h1>
              <p style="color: #555; line-height: 1.5; font-size: 16px;">
                Terima kasih telah mendaftar. Gunakan kode di bawah ini untuk mengaktifkan akun Anda.
              </p>
              <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #007bff; margin: 25px 0;">
                ${verificationCode}
              </p>
              <p style="color: #777; font-size: 16px;">
                Kode ini berlaku selama <strong style="color: #333;">10 menit</strong>.
              </p>
              <p style="font-size: 14px; color: #aaaaaa; margin-top: 20px;">
                Jika Anda tidak merasa mendaftar, silakan abaikan email ini.
              </p>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email verifikasi terkirim ke:", email);
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengirim kode verifikasi email");
  }
};

export const sendWelcomeEmail = async (user) => {
  if (!user || !user.token) {
    console.error("Gagal mengirim email sambutan: user atau token tidak ada.");
    return;
  }

  const mailOptions = {
    from: `"Portofolio Mazda Dev." <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: `Selamat Datang di Portofolio Mazda, ${user.fullName}!`,
    html: `
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">
          <tr>
            <td align="center">
              <h1 style="color: #333;">Selamat Datang!</h1>
              <p style="font-size: 16px; color: #555;">
                Halo ${user.fullName},
              </p>
              <p style="font-size: 16px; color: #555;">
                Terima kasih telah bergabung. Akun Anda telah berhasil diverifikasi.
              </p>
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: left;">
                <p style="margin: 0;"><strong>Nama:</strong> ${user.fullName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
              </div>
              <a href="http://localhost:5173/profil" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                Lihat Profil Anda
              </a>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sambutan terkirim ke:", user.email);
  } catch (error) {
    console.error("Gagal mengirim email sambutan:", error);
  }
};
