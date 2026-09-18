import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

const sendMailHandler = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Mazda Nawallsyah" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error(`[SMTP ERROR] Gagal mengirim ke ${to}:`, error.message);
  }
};

const baseTemplate = (title, content) => `
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px;">
    <table style="width:100%; max-width:600px; margin: 0 auto; border-radius: 16px; background-color: #1e293b; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
      <tr>
        <td style="padding: 40px; text-align: center;">
          <h1 style="color: #f8fafc; font-size: 24px; margin-bottom: 20px;">${title}</h1>
          ${content}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748b;">
            &copy; ${new Date().getFullYear()} Mazda Nawallsyah Portfolio. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  </body>
`;

export const sendEmailVerify = (email, code) => {
  const content = `
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Gunakan kode otorisasi berikut untuk memverifikasi akun Anda.</p>
    <div style="margin: 30px 0; padding: 20px; background-color: #0f172a; border-radius: 12px; border: 1px solid #10b981;">
      <span style="font-size: 32px; font-weight: 800; letter-spacing: 12px; color: #10b981;">${code}</span>
    </div>
    <p style="color: #94a3b8; font-size: 14px;">Kode ini akan kedaluwarsa dalam 10 menit.</p>
  `;
  return sendMailHandler(
    email,
    "Verifikasi Akses Portofolio",
    baseTemplate("Verifikasi Akun", content),
  );
};

export const sendWelcomeEmail = (user) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "https://mazdaweb.bejalen.com";
  const content = `
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Halo <strong>${user.fullName}</strong>,</p>
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Otentikasi berhasil. Selamat datang di sistem Portofolio Mazda Nawallsyah.</p>
    <a href="${frontendUrl}/profil" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 25px;">Akses Dashboard</a>
  `;
  return sendMailHandler(
    user.email,
    "Selamat Datang di Portofolio Mazda",
    baseTemplate("Akses Diberikan", content),
  );
};

export const sendLoginAlert = (user) => {
  const content = `
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Halo <strong>${user.fullName}</strong>,</p>
    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Sistem mendeteksi aktivitas login baru pada akun Anda di waktu <strong>${new Date().toLocaleString(
      "id-ID",
    )}</strong>.</p>
    <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">Jika ini bukan Anda, segera amankan akun Anda.</p>
  `;
  return sendMailHandler(
    user.email,
    "Pemberitahuan Login Sistem",
    baseTemplate("Aktivitas Login Baru", content),
  );
};
