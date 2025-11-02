import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import SeoHelmet from "../SEOHelmet";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "../../context/UserContext"; // Impor useUser
import useCustomSwals from "../../hooks/useCustomSwals";
import instance from "../../utils/axios"; // Impor instance

function VerificationPage() {
  const { siteData } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { showErrorSwal, showSuccessSwal } = useCustomSwals();
  const { login } = useUser(); // Ambil fungsi login

  // Email didapat dari 'state' saat navigate dari RegisterPage
  const [email, setEmail] = useState(location.state?.email || "");
  // State baru untuk kode 6 digit
  const [code, setCode] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Efek untuk "menendang" user jika mereka mendarat di sini tanpa email
  useEffect(() => {
    if (!location.state?.email) {
      showErrorSwal(
        "Email Tidak Ditemukan",
        "Silakan mulai dari halaman registrasi atau login."
      ).then(() => {
        navigate("/signup");
      });
    }
  }, [location.state, navigate, showErrorSwal]);

  // --- FUNGSI VERIFIKASI (TOMBOL UTAMA) ---
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      showErrorSwal("Error", "Kode verifikasi harus 6 digit.");
      return;
    }
    setIsVerifying(true);

    try {
      // Panggil API /register-verify
      const response = await instance.post("/api/users/register-verify", {
        email,
        verificationCode: code,
      });

      const user = response.data.user;
      login(user); // Langsung loginkan user

      await showSuccessSwal(
        "Verifikasi Berhasil!",
        "Akun Anda telah aktif. Selamat datang!"
      );
      navigate("/dashboard"); // Arahkan ke dashboard
    } catch (err) {
      console.error("Gagal verifikasi:", err);
      showErrorSwal(
        "Verifikasi Gagal",
        err.response?.data?.message || "Kode tidak valid atau kedaluwarsa."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // --- FUNGSI KIRIM ULANG ---
  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      // Panggil API /resend-verification
      const response = await instance.post("/api/users/resend-verification", {
        email,
      });
      showSuccessSwal("Berhasil Dikirim", response.data.message);
    } catch (err) {
      console.error("Gagal kirim ulang:", err);
      showErrorSwal(
        "Gagal Mengirim",
        err.response?.data?.message || "Terjadi kesalahan."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-base-100 px-4 py-8">
      <SeoHelmet
        title="Verifikasi Akun Anda"
        description="Masukkan kode 6 digit yang dikirim ke email Anda untuk mengaktifkan akun."
        url="/verifikasi"
      />
      <div className="text-sm breadcrumbs mb-4 self-start max-w-5xl mx-auto w-full">
        <ul>
          <li>
            <Link to="/">Beranda</Link>
          </li>
          <li>Verifikasi Email</li>
        </ul>
      </div>

      <div className="card w-full max-w-md shadow-2xl bg-base-200">
        {/* --- FORM UTAMA (handleVerifySubmit) --- */}
        <form className="card-body" onSubmit={handleVerifySubmit}>
          <h2 className="card-title text-2xl font-bold font-display justify-center text-center">
            <Icon
              icon="mdi:email-check-outline"
              className="w-8 h-8 mr-2 text-primary"
            />
            Verifikasi Akun Anda
          </h2>
          <div className="divider my-2"></div>

          <p className="text-center text-base-content/80 mb-4">
            Kami telah mengirimkan kode 6 digit ke email Anda di
            <strong className="block text-primary">{email}</strong>
            Silakan masukkan kode tersebut di bawah ini.
          </p>

          {/* Input Kode Verifikasi (Input Utama) */}
          <div className="relative form-control mt-2">
            <input
              type="tel"
              id="verificationCode"
              placeholder=" "
              className="input input-bordered w-full pt-4 peer text-base text-center tracking-[0.5em]"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
              required
            />
            <label
              htmlFor="verificationCode"
              className="absolute left-3 top-1 text-xs text-base-content/70 ... "
            >
              Masukkan 6 Digit Kode
            </label>
          </div>

          {/* Tombol Verifikasi (TOMBOL KIRIM UTAMA) */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full font-bold text-base"
              disabled={isVerifying || code.length !== 6}
            >
              {isVerifying ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <Icon icon="mdi:check-decagram" className="mr-2" />
              )}
              Verifikasi Akun
            </button>
          </div>
        </form>

        {/* --- Area Kirim Ulang (Di luar form utama) --- */}
        <div className="card-body pt-0 text-center">
          <div className="divider my-0"></div>
          <p className="text-sm mt-4">Tidak menerima kode?</p>
          <button
            type="button"
            className="btn btn-sm btn-ghost text-primary"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Icon icon="mdi:send-clock-outline" className="mr-2" />
            )}
            Kirim Ulang Kode
          </button>
          <p className="text-center text-sm mt-3">
            Sudah verifikasi?{" "}
            <Link to="/signin" className="link link-secondary font-semibold">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationPage;
